var mongoose = require('mongoose'),
  User = mongoose.model('user'),
  async = require('async'),
  _ = require("lodash"),
  jwt = require('jsonwebtoken'),
  uniqid = require('uniqid');

module.exports = {

  create: function (req, res) {
    var password = req.body.user.pass,
      user = new User({email: req.body.user.email, name: req.body.user.name});

    async.waterfall(
      [
        function (cb) {
          user.setPassword(password, function (err, user) {
            cb(err, user);
          });
        },
        function (user, cb) {
          user.save(function (err) {
            cb(err);
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
  }

}
;