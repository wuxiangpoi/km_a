var tplHtml = require('./editorElementTextMarquee.html');

module.exports = function (app) {

    app.directive('editorElementTextMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '=',
                backGround: '=',
                originalPixel: '='
            },
            link: function (scope, elements, attrs) {
                var watcher = scope.$watchGroup(['data.speed', 'data.value', 'data.size', 'data.font'], function (args) {
                    var speed = args[0], value = args[1], size = args[2], font = args[3];
                    var outerAnimName = 'marquee-left-container';
                    var innerAnimName = 'marquee-left-text';
                    //marqueeDOM.clientWidth
                    window.setTimeout(function () {
                        var outerWidth = elements[0].clientWidth;
                        var innerWidth = elements.find('span')[0].clientWidth;
                        //console.log(outerWidth, innerWidth);
                        scope.$apply(function () {
                            var seconds = (outerWidth + innerWidth) * 400 / speed / scope.originalPixel;
                            scope.outerAnimationStyle = outerAnimName + ' ' + seconds + 's linear infinite';
                            scope.innerAnimationStyle = innerAnimName + ' ' + seconds + 's linear infinite';
                        });
                    }, 0);
                });

                //销毁时清除
                scope.$on('$destroy', function () {
                    watcher();//清除监视
                });
            }
        };
    });

};
