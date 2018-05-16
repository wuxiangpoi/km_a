var remove = require('../../../../libs/array').remove;

module.exports = [
    '$scope',
    '$state',
    'dialogService',
    'programService',
    function ($scope,
              $state,
              dialogService,
              programService) {

        //根据ID预览节目
        $scope.programPreviewById = dialogService.openProgramPreviewDialogById;

        $scope.pageSize = 12;
        $scope.pageIndex = 0;
        $scope.recordCount = 0;
        $scope.doPaging = doPaging;

        doPaging(0);//默认打开第一页

        //执行翻页动作
        function doPaging(pageIndex) {
            var data = {
                pageSize: $scope.pageSize,
                pageIndex: pageIndex
            };
            programService.getProgramList(data, function (data, recordCount) {
                $scope.recordCount = recordCount;
                $scope.pageIndex = pageIndex;
                $scope.programs = data;
            });
        }

        //删除节目
        $scope.deleteProgram = function (program) {
            layer.confirm('确定删除该节目吗？', {
                btn: ['确定', '取消']
            }, function () {
                programService.deleteProgramById(program.id, function (result) {
                    remove($scope.programs, program);
                    layer.msg('已删除该节目！');
                });
            });
        };

    }];