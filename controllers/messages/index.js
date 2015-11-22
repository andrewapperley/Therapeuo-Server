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
                    _id: doctor._id,
                    _type: "Doctor"
                });
            });

            return Promise.all([
                MessageModel.create({
                    "case": caseModel._id,
                    sender: {
                        _id: caseModel.patient,
                        _type: "Patient"
                    },
                    receivers: receivers,
                    timestamp: moment(new Date()).utc().unix(),
                    content: text
                }),
                caseModel
            ]);

        }).spread(function(message, caseModel) {

                PushService.pushNotifications(message, caseModel);
                res.status(200).json("Message received");
            }).catch(function(error) {
            console.log("error", error);
        });

    });

};
