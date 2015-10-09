'use strict';

var fs = require('fs');
var archiver = require('archiver');
var fsx = require('fs-extra');
var path = require('path');
var mongoose = require('mongoose');
var Question = mongoose.model('question');

module.exports = {

  zipFile: function (folderRoute, zipRoute, cb) {

    var output = fs.createWriteStream(zipRoute);
    var zipArchive = archiver('zip');

    output.on('close', function () {
      cb(true);
    });

    zipArchive.pipe(output);

    zipArchive.bulk([
      {src: ['**/*'], cwd: folderRoute, expand: true}
    ]);

    zipArchive.finalize(function (err, bytes) {
      if (err) {
        throw err;
      }
    });
  },

  copyImages: function (images, cb) {
    fsx.removeSync(path.resolve(__dirname, '../scorm-template/images'));
    fsx.mkdirsSync(path.resolve(__dirname, '../scorm-template/images'));
    images.map(function (image) {

      fsx.copySync(path.resolve(__dirname, '../images/' + image), path.resolve(__dirname, '../scorm-template/images/' + image));
    });
    cb(true);
  },

  copyScormTemplate: function(folderName){
    fsx.copySync(path.resolve(__dirname, '../scorm-template'), path.resolve(__dirname, '../questions/' + folderName));
  },

  createManifest: function () {

  },

  question: {

    updateData: function (questionId, data, cb) {
      var conditions = {
          _id: questionId
        },
        update = {
          "$set": {
            "data": data
          }
        };

      Question.update(conditions, update, function (err, rows) {
        if (err) {
          cb(err);
          return;
        }

        cb(null);
      });
    }

  }
};