'use strict';

var CaseModel = require('../../models/case'),
    MessageModel = require('../../models/message'),
    moment = require('moment');

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
        }).then(function(caseModel) {
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

            return MessageModel.create({
                "case": caseModel._id,
                sender: {
                    id: caseModel.patient,
                    _type: "Patient"
                },
                receivers: receivers,
                timestamp: moment(new Date()).utc().unix(),
                content: text
            });
        }).then(function(message) {
            /**
             * Send Push Notifications
             */
            res.send(message);
        }).catch(function(error) {
            console.log(error);
        });



    });

};
