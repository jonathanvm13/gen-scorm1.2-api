var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = Schema(
  {
    email: {type: String, required: true, unique: true, trim: true},
    pass: String,
    name: String,
    cookie: String,
    folders: [{type: Schema.Types.ObjectId, ref: 'folder'}]
  }
);

user.plugin(require('passport-local-mongoose'), {
  usernameField: 'email',
  hashField: 'pass',
  usernameLowerCase: true
});

module.exports = mongoose.model('user', user);
