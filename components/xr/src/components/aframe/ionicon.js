var CONFIG = {};
CONFIG.DEBUG = true;

// TODO : make sure ionicon font family loaded
// TODO : don't create multiple canvas's for the same icon

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
  }
  else {
    if (CONFIG.DEBUG) {console.log("Registering ionicon...");}
  }
  
//default colors
var key_orange       = '#ed5b21'; // rgb(237, 91, 33) Light orange
var key_orange_light = '#ef8c60'; // rgb (239, 140, 96) Extra Light Orange
var key_grey         = '#22252a'; // rgb(34, 37, 42) Standard grey
var key_grey_dark    = '#2c3037'; // rgb(44, 48, 55) Medium grey
var key_grey_light   = '#606876'; // rgb(96, 104, 118) Light grey
var key_offwhite     = '#d3d3d4'; // rgb(211, 211, 212) Extra Light grey
var key_white        = '#fff';

//icon font variables
var icon_font = {"alert": "\uf101", "alert-circled": "\uf100", "android-add": "\uf2c7", "android-add-circle": "\uf359", "android-alarm-clock": "\uf35a", "android-alert": "\uf35b", "android-apps": "\uf35c", "android-archive": "\uf2c9", "android-arrow-back": "\uf2ca", "android-arrow-down": "\uf35d", "android-arrow-dropdown": "\uf35f", "android-arrow-dropdown-circle": "\uf35e", "android-arrow-dropleft": "\uf361", "android-arrow-dropleft-circle": "\uf360", "android-arrow-dropright": "\uf363", "android-arrow-dropright-circle": "\uf362", "android-arrow-dropup": "\uf365", "android-arrow-dropup-circle": "\uf364", "android-arrow-forward": "\uf30f", "android-arrow-up": "\uf366", "android-attach": "\uf367", "android-bar": "\uf368", "android-bicycle": "\uf369", "android-boat": "\uf36a", "android-bookmark": "\uf36b", "android-bulb": "\uf36c", "android-bus": "\uf36d", "android-calendar": "\uf2d1", "android-call": "\uf2d2", "android-camera": "\uf2d3", "android-cancel": "\uf36e", "android-car": "\uf36f", "android-cart": "\uf370", "android-chat": "\uf2d4", "android-checkbox": "\uf374", "android-checkbox-blank": "\uf371", "android-checkbox-outline": "\uf373", "android-checkbox-outline-blank": "\uf372", "android-checkmark-circle": "\uf375", "android-clipboard": "\uf376", "android-close": "\uf2d7", "android-cloud": "\uf37a", "android-cloud-circle": "\uf377", "android-cloud-done": "\uf378", "android-cloud-outline": "\uf379", "android-color-palette": "\uf37b", "android-compass": "\uf37c", "android-contact": "\uf2d8", "android-contacts": "\uf2d9", "android-contract": "\uf37d", "android-create": "\uf37e", "android-delete": "\uf37f", "android-desktop": "\uf380", "android-document": "\uf381", "android-done": "\uf383", "android-done-all": "\uf382", "android-download": "\uf2dd", "android-drafts": "\uf384", "android-exit": "\uf385", "android-expand": "\uf386", "android-favorite": "\uf388", "android-favorite-outline": "\uf387", "android-film": "\uf389", "android-folder": "\uf2e0", "android-folder-open": "\uf38a", "android-funnel": "\uf38b", "android-globe": "\uf38c", "android-hand": "\uf2e3", "android-hangout": "\uf38d", "android-happy": "\uf38e", "android-home": "\uf38f", "android-image": "\uf2e4", "android-laptop": "\uf390", "android-list": "\uf391", "android-locate": "\uf2e9", "android-lock": "\uf392", "android-mail": "\uf2eb", "android-map": "\uf393", "android-menu": "\uf394", "android-microphone": "\uf2ec", "android-microphone-off": "\uf395", "android-more-horizontal": "\uf396", "android-more-vertical": "\uf397", "android-navigate": "\uf398", "android-notifications": "\uf39b", "android-notifications-none": "\uf399", "android-notifications-off": "\uf39a", "android-open": "\uf39c", "android-options": "\uf39d", "android-people": "\uf39e", "android-person": "\uf3a0", "android-person-add": "\uf39f", "android-phone-landscape": "\uf3a1", "android-phone-portrait": "\uf3a2", "android-pin": "\uf3a3", "android-plane": "\uf3a4", "android-playstore": "\uf2f0", "android-print": "\uf3a5", "android-radio-button-off": "\uf3a6", "android-radio-button-on": "\uf3a7", "android-refresh": "\uf3a8", "android-remove": "\uf2f4", "android-remove-circle": "\uf3a9", "android-restaurant": "\uf3aa", "android-sad": "\uf3ab", "android-search": "\uf2f5", "android-send": "\uf2f6", "android-settings": "\uf2f7", "android-share": "\uf2f8", "android-share-alt": "\uf3ac", "android-star": "\uf2fc", "android-star-half": "\uf3ad", "android-star-outline": "\uf3ae", "android-stopwatch": "\uf2fd", "android-subway": "\uf3af", "android-sunny": "\uf3b0", "android-sync": "\uf3b1", "android-textsms": "\uf3b2", "android-time": "\uf3b3", "android-train": "\uf3b4", "android-unlock": "\uf3b5", "android-upload": "\uf3b6", "android-volume-down": "\uf3b7", "android-volume-mute": "\uf3b8", "android-volume-off": "\uf3b9", "android-volume-up": "\uf3ba", "android-walk": "\uf3bb", "android-warning": "\uf3bc", "android-watch": "\uf3bd", "android-wifi": "\uf305", "aperture": "\uf313", "archive": "\uf102", "arrow-down-a": "\uf103", "arrow-down-b": "\uf104", "arrow-down-c": "\uf105", "arrow-expand": "\uf25e", "arrow-graph-down-left": "\uf25f", "arrow-graph-down-right": "\uf260", "arrow-graph-up-left": "\uf261", "arrow-graph-up-right": "\uf262", "arrow-left-a": "\uf106", "arrow-left-b": "\uf107", "arrow-left-c": "\uf108", "arrow-move": "\uf263", "arrow-resize": "\uf264", "arrow-return-left": "\uf265", "arrow-return-right": "\uf266", "arrow-right-a": "\uf109", "arrow-right-b": "\uf10a", "arrow-right-c": "\uf10b", "arrow-shrink": "\uf267", "arrow-swap": "\uf268", "arrow-up-a": "\uf10c", "arrow-up-b": "\uf10d", "arrow-up-c": "\uf10e", "asterisk": "\uf314", "at": "\uf10f", "backspace": "\uf3bf", "backspace-outline": "\uf3be", "bag": "\uf110", "battery-charging": "\uf111", "battery-empty": "\uf112", "battery-full": "\uf113", "battery-half": "\uf114", "battery-low": "\uf115", "beaker": "\uf269", "beer": "\uf26a", "bluetooth": "\uf116", "bonfire": "\uf315", "bookmark": "\uf26b", "bowtie": "\uf3c0", "briefcase": "\uf26c", "bug": "\uf2be", "calculator": "\uf26d", "calendar": "\uf117", "camera": "\uf118", "card": "\uf119", "cash": "\uf316", "chatbox": "\uf11b", "chatbox-working": "\uf11a", "chatboxes": "\uf11c", "chatbubble": "\uf11e", "chatbubble-working": "\uf11d", "chatbubbles": "\uf11f", "checkmark": "\uf122", "checkmark-circled": "\uf120", "checkmark-round": "\uf121", "chevron-down": "\uf123", "chevron-left": "\uf124", "chevron-right": "\uf125", "chevron-up": "\uf126", "clipboard": "\uf127", "clock": "\uf26e", "close": "\uf12a", "close-circled": "\uf128", "close-round": "\uf129", "closed-captioning": "\uf317", "cloud": "\uf12b", "code": "\uf271", "code-download": "\uf26f", "code-working": "\uf270", "coffee": "\uf272", "compass": "\uf273", "compose": "\uf12c", "connection-bars": "\uf274", "contrast": "\uf275", "crop": "\uf3c1", "cube": "\uf318", "disc": "\uf12d", "document": "\uf12f", "document-text": "\uf12e", "drag": "\uf130", "earth": "\uf276", "easel": "\uf3c2", "edit": "\uf2bf", "egg": "\uf277", "eject": "\uf131", "email": "\uf132", "email-unread": "\uf3c3", "erlenmeyer-flask": "\uf3c5", "erlenmeyer-flask-bubbles": "\uf3c4", "eye": "\uf133", "eye-disabled": "\uf306", "female": "\uf278", "filing": "\uf134", "film-marker": "\uf135", "fireball": "\uf319", "flag": "\uf279", "flame": "\uf31a", "flash": "\uf137", "flash-off": "\uf136", "folder": "\uf139", "fork": "\uf27a", "fork-repo": "\uf2c0", "forward": "\uf13a", "funnel": "\uf31b", "gear-a": "\uf13d", "gear-b": "\uf13e", "grid": "\uf13f", "hammer": "\uf27b", "happy": "\uf31c", "happy-outline": "\uf3c6", "headphone": "\uf140", "heart": "\uf141", "heart-broken": "\uf31d", "help": "\uf143", "help-buoy": "\uf27c", "help-circled": "\uf142", "home": "\uf144", "icecream": "\uf27d", "image": "\uf147", "images": "\uf148", "information": "\uf14a", "information-circled": "\uf149", "ionic": "\uf14b", "ios-alarm": "\uf3c8", "ios-alarm-outline": "\uf3c7", "ios-albums": "\uf3ca", "ios-albums-outline": "\uf3c9", "ios-americanfootball": "\uf3cc", "ios-americanfootball-outline": "\uf3cb", "ios-analytics": "\uf3ce", "ios-analytics-outline": "\uf3cd", "ios-arrow-back": "\uf3cf", "ios-arrow-down": "\uf3d0", "ios-arrow-forward": "\uf3d1", "ios-arrow-left": "\uf3d2", "ios-arrow-right": "\uf3d3", "ios-arrow-thin-down": "\uf3d4", "ios-arrow-thin-left": "\uf3d5", "ios-arrow-thin-right": "\uf3d6", "ios-arrow-thin-up": "\uf3d7", "ios-arrow-up": "\uf3d8", "ios-at": "\uf3da", "ios-at-outline": "\uf3d9", "ios-barcode": "\uf3dc", "ios-barcode-outline": "\uf3db", "ios-baseball": "\uf3de", "ios-baseball-outline": "\uf3dd", "ios-basketball": "\uf3e0", "ios-basketball-outline": "\uf3df", "ios-bell": "\uf3e2", "ios-bell-outline": "\uf3e1", "ios-body": "\uf3e4", "ios-body-outline": "\uf3e3", "ios-bolt": "\uf3e6", "ios-bolt-outline": "\uf3e5", "ios-book": "\uf3e8", "ios-book-outline": "\uf3e7", "ios-bookmarks": "\uf3ea", "ios-bookmarks-outline": "\uf3e9", "ios-box": "\uf3ec", "ios-box-outline": "\uf3eb", "ios-briefcase": "\uf3ee", "ios-briefcase-outline": "\uf3ed", "ios-browsers": "\uf3f0", "ios-browsers-outline": "\uf3ef", "ios-calculator": "\uf3f2", "ios-calculator-outline": "\uf3f1", "ios-calendar": "\uf3f4", "ios-calendar-outline": "\uf3f3", "ios-camera": "\uf3f6", "ios-camera-outline": "\uf3f5", "ios-cart": "\uf3f8", "ios-cart-outline": "\uf3f7", "ios-chatboxes": "\uf3fa", "ios-chatboxes-outline": "\uf3f9", "ios-chatbubble": "\uf3fc", "ios-chatbubble-outline": "\uf3fb", "ios-checkmark": "\uf3ff", "ios-checkmark-empty": "\uf3fd", "ios-checkmark-outline": "\uf3fe", "ios-circle-filled": "\uf400", "ios-circle-outline": "\uf401", "ios-clock": "\uf403", "ios-clock-outline": "\uf402", "ios-close": "\uf406", "ios-close-empty": "\uf404", "ios-close-outline": "\uf405", "ios-cloud": "\uf40c", "ios-cloud-download": "\uf408", "ios-cloud-download-outline": "\uf407", "ios-cloud-outline": "\uf409", "ios-cloud-upload": "\uf40b", "ios-cloud-upload-outline": "\uf40a", "ios-cloudy": "\uf410", "ios-cloudy-night": "\uf40e", "ios-cloudy-night-outline": "\uf40d", "ios-cloudy-outline": "\uf40f", "ios-cog": "\uf412", "ios-cog-outline": "\uf411", "ios-color-filter": "\uf414", "ios-color-filter-outline": "\uf413", "ios-color-wand": "\uf416", "ios-color-wand-outline": "\uf415", "ios-compose": "\uf418", "ios-compose-outline": "\uf417", "ios-contact": "\uf41a", "ios-contact-outline": "\uf419", "ios-copy": "\uf41c", "ios-copy-outline": "\uf41b", "ios-crop": "\uf41e", "ios-crop-strong": "\uf41d", "ios-download": "\uf420", "ios-download-outline": "\uf41f", "ios-drag": "\uf421", "ios-email": "\uf423", "ios-email-outline": "\uf422", "ios-eye": "\uf425", "ios-eye-outline": "\uf424", "ios-fastforward": "\uf427", "ios-fastforward-outline": "\uf426", "ios-filing": "\uf429", "ios-filing-outline": "\uf428", "ios-film": "\uf42b", "ios-film-outline": "\uf42a", "ios-flag": "\uf42d", "ios-flag-outline": "\uf42c", "ios-flame": "\uf42f", "ios-flame-outline": "\uf42e", "ios-flask": "\uf431", "ios-flask-outline": "\uf430", "ios-flower": "\uf433", "ios-flower-outline": "\uf432", "ios-folder": "\uf435", "ios-folder-outline": "\uf434", "ios-football": "\uf437", "ios-football-outline": "\uf436", "ios-game-controller-a": "\uf439", "ios-game-controller-a-outline": "\uf438", "ios-game-controller-b": "\uf43b", "ios-game-controller-b-outline": "\uf43a", "ios-gear": "\uf43d", "ios-gear-outline": "\uf43c", "ios-glasses": "\uf43f", "ios-glasses-outline": "\uf43e", "ios-grid-view": "\uf441", "ios-grid-view-outline": "\uf440", "ios-heart": "\uf443", "ios-heart-outline": "\uf442", "ios-help": "\uf446", "ios-help-empty": "\uf444", "ios-help-outline": "\uf445", "ios-home": "\uf448", "ios-home-outline": "\uf447", "ios-infinite": "\uf44a", "ios-infinite-outline": "\uf449", "ios-information": "\uf44d", "ios-information-empty": "\uf44b", "ios-information-outline": "\uf44c", "ios-ionic-outline": "\uf44e", "ios-keypad": "\uf450", "ios-keypad-outline": "\uf44f", "ios-lightbulb": "\uf452", "ios-lightbulb-outline": "\uf451", "ios-list": "\uf454", "ios-list-outline": "\uf453", "ios-location": "\uf456", "ios-location-outline": "\uf455", "ios-locked": "\uf458", "ios-locked-outline": "\uf457", "ios-loop": "\uf45a", "ios-loop-strong": "\uf459", "ios-medical": "\uf45c", "ios-medical-outline": "\uf45b", "ios-medkit": "\uf45e", "ios-medkit-outline": "\uf45d", "ios-mic": "\uf461", "ios-mic-off": "\uf45f", "ios-mic-outline": "\uf460", "ios-minus": "\uf464", "ios-minus-empty": "\uf462", "ios-minus-outline": "\uf463", "ios-monitor": "\uf466", "ios-monitor-outline": "\uf465", "ios-moon": "\uf468", "ios-moon-outline": "\uf467", "ios-more": "\uf46a", "ios-more-outline": "\uf469", "ios-musical-note": "\uf46b", "ios-musical-notes": "\uf46c", "ios-navigate": "\uf46e", "ios-navigate-outline": "\uf46d", "ios-nutrition": "\uf470", "ios-nutrition-outline": "\uf46f", "ios-paper": "\uf472", "ios-paper-outline": "\uf471", "ios-paperplane": "\uf474", "ios-paperplane-outline": "\uf473", "ios-partlysunny": "\uf476", "ios-partlysunny-outline": "\uf475", "ios-pause": "\uf478", "ios-pause-outline": "\uf477", "ios-paw": "\uf47a", "ios-paw-outline": "\uf479", "ios-people": "\uf47c", "ios-people-outline": "\uf47b", "ios-person": "\uf47e", "ios-person-outline": "\uf47d", "ios-personadd": "\uf480", "ios-personadd-outline": "\uf47f", "ios-photos": "\uf482", "ios-photos-outline": "\uf481", "ios-pie": "\uf484", "ios-pie-outline": "\uf483", "ios-pint": "\uf486", "ios-pint-outline": "\uf485", "ios-play": "\uf488", "ios-play-outline": "\uf487", "ios-plus": "\uf48b", "ios-plus-empty": "\uf489", "ios-plus-outline": "\uf48a", "ios-pricetag": "\uf48d", "ios-pricetag-outline": "\uf48c", "ios-pricetags": "\uf48f", "ios-pricetags-outline": "\uf48e", "ios-printer": "\uf491", "ios-printer-outline": "\uf490", "ios-pulse": "\uf493", "ios-pulse-strong": "\uf492", "ios-rainy": "\uf495", "ios-rainy-outline": "\uf494", "ios-recording": "\uf497", "ios-recording-outline": "\uf496", "ios-redo": "\uf499", "ios-redo-outline": "\uf498", "ios-refresh": "\uf49c", "ios-refresh-empty": "\uf49a", "ios-refresh-outline": "\uf49b", "ios-reload": "\uf49d", "ios-reverse-camera": "\uf49f", "ios-reverse-camera-outline": "\uf49e", "ios-rewind": "\uf4a1", "ios-rewind-outline": "\uf4a0", "ios-rose": "\uf4a3", "ios-rose-outline": "\uf4a2", "ios-search": "\uf4a5", "ios-search-strong": "\uf4a4", "ios-settings": "\uf4a7", "ios-settings-strong": "\uf4a6", "ios-shuffle": "\uf4a9", "ios-shuffle-strong": "\uf4a8", "ios-skipbackward": "\uf4ab", "ios-skipbackward-outline": "\uf4aa", "ios-skipforward": "\uf4ad", "ios-skipforward-outline": "\uf4ac", "ios-snowy": "\uf4ae", "ios-speedometer": "\uf4b0", "ios-speedometer-outline": "\uf4af", "ios-star": "\uf4b3", "ios-star-half": "\uf4b1", "ios-star-outline": "\uf4b2", "ios-stopwatch": "\uf4b5", "ios-stopwatch-outline": "\uf4b4", "ios-sunny": "\uf4b7", "ios-sunny-outline": "\uf4b6", "ios-telephone": "\uf4b9", "ios-telephone-outline": "\uf4b8", "ios-tennisball": "\uf4bb", "ios-tennisball-outline": "\uf4ba", "ios-thunderstorm": "\uf4bd", "ios-thunderstorm-outline": "\uf4bc", "ios-time": "\uf4bf", "ios-time-outline": "\uf4be", "ios-timer": "\uf4c1", "ios-timer-outline": "\uf4c0", "ios-toggle": "\uf4c3", "ios-toggle-outline": "\uf4c2", "ios-trash": "\uf4c5", "ios-trash-outline": "\uf4c4", "ios-undo": "\uf4c7", "ios-undo-outline": "\uf4c6", "ios-unlocked": "\uf4c9", "ios-unlocked-outline": "\uf4c8", "ios-upload": "\uf4cb", "ios-upload-outline": "\uf4ca", "ios-videocam": "\uf4cd", "ios-videocam-outline": "\uf4cc", "ios-volume-high": "\uf4ce", "ios-volume-low": "\uf4cf", "ios-wineglass": "\uf4d1", "ios-wineglass-outline": "\uf4d0", "ios-world": "\uf4d3", "ios-world-outline": "\uf4d2", "ipad": "\uf1f9", "iphone": "\uf1fa", "ipod": "\uf1fb", "jet": "\uf295", "key": "\uf296", "knife": "\uf297", "laptop": "\uf1fc", "leaf": "\uf1fd", "levels": "\uf298", "lightbulb": "\uf299", "link": "\uf1fe", "load-a": "\uf29a", "load-b": "\uf29b", "load-c": "\uf29c", "load-d": "\uf29d", "location": "\uf1ff", "lock-combination": "\uf4d4", "locked": "\uf200", "log-in": "\uf29e", "log-out": "\uf29f", "loop": "\uf201", "magnet": "\uf2a0", "male": "\uf2a1", "man": "\uf202", "map": "\uf203", "medkit": "\uf2a2", "merge": "\uf33f", "mic-a": "\uf204", "mic-b": "\uf205", "mic-c": "\uf206", "minus": "\uf209", "minus-circled": "\uf207", "minus-round": "\uf208", "model-s": "\uf2c1", "monitor": "\uf20a", "more": "\uf20b", "mouse": "\uf340", "music-note": "\uf20c", "navicon": "\uf20e", "navicon-round": "\uf20d", "navigate": "\uf2a3", "network": "\uf341", "no-smoking": "\uf2c2", "nuclear": "\uf2a4", "outlet": "\uf342", "paintbrush": "\uf4d5", "paintbucket": "\uf4d6", "paper-airplane": "\uf2c3", "paperclip": "\uf20f", "pause": "\uf210", "person": "\uf213", "person-add": "\uf211", "person-stalker": "\uf212", "pie-graph": "\uf2a5", "pin": "\uf2a6", "pinpoint": "\uf2a7", "pizza": "\uf2a8", "plane": "\uf214", "planet": "\uf343", "play": "\uf215", "playstation": "\uf30a", "plus": "\uf218", "plus-circled": "\uf216", "plus-round": "\uf217", "podium": "\uf344", "pound": "\uf219", "power": "\uf2a9", "pricetag": "\uf2aa", "pricetags": "\uf2ab", "printer": "\uf21a", "pull-request": "\uf345", "qr-scanner": "\uf346", "quote": "\uf347", "radio-waves": "\uf2ac", "record": "\uf21b", "refresh": "\uf21c", "reply": "\uf21e", "reply-all": "\uf21d", "ribbon-a": "\uf348", "ribbon-b": "\uf349", "sad": "\uf34a", "sad-outline": "\uf4d7", "scissors": "\uf34b", "search": "\uf21f", "settings": "\uf2ad", "share": "\uf220", "shuffle": "\uf221", "skip-backward": "\uf222", "skip-forward": "\uf223", "social-android": "\uf225", "social-android-outline": "\uf224", "social-angular": "\uf4d9", "social-angular-outline": "\uf4d8", "social-apple": "\uf227", "social-apple-outline": "\uf226", "social-bitcoin": "\uf2af", "social-bitcoin-outline": "\uf2ae", "social-buffer": "\uf229", "social-buffer-outline": "\uf228", "social-chrome": "\uf4db", "social-chrome-outline": "\uf4da", "social-codepen": "\uf4dd", "social-codepen-outline": "\uf4dc", "social-css3": "\uf4df", "social-css3-outline": "\uf4de", "social-designernews": "\uf22b", "social-designernews-outline": "\uf22a", "social-dribbble": "\uf22d", "social-dribbble-outline": "\uf22c", "social-dropbox": "\uf22f", "social-dropbox-outline": "\uf22e", "social-euro": "\uf4e1", "social-euro-outline": "\uf4e0", "social-facebook": "\uf231", "social-facebook-outline": "\uf230", "social-foursquare": "\uf34d", "social-foursquare-outline": "\uf34c", "social-freebsd-devil": "\uf2c4", "social-github": "\uf233", "social-github-outline": "\uf232", "social-google": "\uf34f", "social-google-outline": "\uf34e", "social-googleplus": "\uf235", "social-googleplus-outline": "\uf234", "social-hackernews": "\uf237", "social-hackernews-outline": "\uf236", "social-html5": "\uf4e3", "social-html5-outline": "\uf4e2", "social-instagram": "\uf351", "social-instagram-outline": "\uf350", "social-javascript": "\uf4e5", "social-javascript-outline": "\uf4e4", "social-linkedin": "\uf239", "social-linkedin-outline": "\uf238", "social-markdown": "\uf4e6", "social-nodejs": "\uf4e7", "social-octocat": "\uf4e8", "social-pinterest": "\uf2b1", "social-pinterest-outline": "\uf2b0", "social-python": "\uf4e9", "social-reddit": "\uf23b", "social-reddit-outline": "\uf23a", "social-rss": "\uf23d", "social-rss-outline": "\uf23c", "social-sass": "\uf4ea", "social-skype": "\uf23f", "social-skype-outline": "\uf23e", "social-snapchat": "\uf4ec", "social-snapchat-outline": "\uf4eb", "social-tumblr": "\uf241", "social-tumblr-outline": "\uf240", "social-tux": "\uf2c5", "social-twitch": "\uf4ee", "social-twitch-outline": "\uf4ed", "social-twitter": "\uf243", "social-twitter-outline": "\uf242", "social-usd": "\uf353", "social-usd-outline": "\uf352", "social-vimeo": "\uf245", "social-vimeo-outline": "\uf244", "social-whatsapp": "\uf4f0", "social-whatsapp-outline": "\uf4ef", "social-windows": "\uf247", "social-windows-outline": "\uf246", "social-wordpress": "\uf249", "social-wordpress-outline": "\uf248", "social-yahoo": "\uf24b", "social-yahoo-outline": "\uf24a", "social-yen": "\uf4f2", "social-yen-outline": "\uf4f1", "social-youtube": "\uf24d", "social-youtube-outline": "\uf24c", "soup-can": "\uf4f4", "soup-can-outline": "\uf4f3", "speakerphone": "\uf2b2", "speedometer": "\uf2b3", "spoon": "\uf2b4", "star": "\uf24e", "stats-bars": "\uf2b5", "steam": "\uf30b", "stop": "\uf24f", "thermometer": "\uf2b6", "thumbsdown": "\uf250", "thumbsup": "\uf251", "toggle": "\uf355", "toggle-filled": "\uf354", "transgender": "\uf4f5", "trash-a": "\uf252", "trash-b": "\uf253", "trophy": "\uf356", "tshirt": "\uf4f7", "tshirt-outline": "\uf4f6", "umbrella": "\uf2b7", "university": "\uf357", "unlocked": "\uf254", "upload": "\uf255", "usb": "\uf2b8", "videocamera": "\uf256", "volume-high": "\uf257", "volume-low": "\uf258", "volume-medium": "\uf259", "volume-mute": "\uf25a", "wand": "\uf358", "waterdrop": "\uf25b", "wifi": "\uf25c", "wineglass": "\uf2b9", "woman": "\uf25d", "wrench": "\uf2ba", "xbox": "\uf30c"};

