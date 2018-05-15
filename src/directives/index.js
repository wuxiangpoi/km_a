import headerBar from './headerBar'
import siderBar from './siderBar'
import kmSelect from './kmSelect'
import eCharts from './eCharts'
import eChartMeter from './eChartMeter'
import eChartMap from './eChartMap'
import meInclude from './meInclude'
import meLazyload from './me-lazyload.js'
import cityPicker from './cityPicker'
import upload from './upload'
import zTree from './zTree.js'
import imageView from './imageView'

const directives = [headerBar,siderBar,kmSelect,eCharts,eChartMeter,eChartMap,meInclude,meLazyload,cityPicker,upload,zTree,imageView]
    
export default app => {
    directives.forEach(directive => {
        directive(app);
    })
}