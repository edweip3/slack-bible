'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const async = require('async');
const Boom = require('boom');

const config = require('./config');
const Bible = require('./bible');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
	method: 'GET',
	path: '/search',
	handler: function (request, reply) {

		var temp = request.query.text.split(' ');
		var book = '';
		if (temp[0]==='1' || temp[0]==='2' || temp[0]==='3') {
			book = temp[0] + ' ' + temp[1];
		} else {
			book = temp[0];
		}

		if (!temp[1]){
			return reply();
		}
		var temp2 = temp[1].split(':');
		var chapter = temp2[0];
		if (!temp2[1]){
			return reply();
		}
		var temp3 = temp2[1].split('-');

		if (!temp3[0]) {
			return reply();
		}

		var min = parseInt(temp3[0]);
		var max = temp3[1] ? parseInt(temp3[1]) : parseInt(temp3[0]);

		var verses = [];
		for (var i=min; i<=max; i++) {
			verses.push(i);
		}

		var ret = '';
		async.eachSeries(verses, function(verse, cb){
			Bible.getVerse(book, chapter, verse, function(err, result){
				if (err) {
					console.log(err);
					return cb(err);
				}
	        	ret += verse + '. ' + result + '\n';
	        	cb();
			});
		}, function(err) {
			if (err) {
				console.log(err);
				//return reply(Boom.badRequest('sorry'));
				return reply();
			}
			reply(ret);
		});

    },
    config: {
        validate: {
            /*query: function(val, options, next) {
			console.log(val);
			if (!val.text) {
				return next(new Error('no q'));
			}

			if (val.token!==config.token) {
				return next(new Error('invalid token'));
			}
			var temp = val.text.split(' ');
			if (temp.length < 2) {
				return next(new Error('wrong query format'));
			}
			next(null, val);
		}*/
        }
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

