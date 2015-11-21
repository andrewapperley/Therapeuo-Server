var apn = require('apn'),
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
            ApplePushService = new apn.Connection({
                cert: "",
                key: ""
            });

            ApplePushService.on("transmitted", function (notification, device) {

            });

            ApplePushService.on("completed", function () {

            });

            ApplePushService.on("error", function (error) {

            });

            ApplePushService.on("transmissionError", function (error, notification, device) {

            });

            ApplePushService.on("timeout", function () {
                expired = true;
                reset();
            });

        }
    }




    return {
        pushNotification: function(deviceToken, message, caseId) {
            init();
            var device = new apn.Device(deviceToken);
            var notification = new apn.Notification();
            notification.badge = 1;
            notification.alert = "";
            notification.payload = {
                "case": caseId,
                "message": message._id
            };
            ApplePushService.pushNotification(notification, device);
        }
    }

}();
