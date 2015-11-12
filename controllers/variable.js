module.exports = {

	validate: function(req, res) {
		var variableText = req.variables.text;
		res.status(200).json({
			ok: true,
			variables: ['variable 1', 'variable 2']
		});
	}

};