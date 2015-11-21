
var Schema = require('mongoose').Schema;

var _schema = {
    name: {type: String, required: true}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
