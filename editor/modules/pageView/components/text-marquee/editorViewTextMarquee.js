var tplHtml = require('./editorViewTextMarquee.html');

module.exports = function (app) {

    app.directive('editorViewTextMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                pixelHorizontal: '=',
                pixelVertical: '=',
                data: '='
            },
            link: function (scope, elements, attrs) {
                var maxPixel = scope.pixelHorizontal > scope.pixelVertical ? scope.pixelHorizontal : scope.pixelVertical;
                scope.fontUnit = maxPixel / 1000;

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
                            var seconds = (outerWidth + innerWidth) * 400 / speed / maxPixel;
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