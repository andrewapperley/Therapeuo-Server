var client = require('twilio')(config.twilio.access, config.twilio.secret);

module.exports = function() {


    return {
        sendMessage: function(message) {
            return client.sendMessage({
                to: message.receiver_.id,
                from: config.twilio.number,
                body: message.content

            }).then(function(responseData) {

            });
        }
    };

}();
