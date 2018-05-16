module.exports = function (app) {

    //背景属性编辑
    require('./background/editorElementPropertyBackground')(app);

    //边框属性编辑
    require('./border/editorElementPropertyBorder')(app);

    //滤镜属性编辑
    require('./filter/editorElementPropertyFilter')(app);

    //布局属性编辑
    require('./layout/editorElementPropertyLayout')(app);

    //轮播属性编辑
    require('./carousel/editorElementPropertyCarousel')(app);

    //图片属性编辑
    require('./image/editorElementPropertyImage')(app);

    //跑马灯属性编辑
    require('./marquee/editorElementPropertyMarquee')(app);

    //多视频属性编辑
    require('./serie/editorElementPropertySerie')(app);

    //流媒体属性编辑
    require('./stream-media/editorElementPropertyStreamMedia')(app);

    //摄像头属性编辑
    require('./camera/editorElementPropertyCamera')(app);

    //文字属性编辑
    require('./text/editorElementPropertyText')(app);

    //文字/走马灯混合体属性编辑
    require('./text-marquee/editorElementPropertyTextMarquee')(app);

    //时间属性编辑
    require('./time/editorElementPropertyTime')(app);

    //视频属性编辑
    require('./video/editorElementPropertyVideo')(app);

    //网页属性编辑
    require('./webview/editorElementPropertyWebview')(app);

};