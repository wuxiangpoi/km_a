module.exports = function (app) {

    app.filter('editorElementFilterStyle', function () {
        return function (filter) {
            switch (filter.ver) {
                case 1:
                    var filter_strs = [];
                    (function () {
                        if (filter.opacity !== 100) {//不透明
                            filter_strs.push('opacity(' + filter.opacity + '%)');
                        }
                        if (filter.brightness !== 100) {//亮度
                            filter_strs.push('brightness(' + filter.brightness + '%)');
                        }
                        if (filter.contrast !== 100) {//对比度
                            filter_strs.push('contrast(' + filter.contrast + '%)');
                        }
                        if (filter.saturate !== 100) {//饱和度
                            filter_strs.push('saturate(' + filter.saturate + '%)');
                        }
                        if (filter.grayscale !== 0) {//灰度
                            filter_strs.push('grayscale(' + filter.grayscale + '%)');
                        }
                        if (filter.invert !== 0) {//反色
                            filter_strs.push('invert(' + filter.invert + '%)');
                        }
                        if (filter.blur !== 0) {//模糊
                            filter_strs.push('blur(' + filter.blur * 16 / 10 + 'px)');
                        }
                        if (filter.hueRotate % 360 !== 0) {//色相旋转
                            filter_strs.push('hue-rotate(' + filter.hueRotate + 'deg)');
                        }
                    })();
                    return {'filter': filter_strs.join(' ')};
                default:
                    return {};
            }
        };
    });

};
