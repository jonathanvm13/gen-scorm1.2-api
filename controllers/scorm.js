'use strict';

var helper = require('../lib/helper.js');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
var QuestionHelper = helper.question;
var _ = require('lodash');
var Config = require("../config/config");

module.exports = {

  zipAndDownloadFile: function (req, res) {
    var questionId = req.params.questionid;

    var folderRoute = "./questions/" + questionId;
    var zipRoute = "./questions/" + questionId + ".zip";

    helper.zipFile(folderRoute, zipRoute, function (ok) {
      if (!ok) {
        return res.status(400).jsonp({ok: false});
      }

      return res.status(200).jsonp({ok: true});
    });


  },

  update: function (req, res) {
    var question = req.body.question;
    var questionId = req.params.questionid;

    QuestionHelper.updateData(questionId, question, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      //Create or update question folder with scorm template
      helper.copyScormTemplate(questionId);

      var route = "./questions/" + questionId + "/js/xml-question.js";
      var data = "var question = " + JSON.stringify(question) + "; question = JSON.parse(question);window.question = window.question || question;";

      fs.writeFile(route, data, function (err) {
        if (err) {
          return res.status(400).jsonp({ok: false});
        }

        res.status(200).jsonp({ok: true, url: Config.apiUrl + "/static/" + questionId + "/launch.html"});
      });
    });
  },

  Download: function (req, res) {
    var questionId = req.params.questionid;

    var file =  "./questions/" + questionId + ".zip";

    res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
    res.setHeader('Content-type', mime.lookup(file));

    fs.createReadStream(file).pipe(res);
  },

  uploadFiles: function (req, res) {
    var imageFile;

    _.forIn(req.files, function (file, field) {
      imageFile = file.name;
    });

    return res.status(200).jsonp({url: Config.apiUrl + "/static/" + imageFile});
  }

};
