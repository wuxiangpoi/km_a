module.exports = function (app) {

    require('./carousel/editorViewCarousel')(app);

    require('./serie/editorViewSerie')(app);

    require('./time/editorViewTime')(app);

    require('./webview/editorViewWebview')(app);

    require('./stream/editorViewStream')(app);

    require('./camera/editorViewCamera')(app);

    require('./text-marquee/editorViewTextMarquee')(app);

};
