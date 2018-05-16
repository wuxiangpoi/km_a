var tplHtml = require('./editorPageView.html');

var less = require('./editorPageView.less');

module.exports = function (app) {

    require('./components/index.less');
    require('./components/index')(app);

    //页面预览指令
    app.directive('editorPageView', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                //size: '=',
                //programSize: '=',
                page: '='
            },
            link: function (scope, elements, attrs) {
                var dom = elements[0];
                var parentDOM = dom.parentNode;

                function autoComputeSize() {
                    var pWidth = parentDOM.clientWidth;//20间距
                    var pHeight = parentDOM.clientHeight;//20间距
                    var hSize = scope.pixelHorizontal;
                    var vSize = scope.pixelVertical;

                    if (hSize / vSize > pWidth / pHeight) {
                        scope.scale = pWidth / hSize;
                    } else {
                        scope.scale = pHeight / vSize;
                    }
                }

                function resize() {
                    scope.$apply(function () {
                        autoComputeSize();
                    });
                }

                //autoComputeSize();
                var timer = window.setTimeout(resize, 0);

                window.addEventListener('resize', resize, false);

                scope.$on('resize', function () {
                    autoComputeSize();
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', resize, false);
                    if (timer) {
                        window.clearTimeout(timer);
                        timer = null;
                    }
                });

            }
        };
    });

};
