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
          res.send(404, err.message);
        } else {
          res.status(200).jsonp({status: 'completo'});
        }
      })
    }
  ],

  update: [
    function (req, res) {
      UserDB.findById(req.params.id, function (err, qq) {
        qq.email = req.body.email;
        qq.pass = req.body.pass;
        qq.name = req.body.name;

        qq.save(function (err) {
          if (err) {
            res.send(400, err.message);
          } else {
            res.status(200).jsonp({status: 'completo'});
          }
        })
      });

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
        res.status(200).json({
          token: token
        });
      });
    }
  ],

  logout: [
    function (req, res) {
      UserDB.findById(req.body.id, function (err, user) {
        if (err) res.send(404, err.message);
        else if (!user) res.send(401, "No existe el usuario");
        else {
          delete user.cookie;

          user.save(function (err) {
            if (err) {
              res.send(400, err.message);
            } else {
              res.status(200).jsonp({status: 'completo'});
            }
          })
        }
      });

    }
  ],

  list: [
    function (req, res) {
      UserDB.find(function (err, qq) {
        if (err)
          res.send(404, err.message);

        res.status(200).jsonp(qq);
      });
    }
  ]


}
;