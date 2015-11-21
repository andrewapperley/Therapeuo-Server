

var mongoose = require('mongoose');
var Promise = require('bluebird');
var walk = require('walk');

var connection = null;
var models = [];
var db = function() {

    return {

        config: function(options) {
           return new Promise(function(resolve, reject) {
               connection = mongoose.connect(options.host,  options.database);
               resolve();
            });
        },

        models: function() {
            return new Promise(function(resolve, reject) {

                var walker = walk.walk("./models", null);
                var error;

                walker.on("file", function (root, fileStats, next) {
                    if (fileStats.name.indexOf("-schema") <= -1 && root.indexOf("/viewModels") <= -1) {
                        var model = require("." + root + "/" + (fileStats.name.replace(".js", "")));
                        models.push({
                            name: model.modelName,
                            model: model
                        })
                    }
                    next();
                });

                walker.on("errors", function (root, stats, next) {
                    error = stats[0].error;
                    next();
                });

                walker.on("end", function () {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });

            });
        },

        getConnection: function() {
            return connection;
        },

        getModels: function() {
            return models;
        }
    }

};

module.exports = db();
