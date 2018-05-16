module.exports = function (app) {

    //视频URL安全处理
    require('./editorVideoURLSCEFilter')(app);

    //背景图片平铺
    require('./editorContainBackgroundFilter')(app);

    //背景图片铺满
    require('./editorFullBackgroundFilter')(app);

    //字体过滤器
    require('./editorFontFamilyFilter')(app);

    //日期格式过滤器
    require('./editorDateTimeFormatterFilter')(app);

    //跨域安全路径过滤器
    require('./editorTrustAsResourceUrl')(app);

    //四舍五入过滤器
    require('./editorMathRoundFilter')(app);

    require('./editorOSSImageUrlResizeFilter')(app);


    //ng-style 样式过滤器
    require('./editorElementFilterStyle')(app);

    require('./editorElementLayoutStyle')(app);

    require('./editorElementBorderStyle')(app);

    require('./editorElementBackgroundStyle')(app);

    require('./editorPageThumbBackgroundStyle')(app);

    require('./editorPageViewBackgroundStyle')(app);

    require('./editorProgramThumbStyle')(app);

    require('./editorProgramViewStyle')(app);

    require('./editorTypeDescribe')(app);

    //,,,,,

    require('./editorViewTimeStyle')(app);

    require('./editorViewTextMarqueeStyle')(app);

    require('./editorHlsUrlFilter')(app);

};
