var mongoose = require('mongoose');
var FolderDB = mongoose.model('folder');
var UserDB = mongoose.model('user');
var QuestionDB = mongoose.model('question');
var Q = require('q');

uniqid = require('uniqid');
module.exports = {
    create: [
        function(req, res){

            var folder = new FolderDB(
            {
                    name: req.body.name,
                    _user : req.body.userid
            }
            );
            folder.save(function(err)
            {
                if(err){
                    res.send(404, err.message);
                }else{
                    UserDB.findById(req.body.userid, function(err, user){
                        if (err) res.send(404, err.message);
                        else if (!user) res.send(401, "No existe el usuario");
                        else {
                            user.folders.push(folder);
                            user.save(function(err)
                            {
                                if(err){
                                    res.send(404, err.message);
                                }else{
                                    res.status(200).jsonp({_id:folder._id,name:folder.name });
                                }
                            })
                        }
                    });
                }
            })
        }
    ],

    
    update: [
        function(req, res){  
            FolderDB.findById(req.params.id, function(err, folder){
                folder.name = req.body.name;
                folder.save(function(err){
                    if(err){
                        res.send(400, err.message);
                    }else{
                        res.status(200).jsonp({status: 'completo'});
                    } 
                })
            });
            
        }   
    ],


    delete: [
        function(req, res){
            FolderDB.findById(req.params.id, function(err, folder){
                if(err) return res.send(500, err.message);
                else if(!folder) return res.send(500, "No existe");
                else {
                    folder.remove(function (err) {
                        if (err) return res.send(500, err.message);
                        else {
                            QuestionDB.remove({_folder: folder._id}).exec();
                            res.status(200).jsonp({status: 'completo'})
                        }

                    })
                }
            });
        }    
    ],

    list: [
        function(req, res){
                UserDB.findById(req.params.userid).populate('folders')
                    .exec(function (err, user) {
                    if(err)
                        res.send(404, err.message);
                    else if(!user){
                        res.send(404, "No existe el usuario");
                    }
                    else{
                        res.status(200).json({
                            User: user
                        });

                    }
                });
		}
    ]

    
};