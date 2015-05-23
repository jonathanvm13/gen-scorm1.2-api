var Printer = {
	generateInput: function(name, id) {
		return "<div class='input-group'>"+ 
			"<span class='input-group-addon' id='ba'>"+ name +"</span>"+
			"<input class='form-control response' aria-describedby='ba' type='number' id='"+ id +"'>"+
			"</div>"
	},
	//response for modal
	alertModal: function(name, clase, solution) {
		return '<div class="alert ' + clase + '  col-xs-12"><label>' + name + ':&nbsp; </label>'+ solution +'</div>';
	}


}

window.Printer = window.Printer || Printer;