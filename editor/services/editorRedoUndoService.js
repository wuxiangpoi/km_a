module.exports = function (app) {

    //撤销/重做服务
    app.service('editorRedoUndoService', function () {
        //记录状态并执行redo方法
        this.saveAndExecRedo = function (redo, undo, $scope) {
            $scope.$emit('undo-redo-save', redo, undo);
        };

    });

};