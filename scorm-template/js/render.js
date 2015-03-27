$(document).on("ready", render);

//this should get data of the API
//Static Variables
var Question = window.question;
var Answer = Question.respuesta || {};
var Errors = Answer.error_genuino;

//Event Emmiter
function render() {
	//Default content
	Render.getFormulation();

	//Event Click 
	$("#sendData").on("click", Render.evalueteData);
	//Press Enter
	$('body').on('keydown','#inputData', function(event) {
	  if (event.keyCode == 13) {
	  	$("#modal").modal();
	    Render.evalueteData();
	  }
	});
}

//Object Render
var Render= {
	//get Texts and Formulas  
	getFormulation: function() {
		var Expresions = Question.pregunta.formulacion.expresion;
		Expresions.forEach(function( expresion ){
				if(expresion.tipo == "texto") {
					console.log(expresion.texto);
					$(".statement").text( $(".statement").text()+expresion.texto );
				}
		});
	},

	//Generate Solution, evalue and print data
	generateSolution: function( response ) {
		var formula = Answer.formula;
		console.log(formula);
		try{
			var solution = math.eval(formula+"");
			var evalResponse = math.eval(response+"") || response;
			if(evalResponse == solution && evalResponse != undefined) {
				console.log("la respuesta es correcta");
				solution = "Correcto: " + solution;
				$("#Answer").addClass("alert-success");
				$("#Answer").text(solution);
			} else {
				console.log(this);
				Render.checkErrors( response, function( ok ) {
					if(!ok) {
						$("#Answer").addClass("alert-warning");
						$("#Answer").text("Respuesta erronea");	
						$("#feedback").text("No hay retroalimentacion en este caso");
					}
				});
			}

		}catch(e){
			console.log(e);
		}
	},

	evalueteData: function() {
		var response = $("#inputData").val();
		console.log(response);
		if(response != null && response != undefined && response != "") {
			Render.generateSolution(response);
		}
	},

	//compare genuine error with the user response
	checkErrors: function( response, cb ) {
		var flag = false;
		Errors.forEach(function( error ){
			console.log(error);
			try{
				var evalResponse = math.eval(response+"") || response;
				var evalError = math.eval(error.formula);
				console.log(evalError, evalResponse);
				if(evalError == evalResponse && evalError != undefined) {
					evalError = "Error: " + evalError ;
					$("#Answer").addClass("alert-warning");
					$("#Answer").text(evalError);
					$("#feedback").text("ERROR: " + error.retro_alimentacion);
					cb(!flag);
					flag = !flag;
					return false; //stop forEach
				}

			}catch(e) {
				console.log(e);
			}
			if(flag == false ) cb(flag);
		});
	}



}
