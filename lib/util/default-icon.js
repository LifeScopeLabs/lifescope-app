let colorPalette = [
	'#a2b9bc',
	'#b2ad7f',
	'#878f99',
	'#6b5b95',
	'#feb236',
	'#d64161',
	'#ff7b25',
	'#d6cbd3',
	'#eca1a6',
	'#bdcebe',
	'#ffef96',
	'#50394c',
	'#2efbd8',
	'#618685',
	'#36486b',
	'#4040a1',
	'#c1502e',
	'#622569',
	'#c83349',
	'#4d4d4d',
	'#ff80ce',
	'#51e898',
	'#00c2e0',
	'#0079bf',
	'#a232cb',
	'#eb5a46',
	'#b6bbbf',
	'#61bd4f',
	'#f2d600',
	'#ffab4a',
];

export const defaultLetter = function(person) {
	return person.first_name && person.first_name[0] ? person.first_name[0] : person.last_name && person.last_name[0] ? person.last_name[0] : person.middle_name && person.middle_name[0] ? person.middle_name[0] : '';
};

export const defaultColor = function(person) {
	if (person.first_name || person.middle_name || person.last_name) {
		let buffer = Buffer.from(person.first_name && person.first_name.length > 0 ? person.first_name : person.last_name && person.last_name.length > 0 ? person.last_name : person.middle_name);

		let sum = _.sum(buffer);

		let modulo = sum % 30;

		return colorPalette[modulo];
	}
	else {
		return '#ffffff'
	}
};