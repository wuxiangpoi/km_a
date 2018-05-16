var tplHtml = require('./editorElementPropertyStreamMedia.html');

module.exports = function (app) {

    app.directive('editorElementPropertyStreamMedia', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '='
            },
            controller: ['$scope', 'editorRedoUndoService', function ($scope, editorRedoUndoService) {

                //当URL变化时
                $scope.urlChange = function (newVal, oldVal) {
                    var data = $scope.data;

                    editorRedoUndoService.saveAndExecRedo(function () {
                        data.url = newVal;
                    }, function () {
                        data.url = oldVal;
                    }, $scope);
                };


                (function () {

                    function isWin64() {
                        var agent = navigator.userAgent.toLowerCase();
                        return (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0)
                    }

                    function isWindows() {
                        var platform = navigator.platform;
                        return (platform === "Win32")
                            || (platform === "Windows");
                    }

                    function isMacOS() {
                        var platform = navigator.platform;
                        return (platform === "Mac68K")
                            || (platform === "MacPPC")
                            || (platform === "Macintosh")
                            || (platform === "MacIntel");
                    }

                    if (isWindows()) {
                        if (isWin64()) {
                            $scope.downloadurl = 'http://cdn-public.q-media.cn/vlc_x64.zip';
                        } else {
                            $scope.downloadurl = 'http://cdn-public.q-media.cn/vlc_x86.zip';
                        }
                    } else if (isMacOS()) {
                        $scope.downloadurl = 'http://cdn-public.q-media.cn/vlc.dmg';
                    } else {
                        $scope.downloadurl = '';
                    }

                })();

            }]
        };
    });

};
