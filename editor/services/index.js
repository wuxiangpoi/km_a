module.exports = function (app) {

    require('./editorTestService')(app);

    require('./editorResourceService')(app);

    require('./editorRedoUndoService')(app);

    require('./editorTabRecordService')(app);

};