var _ = require('lodash'),
    Promise = require('bluebird'),
    PatientModel = require('../models/patient'),
    MessageModel = require('../models/message'),
    moment = require('moment');

var geocoderProvider = 'google';
var httpAdapter = 'https';
var extra = {
    apiKey: 'AIzaSyBp1Riq5f_KGhWEI7zYRE48mtaCSJW-3Vc', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

module.exports = function() {

    var triggerCodes = [{
        key: "LOC:",
        type: "location"
    }, {
        key: "/options",
        type: "options"
    }];

    return {
        parseMessage: function(message, caseModel) {
            var trackingTriggers = [];
            var messages = [];
                var promises = [];
                    _.forEach(triggerCodes, function(trigger) {
                        if (_.includes(message.content, trigger.key)) {
                            switch(trigger.type) {
                                case "location": {
                                    var index = message.content.indexOf(trigger.key);
                                    var location = message.content.slice(index+trigger.key.length);
                                    trackingTriggers.push(trigger.type);
                                    promises.push(geocoder.geocode(location));
                                    break;
                                }
                                case "options": {
                                    trackingTriggers.push(trigger.type);
                                    promises.push( MessageModel.create({
                                        "case": caseModel._id,
                                        sender: {
                                            _id: 0,
                                            _type: "Server"
                                        },
                                        receivers: [
                                            {
                                                _id: caseModel.patient._id,
                                                _type: "Patient"
                                            }
                                        ],
                                        timestamp: moment(new Date()).utc().unix(),
                                        content: "\nLocation = LOC: LOCATION \n OPTIONS = /options"
                                    }));
                                    break;
                                }
                            }
                        }
                    });
                return Promise.all(promises)
            .then(function(results) {
                        _.forEach(results, function(result, i) {
                            switch(trackingTriggers[i]) {
                                case "location": {
                                    trackingTriggers.push(
                                        PatientModel.findByIdAndUpdate(caseModel.patient._id, {
                                            location: [result[0].latitude, result[0].longitude],
                                            locationDescription: result[0].formattedAddress
                                        }, {
                                            new: true
                                        })
                                    );
                                    break;
                                }
                                case "options": {
                                    messages.push(result);
                                    break;
                                }
                            }
                        });
                    return Promise.all([trackingTriggers, messages]);
            });
        }
    };
}();
