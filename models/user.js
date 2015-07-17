var mongoose = require('mongoose'),
  validator = require('validator'),
  validate = require('mongoose-validator'),
  Schema = mongoose.Schema;

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
    delete ret.pass;
    delete ret.salt;
    delete ret.__v;
  }
});


user.path('email').validate(function (value, next) {
  next(validator.isEmail(value));
}, 'Invalid email');

user.plugin(require('passport-local-mongoose'), {
  usernameField: 'email',
  hashField: 'pass',
  usernameLowerCase: true
});

user.statics.addFolder = function (userId, folderId, cb) {
  var conditions = {
      _id: userId
    },
    update = {
      "$addToSet": {
        "folders": folderId
      }
    };

  this.update(conditions, update, cb);
};

module.exports = mongoose.model('user', user);
