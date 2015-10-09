var env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    apiUrl: "http://localhost:4000"
  },
  production: {
    apiUrl: "http://104.131.58.229:4000"
  }
};

module.exports = config[env];
