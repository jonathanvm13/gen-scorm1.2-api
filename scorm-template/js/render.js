$(document).on("ready", render);

//this should get data of the API
//Static Variables
var Question    = window.question;
var Answer 	    = Question.respuesta || {};
//var Errors 	    = Answer.error_genuino;
var TreeUtils   = window.treeUtils;
var RandomUtils = window.randomUtils;
var Variables   = {};
var Responses   = Question.respuestas.respuesta;

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
                    $(".statement").append('<div style="border-style: solid; border-width: 1px;  background:#ccc; border:1px solid #999; border-radius: 5px; padding: 2px 4px;display:inline-block;" class="pre-equation"><math>'+mathmlString+'</math></div>');
                }
            });
        }
	},

  //Load and execute random functions for each var
  loadVariables : function() {
      var JsonVariables = Question.variables;
      if (typeof JsonVariables.length != 'undefined') {
          JsonVariables.forEach(function (variable) {
              Variables[variable.variable.id] = randomUtils.genRandom(variable.variable);
          });
      } else {
          Variables[JsonVariables.variable.id] = randomUtils.genRandom(JsonVariables.variable);
      }
      console.log(Variables);
      $.each(Variables, function (key, val) {
          $("#infoVars").append("<p>" + key + " = " + val + "</p>");
      });
  },

  //load html inputs for type the response and next evaluate this
  loadInputsResponse: function(){
      var JsonResponses = Question.respuestas.respuesta;
      console.log(JsonResponses);
      if (typeof JsonResponses.length != 'undefined') 
          JsonResponses.forEach(function (res) {
              $("#inputResponses").append(generateInput(res.nombre, res.id));
          });
      else 
          $("#inputResponses").append(generateInput(JsonResponses.nombre, JsonResponses.id));
  },

  evalueteData: function() {
		$('.response').each(function(){
			var response = $(this).val();
			if(response != null && response != undefined && response != "") {
				//$("#modal").modal();
				Render.generateSolution(response, $(this).attr('id'));
			} else {
				alert("no puede enviar un campo vacio");
			}
		});
	},

	//Generate Solution, evalue and print data
	generateSolution: function( response, id ) {
		var formula;
		if (typeof Responses.length != 'undefined') {
			var res = $.grep(Responses, function(res){return res.id = id });
			console.log(res);
			formula = res.formula;
		} else {
			formula = Responses.formula;
		}
		console.log(formula);
		try{
			var solution = math.eval(formula+"");
			if(response == solution && response != undefined) {
				console.log("la respuesta es correcta");
				solution = "Correcto: " + solution;
				$("#Answer").addClass("alert-success");
				$("#Answer").text(solution);
			} else {
				console.log(this);
				Render.checkErrors( response, id, function( ok ) {
					if(!ok) {
						$("#Answer").addClass("alert-warning");
						$("#Answer").text("Respuesta erronea");	
						$("#feedback").text("No hay retroalimentacion en este caso");
					}
				});
			}
			$("#modal").modal();
		}catch(e){
			console.log(e);
		}
	},

	

	//compare genuine error with the user response
	checkErrors: function( response, id, cb ) {
		var flag = false;
		var res = $.grep(Responses, function(res){return res.id = id });
		if(res.error_genuino) {
			res.error_genuino.forEach(function( error ){
				console.log(error);
				try{
					var evalError = math.eval(Render.replaceVariables(error.formula+""));
					console.log(evalError, response);
					if(evalError == response && evalError != undefined) {
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
		
	},

	//replace vairables from formula
	replaceVariables: function(formula) {
		//formula.split("#").join().replace(/,/gi, "");
		var newFormula = formula.split("#").map(function(value, index){
			if(index % 2 != 0) {
				return Variables[value]
			}
		});
		console.log(newFormula);
		return newFormula;
	}

}

function generateInput(name, id) {
	return "<div class='input-group'>"+ 
		"<span class='input-group-addon' id='ba'>"+ name +"</span>"+
		"<input class='form-control response' aria-describedby='ba' type='number' id='"+ id +"'>"+
		"</div>"
}
