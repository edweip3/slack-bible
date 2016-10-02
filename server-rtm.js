var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;

var token = 'xoxb-86389590852-x6kH6exT965RA6is0NB7DQHU';

var rtm = new RtmClient(token, {logLevel: 'info'});
rtm.start();

var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;

// you need to wait for the client to fully connect before you can send messages
rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
	var channel = rtm.dataStore.getChannelByName('test');
	console.log('connected');
  // This will send the message 'this is a test message' to the channel identified by id 'C0CHZA86Q'
 /*rtm.sendMessage('this is a test message', channel.id, function messageSent() {
    // optionally, you can supply a callback to execute once the message has been sent
  });*/
});


rtm.on(RTM_EVENTS.MESSAGE, function (message) {
  // Listens to all `message` events from the team
  //console.log(message);
  var user = rtm.dataStore.getUserById(message.user);
  //console.log(user);
  if (message.type=='message') {

  	rtm.sendMessage('Hi ' + user.real_name + ', I don\'t do much yet, but Ed is teaching me stuff as quickly as he can. Please stay tuned. :)', message.channel, function messageSent() {
	    // optionally, you can supply a callback to execute once the message has been sent

	 });
  }

});