AFRAME.registerComponent('ionicon', {
    schema: {
      icon: {type: 'string', default: ''},
      width: {type: 'number', default: 1},
      height: {type: 'number', default: 1},
      fontColor: {type: 'string', default: key_offwhite},
      backgroundColor: {type: 'string', default: key_grey},
    },

    init: function () {
      if (CONFIG.DEBUG) {
        console.log('ionicon init');
      }

      var data = this.data;
      var el = this.el;

      // dimensions
      var multiplier = 350;
      var canvasWidth = this.data.height*multiplier; //square
      var canvasHeight = this.data.height*multiplier;

      // canvas container
      var canvasContainer = document.createElement('div');
      canvasContainer.setAttribute('class', 'visuallyhidden');
      document.body.appendChild(canvasContainer);

      // canvas
      var canvas = document.createElement("canvas");
      this.canvas = canvas;
      canvas.className = "visuallyhidden";
      // console.log("setting height")
      canvas.setAttribute('width', canvasWidth);
      canvas.setAttribute('height', canvasHeight);
      canvas.id = getUniqueId('canvasIcon');
      canvasContainer.appendChild(canvas);
      var ctx = this.ctx = canvas.getContext('2d');

      // create icon
    //   console.log(`data.height: ${data.height}`)
    //   console.log(`data.backgroundColor: ${data.backgroundColor}`)

      el.setAttribute('geometry', `primitive: plane; height: ${data.height}; width: ${data.height};`);
      el.setAttribute('material', `shader: flat; transparent: true; opacity: 0.5; side:back; color:${data.backgroundColor};`);

      drawIcon(ctx, canvas, data.icon, data.fontColor, 1);

      // place icon
      var iconEntity = document.createElement("a-entity");
      iconEntity.setAttribute('geometry', `primitive: plane; width: ${data.width/2}; height: ${data.height/2};`);
      iconEntity.setAttribute('material', `shader: flat; src: #${canvas.id}; transparent: true; opacity: 1; side:front;`);
      iconEntity.setAttribute('position', `0 0 0.041`);
      el.appendChild(iconEntity);
      
    },

    tick: function () {
    }

});

