$(document).on("ready", render);

//this should get data of the API
//Static Variables
var Question    = window.question;
var Answer 	    = Question.respuesta || {};
//var Errors 	    = Answer.error_genuino;
var TreeUtils   = window.treeUtils;
var RandomUtils = window.randomUtils;
var Responses   = Question.respuestas.respuesta;
var Printer 		= window.Printer;
var Variables = {};
var DecodeText = {"&amp;&amp;#35;40;":"(","&amp;&amp;#35;41;":")"};

var correctAnswer = true;
var correctResponses = 0;
//Event Emmiter
function render() {
	//Default content
    Render.loadVariables();
    Render.getFormulation();
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

            if(Expresions.length) {
                Expresions.forEach(function (expresion) {
                    if (expresion.tipo == "texto") {
                        $(".statement").append(expresion.texto);

                    } else if (expresion.tipo == "imagen"){
                        $(".statement").append('<img  id="'+ expresion.texto +'" style="height: 100px; width: 100px; display: block" src="images/'+expresion.texto+'" />');

                    } else {
                        var id = expresion.texto.substring(9, expresion.texto.length);
                        Tree = TreeJson[id];
                        mathmlString = TreeUtils.makeString(Tree);

                        $.each(Variables, function (key, val) {
                            mathmlString = mathmlString.replace(new RegExp('<mn>' + key + '</mn>', 'g'), '<mn>' + val + '</mn>');
                        });
                        $.each(DecodeText, function (key, val) {
                            mathmlString = mathmlString.replace(new RegExp('<mtext>' + key + '</mtext>', 'g'), '<mtext>' + val + '</mtext>');
                        });

                        $(".statement").append('<div  class="mathjax-expresion pre-equation"><math>' + mathmlString + '</math></div>');
                    }
                });
            } else {
                if (Expresions.tipo == "texto") {
                    $(".statement").append(Expresions.texto);

                } else if (Expresions.tipo == "imagen"){
                    $(".statement").append('<img  id="'+ Expresions.texto +'" style="height: 150px; width: 150px; display: block" src="images/'+Expresions.texto+'" />');

                } else {
                    var id = Expresions.texto.substring(9, Expresions.texto.length);
                    Tree = TreeJson[id];
                    mathmlString = TreeUtils.makeString(Tree);

                    $.each(Variables, function (key, val) {
                        mathmlString = mathmlString.replace(new RegExp('<mn>' + key + '</mn>', 'g'), '<mn>' + val + '</mn>');
                    });
                    $.each(DecodeText, function (key, val) {
                        mathmlString = mathmlString.replace(new RegExp('<mtext>' + key + '</mtext>', 'g'), '<mtext>' + val + '</mtext>');
                    });

                    $(".statement").append('<div  class="mathjax-expresion pre-equation"><math>' + mathmlString + '</math></div>');
                }
            }
        }
	},

  //load html inputs for type the response and next evaluate this
  loadInputsResponse: function(){
      var JsonResponses = Question.respuestas.respuesta;
      console.log(JsonResponses);
      if(JsonResponses) {
          if (typeof JsonResponses.length != 'undefined')
              JsonResponses.forEach(function (res) {
                  $("#inputResponses").append(Printer.generateInput(res.nombre, res.id));
              });
          else
              $("#inputResponses").append(Printer.generateInput(JsonResponses.nombre, JsonResponses.id));
      }
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
		//correctResponses = 0;
	},

  //Load and execute random functions for each var
  loadVariables : function() {
      var JsonVariables = Question.variables.variable;

      if(JsonVariables) {

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
      }
  },


	//Generate Solution, evalue and print data
	generateSolution: function( response, id ) {
		var formula, nameResponse;
		correctAnswer = true;

		var responsesTotal = 0;
		
		if (typeof Responses.length != 'undefined') {
			responsesTotal = Responses.length;
			var res = $.grep(Responses, function(res){return res.id == id })[0];
			console.log(res, res.formula);
			formula = res.formula;
			nameResponse = res.nombre;
		} else {
			formula = Responses.formula;
			nameResponse = Responses.nombre;
			responsesTotal = 1;
		}
		console.log(formula);
		try{
			var solution = math.eval(formula+"");
			if(response == solution && response != undefined) {
				console.log("la respuesta es correcta");
				correctResponses++;
				solution = "Correcto: " + solution;
				$("#Answer").append(Printer.alertModal(nameResponse, 'alert-success',solution));
			} else {
				correctAnswer = false;
				console.log(this);
				
				Render.checkErrors( response, id, function( ok ) {
					if(!ok) {
						console.log("holi");
						$("#Answer").append(Printer.alertModal(nameResponse,'alert-warning',"Respuesta erronea"));
					}
				});
			}
			$("#modal").modal();
		}catch(e){
			console.log(e);
		}
		//var feedback = correctAnswer? "Muy bien la respuesta es correcta" : "Una de las respuestas es incorrecta";
		setInterval(function () {

			var feedback = "respondiste "+ correctResponses + " de "+responsesTotal;
			$("#feedback").text(feedback);
		}, 1000);
		
	},

	

	//compare genuine error with the user response
	checkErrors: function( response, id, cb ) {
		var flag = false;
		var res = $.grep(Responses, function(res){return res.id == id })[0];
		if(res && res.error_genuino &&  res.error_genuino != undefined) {

			if(res.error_genuino.length != undefined) {
				res.error_genuino.forEach(function( error ){
					console.log(error);
					try{
						var evalError = math.eval(Render.replaceVariables(error.formula+""));
						console.log(evalError, response);
						if(evalError == response && evalError != undefined) {
							evalError = "Error: " + evalError;
							$("#Answer").append(Printer.alertModal(res.nombre, "alert-warning ", error.retro_alimentacion));
							cb(!flag);
							flag = !flag;
							return false; //stop forEach
						}

					}catch(e) {
						console.log(e);
					}
					
				});	
			} else {
				try{
					var evalError = math.eval(Render.replaceVariables(res.error_genuino.formula+""));
					console.log(evalError, response);
					if(evalError == response && evalError != undefined) {
						evalError = "Error: " + evalError;
						$("#Answer").append(Printer.alertModal(res.nombre, "alert-warning ", res.error_genuino.retro_alimentacion));
						cb(!flag);
						flag = !flag;
						return false; //stop forEach
					}

				}catch(e) {
					console.log(e);
				}
			}

			
		} 
		if(flag == false ) cb(flag);
	},

	//replace vairables from formula
	replaceVariables: function(formula) {
		//formula.split("#").join().replace(/,/gi, "");
		var newFormula = formula.split("#").map(function(value, index){
			if(index % 2 != 0) {
				return Variables[value]
			} else return value;
		});
		console.log(newFormula.join().replace(/,/gi, ""));
		return newFormula.join().replace(/,/gi, "");
	}

}

function generateInput(name, id) {
	return "<div class='input-group'>"+ 
		"<span class='input-group-addon' id='ba'>"+ name +"</span>"+
		"<input class='form-control response' aria-describedby='ba' type='number' id='"+ id +"'>"+
		"</div>"
}
