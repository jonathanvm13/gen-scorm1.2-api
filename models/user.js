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

user.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.__v;
  }
});

user.plugin(require('passport-local-mongoose'), {
  usernameField: 'email',
  hashField: 'pass',
  usernameLowerCase: true
});

module.exports = mongoose.model('user', user);
