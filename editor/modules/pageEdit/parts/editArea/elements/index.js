var css = require('./elements.css');

module.exports = function (app) {

    //背景视图
    require('./editorElementBackground')(app);

    //边框视图
    require('./editorElementBorder')(app);

    //轮播图指令
    require('./editorElementCarousel')(app);

    //拖拽元素
    require('./editorElementDragger')(app);

    //滤镜视图
    require('./editorElementFilter')(app);

    //网格视图
    require('./editorElementGridding')(app);

    //图片视图
    require('./editorElementImage')(app);

    //布局视图
    require('./editorElementLayout')(app);

    //尺寸标记
    require('./editorElementMark')(app);

    //跑马灯视图
    require('./editorElementMarquee')(app);

    //多视频指令
    require('./editorElementSerie')(app);


    //流媒体视图
    require('./editorElementStreamMedia')(app);

    //摄像头
    require('./editorElementCamera')(app);

    //文字视图
    require('./editorElementText')(app);

    //文字/走马灯混合体
    require('./editorElementTextMarquee')(app);

    //时间视图
    require('./editorElementTime')(app);

    //3D变换视图
    require('./editorElementTransform')(app);

    //视频视图
    require('./editorElementVideo')(app);

    //网页视图
    require('./editorElementWebview')(app);
};
