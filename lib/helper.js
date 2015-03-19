'use strict';

var fs = require('fs'),
    archiver = require('archiver');

module.exports = {
    zipFile : function(cb){
        var output = fs.createWriteStream('./scorm.zip');
        var zipArchive = archiver('zip');

        output.on('close', function() {
            cb(true);
        });

        zipArchive.pipe(output);

        zipArchive.bulk([
            { src: [ '**/*' ], cwd: './scorm-template', expand: true }
        ]);

        zipArchive.finalize(function(err, bytes) {
            if(err) {
                throw err;
            }
        });
    }
}