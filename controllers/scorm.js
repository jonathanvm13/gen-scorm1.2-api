'use strict';

var helper = require('../lib/helper.js'),
    path = require('path'),
    mime = require('mime'),
    fs = require('fs');

module.exports = {
    zipAndDownloadFile: [
        function (req, res) {
            helper.zipFile(function(ok){
                if(!ok) return res.status(500).jsonp({ok: false});
                    var file = './scorm.zip';
                    res.setHeader('Content-disposition', 'attachment; filename=' + path.basename(file));
                    res.setHeader('Content-type', mime.lookup(file));

                    fs.createReadStream(file).pipe(res);
            });
        }
    ]
}
