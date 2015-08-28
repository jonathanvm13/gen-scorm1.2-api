var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema,
  _ = require("lodash");

var folder = Schema(
  {
    name: String,
    parent_folder: {type: String, required: true, ref: 'folder'},
    questions: [{type: Schema.Types.ObjectId, ref: 'question'}],
    folders: [{type: Schema.Types.ObjectId, ref: 'folder'}],
    owner: {type: String, required: true, ref: 'user'},
    users: [{type: String, required: true, ref: 'user'}],
    delete: Boolean
  }
);

folder.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.__v;
  }
});

folder.methods.create = function (cb) {
  this.save(cb);
};

folder.statics.getFoldersWithQuestions = function (userId, cb) {
  this.find({
    user: userId,
    $or: [
      {delete: false},
      {delete: {$exists: false}}
    ]
  })
    .populate('questions', "name", {
      $or: [
        {delete: false},
        {delete: {$exists: false}}
      ]
    })
    .exec(cb);
};

folder.statics.hasUser = function (folderId, userId){
   this.find({_id: folderId, users: userId}, function(err, folder){
     if(folder){
       return true;
     }

     return false;
   })
};

folder.statics.getAllData = function (folderId, cb) {
  var self = this;

  async.waterfall(
    [
      function (next) {
        self.findById(folderId)
          .populate('questions folders', {
            $or: [
              {delete: false},
              {delete: {$exists: false}}
            ]
          }).exec(next);
      },
      function (next, rootFolder) {
        var foldersIds = [];
        var questionsIds = [];

        _.forEach(rootFolder.folders, function (folder) {
          foldersIds.concat(folder.folders);
          questionsIds.concat(folder.questions);
        });

        self.getByIds(foldersIds, function (err, subFolders) {
          next(err, rootFolder, subFolders, questionsIds);
        });
      },
      function (next, rootFolder, subFolders, questionsIds) {
        var Question = require('./question');

        Question.getByIds(questionsIds, function (err, subQuestions) {
          next(rootFolder, subFolders, subQuestions)
        });
      },
      function (next, rootFolder, subFolders, subQuestions) {
        rootFolder = rootFolder.toJSON();

        rootFolder.folders = _.map(rootFolder.folders, function (folder) {
          var folders = folder.folders;
          var questions = folder.questions;

          folder.folders = [];
          folder.questions = [];

          _.forEach(subFolders, function (folder) {
            if (_.includes(folders, folder._id)) {
              folder.folders.push(folder);
            }
          });

          _.forEach(subQuestions, function (question) {
            if (_.includes(questions, questions._id)) {
              folder.questions.push(question);
            }
          });

          return folder;
        });

        next(null, rootFolder);
      }
    ],
    cb
  )
};

folder.statics.getByIds = function (foldersIds, cb) {
  this.find({
    _id: {
      $in: foldersIds
    }
  }).populate('questions folders', {
    $or: [
      {delete: false},
      {delete: {$exists: false}}
    ]
  }).exec(cb);
};


folder.statics.getById = function (folderId, cb) {
  this.findById(folderId, cb);
};

folder.statics.getFolderWithQuestions = function (folderId, cb) {
  this.findById(folderId).populate('questions', "name", {
    $or: [
      {delete: false},
      {delete: {$exists: false}}
    ]
  })
    .exec(cb);
};

folder.statics.getQuestionsFromFolders = function (foldersIds, userId, cb) {
  this.find({
    _id: {
      $in: foldersIds
    },
    user: {
      $ne: userId
    }
  })
    .populate('questions', "name", {
      $or: [
        {delete: false},
        {delete: {$exists: false}}
      ]
    })
    .exec(cb);
};

folder.statics.addFolder = function (parentFolderId, folderIdToAdd, cb) {
  var conditions = {
      _id: parentFolderId
    },
    update = {
      "$addToSet": {
        "folders": folderIdToAdd
      }
    };

  this.update(conditions, update, cb);
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
