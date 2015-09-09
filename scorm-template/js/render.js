$(document).on("ready", render);

//this should get data of the API

//Static Variables
var Question = window.question;
var Answer = Question.respuesta || {};

//var Errors 	    = Answer.error_genuino;
var RandomUtils = window.randomUtils;
//var Responses = Question.respuestas.respuesta;
var Printer = window.Printer;
var Variables = {};
var Variable = {};
var DecodeText = {"&amp;&amp;#35;40;": "(", "&amp;&amp;#35;41;": ")"};

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
  $('body').on('keydown', '#inputData', function (event) {
    if (event.keyCode == 13) {
      Render.evalueteData();
    }
  });
}

//Object Render
var Render = {

  //get Texts and Formulas
  getFormulation: function () {
    var question = Question.formulation;
     ///La idea de esta fucnión es cargar toda la formulación tal y como el profesor la programó haciedo uso del objeto
     // Question que tiene toda la data en formato JSON de la pregunta (Formulación, variables y respuestas), aquí se deben cargar las formulas,
     // expresiones, texto, etc con el valor de las variables correspondiente despues de generar los numeros aleatorios y además ejecutar las operaciones
     // entre ellas(En el caso que se deba ejecutar la operacion).
     // El lugar donde se imprimirá toda la formulación tiene la clase .statement y lo pueden encontrar en launch.html
     var expresionsInQuestion = [];   // @(_q + _b)
     for (var i = 0; i < question.length; i++) {
      const token = question[i];
      if(token == '_'){
        Variables[String(question).substring(i,i+1)];
      }
      if(token == '@'){
        var initialIndex = {'index':i};
      } else if(token == '}' && initialIndex){
        console.log(i);
        var finalIndex = {'index':i};
        expresionsInQuestion.push({
          'expresion':String(question).substring(initialIndex.index+2,finalIndex.index),
          'completeExpresion': String(question).substring(initialIndex.index,finalIndex.index+1),
          'initial':initialIndex.index,
          'final':finalIndex.index
        });
      }
    }
    var newQuestion = question;
    expresionsInQuestion.map(function(expresion,index){
      var newValor = math.eval(expresion.expresion);
      newQuestion = newQuestion.replace(expresion.completeExpresion,newValor);
      console.log(newQuestion);
    });

    $('.statement').html(newQuestion);


  },

  //load html inputs for type the response and next evaluate this
  loadInputsResponse: function () {
    Question.answers.forEach(function(answer, index){
      var answerHtml = Printer.generateInput(answer.name, answer._id);
      $('#inputResponses').append(answerHtml);
    })
  },

  evalueteData: function () {

    $('.response').each(function () {
      var inputValue = $(this).val();

      if (inputValue != null && inputValue != undefined && inputValue != "") {

        var id =  $(this).attr('id');
        Question.answers.forEach(function(answer, index){
          if(answer._id == id ){

            var code = answer.code.join("");
            inputValue = Number(inputValue);
            eval(code);
          }
        });
      } else {
        alert("No se puede enviar un campo vacio");
      }
    });
  },

  //Load and execute random functions for each var
  loadVariables: function () {
    Question.variables.variables.forEach(function(variable, index){
      eval(variable.code);
    });

    Variable = Variables;

  },

};

