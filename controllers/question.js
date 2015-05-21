var mongoose = require('mongoose');
var QuestionDB = mongoose.model('question');
var FolderDB = mongoose.model('folder');
uniqid = require('uniqid');

module.exports = {
    createQuestion: [
        function(req, res){

            var quest = new QuestionDB(
                {

                    xml_pregunta: req.body.xml_pregunta,
                    xml_metados: req.body.xml_metados,
                    titulo: req.body.titulo,
                    _folder : req.body.folderid
                }
            );

            quest.save(function(err)
            {
                if(err){
                    res.send(400, err.message);
                }else{
                    FolderDB.findById(req.body.folderid, function(err, folder){
                        if (err) res.send(404, err.message);
                        else if (!folder) res.send(401, "No existe la carpeta");
                        else {
                            folder.questions.push(quest);
                            folder.save(function(err)
                            {
                                if(err){
                                    res.send(404, err.message);
                                }else{
                                    res.status(200).jsonp({_id: quest._id,titulo:quest.titulo});
                                }
                            })
                        }
                    });
                }
            })
        }
    ],

    updateQuestion: [
        function(req, res){
            QuestionDB.findById(req.params.id, function(err, qq){
                if( req.body.titulo){
                    qq.titulo = req.body.titulo;
                }else {
                    qq.xml_pregunta = req.body.xml_pregunta;
                    qq.xml_metados = req.body.xml_metados;
                }

                qq.save(function(err){
                    if(err){
                        res.send(400, err.message);
                    }else{
                        res.status(200).jsonp({status: 'completo'});
                    }
                })
            });

        }
    ],

    deleteQuestion: [
        function(req, res){
            QuestionDB.findById(req.params.id, function(err, qq){
                qq.remove(function(err){
                    if(err) return res.send(500, err.message);
                    res.status(200).jsonp({status: 'completo'})
                })
            });
        }
    ],

    listQuestion: [
        function(req, res) {

            FolderDB.findById(req.params.folderid).populate('questions')
                .exec(function (err, folder) {
                    if (err)
                        res.send(404, err.message);
                    else if (!folder) {
                        res.send(404, "No existe la carpeta");
                    }
                    else {
                        res.status(200).json({
                            Folder: folder
                        });

                    }
                });
        }
    ],

    listQuestionOne: [
        function(req, res){
            QuestionDB.findById(req.params.id, function(err, qq){
                if(err)
                    res.send(404, err.message);

                res.status(200).jsonp(qq);
            });
        }
    ]

};