'use strict';

module.exports = function (router) {

    router.get('/:id', function (req, res) {

        res.send("index");

    });

    router.get('/doctor/:doctorID/list', function (req, res) {

        res.send("index");

    });

    router.get('/patient/:patientID/list', function (req, res) {

        res.send("index");

    });

    router.post('/modify', function (req, res) {

        res.send("index");

    });

    router.post('/', function (req, res) {

        res.send("index");

    });

    router.post('/decline', function (req, res) {

        res.send("index");

    });

};
