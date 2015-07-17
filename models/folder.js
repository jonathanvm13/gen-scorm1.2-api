var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

var folder = Schema(
  {
    name: String,
    questions: [{type: Schema.Types.ObjectId, ref: 'question'}],
    user: {type: String, required: true, ref: 'user'},
    delete: Boolean
  }
);

folder.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.__v;
  }
});

folder.methods.create = function (cb) {
  var User = require('./user'),
    self = this;

  async.waterfall(
    [
      function (next) {

        self.save(function (err, folder) {
          next(err, folder);
        });
      },
      function (folder, next) {

        User.addFolder(folder.user, folder._id, function (err, rows) {
          next(err, folder);
        });
      }
    ],
    cb
  )
};

folder.statics.getFoldersWithQuestions = function (userId, cb) {
  this.find({user: userId, $or: [{delete: false}, {delete: {$exists: false}}]}).populate('questions', "name", {$or: [{delete: false}, {delete: {$exists: false}}]}).exec(cb);
};

folder.statics.addQuestion = function (folderId, questionId, cb) {
  var conditions = {
      _id: folderId
    },
    update = {
      "$addToSet": {
        "questions": questionId
      }
    };

  this.update(conditions, update, cb);
};

folder.statics.updateName = function (folderId, name, cb) {
  var conditions = {
      _id: folderId
    },
    update = {
      "$set": {
        "name": name
      }
    };

  this.update(conditions, update, cb);
};

folder.statics.deleteById = function (folderId, cb) {
  var conditions = {
      _id: folderId
    },
    update = {
      "$set": {
        "delete": true
      }
    };

  this.update(conditions, update, cb);
};

module.exports = mongoose.model('folder', folder);
