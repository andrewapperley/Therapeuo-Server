'use strict';
var Doctor = require('../../models/doctor');

module.exports = function (router) {

    router.get('/:email', function (req, res) {
        
    });

    router.put('/:id/update', function(req, res) {
        res.send("update");
    });

    router.get('/list', function (req, res) {
        res.send("index");
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
