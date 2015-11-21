
var Schema = require('mongoose').Schema;

var _schema = {
    case: {type: Schema.Types.ObjectId, ref: "Case"},
    sender: {
        id: {type: Schema.Types.ObjectId},
        _type: {type: String}
    },
    receiver: {
        id: {type: Schema.Types.ObjectId},
        _type: {type: String}
    },
    timestamp: {type: Number},
    sent: {type: Boolean, required: true},
    delivered: {type: Boolean, required: true},
    content: {type: String, required: true}
};

module.exports = function() {

    var schema = new Schema(_schema);

    /**
     * Attach any static functions here
     */

    return schema;
}();
