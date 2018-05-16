module.exports = function (app) {

    app.filter('editorDateTimeFormatterFilter', ['$filter', function ($filter) {
        var dateFilter = $filter('date');
        return function (time, formatterID) {
            switch (formatterID) {
                case 1:
                    return dateFilter(time, "yyyy年MM月dd日 HH:mm:ss");
                case 2:
                    return dateFilter(time, "yyyy年MM月dd日");
                case 3:
                    return dateFilter(time, "HH:mm:ss");
                case 4:
                    return dateFilter(time, "yyyy年MM月dd日") + " 星期" + "日一二三四五六".substr(time.getDay() % 7, 1);
                default:
                    return dateFilter(time, "yyyy年MM月dd日 HH:mm:ss");
            }
        };
    }]);

};
