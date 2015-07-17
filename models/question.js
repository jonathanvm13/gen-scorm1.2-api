var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

var question = mongoose.Schema(
  {
    data: String,
    metadata: String,
    name: String,
    folder: {type: String, required: true, ref: 'folder'}
  }
);

question.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.__v;
    delete folder;
  }
});

question.methods.create = function (cb) {
  var Folder = require('./folder'),
    self = this;

  async.waterfall(
    [
      function (next) {

        self.save(function (err, question) {
          next(err, question);
        });
      },
      function (question, next) {

        Folder.addQuestion(question.folder, question._id, function (err, rows) {
          next(err, question);
        });
      }
    ],
    cb
  )
};

module.exports = mongoose.model('question', question);