// getUniqueID
function getUniqueId(stringPrefix) {
    var datestr = new Date().getTime().toString();
    var randomstr = Math.random().toString().replace('.', '');
    return stringPrefix + '_' + datestr + randomstr;
}

// drawIcon
function drawIcon(ctx, canvas, icon, color, size) {
  if (CONFIG.DEBUG) {console.log("ionicon: drawIcon");}
  setTimeout(function(){
      ctx.font = '240px Ionicons';
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 0;
      ctx.shadowOffsetX = 0;
      ctx.scale(1, 1);

      console.log("icon: " + icon); 
      if(icon_font[icon]){
          ctx.fillText(icon_font[icon], canvas.width/2, canvas.height/2);
      }else{
          console.log("icon_font[" + icon + "] does not exist");
          ctx.fillText('?', canvas.width/2, canvas.height/2);
      }

  },500); // callback when font is loaded needed
}



AFRAME.registerPrimitive( 'a-ionicon', {
    defaultComponents: {
        'ionicon': { }
    },
    mappings: {
        'width': 'ionicon.width',
        'height': 'ionicon.height',
        'font-color': 'ionicon.fontColor',
        'background-color': 'ionicon.backgroudColor',
        'icon': 'ionicon.icon',
    }
});

{/* <style type="text/css">
		@font-face{
			font-family:"Ionicons";

			src:url("assets/fonts/ionicons.eot?v=2.0.1");
			src:url("assets/fonts/ionicons.eot?v=2.0.1#iefix") format("embedded-opentype"),url("assets/fonts/ionicons.ttf?v=2.0.1") format("truetype"),url("assets/fonts/ionicons.woff?v=2.0.1") format("woff"),url("assets/fonts/ionicons.svg?v=2.0.1#Ionicons") format("svg");
			
			font-weight:normal;
			font-style:normal
		}
		body{font-family:Ionicons;}
		.visuallyhidden {
			display: block;
			border: 0;
			clip: rect(0 0 0 0);
			height: 1px;
			width: 1px;
			margin: -1px;
			padding: 0;
			overflow: hidden;
			position: absolute !important;
		} 
	</style> */}