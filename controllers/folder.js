var mongoose = require('mongoose'),
  Folder = mongoose.model('folder'),
  User = mongoose.model('user'),
  Question = mongoose.model('question'),
  Q = require('q'),
  uniqid = require('uniqid'),
  async = require('async');

module.exports =  {

  create: function (req, res) {
    var folder = req.body.folder;
    var parentFolderId = req.params.folderid;
    var user = req.user;

    async.waterfall(
        [
          function getDataParentFolder(next) {
            Folder.getById(parentFolderId, next);
          },
          function (next, parentFolder) {
            var folder = new Folder(
                {
                  name: folder.name,
                  owner: user._id,
                  parent_folder: parentFolder._id,
                  users : parentFolder.users //The new folder have the same users  acces from her parent
                }
            );

            folder.create(next);
          }
        ],
        function (err) {
          if (err) {
            return res.status(400).json({
              ok: false,
              message: err.message
            });
          }

          res.status(200).json({
            ok: true,
            folder: {
              _id: folder._id,
              name: folder.name
            }
          });
        }
    );
  },

  update: function (req, res) {
    var folder = req.body.folder,
      folderId = req.params.folderid;

    Folder.updateName(folderId, folder.name, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      if (rows.n == 0) {
        return res.status(400).json({
          ok: false,
          message: "The folder does not exist"
        });
      }

      res.status(200).json({
        ok: true
      });
    });
  },

  delete: function (req, res) {
    var folderId = req.params.folderid;

    Folder.deleteById(folderId, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      if (rows.n == 0) {
        return res.status(400).json({
          ok: false,
          message: "The folder does not exist"
        });
      }

      res.status(200).json({
        ok: true
      });
    });
  },

  list: function (req, res) {
    var userId = req.user._id;

    async.waterfall(
      [
        function (next) {
          Folder.getFoldersWithQuestions(userId, function (err, folders) {
            next(err, folders);
          });
        },
        function (folders, next) {
           User.getById(userId, 'default_folder default_shared_folder shared_folders', function(err, user){
             next(err, folders, user);
           });
        },
        function questionsFromDefaultFolder(folders, user, next) {
           var folderDefaultId = user.default_folder;

           Folder.getFolderWithQuestions(folderDefaultId, function(err, default_folder){
             next(err, folders, default_folder, user);
           });
        },
        function questionsFromDefaultSharedFolder(folders, default_folder, user, next) {
          var sharedFolderDefaultId = user.default_shared_folder;

           Folder.getFolderWithQuestions(sharedFolderDefaultId, function(err, default_shared_folder){
             next(err, folders, default_folder, default_shared_folder, user);
           });
        },
        function questionsFromSharedFolders(folders, default_folder, default_shared_folder, user, next) {
          var sharedFoldersIds = user.shared_folders;

           Folder.getQuestionsFromFolders(sharedFoldersIds, user._id, function(err, shared_folders){
             next(err, folders, default_folder, default_shared_folder, shared_folders);
           });
        }
      ],
      function (err, folders, default_folder, default_shared_folder, shared_folders) {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: err.message
          });
        }

        res.status(200).json({
          ok: true,
          folders: folders,
          default_folder: default_folder,
          default_shared_folder: default_shared_folder,
          shared_folders: shared_folders
        });
      }
    );
  }

};
