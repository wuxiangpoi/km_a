import login from './modules/login/route.js'
import errPage from './modules/errPage/route.js'
import dashboard from './modules/dashboard/route.js'
import home from './modules/home/route.js'
import domain from './modules/domain/route.js'
import dictionary from './modules/dictionary/route.js'
import versionfile from './modules/versionfile/route.js'
import checkModel from './modules/checkModel/route.js'
import terminal from './modules/terminal/route.js'
import terminalreport from './modules/terminalreport/route.js'
import terminalcommand from './modules/terminalcommand/route.js'
import terminalmigrate from './modules/terminalmigrate/route.js'

const states = [dashboard, home,domain,dictionary,versionfile,checkModel, terminal, terminalreport,terminalcommand, login,errPage,terminalmigrate]

export default app => {
    states.forEach(state => {
        state(app);
    })
    app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider',($stateProvider, $urlRouterProvider, $controllerProvider) => {
        $urlRouterProvider.otherwise('/login');
    }])
};