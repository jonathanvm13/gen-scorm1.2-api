var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var question = mongoose.Schema({

    xml_pregunta: String,
    xml_metados: String,
    titulo: String,
    _folder : { type: String, required: true, ref: 'folder' }
});

module.exports = mongoose.model( 'question', question );
