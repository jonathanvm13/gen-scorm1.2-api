var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var folder = Schema({
            name : String,
            questions : [{ type: Schema.Types.ObjectId, ref: 'question'}],
            _user : { type: String, required: true, ref: 'user' }
    }
);

module.exports = mongoose.model( 'folder', folder );
