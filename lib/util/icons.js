var translation = {
	FontAwesome: {
		default: 'far fa-circle',

		contact: {
			default: 'fas fa-user'
		},

		content: {
			default: 'fas fa-map-marker',

			achievement: 'fas fa-trophy',
			audio: 'fas fa-headphones',
			code: 'fas fa-code',
			file: 'far fa-file',
			game: 'fas fa-gamepad',
			image: 'far fa-image',
			invite: 'far fa-envelope',
			receipt: 'fas fa-receipt',
			software: 'far fa-save',
			text: 'far fa-file-alt',
			video: 'fas fa-video',
			'web-page': 'fas fa-desktop'
		},

		event: {
			default: 'fas fa-exclamation',

			attended: 'fas fa-at',
			called: 'fas fa-phone',
			commented: 'fas fa-comment',
			created: 'fas fa-pencil-ruler',
			ate: 'fas fa-utensils',
			edited: 'fas fa-pen-square',
			exercised: 'fas fa-heartbeat',
			messaged: 'fas fa-comments',
			played: 'fas fa-play',
			purchased: 'far fa-credit-card',
			slept: 'fas fa-bed',
			traveled: 'fas fa-plane',
			viewed: 'far fa-eye',
			visited: 'fas fa-map-pin'
		},

		location: {
			default: 'fas fa-map-marker-alt'
		},

		organization: {
			default: 'far fa-building'
		},

		person: {
			default: 'fas fa-user'
		},

		place: {
			default: 'fas fa-map-pin'
		},

		thing: {
			default: 'fas fa-cube',

			'apparel_&_accessories': 'fas fa-tshirt',
			appliances: 'fas fa-cube',
			automotive: 'fas fa-car',
			baby: 'fas fa-child',
			'books_&_magazines': 'fas fa-book',
			electronics: 'fas fa-bolt',
			food: 'fas fa-utensils',
			gifts: 'fas fa-gift',
			'health_&_beauty': 'fas fa-plus-circle',
			'home_&_kitchen': 'fas fa-home',
			'movies_&_tv': 'fas fa-television',
			music: 'fas fa-music',
			office: 'fas fa-briefcase',
			pet: 'fas fa-paw',
			products: 'fas fa-shopping-bag',
			shoes: 'fas fa-show-prints',
			'sports_&_outdoors': 'fas fa-futbol',
			'tools_&_home_improvement': 'fas fa-hammer',
			'toys_&_games': 'fas fa-gamepad',
			other: 'fas fa-pen-square'
		},

		provider: {
			default: 'fas fa-plug',

			'chrome extension': 'fab fa-chrome',
			dropbox: 'fab fa-dropbox',
			'firefox extension': 'fab fa-firefox',
			facebook: 'fab fa-facebook-f',
			'financial files': 'fas fa-file-invoice-dollar',
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
			default: 'fas fa-plug',

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
