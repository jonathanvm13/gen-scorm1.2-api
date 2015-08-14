var mongoose = require('mongoose'),
  User = mongoose.model('user'),
  async = require('async'),
  _ = require("lodash"),
  jwt = require('jsonwebtoken'),
  uniqid = require('uniqid');

module.exports = {

  create: function (req, res) {
    var password = req.body.user.pass;
    var colors = ['4EAD3E', '6FC6D9', 'F8CB3A', 'E5204E'];
    var number = Math.floor(Math.random() * 4);
    var userName = req.body.user.name;

    var photo = {
        public_url: 'http://dummyimage.com/100x100/ffffff/' + colors[number] + '&text=' + userName.charAt(0).toUpperCase()
    };

    var defaultFolder = new Folder();
    var defaultSharedFolder = new Folder();

    var user = new User({
        email: req.body.user.email,
        name: userName,
        photo: photo,
        default_folder: defaultFolder._id,
        default_shared_folder: defaultSharedFolder._id
    });

    async.waterfall(
      [
        function (next) {
          defaultFolder.create(function (err, folder) {
            next(err);
          });
        },
        function (next) {
          defaultSharedFolder.create(function (err, folder) {
            next(err);
          });
        },
        function (next) {
          user.setPassword(password, function (err, user) {
            next(err, user);
          });
        },
        function (user, next) {
          user.save(function (err) {
            next(err);
          });
        }
      ],
      function (err) {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: err.message
          });
        }

        res.status(200).json({ok: true});
      }
    );
  },

  login: function (req, res) {
    var user = req.body.user;

    User.authenticate()(user.email, user.pass, function (err, user, message) {
      if (err) {

          return res.status(400).json({
            ok: false,
            message: err.message
          });
      } else if (!user) {

          return res.status(401).json({
            ok: false,
            message: "Email or password invalid"
          });
      }

      //Cleaning user object
      user.pass = undefined;
      user.folders = undefined;

      token = jwt.sign(user, "zVTcnZgLTWoNxAidDbOwQQuWfKRwVC");

      res.status(200).json({
        ok: true,
        token: token
      });
    });
  },

  getInfo: function(req, res){
   var user = req.user;

    User.getById(user._id, 'name email photo', function(err, user){
      if(err){
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      res.status(200).json({
        ok: true,
        user: user
      });
    });
  },

  sharedFolder: function(req, res){
    var folderId = req.params.folderid;
    var email = req.body.user.email;

    User.addSharedFolder(email, folderId, function (err, rows) {
      if(err || rows.n == 0){
        return res.status(400).json({
          ok: false,
          message: err.message || "The user has the shared folder"
        });
      }

      res.status(200).json({
        ok: true
      });
    });
  },

  sharedQuestion: function(req, res){
    var questionId = req.params.questionid;
    var email = req.body.user.email;

    async.waterfall(
      [
        function (next) {
          User.getByEmail(email, "default_shared_folder", function (err, user) {
            next(err, user);
          });
        },
        function (user, next) {
          var folderId = user.default_shared_folder;

          Folder.addQuestion(folderId, questionId, function (err, rows) {
            next(err, question);
          });
        }
      ],
      function (err) {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: err.message
          });
        }

        res.status(200).json({ok: true});
      }
    );
  }

};
