'use strict';

var CaseModel = require('../../models/case'),
    MessageModel = require('../../models/message'),
    moment = require('moment'),
    PushService = require('../../services/apn-service'),
    Promise = require('bluebird');

module.exports = function (router) {

    function createPromise(object) {
        return new Promise(function(resolve, reject) {
            resolve(object);
        });
    }

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
        }).then(function(caseModel) {
            console.log(caseModel);
            if (caseModel) {
                return caseModel;
            } else {
                return CaseModel.createCase(patientId);
            }
        }).then(function(caseModel) {

        }).catch(function(error) {
            console.log(error);
        });



    });

};
