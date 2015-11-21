'use strict';
var Doctor = require('../../models/doctor');

module.exports = function (router) {

    router.get('/:id', function (req, res) {
        Doctor.findById(req.params.id, function (err, result) {
            if (err || !result) {
                res.status(404).json({'error': 'Doctor not found.'});
            } else {
                res.status(200).json(result);
            }
        });
    });

    router.put('/:id', function(req, res) {
        delete req.body._id;
        delete req.body.__v;
        Doctor.findByIdAndUpdate(req.params.id, req.body, function(err, result) {
            if (err || !result) {
                res.status(400).json({'error': 'Update failed.'});
            } else {
                res.status(200).json({'success': 'Doctor updated.'});
            }
        });
    });

    router.post('/login', function (req, res) {
        Doctor.findOne({email: req.body.email}, function (err, result) {
            if (err || !result) {
                res.status(404).json({'error': 'Doctor not found. Register!'});
            } else if (result.get('password') !== req.body.password) {
                res.status(401).json({'error': 'Password not be matching yo'});
            } else {
                res.status(200).json({'success': 'Logged in yay', 'doctor': result});
            }
        });
    });

    router.post('/register', function (req, res) {
        var newDoctor = new Doctor({
          name: req.body.name,
          password: req.body.password,
          email: req.body.email
        });

        newDoctor.save(function(error) {
            if (error) {
                res.status(400).json({'error': error});
            } else {
                res.status(201).json(newDoctor);
            }
        });
    });

    router.post('/:id/message', function (req, res) {

        res.send("index");

    });

    router.post('/status', function (req, res) {

        res.send("index");

    });

};
