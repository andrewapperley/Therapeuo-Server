
var mongoose = require('mongoose');
var caseSchema = require('./case-schema');
var PatientModel = require('./patient');
var DoctorModel = require('./doctor');
var Promise = require('bluebird');

module.exports = function() {

    var model = mongoose.model('Case', caseSchema);
    model.createCase = function(patient) {
        var promises = [];
        promises.push(PatientModel.findOneAndUpdate({
            _id: patient
        }, {
            _id: patient
        }, {
            upsert: true,
            "new": true
        }));
        promises.push(DoctorModel.findOne({
            available: true,
            assisting: false
        }));
        return Promise.all(promises).spread(function(patient, doctor) {
            return model.create({
                patient: patient._id,
                doctors: [doctor._id],
                primary: doctor._id
            });
        }).catch(function(error) {
            console.log(error);
        });
    };

    return model;

}();
