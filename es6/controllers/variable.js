var VariableParser = require('../lib/variables/parser');
module.exports = {

	validate: function(req, res) {
		var variableText = req.body.variables.text;
		var validationOutput = VariableParser.validateAll(variableText);
		if(validationOutput.errors.length == 0) {
			res.status(200).json({
				ok: true,
				variables: validationOutput.variables,
				values: validationOutput.results,
				errors: []
			});	
		} else {
			res.status(200).json({
				ok: false,
				errors: validationOutput.errors,
				variables: null,
				values: null,
			});
		}
		
	}

};