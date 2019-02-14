var translation = {
	FontAwesome: {
		default: 'far fa-circle',

		contact: {
			default: 'fal fa-user'
		},

		content: {
			default: 'fal fa-map-marker',

			achievement: 'fal fa-trophy',
			audio: 'fal fa-headphones',
			code: 'fal fa-code',
			file: 'far fa-file',
			game: 'fal fa-gamepad',
			image: 'far fa-image',
			invite: 'far fa-envelope',
			receipt: 'fal fa-receipt',
			software: 'far fa-save',
			text: 'far fa-file-alt',
			video: 'fal fa-video',
			'web-page': 'fal fa-desktop'
		},

		event: {
			default: 'fal fa-exclamation',

			attended: 'fal fa-at',
			called: 'fal fa-phone',
			commented: 'fal fa-comment',
			created: 'fal fa-pencil-ruler',
			ate: 'fal fa-utensils',
			edited: 'fal fa-pen-square',
			exercised: 'fal fa-heartbeat',
			messaged: 'fal fa-comments',
			played: 'fal fa-play',
			purchased: 'far fa-credit-card',
			slept: 'fal fa-bed',
			traveled: 'fal fa-plane',
			viewed: 'far fa-eye',
			visited: 'fal fa-map-pin'
		},

		location: {
			default: 'fal fa-map-marker-alt'
		},

		organization: {
			default: 'far fa-building'
		},

		person: {
			default: 'fal fa-user'
		},

		place: {
			default: 'fal fa-map-pin'
		},

		thing: {
			default: 'fal fa-cube',

			'apparel_&_accessories': 'fal fa-tshirt',
			appliances: 'fal fa-cube',
			automotive: 'fal fa-car',
			baby: 'fal fa-child',
			'books_&_magazines': 'fal fa-book',
			electronics: 'fal fa-bolt',
			food: 'fal fa-utensils',
			gifts: 'fal fa-gift',
			'health_&_beauty': 'fal fa-plus-circle',
			'home_&_kitchen': 'fal fa-home',
			'movies_&_tv': 'fal fa-television',
			music: 'fal fa-music',
			office: 'fal fa-briefcase',
			pet: 'fal fa-paw',
			products: 'fal fa-shopping-bag',
			shoes: 'fal fa-show-prints',
			'sports_&_outdoors': 'fal fa-futbol',
			'tools_&_home_improvement': 'fal fa-hammer',
			'toys_&_games': 'fal fa-gamepad',
			other: 'fal fa-pen-square'
		},

		provider: {
			default: 'fal fa-plug',

			'chrome extension': 'fab fa-chrome',
			dropbox: 'fab fa-dropbox',
			'firefox extension': 'fab fa-firefox',
			facebook: 'fab fa-facebook-f',
			'financial files': 'fal fa-file-invoice-dollar',
			github: 'fab fa-github',
			google: 'fab fa-google',
			instagram: 'fab fa-instagram',
			lyft: 'fab fa-lyft',
			microsoft: 'fab fa-windows',
			reddit: 'fab fa-reddit-alien',
			pinterest: 'fab fa-pinterest-p',
			slack: 'fab fa-slack',
			slice: 'far fa-credit-card',
			spotify: 'fab fa-spotify',
			steam: 'fab fa-steam-symbol',
			twitter: 'fab fa-twitter',
			uber: 'fab fa-uber'
		},

		browser: {
			default: 'fal fa-plug',

			chrome: 'fab fa-chrome',
			firefox: 'fab fa-firefox',
			safari: 'fab fa-safari',
			edge: 'fab fa-edge'
		}
	}
};


function getIcon(library, type, name) {
	if (arguments.length <= 2) {
		name = type;
		type = library;
		library = 'FontAwesome';

		if (arguments.length == 1) {
			return translation[library][type].default;
		}
	}

	type = type.toLowerCase();

	if (name) {
		name = name.toLowerCase();
	}

	if (!translation[library]) {
		throw new Error('Invalid font library.');
	}

	if (!translation[library][type]) {
		return translation[library].default;
	}

	if (!translation[library][type][name]) {
		return translation[library][type].default;
	}

	return translation[library][type][name];
}

export default getIcon;
