
var Schema = require('mongoose').Schema;

var _schema = {
    case: {type: Schema.Types.ObjectId, ref: "Case"},
    sender: {
        id: {type: String},
        _type: {type: String}
    },
    receiver: {
        id: {type: String},
        _type: {type: String}
    },
    timestamp: {type: Number},
    content: {type: String, required: true}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
