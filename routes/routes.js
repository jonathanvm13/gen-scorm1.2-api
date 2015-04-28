var Scorm =  require('../controllers/scorm');
    
var routes = [
    {
        path: '/scorm/',
        httpMethod: 'POST',
        middleware: [Scorm.zipAndDownloadFile]
    },
    {
        path: '/scorm/',
        httpMethod: 'PUT',
        middleware: [Scorm.update]
    },
    {
        path: '/scorm/download',
        httpMethod: 'GET',
        middleware: [Scorm.Download]
    }
];

module.exports = routes;