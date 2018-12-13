---
breadcrumbs:
  - '[Learn](/learn)'
  - '[Signing up and Logging In](/login)'
---

# So how, exactly, do I sign up?

Have you ever signed up for something using your Facebook, Twitter, or Google account?
Signing up for LifeScope is similar to that, only with any service that we support, and you can automatically get a jump-start on collecting data from that service.

First, go to [app.lifescope.io](https://app.lifescope.io).
If you're not already logged in to a LifeScope account, you'll see a bunch of squares for the services we support.
Click on one, and a modal will appear asking what data from that service you'd like us to retrieve.
After checking the boxes as you see fit, click on the 'Connect to <Service>' button.

You will be redirected to the authorization workflow for that service.
You may have to log into that service if you aren't already; note that LifeScope DOES NOT EVER have access to your password, as this step is carried out entirely under that service's control.
You will then be asked to authorize LifeScope's access to your data.
When you've authorized us, you will be sent back to LifeScope, and you will have both an account and a Connection to that service.
We will start retrieving the data you authorized shortly after that.

# How do I log back in?

It's the exact same process as signing up - go to app.lifescope.io, click the service you signed up with, connect to that service, and complete any authorization steps.

# Why do I have to re-authorize a service when logging in?

Because of the way we've set up LifeScope, we don't know ahead of time whether a logged-out user attempting to make a Connection to a service already has an account with us.
Only near the end of the authorization process do we see whether the Connection that was just authorized is on behalf of a user that we've already seen.
If it is, then we delete the new Connection and keep using the one you already made.
NOTE: any permissions you did or did not grant during the subsequent logins are ignored; we only pay attention to the permissions on the original Connection's permissions.

For example, let's say you signed up using your Google account, and gave LifeScope permission to retrieve your emails and your Drive history.
You then log out and sign in using Google, this time saying you want just your Drive history.
When we're finishing up that second Connection, we see that there is already a Connection to your Google account, delete the new Google Connection, and log you in to your LifeScope account.
We will still be retrieving your emails and Drive history since that's what was selected on the original Connection.

# What if I've made Connections to other services?

You can log into your account using *any* service that you have a Connection to.
Let's say you signed up with Google, and additionally have made Connections to Instagram, Twitter, and Pinterest.
Logging in with any of those four services will get you to the same LifeScope account.

# What happens if I sign up with one service, log out, then sign up with a different service?

In that case, you would have two separate LifeScope accounts, one associated with each service.
You would not be able to search the data from those two Connections concurrently.
We strongly recommend having one account with Connections to everything you want rather than having those Connections spread over multiple accounts.
Of course, if you have a reason for keeping some of your data separate from others, that's cool with us.

# Can I transfer Connections (and their data) to a different account?

Unfortunately no, though we may implement that in the future if there's enough of a demand for it.
What you'd have to do is delete the Connection from its current account and then make a new Connection to that service in your other account.
For most services, we should be able to re-retrieve all of the data you had, though some have limits on how far back we can go when retrieving your information. 

# Can I connect a service to multiple LifeScope accounts?

Not the same exact account with that service, no,
You can't sign up with a specific Google account, then make a Connection to that Google account on another LifeScope account.

If you have multiple accounts with a service, though, you can have them be associated with separate LifeScope accounts.
If you have both a work and a personal Google account, you could sign up for a LifeScope account with the work one and separately sign up for a LifeScope account with the personal one.  

# Can I change what information you retrieve after I've signed up? 

Absolutely. See the page on [Connections](/learn/connections) for more information.

# How do you have access to my Facebook/Twitter/etc. account without my password?

Without getting into the nitty-gritty details, the services that you can make Connections to with LifeScope all use standard authentication frameworks that allow other services to obtain limited credentials on behalf of a user.
The 'token' that we're granted on your behalf lets us access certain data, but it is not your password, never gives us access to your password, and in most cases it only lets us get at data that you've explicitly let us*.

*Most services use OAuth2, the current best-practice framework. A few services use older frameworks such as OAuth1 and OpenID that don't have as fine control over what we're allowed to get, but we will still only retrieve the data you tell us to.

# How do I delete my account?

It would bum us out a bit if you want to go, but we've made it pretty simple to do so.
Go to [your account settings](/settings/account), click on the 'Delete Account' button, and then confirm you want to delete it.
We remove everything we've retrieved for you; all your data, all your Connections, plus your account with us.
As far as we know, you never existed in our service.
