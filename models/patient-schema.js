
var Schema = require('mongoose').Schema;

var _schema = {
    _id: {type: String, required: true, unique: true},
    name: {type: String},
    location: { type: [Number], index: { type: '2dsphere', sparse: true}}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
