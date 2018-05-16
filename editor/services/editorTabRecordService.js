var elementTabIndex = 0;

var pageTabIndex = 1;

module.exports = function (app) {

    //页签记录服务
    app.service('editorTabRecordService', function () {

        this.getElementTabIndex = function () {
            return elementTabIndex;
        };

        this.setElementTabIndex = function (tabIndex) {
            elementTabIndex = tabIndex;
        };

        this.getPageTabIndex = function () {
            return pageTabIndex;
        };

        this.setPageTabIndex = function (tabIndex) {
            pageTabIndex = tabIndex;
        };

    });

};