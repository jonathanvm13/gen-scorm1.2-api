'use strict';

var helper = require('../lib/helper.js'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs');

module.exports = {
    zipAndDownloadFile: [
        function (req, res) {

            fs.writeFile("./scorm-template/js/xml-question.js", req.body.question, function(err) {
                if(err) return res.status(500).jsonp({ok: false});

                fs.writeFile("./scorm-template/js/xml-metadatos.js", req.body.metadatos, function(err) {
                    if(err) return res.status(500).jsonp({ok: false});

                    return res.status(200).jsonp({ok: true});
                });
            });

            helper.createManifest();



            /*helper.zipFile(function(ok){
                if(!ok) return res.status(500).jsonp({ok: false});
                    var file = './scorm.zip';
                    res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
                    res.setHeader('Content-type', mime.lookup(file));

                    fs.createReadStream(file).pipe(res);
            });*/
        }
    ]
}
