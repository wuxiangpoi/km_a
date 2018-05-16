var less = require('./index.less');

module.exports = function (app) {

    //单图片选择控件
    require('./image-selector/editorControlImageSelector')(app);

    //多图片选择控件
    require('./multiple-image-viewer/editorControlMultipleImageViewer')(app);

    //多视频选择控件
    require('./multiple-video-viewer/editorControlMultipleVideoViewer')(app);

    //分辨率选择器
    require('./pixel-selector/editorPixelSelector')(app);

    //快捷键提示
    require('./hotkeys-tip/editorControlHotkeysTip')(app);

    //范围拖动控件
    require('./range/editorControlRange')(app);

    //多行文本框
    require('./textarea/editorControlTextArea')(app);

    //双向绑定开关
    require('./switcher/editorControlSwitcher')(app);

    //单视频选择控件
    require('./video-selector/editorControlVideoSelector')(app);

    //视频封面图及点击播放（优化用）
    require('./video-viewer/editorControlVideoViewer')(app);

    //音频封面及点击播放（优化用）
    require('./audio-viewer/editorControlAudioViewer')(app);

    //字体选择
    require('./font/editorControlFont')(app);

    //RGB颜色选择
    require('./rgb-color/editorControlRgbColor')(app);

    //边框样式选择
    require('./border-style/editorControlBorderStyle')(app);

    //日期格式选择
    require('./time-formatter/editorControlTimeFormatter')(app);

    //是否滚动选框
    require('./is-scroll/editorControlIsScroll')(app);

    //动画选择
    require('./animation/editorControlAnimation')(app);

    //水平对齐
    require('./align-horizontal/editorControlAlignHorizontal')(app);

    //垂直对齐
    require('./align-vertical/editorControlAlignVertical')(app);

    //水平方向
    require('./direction-horizontal/editorControlDirectionHorizontal')(app);

    //单行/多行
    require('./is-multiple/editorControlIsMultiple')(app);

    //背景图片类型
    require('./background-tytpe/editorControlBackgroundType')(app);

    //布局对齐
    require('./layout-align/editorControlLayoutAlign')(app);

    //摄像头品牌
    require('./camera-brand/editorControlCameraBrand')(app);

    //码流
    require('./bit-stream/editorControlBitStream')(app);

    //简单背景选择控件
    require('./simple-background/editorControlSimpleBackground')(app);

};
