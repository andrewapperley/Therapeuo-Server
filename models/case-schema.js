
var Schema = require('mongoose').Schema;
var Message = require('./message');

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
	})

    return schema;
}();
