module.exports = function (app) {

    //基本属性编辑
    require('./page/editorPagePropertyBasic')(app);

    //背景属性编辑
    require('./background/editorPagePropertyBackground')(app);

    //背景音乐编辑
    require('./music/editorPagePropertyMusic')(app);

};