var apn = require('apn'),
    _ = require('lodash'),
    ApplePushService,
    expired = false;


module.exports = function() {

    function reset() {
        ApplePushService.removeAllListeners("transmitted");
        ApplePushService.removeAllListeners("completed");
        ApplePushService.removeAllListeners("error");
        ApplePushService.removeAllListeners("transmissionError");
        ApplePushService.removeAllListeners("timeout");
        init();
    }

    function init() {
        if (!ApplePushService || expired) {
            var env = process.env.NODE_ENV || "development";
            console.log("Using "+env+" for push");
            ApplePushService = new apn.Connection({
                passphrase: "therapeuo",
                cert: __dirname+"/cert_"+env+".pem",
                key: __dirname+"/key_"+env+".pem",
                production: env !== "development",
                maxConnections: 10
            });

            ApplePushService.on("transmitted", function (notification, device) {
                console.log("transmitted", notification, device);
            });

            ApplePushService.on("completed", function () {
                console.log("completed");
            });

            ApplePushService.on("error", function (error) {
                console.log("error", error);
            });

            ApplePushService.on("transmissionError", function (error, notification, device) {
                console.log("transmissionError", error, notification, device);
            });

            ApplePushService.on("timeout", function () {
                expired = true;
                reset();
            });

        }
    }




    return {
        pushNotifications: function(message, caseModel) {
            init();

            var notification = new apn.Notification();
            notification.badge = 1;
            notification.alert = "You have a new message";
            notification.payload = {
                "case": caseModel._id,
                "randomness": new Date().getTime()
            };

            _.forEach(caseModel.doctors, function(doctor) {
                if (doctor.device) { //&& _.includes(message.receivers, {'_id': doctor._id, '_type':'Doctor'})) {
                    var device = new apn.Device(doctor.device);
                    ApplePushService.pushNotification(notification, device);
                }
            });
        }
    }

}();
