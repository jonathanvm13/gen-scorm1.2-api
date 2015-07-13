var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = Schema(
  {
    email: String,
    pass: String,
    name: String,
    cookie: String,
    folders: [{type: Schema.Types.ObjectId, ref: 'folder'}]
  }
);

module.exports = mongoose.model('user', user);
