module.exports = function (app) {

    //定义字体常量
    require('./editorFontFamilyConstant')(app);

    //时间格式化参数
    require('./editorTimeFormatConstant')(app);

    //敏感词
    require('./editorSensitiveWordsConstant')(app);

    //摄像头品牌
    require('./editorBrandsConstant')(app);

};
