module.exports = function (app) {

    app.service('editorTestService', ['editorSensitiveWordsConstant', function (sensitiveWords) {

        this.testAnyElementIsEmpty = function (pages) {
            for (var i = 0; i < pages.length; i++) {
                var elements = pages[i].elements;
                for (var j = 0; j < elements.length; j++) {
                    var ele = elements[j];
                    switch (ele.type) {
                        case 160:
                            if (!ele.data.value) {
                                return true;
                            }
                            break;
                        case 250:
                            if (ele.data.images.length === 0) {
                                return true;
                            }
                            break;
                        case 350:
                            if (ele.data.videos.length === 0) {
                                return true;
                            }
                            break;
                        case 900:
                        case 1000:
                        case 1100:
                            if (!ele.data.url) {
                                return true;
                            }
                            break;
                        default:
                            break;
                    }
                }
            }
            return false;
        };

        //获取第一个匹配到的敏感词，如全局未获取，则返回null
        this.getFirstSensitiveWord = function (pages) {
            var word = null;
            pages.forEach(function (page) {
                page.elements.forEach(function (ele) {
                    if (ele.type === 160) {
                        var text = ele.data.value;
                        for (var i = 0, len = sensitiveWords.length; i < len; i++) {
                            if (text.indexOf(sensitiveWords[i]) !== -1) {
                                word = sensitiveWords[i];
                                break;
                            }
                        }
                    }
                });
            });
            return word;
        };

    }]);
};