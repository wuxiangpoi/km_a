var iconfont = require('./icon-font/icon-font.less');


//创建编辑器模块
var app = angular.module('qmedia.editor', []);

require('./constants/index')(app);

require('./filters/index')(app);

require('./services/index')(app);

require('./controls/index')(app);

require('./modules/index')(app);

module.exports = app;
