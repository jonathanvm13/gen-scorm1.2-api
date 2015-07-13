var mongoose = require('mongoose'),
  UserDB = mongoose.model('user'),
  async = require('async'),
  _ = require("lodash"),
  jwt = require('jsonwebtoken'),
  uniqid = require('uniqid');

module.exports = {

  create: [
    function (req, res) {
      var user = new UserDB(
        {
          email: req.body.email,
          pass: req.body.pass,
          name: req.body.name
        }
      );
      user.save(function (err) {
        if (err) {
          return res.send(404, err.message);
        }
        res.status(200).jsonp({status: 'completo'});
      })
    }
  ],

  login: [
    function (req, res) {
      UserDB.where({email: req.body.email, pass: req.body.pass}).findOne(function (err, user) {
        if (err) {
          return res.send(404, err.message);
        } else if (!user) {
          return res.send(401, "Email or password invalid");
        }
        token = jwt.sign({user: user}, "zVTcnZgLTWoNxAidDbOwQQuWfKRwVC");
        res.status(200).json({token: token});
      });
    }
  ],

  list: [
    function (req, res) {
      UserDB.find(function (err, user) {
        if (err) {
          return res.send(404, err.message);
        }
        res.status(200).jsonp(user);
      });
    }
  ]

}
;