var mixin = {
	replaceVariables: function(formula) {
		formula.split("#").join().replace(/,/gi, "");
	}
}