'use strict';

var helper = require('../lib/helper.js'),
  path = require('path'),
  mime = require('mime'),
  fs = require('fs');

module.exports = {
  zipAndDownloadFile: [
    function (req, res) {
    /*  var json = JSON.parse(parser.toJson(req.body.question)) || {},
        meta = JSON.parse(parser.toJson(req.body.metadatos)) || {},
        xml = json.xml.pregunta,
        images = [];

      fs.writeFile("./scorm-template/js/xml-question.js", "var question = " + JSON.stringify(json.xml) + "; window.question = window.question || question;", function (err) {
        if (err) return res.status(500).jsonp({ok: false});

        fs.writeFile("./scorm-template/js/xml-metadatos.js", "module.exports = " + JSON.stringify(meta.xml), function (err) {
          if (err) return res.status(500).jsonp({ok: false});

          if (xml.formulacion && xml.formulacion.expresion) {

            if (!xml.formulacion.expresion.length) {
              if (xml.formulacion.expresion.tipo.localeCompare("imagen") == 0) {
                images.push(xml.formulacion.expresion.texto);
              }

            } else {
              for (var i = 0; i < xml.formulacion.expresion.length; i++) {
                if (xml.formulacion.expresion[i].tipo.localeCompare("imagen") == 0) {
                  images.push(xml.formulacion.expresion[i].texto);
                }
              }
            }
          }

          helper.copyImages(images, function (ok) {
            if (!ok) return res.status(400).jsonp({ok: false});

            helper.zipFile(function (ok) {
              if (!ok) return res.status(400).jsonp({ok: false});

              return res.status(200).jsonp({ok: true});
            });
          });
        });
      });
      //helper.createManifest();
      */
    }
  ],
  update: [
    function (req, res) {
      /*
      var json = JSON.parse(parser.toJson(req.body.question));
      var meta = JSON.parse(parser.toJson(req.body.metadatos));

      fs.writeFile("./scorm-template/js/xml-question.js", "var question = " + JSON.stringify(json.xml) + "; window.question = window.question || question;", function (err) {
        if (err) return res.status(500).jsonp({ok: false});

        fs.writeFile("./scorm-template/js/xml-metadatos.js", "module.exports = " + JSON.stringify(meta.xml), function (err) {
          if (err) return res.status(500).jsonp({ok: false});

          return res.status(200).jsonp({ok: true});
        });
      });
      //helper.createManifest();
      */
    }

  ],
  Download: [
    function (req, res) {
      var file = './scorm.zip';
      res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
      res.setHeader('Content-type', mime.lookup(file));

      fs.createReadStream(file).pipe(res);
    }
  ],
  uploadFiles: [
    function (req, res) {
      return res.status(200).jsonp({ok: true});
    }
  ]
}
