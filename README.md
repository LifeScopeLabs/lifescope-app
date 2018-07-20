# [LIFESCOPE-APP](https://github.com/LifeScopeLabs/lifescope-app)

## [Repository](https://github.com/LifeScopeLabs/lifescope-app)

(development phase, high priority)

Access your digital memory and tell their stories.  The LIFESCOPE App allows anyone to search and curate your personal data in various views. Search anything about yourself in a web browser or on a native app (Firefox, Chrome, Android, iOS, Windows, Mac).

The codebase is a single-page Universal web app built on Nuxt and Vue.js. Desktop/mobile responsive design interface with javascript extensions. Written with plugin framework for features such as location tracking, webXR and web voice. The web code is containerizable inside a universal app framework Cordova.

# Setup instructions

Please go to the 'setup' folder and follow the instructions.

## [LIFESCOPE Archive App](https://lifescopelabs.github.io/etl.html#lifescope-archive-app)
The current LIFESCOPE web app is deprecated and is being rewritten. 

### [LIFESCOPE Archive App Documentation](https://lifescope.io/getting-started/)

### Requirements
- **MVP**:  Rewrite the [LIFESCOPE Archive App](https://lifescopelabs.github.io/etl.html#lifescope-archive-app) for Nuxt.
- Get location tracking working with the LIFESCOPE API.
- Port the LIFESCOPE web App to Cordova or other native framework.

### Dependencies
- Vue/Nuxt compatible
- Apollo GraphQL
- https://github.com/gonativeio/gonative-android
- https://github.com/gonativeio/gonative-ios

### LIFESCOPE Plugins 
#### [LIFESCOPE-XR](https://github.com/LifeScopeLabs/lifescope-xr)
This is for AR and VR views of LifeScope data as Vue Plugins.

#### [LIFESCOPE-VOICE](https://github.com/LifeScopeLabs/lifescope-voice)
This is a conversational interface of LifeScope data as Vue Plugins.

## Developer Setup

``` bash
# set default node version
nvm alias default 8.10

# install dependencies
$ npm install

# add dev.json to config/

# if running locally, update /etc/hosts:
127.0.0.1       app.lifescope.io
127.0.0.1       api.lifescope.io
127.0.0.1       xr.lifescope.io
127.0.0.1       nxr.lifescope.io

# also if running locally, accept certificates from xr.lifescope.io, nxr.lifescope.io, and api.lifescope.io

# launch lifescope-api, ngninx, and lifescope-xr
# see lifescope-api/README.md, lifescope-xr/README.md

# build
$ npm run build

# run with NODE_ENV set
$ NODE_ENV=dev npm run start

```

## Login

**Sign up and login with any provider. Automatically adds an API ETL connection.**

![providerpage]

## Homepage

**List saved searches and hashtags**

![nativeapp]

## Explorer

Filter, Sort, and Search. See Advanced and Saved searches.

### Views
* Feed
* List
* Map
* Gallery
* [Timeline](http://timeline.knightlab.com)
* Virtual Reality Rooms
* Augmented Reality Maps and gateways
* Voice Interaction

**Gallery View**
"Recent Media" Saved Search

![lifescope-app-legacy]

**Map Satellite View**
"Where Filter" Polygon

![mappoly]

**Map View**
Multiple result at location Exploded Spider

![spider]

## Providers

| Data Source | Status | Data Collected |
|--|--|--|
| Facebook | production | events, content, contacts, locations |
| Twitter | production | events, content, contacts, locations |
| Pinterest | beta | events, content, locations |
| Dropbox | production | events, content, locations |
| Steam | production | events, content |
| Reddit | production | events, content, contacts, contacts |
| Spotify | production | events, content |
| GitHub | production | events, content, contacts |
| Instagram | production | events, content, contacts |
| Google | production | events, content, contacts |
| Slice | development | events, content, things |
| FitBit | planned | events, things |
| TV Time | planned | events, content |

## People Management
* Relate contacts together into People
* Relate People into Users

## Settings
* Manage user info
* Manage data providers

## Published Content
* Embed saved searches as dynamic iFrame
* Served publicly

##  Data Collection Sources

| Data Source | Support | Status | Data Collected |
|--|--|--|--|
| Location History | Universal | development | locations
| **Scrape** Calls | Native app | planned | events, content |
| **Scrape** Messages | Native app | planned | events, content |
| **Scrape** Media | Native app | planned | events, content |
| **Scrape** Files | Native app | planned | events, content |


## Notes

**Alternate Feed View Wireframe**
Content this Week

![lifescope-app-wireframe]

**Story based publishing Wireframes**
Map "Wedding Destination Vacation"

![Hawaii]

**Map Timeline**
"Wedding Destination Vacation"

![HawaiiV2]

[providerpage]:https://lifescopelabs.github.io/assets/screenshots/provider-maps-screenshot.png
[spider]:https://lifescopelabs.github.io/assets/maps/map-spider.png
[mappoly]:https://lifescopelabs.github.io/assets/wireframes/sat-select-poly.png
[lifescope-app-legacy]:https://lifescopelabs.github.io/assets/screenshots/lifescope-app-legacy.png
[lifescope-app-wireframe]:https://lifescopelabs.github.io/assets/wireframes/week-content-feed.jpg
[Hawaii]:https://lifescopelabs.github.io/assets/wireframes/Hawaii.png
[HawaiiV2]:https://lifescopelabs.github.io/assets/wireframes/HawaiiV2.png
[nativeapp]:https://lifescopelabs.github.io/assets/screenshots/ss-savedsearches.png
