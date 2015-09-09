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

  //Generate Solution, evalue and print data
  generateSolution: function (response, id) {

    //Aquí vamos a comparar la respuesta del usuario con la respuesta real.

    var formula, nameResponse;
    correctAnswer = true;

    var responsesTotal = 0;

    if (typeof Responses.length != 'undefined') {
      responsesTotal = Responses.length;
      var res = $.grep(Responses, function (res) {
        return res.id == id
      })[0];
      console.log(res, res.formula);
      formula = res.formula;
      nameResponse = res.nombre;

    } else {
      formula = Responses.formula;
      nameResponse = Responses.nombre;
      responsesTotal = 1;
    }

    console.log(formula);
    try {

      var solution = math.eval(replaceVariables(formula + ""));
      if (response == solution && response != undefined) {
        console.log("la respuesta es correcta");
        correctResponses++;
        solution = "Correcto: " + solution;
        $("#Answer").append(Printer.alertModal(nameResponse, 'alert-success', solution));

      } else {
        correctAnswer = false;
        console.log(this);

        Render.checkErrors(response, id, function (ok) {
          if (!ok) {
            console.log("holi");
            $("#Answer").append(Printer.alertModal(nameResponse, 'alert-warning', "Respuesta erronea"));
          }
        });
      }

      $("#modal").modal();
    } catch (e) {
      console.log(e);
    }
    //var feedback = correctAnswer? "Muy bien la respuesta es correcta" : "Una de las respuestas es incorrecta";
    setInterval(function () {

      var feedback = "respondiste " + correctResponses + " de " + responsesTotal;
      $("#feedback").text(feedback);
    }, 1000);

  },

  //compare genuine error with the user response
  checkErrors: function (response, id, cb) {
    var flag = false;
    var res = $.grep(Responses, function (res) {
      return res.id == id
    })[0];

    if (res && res.error_genuino && res.error_genuino != undefined) {

      if (res.error_genuino.length != undefined) {
        res.error_genuino.forEach(function (error) {
          console.log(error);

          try {
            var evalError = math.eval(Render.replaceVariables(error.formula + ""));
            console.log(evalError, response);

            if (evalError == response && evalError != undefined) {
              evalError = "Error: " + evalError;
              $("#Answer").append(Printer.alertModal(res.nombre, "alert-warning ", error.retro_alimentacion));
              cb(!flag);
              flag = !flag;
              return false; //stop forEach
            }
          } catch (e) {
            console.log(e);
          }
        });

      } else {

        try {
          var evalError = math.eval(Render.replaceVariables(res.error_genuino.formula + ""));
          console.log(evalError, response);

          if (evalError == response && evalError != undefined) {
            evalError = "Error: " + evalError;
            $("#Answer").append(Printer.alertModal(res.nombre, "alert-warning ", res.error_genuino.retro_alimentacion));
            cb(!flag);
            flag = !flag;
            return false; //stop forEach
          }
        } catch (e) {
          console.log(e);
        }
      }


    }
    if (flag == false) {
      cb(flag);
    }
  },

  //replace vairables from formula
  replaceVariables: function (formula) {
    //formula.split("#").join().replace(/,/gi, "");
    var newFormula = formula.split("#").map(function (value, index) {
      if (index % 2 != 0) {
        return Variables[value]
      } else return value;
    });
    return newFormula.join().replace(/,/gi, "");

  }

};

function generateInput(name, id) {
  return "<div class='input-group'>" +
    "<span class='input-group-addon' id='ba'>" + name + "</span>" +
    "<input class='form-control response' aria-describedby='ba' type='number' id='" + id + "'>" +
    "</div>"
}
