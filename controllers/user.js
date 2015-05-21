var mongoose = require('mongoose');
var UserDB = mongoose.model('user');
uniqid = require('uniqid');
module.exports = {

    create: [
        function(req, res){
            console.log("Vamos a crear el usuario")
            console.log(req.body.email);

            var user = new UserDB(
                {   

                    email: req.body.email,
                    pass: req.body.pass,
                    name: req.body.name
                }
            );
            user.save(function(err)
            {
                if(err){
                    res.send(404, err.message);
                }else{
                    console.log("Usuario creado")

                    res.status(200).jsonp({status: 'completo'});
                } 
            })
        }
    ],

    
    update: [
        function(req, res){  
            UserDB.findById(req.params.id, function(err, qq){
                qq.email = req.body.email;
                qq.pass = req.body.pass;
                qq.name = req.body.name;
                
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
    login: [
        function(req, res) {
            console.log(req.body.email+" Este es el email");
            console.log(req.body.pass+" Este es el pass");
            UserDB.where({email: req.body.email, pass: req.body.pass}).findOne(function (err, user) {
                if (err) res.send(404, err.message);
                else if (!user) res.send(401, "No existe el usuarioo");
                else {
                    var header=req.headers['authorization'];
                    console.log(header);
                    UserDB.findOneAndUpdate({ _id: user._id }, {cookie:header},function(err, user) {
                        if (user) {
                            res.status(200).json({
                                id:user._id,
                                name: user.name
                            });
                        }
                        else if(err) res.send(400, err.message);
                        else  res.send(400, "Error inesperado");

                    });
                }
            });
        }
    ],
    logout: [
        function(req, res){
            UserDB.findById(req.body.id, function(err, user){
                if (err) res.send(404, err.message);
                else if (!user) res.send(401, "No existe el usuario");
                else {
                    delete user.cookie ;

                    user.save(function (err) {
                        if (err) {
                            res.send(400, err.message);
                        } else {
                            res.status(200).jsonp({status: 'completo'});
                        }
                    })
                }
            });

        }
    ],
    /*
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
    */
    list: [
        function(req, res){
            UserDB.find(function(err, qq){
                if(err)
                    res.send(404, err.message);
                
                res.status(200).jsonp(qq);
            });
		}
    ]
    /*
    listQuestionOne: [
        function(req, res){
            QuestionDB.findById(req.params.id, function(err, qq){
                if(err)
                    res.send(404, err.message);
                
                res.status(200).jsonp(qq);
            });
		}
    ],*/
    
};