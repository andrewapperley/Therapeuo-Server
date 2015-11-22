
var Schema = require('mongoose').Schema;
var Message = require('./message');
var _ = require('lodash');
var moment = require('moment');

var _schema = {
	patient: {type: String, ref: "Patient", required: true},
	doctors: {type: [{type: Schema.Types.ObjectId, ref: "Doctor"}]},
    primary: {type: Schema.Types.ObjectId, ref: "Doctor", required: true},
    open: {type: Boolean, default: true},
    notes: {type: String}
};

module.exports = function() {

    var schema = new Schema(_schema);

	schema.method('messages', function() {
		return Message.find({'case': {$in: [this._id]}});
	});

	schema.method('receiversExcluding', function(id) {
		var allReceivers = [];
		_.each(this.doctors, function(doctor) {
			if (doctor !== id) {
				allReceivers.push({
					'_id': doctor,
					'_type':'Doctor'
				});
			}
		});
		if (this.patient !== id) {
			allReceivers.push({
				'_id': this.patient,
				'_type': 'Patient'
			});
		}
		return allReceivers;
	});

	schema.method('addMessage', function(stuff) {
		return Message.create({
			content: stuff.content,
			case: this._id,
			sender: stuff.doctor.toString(),
			receivers: this.receiversExcluding(stuff.doctor),
			timestamp: moment(new Date()).utc().unix()
		});
	});

	schema.method('addDoctor', function(doctorId) {
		_.each(this.doctors, function(doc) {
			// == since doc is typeof object for whatever reason
			if (doc == doctorId) {
				throw "Doctor already on the case";
			}
		});
		this.doctors.push(doctorId);
		return this.save();
	});

    return schema;
}();
