import login from './modules/login/route.js'
import errPage from './modules/errPage/route.js'
import dashboard from './modules/dashboard/route.js'
import home from './modules/home/route.js'
import ledShow from './modules/ledShow/route.js'
import domain from './modules/domain/route.js'
import dictionary from './modules/dictionary/route.js'
import versionfile from './modules/versionfile/route.js'
import authorization from './modules/authorization/route.js'
import boardDealer from './modules/boardDealer/route.js'
import checkModel from './modules/checkModel/route.js'
import checkDealer from './modules/checkDealer/route.js'
import terminal from './modules/terminal/route.js'
import user from './modules/user/route.js'
import role from './modules/role/route.js'
import material from './modules/material/route.js'
import terminalreport from './modules/terminalreport/route.js'
import income from './modules/income/route.js'
import incomedetail from './modules/incomedetail/route.js'
import terminalcommand from './modules/terminalcommand/route.js'
import temp from './modules/temp/route.js'
import terminalmigrate from './modules/terminalmigrate/route.js'
import materialchart from './modules/materialchart/route.js'
import terminalchart from './modules/terminalchart/route.js'

import programRouter from './modules/program/programRouter';
import templateRouter from './modules/template/templateRouter';


const states = [
    dashboard,
    home,
    ledShow,
    domain,
    dictionary,
    versionfile,
    authorization,
    boardDealer,
    checkModel,
    checkDealer,
    terminal,
    user,
    role,
    material,
    terminalreport,
    income,
    incomedetail,
    terminalcommand,
    temp,
    login,
    errPage,
    terminalmigrate,
    materialchart,
    terminalchart,
    programRouter,
    templateRouter
];

export default app => {
    states.forEach(state => {
        state(app);
    });
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', ($stateProvider, $urlRouterProvider, $controllerProvider) => {
        $urlRouterProvider.otherwise('/login');
    }]);
};