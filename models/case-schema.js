
var Schema = require('mongoose').Schema;

var _schema = {
    patient: {type: Schema.Types.ObjectId, ref: "Patient", required: true},
    doctors: {type: [{type: Schema.Types.ObjectId, ref: "Doctor"}]},
    primary: {type: Schema.Types.ObjectId, ref: "Doctor", required: true}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
