'use strict';

var db = require('../lib/database'),
    _ = require('lodash');

module.exports = function (router) {

    router.delete('/kill', function (req, res) {

        _.forEach(db.getModels(), function(model) {
           model.model.remove().exec();
        });

        res.send("killed");

    });

};
