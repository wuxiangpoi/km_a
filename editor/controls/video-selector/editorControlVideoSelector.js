var tplHtml = require('./editorControlVideoSelector.html');

module.exports = function (app) {

    app.directive('editorControlVideoSelector', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                video: '=',
                onChange: '&'
            },
            controller: ['$scope', function ($scope) {

                //添加视频
                $scope.insertVideo = function () {
                    $scope.$emit('on-select-single-video', null, function (video) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: video,
                                oldVal: null
                            });
                        }
                        $scope.video = video;
                    });
                };

                //更换视频
                $scope.updateVideo = function () {
                    var oldVideo = $scope.video;
                    $scope.$emit('on-select-single-video', oldVideo, function (video) {
                        if ($scope.onChange) {
                            $scope.onChange({
                                newVal: video,
                                oldVal: oldVideo
                            });
                        }
                        $scope.video = video;
                    });
                };

                //删除视频
                $scope.deleteVideo = function () {
                    if ($scope.onChange) {
                        $scope.onChange({
                            newVal: null,
                            oldVal: $scope.video
                        });
                    }
                    $scope.video = null;
                };
            }]
        };
    });

};
