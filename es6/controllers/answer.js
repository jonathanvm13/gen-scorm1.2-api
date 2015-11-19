var Answer = require('../lib/answers/answer');
module.exports = {

	validate: function(req, res) {
		var answer = req.body.answer;
		answer = Answer.createFromResponse(answer);
		var validationOutput = answer.isValid(variableText);
		if(validationOutput.errors.length == 0) {
			res.status(200).json({
				ok: true,
				variables: validationOutput.variables,
				values: validationOutput.results,
			});	
		} else {
			res.status(200).json({
				ok: false,
				errors: validationOutput.errors
			});
		}
		
	}

};