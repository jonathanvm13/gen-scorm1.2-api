var mongoose = require('mongoose'),
  async = require('async'),
  Schema = mongoose.Schema;

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
      { delete: false },
      { delete: { $exists: false } }
    ]
  })
  .populate('questions', "name", {
    $or: [
      { delete: false },
      { delete: { $exists: false } }
    ]
  })
  .exec(cb);
};

folder.statics.getById = function (folderId, cb) {
  this.findById(folderId, cb);
};

folder.statics.getFolderWithQuestions = function (folderId, cb) {
  this.findById(folderId).populate('questions', "name", {
    $or:
    [
      { delete: false},
      { delete: {$exists: false}}
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
        { delete: false },
        { delete: { $exists: false } }
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
