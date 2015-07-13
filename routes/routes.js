var Scorm = require('../controllers/scorm'),
    UserCtrl = require('../controllers/user'),
    QuestionCtrl = require('../controllers/question'),
    FolderCtrl = require('../controllers/folder');

var routes = [

  //Scorm
  {path: '/scorms/',                 httpMethod: 'POST',   middleware: [Scorm.zipAndDownloadFile]},
  {path: '/scorms/',                 httpMethod: 'PUT',    middleware: [Scorm.update]},
  {path: '/scorms/download',         httpMethod: 'GET',    middleware: [Scorm.Download]},
  {path: '/scorms/uploadfiles',      httpMethod: 'POST',   middleware: [Scorm.uploadFiles]},

  // Folder
  {path: '/folders',                 httpMethod: 'POST',   middleware: [FolderCtrl.create]},
  {path: '/folders/:id',             httpMethod: 'PUT',    middleware: [FolderCtrl.update]},
  {path: '/folders/:id',             httpMethod: 'DELETE', middleware: [FolderCtrl.delete]},
  {path: '/folders/:userid',         httpMethod: 'GET',    middleware: [FolderCtrl.list]},

  //Question
  {path: '/questions',               httpMethod: 'POST',   middleware: [QuestionCtrl.createQuestion]},
  {path: '/questions/:id',           httpMethod: 'PUT',    middleware: [QuestionCtrl.updateQuestion]},
  {path: '/questions/:id',           httpMethod: 'DELETE', middleware: [QuestionCtrl.deleteQuestion]},
  {path: '/questions/all/:folderid', httpMethod: 'GET',    middleware: [QuestionCtrl.listQuestion]},
  {path: '/questions/:id',           httpMethod: 'GET',    middleware: [QuestionCtrl.listQuestionOne]},

  //User
  {path: '/users',                   httpMethod: 'POST',   middleware: [UserCtrl.create]},
  {path: '/users/login',             httpMethod: 'POST',   middleware: [UserCtrl.login]},
  {path: '/users/logout',            httpMethod: 'POST',   middleware: [UserCtrl.logout]},
  {path: '/users/:id',               httpMethod: 'PUT',    middleware: [UserCtrl.update]},
  {path: '/users',                   httpMethod: 'GET',    middleware: [UserCtrl.list]}

];

module.exports = routes;