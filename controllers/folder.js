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
           User.getById(userId, 'root_folder root_shared_folder', next);
        },
        function (next, user) {
          Folder.getAllData(user.root_folder, next);
        },
        function (next, rootFolder) {
          Folder.getAllData(user.root_shared_folder, function(err, sharedFolder){
            next(rootFolder, sharedFolder);
          });
        }
      ],
      function (err, rootFolder, sharedFolder) {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: err.message
          });
        }

        res.status(200).json({
          ok: true,
          root_folder: rootFolder,
          root_shared_folders: sharedFolder
        });
      }
    );
  }

};
