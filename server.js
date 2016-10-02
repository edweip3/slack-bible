'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const async = require('async');
const Boom = require('boom');

const config = require('./config');
const Bible = require('./bible');

const server = new Hapi.Server();
server.connection({ port: 3000 });


function usage() {
	var usage = 'Usage: /bible <book> <chapter>:<verse>[-<verse>]\n';
	usage += '\n';
	usage += 'Examples:\n';
	usage += '/bible gen 1:1\n';
	usage += '/bible gen 1:1-10\n';
	usage += '/bible genesis 1:1-10\n';
	usage += '\n';
	usage += 'NOTE: spaces are important!';

	return usage;
}

server.route({
	method: 'GET',
	path: '/search',
	handler: function (request, reply) {

		try {


			var temp = request.query.text.split(' ');
			var temp2;

			var book = '';
			if (temp[0]==='1' || temp[0]==='2' || temp[0]==='3') {
				book = temp[0] + ' ' + temp[1];
				temp2 = temp[2].split(':');

			} else {
				book = temp[0];
				temp2 = temp[1].split(':');
			}

			//console.log(book);

			if (!temp[1]){
				return reply(usage());
			}
			var chapter = temp2[0];

			var verses = [];
			if (!temp2[1]){

				var numVerses = Bible.getNumVerses(book, chapter);

				for (var j=1; j<=numVerses; j++) {
					verses.push(j);
				}
			} else {
				var temp3 = temp2[1].split('-');

				if (!temp3[0]) {
					return reply(usage());
				}

				var min = parseInt(temp3[0]);
				var max = temp3[1] ? parseInt(temp3[1]) : parseInt(temp3[0]);


				for (var i=min; i<=max; i++) {
					verses.push(i);
				}
			}

			var scripture = '';
			async.eachSeries(verses, function(verse, cb){
				Bible.getVerse(book, chapter, verse, function(err, result){
					if (err) {
						console.log(err);
						return cb(err);
					}
		        	scripture += verse + '. ' + result + '\n';
		        	cb();
				});
			}, function(err) {
				if (err) {
					console.log(err);
					//return reply(Boom.badRequest('sorry'));
					return reply(usage());
				}
				scripture = Bible.getBook(book) + ' ' + temp2[0] + (temp2[1] ? ':' + temp2[1] : '') + '\n' + scripture;

				var ret = {
				    'response_type': 'in_channel',
				    'text': scripture
				}

				reply(ret);
			});

		} catch(e) {
			console.log(e);
			reply(usage());
		}

    },
    config: {
        validate: {
            query: function(val, options, next) {
				//console.log(val);
				/*if (!val.text) {
					return next(new Error('no q'));
				}*/

				if (val.token!==config.token) {
					return next(new Error('invalid token'));
				}
				/*var temp = val.text.split(' ');
				if (temp.length < 2) {
					return next(new Error('wrong query format'));
				}*/
				next(null, val);
			}
        }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

