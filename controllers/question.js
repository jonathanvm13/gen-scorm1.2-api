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
        folder: req.params.folderid
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
    Question.findById(req.params.id, function (err, qq) {
      if (req.body.titulo) {
        qq.titulo = req.body.titulo;
      } else {
        qq.xml_pregunta = req.body.xml_pregunta;
        qq.xml_metados = req.body.xml_metados;
      }

      qq.save(function (err) {
        if (err) {
          res.send(400, err.message);
        } else {
          res.status(200).jsonp({status: 'completo'});
        }
      })
    });

  },

  deleteQuestion: function (req, res) {
    Question.findById(req.params.id, function (err, qq) {
      qq.remove(function (err) {
        if (err) return res.send(500, err.message);
        res.status(200).jsonp({status: 'completo'})
      })
    });
  },

};