
var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

var question = mongoose.Schema(
  {
    answer: Schema.Types.Mixed,
    variables: String,
    formulation: String,
    metadata: Schema.Types.Mixed,
    name: String,
    parent_folder: {type: String, required: true, ref: 'folder'},
    owner: {type: String, required: true, ref: 'user'},
    users: [{type: String, required: true, ref: 'user'}],
    images: [{type: String}],
    delete: Boolean
  }
);

question.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.__v;
    delete ret.folder;
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

question.statics.getByIds = function(questionsIds, cb){
  this.find({
    _id: {
      $in: questionsIds
    },
    $or: [
      {delete: false},
      {delete: {$exists: false}}
    ]
  }, cb);
};

question.statics.hasUser = function (questionId, userId){
  this.find({_id: questionId, users: userId}, function(err, question){
    if(question){
      return true;
    }

    return false;
  })
};

question.statics.updateName = function (questionId, name, cb) {
  var conditions = {
      _id: questionId
    },
    update = {
      "$set": {
        "name": name
      }
    };

  this.update(conditions, update, cb);
};

question.statics.updateData = function (questionId, data, cb) {
	data = JSON.parse(data)
  var conditions = {
      _id: questionId
    },
    update = {
      "$set": {
        "metadata": JSON.stringify(data.metadata),
        "answer": JSON.stringify(data.answer),
        "variable": data.variables,
        "formulation": JSON.stringify(data.formulation),
      }
    };

  this.update(conditions, update, cb);
};

question.statics.updateFields = function (questionId, data, cb) {
  var conditions = {
      _id: questionId
    },
    update = {
      "$set": data
    };
   console.log("Called???");
  this.update(conditions, update, cb);
};

question.statics.deleteById = function (questionId, cb) {
  var conditions = {
      _id: questionId
    },
    update = {
      "$set": {
        "delete": true
      }
    };

  this.update(conditions, update, cb);
};

module.exports = mongoose.model('question', question);
