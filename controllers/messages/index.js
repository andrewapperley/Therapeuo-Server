'use strict';

var CaseModel = require('../../models/case'),
    MessageModel = require('../../models/message'),
    moment = require('moment'),
    PushService = require('../../services/apn-service'),
    Promise = require('bluebird'),
    twilio = require('twilio');

module.exports = function (router) {

    router.get('/:id', function (req, res) {

        res.send("index");

    });

    router.get('/list', function (req, res) {

        res.send("index");

    });

    router.post('/', function (req, res) {

        res.send("index");

    });

    router.post('/receive', function(req, res) {

        var patientId = req.body.From;
        var text = req.body.Body;

        console.log(req.body);

        CaseModel.findOne({
            patient: patientId,
            open: true
        }).populate("patient doctors")
            .then(function(caseModel) {
            if (caseModel) {
                return caseModel;
            } else {
                return CaseModel.createCase(patientId);
            }
        }).then(function(caseModel) {
            var receivers = [];
            caseModel.doctors.map(function(doctor) {
                receivers.push({
                    id: doctor._id,
                    _type: "Doctor"
                });
            });

            return Promise.all([
                MessageModel.create({
                    "case": caseModel._id,
                    sender: {
                        id: caseModel.patient,
                        _type: "Patient"
                    },
                    receivers: receivers,
                    timestamp: moment(new Date()).utc().unix(),
                    content: text
                }),
                caseModel
            ]);

        }).spread(function(message, caseModel) {
                var twiml = new twilio.TwimlResponse();

                //if (caseModel.isNew) {
                //    twiml.say('Hey! Thanks for using Therapeuo. Where are you located? Text back LOC: "LOCATION" to update your profile.');
                //} else {
                    twiml.say('Ok');
                //}
                PushService.pushNotifications(message, caseModel);
                res.writeHead(200, {'Content-Type': 'text/xml'});
                res.end(twiml.toString());
        }).catch(function(error) {
            console.log("error", error);
        });

    });

};
