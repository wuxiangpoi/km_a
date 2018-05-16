var tplList = require('./list/tplList.html');
var ctrlList = require('./list/ctrlList');
var tplAdd = require('./add/tplAdd.html');
var ctrlAdd = require('./add/ctrlAdd');
var tplEdit = require('./edit/tplEdit.html');
var ctrlEdit = require('./edit/ctrlEdit');
var tplCopy = require('./copy/tplCopy.html');
var ctrlCopy = require('./copy/ctrlCopy');

module.exports = function (app) {

    app.config(['$stateProvider', function ($stateProvider) {

        // //生产环境路由配置
        // $stateProvider.state('dashboard.programAdd', {
        //     url: '/programAdd',
        //     template: tplAdd,
        //     controller: ctrlAdd
        // }).state('dashboard.programEdit', {
        //     url: '/programEdit/{id}',
        //     template: tplEdit,
        //     controller: ctrlEdit
        // }).state('dashboard.programCopy', {
        //     url: '/programCopy/{id}',
        //     template: tplCopy,
        //     controller: ctrlCopy
        // });

        //节目模块路由
        $stateProvider.state('program.list', {
            url: '/list',
            template: tplList,
            controller: ctrlList
        }).state('program.add', {
            url: '/add',
            template: tplAdd,
            controller: ctrlAdd
        }).state('program.edit', {
            //onExit: ['$state', '$stateParams', function ($state, $stateParams) {
            //    console.log(this);
            //    console.log($state);
            //    console.log($stateParams);
            //}],
            url: '/edit/{id}',
            template: tplEdit,
            controller: ctrlEdit
        }).state('program.copy', {
            url: '/copy/{id}',
            template: tplCopy,
            controller: ctrlCopy
        });

    }]);

};