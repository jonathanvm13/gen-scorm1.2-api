var Scorm =  require('../controllers/scorm');
    
var routes = [
    {
        path: '/hello',
        httpMethod: 'GET',
        middleware: [Scorm.hello]
    }
];

module.exports = routes;