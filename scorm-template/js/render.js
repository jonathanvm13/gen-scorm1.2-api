$(document).on("ready", render);

//this should get data of the API
//Static Variables
var Question = window.question;
var Answer = Question.respuesta || {};
var Errors = Answer.error_genuino;
//var Variables = Question.variables || {}
var TreeUtils = window.treeUtils;
var RandomUtils = window.randomUtils;
var Variables = [];
//Event Emmiter
function render() {
	//Default content
	Render.getFormulation();
    Render.loadVariables();

	//Event Click 
	$("#sendData").on("click", Render.evalueteData);
	//Press Enter
	$('body').on('keydown','#inputData', function(event) {
	  if (event.keyCode == 13) {
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
                    $(".statement").append( $(".statement").html()+expresion.texto );
                }else{
                    var id = expresion.texto.substring(9, expresion.texto.length);
                    Tree = TreeJson[id];
                    mathmlString = TreeUtils.makeString(Tree);
                    $(".statement").append('<div style="border-style: solid; border-width: 1px;  font-family:inherit;font-size:inherit;font-weight:inherit;background:#ccc; border:1px solid #999; border-radius: 5px; padding: 2px 4px;display:inline-block;" class="pre-equation"><math>'+mathmlString+'</math></div>');
                }
            });
        }
	},

    //Load and execute random functions for each var
    loadVariables : function(){
        var JsonVariables = Question.variables;

        // if(JsonVariables.length !='undefined'){
        //     JsonVariables.forEach(function (expresion) {

        //     });

        // }else {

        //     Variables[JsonVariables.variable.id] = randomUtils.genRandom(JsonVariables.variable.tipo);

        // }
    },

	//Generate Solution, evalue and print data
	generateSolution: function( response ) {
		var formula = Answer.formula;
		console.log("formula sin remplzar", formula);
		formula = Render.replaceVariables(formula);
		console.log("formula despues de remplzar", formula);
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
			$("#modal").modal();
			Render.generateSolution(response);
		} else {
			alert("no puede enviar un campo vacio");
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
	},

	replaceVariables: function( formula ) {
		var variables= [];
		var semi = formula.split("#");
		var aux = [];
		var newFormula = "";
		semi.forEach(function(variable, index) {
			if(index % 2 == 1) {
				aux.push(variable);

				newFormula += Render.operateVariable(variable);//this will change 
			} else {
				newFormula += variable;
			}
		});
		variables = aux;
		console.debug(newFormula);
		console.log(variables);
		return newFormula;

	},

	operateVariable: function( newVariable ) {
		return "2";
		// var newVal = null;
		// Variables.forEach(function( variable ) {
		// 	if(variable.id == newVariable && variable.id != undefined ) {
		// 		if(variable.tipo == "especifica") {
		// 			newVal = variable.valor[Math.floor(Math.random()*variable.valor.length)]
		// 		} else if(variable.tipo == "uniforme") {
		// 			console.log("es uniforme");
		// 		}
		// 	}
		// });
		// console.log(newVal);
	}
}
