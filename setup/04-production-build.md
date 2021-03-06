# Building and running LifeScope App in a cloud production environment
Once you have a MongoDB cluster running and have set up a BitScoop account, created maps for all of the services, and 
saved the credentials for that service in its respective Map, you have everything you need to run the API.
The App server was designed to be uploaded and run via Kubernetes. To date it has only been tested on AWS' Elastic Kubernetes Service (and locally on minikube).
All further instructions will assume AWS technologies since we can speak to them; using another cloud provider should
work similarly, just with appropriate deviations to account for how Google/Microsoft/etc. clouds work in practice. 

## Location of Kubernetes scripts

This guide references Kubernetes configuration scripts. 
These scripts are all located in [a separate repository](https://github.com/lifescopelabs/lifescope-kubernetes).

## Create config file
You'll need to create a new file in the config folder called production.json.
The gitignore contains this filename, so there's no chance of accidentally committing it.

This new config file only needs a few lines, because the 'config' library first pulls everything from 'default.json' and then overrides anything that it finds in other config files it uses.
The config file should look like this:

```
{
  "mongodb": {
	"address": "<insert address>"
  },
  "bitscoop": {
	"api_key": "<insert API key>"
  }
}
```

## Obtain SSL certificate
IF you want your server to be secure, you'll need to purchase a domain name and then register the domain or subdomain(s) 
that you want to use for LifeScope with Amazon Certificate Manager.

When you have the certificate from ACM, make note of its ARN.
Look in the production Nginx config for the Service that will be set up.
Look for the field metadata -> annotations -> service.beta.kubernetes.io/aws-load-balancer-ssl-cert
You will need to replace the value here with the ARN of the certificate you generated.

## Install node_modules
Run npm install or yarn install (npm or yarn must already be installed).

## Run migrations
NOTE: If you've already done this while setting up the API, you can skip this entire step here.

You'll need to run the two migrations in the migrations folder via 'NODE_ENV=production babel-node migrations/<name>.js'.
The first migration creates indices on each collection that LifeScope stores in the database.
The second loads the LifeScope Providers into the database. 
Make sure that you've replaced the remote_map_id's in the Providers with the BitScoop Map IDs you've created.


## Containerize App via Docker and run in a Kubernetes Cluster
The LifeScope App can be run in a Kubernetes Cluster via containerizing the code with Docker.

Containerized builds of the codebase can be found on LifeScope Labs' Docker hub, ```lifescopelabs/lifescope-app:vX.Y.Z```.
If you want to build your own, you will need to build an image locally and push to a Docker Hub you control. 

### Set up Docker Hub account and install Docker on your machine (optional)
*LifeScope has a Docker Hub account with repositories for images of each of the applications that make up the service.
The Kubernetes scripts are coded to pull specific versions from the official repos.
If you're just pulling the official images, you don't need to set up your own Hub or repositories therein.*

This guide will not cover how to set up a Docker Hub account or a local copy of Docker since the instructions provided 
by the makers of those services are more than sufficient.
Once you've created a Docker Hub account, you'll need to make public repositories for each of the lifescope services you
want to run. At the very least, you'll want to run lifescope-api and lifescope-app, and the Docker Hubs for those are 
most easily named ```lifescope-api```and ```lifescope-app```. If you use different names, you'll have to change the 
image names in the Kubernetes config files for each repo in the lifescope-kubernetes sub-directories for those services.

### Containerize the App with Docker (optional)

*LifeScope has a Docker Hub account with repositories for images of each of the applications that make up the service.
The Kubernetes scripts are coded to pull specific versions from the official repos.
If you want to pull from a repo you control, do the following:*

After installing Docker on your machine, from the top level of this application run ```docker build -t <Docker Hub username>/lifescope-app:vX.Y.Z .```.
X,Y, and Z should be the current version of the App, though it's not required that you tag the image with a version.

You'll then need to push this image to Docker Hub so that the Kubernetes deployment can get the proper image.
Within lifescope-kubernetes/lifescope-app/overlays/production/production.yaml, you'll see a few instances of an image name that points to an image name, something along
the lines of lifescopelabs/lifescope-app:v4.0.0. Each instance of this will need to be changed to <Docker Hub username>/<public repo name>:<version name>.
For example, if your username is 'cookiemonstar' and you're building v4.5.2 of the App, you'd change the 'image' field 
wherever it occurs in overlays/production/production.yaml to ```cookiemonstar/lifescope-app:v4.5.2```.
This should match everything following the '-t' in the build command.

Once the image is built, you can push it to Docker Hub by running ```docker push <imagename>```, e.g. ```docker push cookiemonstar/lifescope-app:v4.5.2```.
You're now ready to deploy the Kubernetes cluster.

#### Note on running a dev environment of App

Because Nuxt uses an npm command to start, there is a separate command for starting the built code in dev mode.
Consequently, the Docker image must be built slightly differently; run the following:
```docker build -t <Docker Hub username>/lifescope-app:vX.Y.Z-dev -f Dockerfile-dev .``` 
  
The lifescope-kubernetes/lifescope-app/base/lifescope-app.yaml script expects the image name to end in '-dev'. 

### Deploy Kubernetes cluster and API pod
This guide is copied almost verbatim in lifescope-app, so if you've already set up that, you can skip straight to
running the lifescope-api script.

#### Install eksctl and create Fargate cluster
Refer to [this guide](https://docs.aws.amazon.com/eks/latest/userguide/getting-started-eksctl.html) for how to set up
eksctl.

The script to provision the Fargate cluster is located in the lifescope-kubernetes repo.
To provision the Fargate cluster, from the top level of lifescope-kubernetes run 
```eksctl create cluster -f aws-fargate/production/aws-cluster.yaml```.

#### Run Nginx Kustomize config and provision DNS routing to Load Balancer

From the top level of the lifescope-kubernetes repo, run ```kubectl apply -k lifescope-nginx/overlays/production```.
This will install nginx in your K8s cluster. After a minute or so the Load Balancer that is set up will have provisioned
an external IP, which you can get by running ```kubectl get service -n nginx-ingress``` and looking in the column 'EXTERNAL-IP'.

This external IP will need to be used in a few places.

First, go to [AWS Route53 -> Hosted zones](https://console.aws.amazon.com/route53/home?#hosted-zones:).
Create a Hosted Zone for the top-level domain you're using.
Within that, create a Record Set. The Name can be left blank, Type should be 'A - IPv4 address', set Alias to 'Yes',
and under Alias Target enter 'dualstack.<external-IP>' (if you click on the text box for Alias Target, a prompt scrollable box
should pop up with various resources you have in AWS; the Load Balancer for Nginx should be under 'ELB Classic load balancers'
and if clicked on it should autocomplete everything properly). Click Create when this is all entered.

Next, you'll need to make CNAMEs with your domain registrar from 'app', 'api', and any other lifescope services you're
setting up (embed, xr, nxr) to the external IP.

#### Run API Kustomize script

*Before running this, make sure that you have the dev.json file from the config folder in lifescope-kubernetes/lifescope-app/base
and the production.json file from the config folder in lifescope-kubernetes/lifescope-app/overlays/production
dev.json won't be used, but due to a deficiency in Kustomize as of writing this it's impossible to tell it to ignore the 
base instruction of secretizing dev.json.*

From the top level of the lifescope-kubernetes repo, run ```kubectl apply -k lifescope-app/overlays/production```.

If this ran properly, you should be able to go to app.<domain>.io and see a page asking whether you want to sign up or log in. 

# Build and run in AWS Elastic Beanstalk (Deprecated)
The LifeScope API can be bundled and run via AWS Elastic Beanstalk.
NOTE: This was last successfully tested and run in version 3.5.3 of the App. Version 4.0.0 switched to using Node 12
with its --experimental-modules support for ES6 imports, as well as switching to running it in production using
Kubernetes. Some additional work may be needed to make the current iteration of the code work in this environment.

## Build and package the files
Run 'npm run build'.
When that's finished, run 'gulp bundle:ebs'.
The end result should be a .zip file in the dist/ folder called 'lifescope-api-ebs.x.y.x.zip'.

## Create Elastic Beanstalk
Create an AWS account if you don't have one already.
Go to the home page for Elastic Beanstalk and create a new Application.
Within this application, create a new Environment.
The type should be 'Web server environment'.
Give it a name and select a domain (this domain will have to be unique).
For Platform, pick 'Preconfigured platform' and select 'node.js'.

For Application code, select 'Upload your code', then click on the Upload button.
For Source code origin keep 'Local file' selected, then click 'Choose file', navigate to the lifescope-api/dist folder, and select the lifescope-api-ebs .zip file that was generated.
You'll probably want to use a version label such as 'api-v1' (or 'api-v2', 'api-v3', etc. if you recompile the code later)
 
Next click the Upload button in the lower right and then click 'Configure more options'.
First Modify 'Software'.
Change the node.js version to 8.11.1 (or whatever the latest version is).
The node command needs to be 'npm run serve', and you should add an Environment property with Name 'NODE_ENV' and Value 'production'.
Click Save to lock these options in.

You can change the virtual hardware this runs on in the Instances and Capacity pages.
How you want to configure this is up to you and your wallet, but under Capacity you do need to set the Environment type to 'Load balanced'.

You then should modify the Load Balancer.
Select 'Application Load Balancer', then add a listener on port 443 over HTTPS.
Select the SSL certificate you registered in ACM, select an SSL policy, then click 'Add'.
You then need to select the 'default' process, then select 'Options'->Edit, and change the HTTP code to 204 and the path to '/health', then click Save.
Finally, click Save.

Everything should be configured at this point, so click 'Create environment'.
Elastic Beanstalk should take a few minutes to set up everything for you.
When it's done, you should be able to hit the URL followed by '/gql-i', and a GraphiQL interface should appear.


