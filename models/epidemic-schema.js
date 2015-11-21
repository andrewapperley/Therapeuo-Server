
var Schema = require('mongoose').Schema;

var _schema = {
    name: {type: String, required: true},
    categories: { type: [ {type: Schema.Types.ObjectId, ref: "Category"}]},
    active: {type: Boolean, default: true},
    location: { type: [Number], index: { type: '2dsphere', sparse: true}}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
