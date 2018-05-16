import baseService from './baseService'
import userService from './userService'
import chartService from './chartService'
import sentencesService from './sentencesService'


import dmbdRest from './dmbdRest';
import programService from './programService';
import templateService from './templateService';
import publicTemplateService from './publicTemplateService';
import imageService from './imageService';
import videoService from './videoService';
import audioService from './audioService';
import resourcePathService from './resourcePathService';


const services = [
    baseService,
    userService,
    chartService,
    sentencesService,

    dmbdRest,
    programService,
    templateService,
    publicTemplateService,
    imageService,
    videoService,
    audioService,
    resourcePathService
];


export default app => {
    services.forEach(service => {
        service(app);
    })
};