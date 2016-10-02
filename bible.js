const books = require('./books.json');
const _ = require('lodash');

var keywords = {};

_.keys(books).forEach(function(key){
	keywords[key.toLowerCase()] = {
		name: key,
		code: books[key].code
	};

	books[key].tags.forEach(function(tag){
		keywords[tag] = {
			name: key,
			code: books[key].code
		};
	});
});

var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream('./bibles/Chinese__Union_Simplified__cus__LTR.txt')
});

var bible = {};

lineReader.on('line', function (line) {
	var tokens = line.split('||');
	var book = tokens[0];
	var chapter = tokens[1];
	var verse = tokens[2];
	var text = tokens[3];

	//console.log(tokens);
	if (!bible[book]) bible[book] = {};
	if (!bible[book][chapter]) bible[book][chapter] = {};

	bible[book][chapter][verse] = text.replace(/\s/g, '');
});

lineReader.on('close', function (line) {
	/*getVerse('Genesis', '1', '20', function(err, result){
		if (err) return console.log(err);
		console.log(result);
	})*/
});

var getBook = function(book) {
	return keywords[book.toLowerCase()].name;
}

var getNumVerses = function(book, chapter) {
	var bookObj = keywords[book.toLowerCase()];
	if (!bookObj) {
		return 0;
	}

	var chapterObj = bible[bookObj.code][chapter+''];
	if (!chapterObj) {
		return 0;
	}
	return _.keys(chapterObj).length;
}

var getVerse = function(book, chapter, verse, cb) {
	book = book.toLowerCase();
	if (!keywords[book]) {
		return cb(new Error('no such book' + book));
	}
	try {
		verse = bible[keywords[book].code][chapter+''][verse+''];
		if (!verse) {
			return cb(new Error('no such verse '+ keywords[book].name + ' ' + chapter + ':' + verse));
		}
		cb(null, verse);
	} catch(e) {
			return cb(new Error('no such verse '+ keywords[book].name + ' ' + chapter + ':' + verse));
	}
};



module.exports = {
	getVerse: getVerse,
	getBook: getBook,
	getNumVerses: getNumVerses
};
