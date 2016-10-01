'use strict';

const Hapi = require('hapi');
const Joi = require('joi');
const Bible = require('./bible');
const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/search',
    handler: function (request, reply) {
	var temp = request.query.q.split(' ');
	var book = '';
	if (temp[0]==='1' || temp[0]==='2' || temp[0]==='3') {
		book = temp[0] + ' ' + temp[1];
	} else {
		book = temp[0];
	}

	var temp2 = temp[1].split(':');
	var chapter = temp2[0];
	var verses = [];
	verses.push(temp2[1]);
	Bible.getVerse(book, chapter, verses[0], function(err, result){
		if (err) {console.log(err);}
        	reply(result);
	});
    },
    config: {
        validate: {
            query: function(val, options, next) {
			console.log(val);
			if (!val.q) {
				return next(new Error('no q'));
			}

			var temp = val.q.split(' ');
			if (temp.length < 2) {
				return next(new Error('wrong query format'));
			}
			next(null, val);
		}
        }
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
