var client = null;
var number = null;
var _ = require('lodash');

module.exports = function() {


    return {
        config: function(options) {
            client = require('twilio')(options.access, options.secret);
            number = options.number;
        },
        sendMessage: function(message) {
            var to = null;
            message.receivers.map(function(r) {
                if(r._type === "Patient") {
                    to = r;
                }
            });
            console.log({
                to: to._id,
                from: number,
                body: message.content

            });
            return client.sendMessage({
                to: to._id,
                from: number,
                body: message.content

            }).then(function(responseData) {
                console.log(responseData);
                return responseData;
            });
        }
    };

}();
