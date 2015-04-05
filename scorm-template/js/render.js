$(document).on("ready", render);

//this should get data of the API
//Static Variables
var Question = window.question;
var Answer = Question.respuesta || {};
var Errors = Answer.error_genuino;
var TreeUtils = window.treeUtils;
var RandomUtils = window.randomUtils;
var Variables = {};

//Event Emmiter
function render() {
	//Default content
	Render.getFormulation();
    Render.loadVariables();
    Render.loadInputsResponse();

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
		var Expresions = Question.pregunta.formulacion.expresion,
            TreeJson = JSON.parse(decodeURIComponent(Question.pregunta.objetos.json)),
            Tree,
            mathmlString;


        if (typeof Question.pregunta.formulacion !== 'undefined') {

            Expresions.forEach(function( expresion ){
                if(expresion.tipo == "texto") {
                    $(".statement").append(expresion.texto );
                }else{
                    var id = expresion.texto.substring(9, expresion.texto.length);
                    Tree = TreeJson[id];
                    mathmlString = TreeUtils.makeString(Tree);
                    console.log(mathmlString);
                    console.log(Tree);
                    $(".statement").append('<div style="font-family:inherit;font-size:inherit;font-weight:inherit; padding: 2px 4px;display:inline-block;" class="pre-equation"><math>'+mathmlString+'</math></div>');
                }
            });
        }
	},

    //Load and execute random functions for each var
    loadVariables : function() {
        var JsonVariables = Question.variables.variable;

        if (typeof JsonVariables.length != 'undefined') {
            JsonVariables.forEach(function (variable) {
                Variables[variable.id] = randomUtils.genRandom(variable);
            });
        } else {
            Variables[JsonVariables.id] = randomUtils.genRandom(JsonVariables);
        }
        $.each(Variables, function (key, val) {
            $("#infoVars").append("<p>" + key + " = " + val + "</p>");
        });
    },

    //load html inputs for type the response and next evaluate this
    loadInputsResponse: function(){
        var JsonResponses = Question.respuestas.respuesta;
        console.log(JsonResponses);

        if (typeof JsonResponses.length != 'undefined') {
            JsonResponses.forEach(function (res) {
                $("#inputResponses").append("<p><label>"+res.nombre+" = </label> <input type='text' id='"+res.id+"'></p>");
            });
        } else {
            $("#inputResponses").append("<p><label>"+JsonResponses.nombre+" = </label> <input type='text' id='"+JsonResponses.id+"'></p>");
        }
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
