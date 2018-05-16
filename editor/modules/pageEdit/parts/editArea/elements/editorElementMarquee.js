var tplHtml = require('./editorElementMarquee.html');

module.exports = function (app) {

    app.directive('editorElementMarquee', function () {
        return {
            restrict: 'E',
            replace: true,
            template: tplHtml,
            scope: {
                data: '=',
                originalPixel: '='
            },
            link: function (scope, elements, attrs) {
                var watcher = scope.$watchGroup(['data.isLeft', 'data.speed', 'data.value', 'data.size', 'data.font'], function (args) {
                    var isLeft = args[0], speed = args[1], value = args[2], size = args[3], font = args[4];
                    var outerAnimName = isLeft ? 'marquee-left-container' : 'marquee-right-container';
                    var innerAnimName = isLeft ? 'marquee-left-text' : 'marquee-right-text';
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
