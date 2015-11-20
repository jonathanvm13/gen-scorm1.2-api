var Answer = require('../lib/answers/answer');

module.exports = {

	validate: function(req, res) {
		var answer = req.body.answer;
		var variableText = req.body.variables.text;
		res.status(200).json(Answer.validateAnswer(answer, variableText));
	}
};