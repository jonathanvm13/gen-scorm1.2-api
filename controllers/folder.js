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
    Folder.findById(req.params.id, function (err, folder) {
      folder.name = req.body.name;
      folder.save(function (err) {
        if (err) {
          res.send(400, err.message);
        } else {
          res.status(200).json({status: 'completo'});
        }
      })
    });
  },

  delete: function (req, res) {
    Folder.findById(req.params.id, function (err, folder) {
      if (err) return res.send(500, err.message);
      else if (!folder) return res.send(500, "No existe");
      else {
        folder.remove(function (err) {
          if (err) return res.send(500, err.message);
          else {
            Question.remove({_folder: folder._id}).exec();
            res.status(200).json({status: 'completo'})
          }

        })
      }
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