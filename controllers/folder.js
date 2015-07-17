var mongoose = require('mongoose'),
  Folder = mongoose.model('folder'),
  User = mongoose.model('user'),
  Question = mongoose.model('question'),
  Q = require('q'),
  uniqid = require('uniqid'),
  async = require('async');

module.exports = {

  create: function (req, res) {
    var folder = new Folder(
      {
        name: req.body.folder.name,
        user: req.user._id
      }
    );

    folder.create(function (err, folder) {
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
    });
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
    Folder.getFoldersWithQuestions(req.user._id, function (err, folders) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      res.status(200).json({
        ok: true,
        folders: folders
      });
    });
  }
};