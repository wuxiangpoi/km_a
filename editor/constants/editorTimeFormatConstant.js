var data = [
    {
        "id": 1,
        "name": "日期和时间"
    },
    {
        "id": 4,
        "name": "日期和星期"
    },
    {
        "id": 2,
        "name": "仅日期"
    },
    {
        "id": 3,
        "name": "仅时间"
    }
];

module.exports = function (app) {

    //时间格式化参数
    app.constant('editorTimeFormatConstant', data);

};