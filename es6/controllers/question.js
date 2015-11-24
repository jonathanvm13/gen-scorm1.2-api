var mongoose = require('mongoose');
var Question = mongoose.model('question');
var Folder = mongoose.model('folder');
var async = require('async');
var uniqid = require('uniqid');
var helper = require('../lib/helper.js');
var QuestionHelper = helper.question;
var Config = require("../config/config");
var fs = require('fs');
const VariableParser = require('../lib/variables/parser');
const Answer = require('../lib/answers/answer');



module.exports = {

  createQuestion(req, res) {
    var user = req.user;
    var parentFolderId = req.params.folderid;

    async.waterfall(
      [
        function getDataParentFolder(next) {
          Folder.getById(parentFolderId, next);
        },
        function (parentFolder, next) {
          var question = new Question(
            {
              name: req.body.question.name,
              owner: user._id,
              parent_folder: parentFolder._id,
              users: parentFolder.users //The new question have the same users  acces from her parent
            }
          );

          question.create(function (err, question) {
            next(err, question);
          });
        },
        function (question, next) {
          Folder.addQuestion(parentFolderId, question._id, function (err, rows) {
            if (!err && rows.n == 0) {
              return next(new Error("Parent folder was not update"));
            }
            next(err, question);
          });
        }
      ],
      function (err, question) {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: err.message
          });
        }

        //Create or update question folder with scorm template
        helper.copyScormTemplate(question._id);


        var route = "./questions/" + question._id + "/js/xml-question.js";
        var data = "var question = " + JSON.stringify(question) + "; question = JSON.parse(question);window.question = window.question || question;";

        fs.writeFile(route, data, function (err) { console.log(err)});

        res.status(200).json({
          ok: true,
          question: {
            _id: question._id,
            name: question.name
          }
        });

      }
    );
  },

  updateQuestion(req, res) {
    var question = req.body.question;
    var questionId = req.params.questionid;

    Question.updateName(questionId, question.name, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      if (rows.n == 0) {
        return res.status(400).json({
          ok: false,
          message: "The question does not exist"
        });
      }

      res.status(200).json({
        ok: true
      });
    });
  },

  setData(req, res) {
    var question = req.body.question;
    var questionId = req.params.questionid;

    QuestionHelper.updateData(questionId, question.data, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok:false,
          message: err.message
        });
      }

      res.status(200).json({ok:true});
    });
  },

  deleteQuestion(req, res) {
    var questionId = req.params.questionid;

    Question.deleteById(questionId, function (err, rows) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      if (rows.n == 0) {
        return res.status(400).json({
          ok: false,
          message: "The question does not exist"
        });
      }

      res.status(200).json({
        ok: true
      });
    });
  },

  validateVariables(req, res) {
    var variableText = req.body.variables.text;
    var questionId = req.params.questionid;
    var question = req.body.question;
    question.data = JSON.parse(question.data)
    question.data.variables.text = variableText;
    var output = VariableParser.validate(variableText);
    question.data.variables.variables = output.variables;
    question.data = JSON.stringify(question.data);
    QuestionHelper.updateData(questionId, question.data, function (err, rows) {
      if (err) {
        console.log("An error has ocurred", err);
      }
    });
    res.status(200).json(output);
  },

  validateAnswer(req, res) {
    var answer = req.body.answer;
    var variableText = req.body.variables.text;
    var questionId = req.params.questionid;
    var question = req.body.question;
    var output = Answer.validateAnswer(answer, variableText);
    question.data = JSON.parse(question.data);
    question.data.answer = output.answer;
    question.data.variables.text = variableText;
    question.data.variables.variables = output.variables;
    question.data = JSON.stringify(question.data);
    QuestionHelper.updateData(questionId, question.data, function (err, rows) {
      if (err) {
        console.log("An error has ocurred");
      }
    });
    res.status(200).json(output);
  }


};