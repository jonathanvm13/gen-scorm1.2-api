var mongoose = require('mongoose'),
  Question = mongoose.model('question'),
  Folder = mongoose.model('folder'),
  async = require('async'),
  uniqid = require('uniqid');

module.exports = {
  createQuestion: function (req, res) {

    var question = new Question(
      {
        name: req.body.question.name,
        folder: req.params.folderid,
        owner: req.user._id
      }
    );

    question.create(function (err, question) {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: err.message
        });
      }

      res.status(200).json({
        ok: true,
        question: {
          _id: question._id,
          name: question.name
        }
      });
    });
  },

  updateQuestion: function (req, res) {
    var question = req.body.question,
      questionId = req.params.questionid;

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

  setData: function (req, res) {
    var question = req.body.question,
      questionId = req.params.questionid;

    Question.updateData(questionId, question.data, function (err, rows) {
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

  deleteQuestion: function (req, res) {
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
  }

};
