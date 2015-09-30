'use strict';

var helper = require('../lib/helper.js');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var QuestionHelper = helper.question;

module.exports = {

  zipAndDownloadFile: function (req, res) {
    var question = req.body.question;

    fs.writeFile("./scorm-template/js/xml-question.js", "var question = " + JSON.stringify(question) + "; window.question = window.question || question;", function (err) {
      if (err) {
        return res.status(400).jsonp({ok: false});
      }

      helper.zipFile(function (ok) {
        if (!ok) {
          return res.status(400).jsonp({ok: false});
        }

        return res.status(200).jsonp({ok: true});
      });

    });

    //helper.createManifest();
  },

  update: function (req, res) {
    var question = req.body.question;
    var questionId = req.params.questionid;

    QuestionHelper.updateData(questionId, question, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok:false,
          message: err.message
        });
      }
      var route = "./scorm-template/js/xml-question.js";
      var data = "var question = " + JSON.stringify(question) + "; question = JSON.parse(question);window.question = window.question || question;";

      fs.writeFile(route, data, function (err) {
        if (err) {
          return res.status(400).jsonp({ok: false});
        }

        res.status(200).jsonp({ok: true});
      });
    });
  },

  Download: function (req, res) {
    var file = './scorm.zip';
    res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
    res.setHeader('Content-type', mime.lookup(file));

    fs.createReadStream(file).pipe(res);
  },

  uploadFiles: function (req, res) {
    return res.status(200).jsonp({ok: true});
  }

};
