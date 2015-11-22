'use strict';
var Case = require('../../models/case');
var Message = require('../../models/message');
var Doctor = require('../../models/doctor');
var ApnService = require('../../services/apn-service');
var MessageService = require('../../services/message-service');
var Promise = require('bluebird');
var _ = require('lodash');

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

        Case.findByIdAndUpdate({_id: req.params.id}, req.body)
            .then(function(result) {
                if (result) {
                    if (_.has(req.body, "open")) {
                        if (req.body.open === false) {
                            Doctor.find({_id: {$in: result.doctors}})
                                .then(function(doctors) {
                                    var promises = [];
                                    _.forEach(doctors, function(d) {
                                        d.assisting = false;
                                        promises.push(d.save());
                                    });
                                    return Promise.all(promises)
                                }).then(function() {
                                    res.status(204).end();
                                });
                        } else {
                            res.status(204).end();
                        }
                    }
                } else {
                    res.status(200).end();
                }
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
                return Promise.all([
                    message,
                    MessageService.sendMessage(message)
                ]);
            })
            .spread(function(message, result) {
                res.status(201).json(message);
            })
            .catch(function(error) {
                res.status(404).json({'error': error});
            });
    });

    router.put('/:id/add_doctor', function (req, res) {
        Case.findById(req.params.id)
            .then(function(result) {
                return result.addDoctor(req.body.doctor_id);
            })
            .then(function(result) {
                res.json(result);
            })
            .catch(function(error) {
                res.status(400).json({'error': error});
            });
    });

    router.post('/decline', function (req, res) {

        res.send("index");

    });

};
