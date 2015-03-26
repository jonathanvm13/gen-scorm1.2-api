var Scorm =  require('../controllers/scorm');
    
var routes = [
    {
        path: '/scorm',
        httpMethod: 'POST',
        middleware: [Scorm.zipAndDownloadFile]
    }
];

module.exports = routes;