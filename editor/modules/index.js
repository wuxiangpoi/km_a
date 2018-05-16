require('./common.less');

require('./animation.css');

module.exports = function (app) {

    require('./pageThumb/editorPageThumb')(app);

    require('./pageView/editorPageView')(app);
    
    require('./pageEdit/editorPageEdit')(app);

    require('./programEditor/programEditor')(app);

    require('./templateEditor/templateEditor')(app);

};