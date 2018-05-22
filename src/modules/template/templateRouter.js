var tplList = require('./list/tplList.html');
var ctrlList = require('./list/ctrlList');

var tplAdd = require('./add/tplAdd.html');
var ctrlAdd = require('./add/ctrlAdd');

var tplEdit = require('./edit/tplEdit.html');
var ctrlEdit = require('./edit/ctrlEdit');

module.exports = function (app) {

    app.config(['$stateProvider', function ($stateProvider) {

        //生产环境路由配置
        $stateProvider.state('dashboard.templateList', {
            url: '/templateList',
            info: '模板管理',
            template: tplList,
            controller: ctrlList
        }).state('dashboard.templateAdd', {
            url: '/templateAdd',
            template: tplAdd,
            controller: ctrlAdd
        }).state('dashboard.templateEdit', {
            url: '/templateEdit/{id}',
            template: tplEdit,
            controller: ctrlEdit
        });
        

        // //模板模块路由
        // $stateProvider.state('template.list', {
        //     url: '/list',
        //     template: tplList,
        //     controller: ctrlList
        // }).state('template.add', {
        //     url: '/add',
        //     template: tplAdd,
        //     controller: ctrlAdd
        // }).state('template.edit', {
        //     url: '/edit/{id}',
        //     template: tplEdit,
        //     controller: ctrlEdit
        // });

    }]);

};