module.exports = function (app) {

    require('./editArea/editorEditArea')(app);

    require('./pageTools/editorPageTools')(app);

    require('./pageProperty/editorPageProperty')(app);

    require('./elementProperty/editorElementProperty')(app);

};