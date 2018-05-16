var data = [
    {
        "id": 0,
        "name": "系统默认",
        "value": "inherit"
    },
    {
        "id": 1,
        "name": "宋体",
        "value": "SimSun"
    },
    {
        "id": 2,
        "name": "黑体",
        "value": "SimHei"
    },
    {
        "id": 3,
        "name": "微软雅黑",
        "value": "Microsoft YaHei"
    },
    {
        "id": 4,
        "name": "楷体",
        "value": "KaiTi"
    },
    {
        "id": 5,
        "name": "隶书",
        "value": "LiSu"
    },
    {
        "id": 6,
        "name": "幼圆",
        "value": "YouYuan"
    }
];

module.exports = function (app) {

    //定义字体常量
    app.constant('editorFontFamilyConstant', data);

};

