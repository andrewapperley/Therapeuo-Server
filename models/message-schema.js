
var Schema = require('mongoose').Schema;

var _schema = {
    logo: {type: Schema.Types.ObjectId, ref: "Media"},
    name: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    suspended: {type: Boolean, default: false},
    activated: {type: Boolean, default: true}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
