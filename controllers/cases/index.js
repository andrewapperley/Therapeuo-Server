'use strict';
var Case = require('../../models/case');
var Message = require('../../models/message');
var ApnService = require('../../services/apn-service');
var Promise = require('bluebird');

module.exports = function (router) {

    router.get('/:id', function (req, res) {
        Case.findById(req.params.id)
            .populate("patient doctors")
            .then(function(result) {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({'error': 'No case by that id.'});
                }
            })
            .catch(function(error) {
                res.status(500).json({'error': error});
            });
    });

    router.get('/:id/messages', function(req, res) {
        Case.findById(req.params.id)
            .populate("patient doctors")
            .then(function(result) {
                if (result) {
                    result.messages()
                        .then(function(results) {
                            res.json(results);
                        })
                        .catch(function(error) {
                            res.status(500).json({'error': error});
                        });
                } else {
                    res.status(404).json({'error': 'No case with that ID, so no messages for you!'});
                }
            })
            .catch(function(error) {
                res.status(500).json({'error': error});
            });
    });

    router.get('/:id/doctors', function(req, res) {
        Case.findById(req.params.id)
            .select("doctors")
            .populate("doctors")
            .then(function(caseModel) {
                res.json(caseModel.doctors);
            }).catch(function(error) {
                res.status(500).json({'error': error});
            })
    });

    router.put('/:id/update', function (req, res) {
        delete req.body._id;
        delete req.body.__v;
        delete req.body.patient;
        delete req.body.primary;
        delete req.body.doctors;

        Case.findByIdAndUpdate(req.params.id, req.body)
            .then(function(result) {
                res.status(204).end();
            })
            .catch(function(error) {
                res.status(500).json({error: error});
            });
    });

    router.post('/:id/message', function(req, res) {
        Case.findById(req.params.id)
            .then(function(result) {
                if (result) {
                    return result;
                } else {
                    throw "No case by that id";
                }
            })
            .then(function(theCase) {
                return Promise.all([
                    theCase.addMessage({
                        content: req.body.content,
                        doctor: req.body.doctor
                    }),
                    theCase
                ]);
            })
            .spread(function(message, theCase) {
                ApnService.pushNotifications(message, theCase);
                return message;
            })
            .then(function(result) {
                res.status(201).json(result);
            })
            .catch(function(error) {
                res.status(404).json({'error': error});
            });
    });

    router.post('/decline', function (req, res) {

        res.send("index");

    });

};
