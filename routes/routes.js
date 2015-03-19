var Scorm =  require('../controllers/scorm');
    
var routes = [
    {
        path: '/scorm',
        httpMethod: 'GET',
        middleware: [Scorm.zipAndDownloadFile]
    }
];

module.exports = routes;