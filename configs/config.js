var config_dev = require('./config.dev');
var config_test = require('./config.test');
var config_dep = require('./config.dep');

//var NODE_ENV = process.env.NODE_ENV;

//console.log(NODE_ENV);

// if (NODE_ENV === 'dev') {
//     module.exports = config_dev;
// } else if (NODE_ENV === 'test') {
//     module.exports = config_test;
// } else {
//     module.exports = config_dep;
// }

module.exports = config_dev;