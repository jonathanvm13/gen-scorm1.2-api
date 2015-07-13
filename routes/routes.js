var Scorm = require('../controllers/scorm'),
  UserCtrl = require('../controllers/user'),
  QuestionCtrl = require('../controllers/question'),
  FolderCtrl = require('../controllers/folder');

var routes = [

  //Scorm
  {path: '/scorm/', httpMethod: 'POST', middleware: [Scorm.zipAndDownloadFile]},
  {path: '/scorm/', httpMethod: 'PUT', middleware: [Scorm.update]},
  {path: '/scorm/download', httpMethod: 'GET', middleware: [Scorm.Download]},
  {path: '/scorm/uploadfiles', httpMethod: 'POST', middleware: [Scorm.uploadFiles]},

  // Folder
  {path: '/folder', httpMethod: 'POST', middleware: [FolderCtrl.create]},
  {path: '/folder/:id', httpMethod: 'PUT', middleware: [FolderCtrl.update]},
  {path: '/folder/:id', httpMethod: 'DELETE', middleware: [FolderCtrl.delete]},
  {path: '/folder/:userid', httpMethod: 'GET', middleware: [FolderCtrl.list]},

  //Question
  {path: '/question', httpMethod: 'POST', middleware: [QuestionCtrl.createQuestion]},
  {path: '/question/:id', httpMethod: 'PUT', middleware: [QuestionCtrl.updateQuestion]},
  {path: '/question/:id', httpMethod: 'DELETE', middleware: [QuestionCtrl.deleteQuestion]},
  {path: '/question/all/:folderid', httpMethod: 'GET', middleware: [QuestionCtrl.listQuestion]},
  {path: '/question/:id', httpMethod: 'GET', middleware: [QuestionCtrl.listQuestionOne]},

  //User
  {path: '/user', httpMethod: 'POST', middleware: [UserCtrl.create]},
  {path: '/user/login', httpMethod: 'POST', middleware: [UserCtrl.login]},
  {path: '/user/logout', httpMethod: 'POST', middleware: [UserCtrl.logout]},
  {path: '/user/:id', httpMethod: 'PUT', middleware: [UserCtrl.update]},
  {path: '/user', httpMethod: 'GET', middleware: [UserCtrl.list]}

];

module.exports = routes;