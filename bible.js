const books = require('./books.json');
var lineReader = require('readline').createInterface({
	input: require('fs').createReadStream('./bibles/Chinese__Union_Simplified__cus__LTR.txt')
});

var bible = {};
lineReader.on('line', function (line) {
	var tokens = line.split('||');
	//console.log(tokens);
	if (!bible[tokens[0]]) bible[tokens[0]] = {};
	if (!bible[tokens[0]][tokens[1]]) bible[tokens[0]][tokens[1]] = {};
	bible[tokens[0]][tokens[1]][tokens[2]]=tokens[3].replace(/\s/g, '');

});

lineReader.on('close', function (line) {
	/*getVerse('Genesis', '1', '20', function(err, result){
		if (err) return console.log(err);
		console.log(result);
	})*/
});

var getVerse = function(book, chapter, verse, cb) {
	if (!books[book]) {
		return cb(new Error('no such book'));
	}
	try {
		verse = bible[books[book].code][chapter+''][verse+''];
		if (!verse) {
			return cb(new Error('no such verse'));
		}
		cb(null, verse);
	} catch(e) {
		cb(new Error('no such verse'));
	}
};

module.exports = {getVerse: getVerse};
