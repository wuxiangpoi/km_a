var config_dev = require('./config.dev.js');
var config_pro = require('./config.pro.js');



var NODE_ENV = process.env.NODE_ENV;

if (NODE_ENV === 'dev') {
    module.exports = config_dev;
} else if (NODE_ENV === 'production') {
    module.exports = config_pro;
}