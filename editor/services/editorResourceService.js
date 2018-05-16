import {max, unique} from '../../libs/array';

//处理节目中的资源
var handleResourcesFromPages = (function () {
    return function (pages, imageHandler, videoHandler, audioHandler) {
        pages.forEach(function (page) {
            switch (page.ver) {
                case 1:
                    handleImageFromBackground(page.background, imageHandler);
                    handleAudioFromMusic(page.music, audioHandler);
                    page.elements.forEach(function (ele) {
                        switch (ele.ver) {
                            case 1:
                                handleImageFromBackground(ele.background, imageHandler);
                                handleResourceFromElement(ele.type, ele.data, imageHandler, videoHandler);
                                break;
                            default :
                                break;
                        }
                    });
                    break;
                default :
                    break;
            }
        });
    };

    function handleImageFromBackground(background, handler) {
        switch (background.ver) {
            case 1:
                if (background.type === 2 && background.image) {
                    handler(background.image);
                }
                break;
            default :
                break;
        }
    }

    function handleAudioFromMusic(music, handler) {
        if (music) {
            switch (music.ver) {
                case 1:
                    handler(music);
                    break;
                default :
                    break;
            }
        }
    }

    function handleResourceFromElement(type, data, imageHandler, videoHandler) {
        switch (type) {
            case 200:
                handleImageFromImage(data, imageHandler);
                break;
            case 250:
                handleImageFromCarousel(data, imageHandler);
                break;
            case 300:
                handleVideoFromVideo(data, videoHandler);
                break;
            case 350:
                handleVideoFromSerie(data, videoHandler);
                break;
            default :
                break;
        }
    }

    function handleImageFromImage(data, handler) {
        switch (data.ver) {
            case 1:
                if (data.image) {
                    handler(data.image);
                }
                break;
            default :
                break;
        }
    }

    function handleImageFromCarousel(data, handler) {
        switch (data.ver) {
            case 1:
                data.images.forEach(handler);
                break;
            default :
                break;
        }
    }

    function handleVideoFromVideo(data, handler) {
        switch (data.ver) {
            case 1:
                if (data.video) {
                    handler(data.video);
                }
                break;
            default :
                break;
        }
    }

    function handleVideoFromSerie(data, handler) {
        switch (data.ver) {
            case 1:
                data.videos.forEach(handler);
                break;
            default :
                break;
        }
    }
})();

//转换播放时长
function transformDuration(durationStr) {
    var arr = durationStr.split(':');
    var arr2 = arr.map(function (item) {
        return window.parseInt(item, 10);
    });
    return arr2[0] * 3600 + arr2[1] * 60 + arr2[2];
}

module.exports = function (app) {

    app.service('editorResourceService', function () {

        //从节目页面（场景）集合中获取去除重复后的资源列表
        this.getResourcePathsFromPages = function (pages) {
            var paths = [];

            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        paths.push(image.path);
                        break;
                    default :
                        paths.push(image);
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        paths.push(video.path);
                        break;
                    default :
                        paths.push(video);
                        break;
                }
            }, function (audio) {
                switch (audio.ver) {
                    case 1:
                        paths.push(audio.path);
                        break;
                    default :
                        paths.push(audio);
                        break;
                }
            });

            return unique(paths);
        };

        //添加资源中标识符以外的属性
        this.setResourcePropertyWithoutPathToPages = function (pages, pathMaps) {
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        var info = pathMaps[image.path];
                        if (info) {
                            image.name = info.name;
                            image.size = info.size;
                            image.mime = info.mime;
                            image.width = info.width;
                            image.height = info.height;
                            image.createTime = info.createTime;
                            image.url = info.url;
                        }
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        var info = pathMaps[video.path];
                        if (info) {
                            video.name = info.name;
                            video.duration = transformDuration(info.duration);
                            video.size = info.size;
                            video.bitrate = info.bitrate;
                            video.mime = info.mime;
                            video.ac = info.ac;
                            video.vc = info.vc;
                            video.width = info.width;
                            video.height = info.height;
                            video.createTime = info.createTime;
                            video.url = info.url;
                            video.snapshot = info.snapshot;
                        }
                        break;
                    default :
                        break;
                }
            }, function (audio) {
                switch (audio.ver) {
                    case 1:
                        var info = pathMaps[audio.path];
                        if (info) {
                            audio.name = info.name;
                            audio.duration = transformDuration(info.duration);
                            audio.size = info.size;
                            audio.bitrate = info.bitrate;
                            audio.mime = info.mime;
                            audio.ac = info.ac;
                            audio.createTime = info.createTime;
                            audio.url = info.url;
                        }
                        break;
                    default :
                        break;
                }
            });
        };

        //删除资源中标识符以外的属性
        this.deleteResourcePropertyWithoutPathFromPages = function (pages) {
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        delete image.name;
                        delete image.size;
                        delete image.mime;
                        delete image.width;
                        delete image.height;
                        delete image.createTime;
                        delete image.url;
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        delete video.name;
                        delete video.duration;
                        delete video.size;
                        delete video.bitrate;
                        delete video.mime;
                        delete video.ac;
                        delete video.vc;
                        delete video.width;
                        delete video.height;
                        delete video.createTime;
                        delete video.url;
                        delete video.snapshot;
                        break;
                    default :
                        break;
                }
            }, function (audio) {
                switch (audio.ver) {
                    case 1:
                        delete audio.name;
                        delete audio.duration;
                        delete audio.size;
                        delete audio.bitrate;
                        delete audio.mime;
                        delete audio.ac;
                        delete audio.createTime;
                        delete audio.url;
                        delete audio.md5;
                        break;
                    default :
                        break;
                }
            });
        };

        //从节目页面（场景）集合中获取去除重复后的资源总数
        this.getResourceCountFromPages = function (pages) {
            return this.getResourcePathsFromPages(pages).length;
        };

        //从节目页面（场景）集合中获取去除重复后的资源总大小
        this.getResourceTotalSizeFromPages = function (pages) {
            var resources = [];
            handleResourcesFromPages(pages, function (image) {
                switch (image.ver) {
                    case 1:
                        resources.push({
                            path: image.path,
                            size: image.size
                        });
                        break;
                    default :
                        break;
                }
            }, function (video) {
                switch (video.ver) {
                    case 1:
                        resources.push({
                            path: video.path,
                            size: video.size
                        });
                        break;
                    default :
                        break;
                }
            }, function (audio) {
                switch (audio.ver) {
                    case 1:
                        resources.push({
                            path: audio.path,
                            size: audio.size
                        });
                        break;
                    default :
                        break;
                }
            });
            //去重复
            resources = unique(resources, function (item) {
                return item.path;
            });

            var totalSize = 0;
            resources.forEach(function (item) {
                totalSize += item.size;
            });
            return totalSize;
        };

        //计算场景建议播放时长
        this.getPageSuggestTime = function (page) {
            var elementsSeconds = [];
            page.elements.forEach(function (ele) {
                if (ele.type === 250) {//多图片轮播
                    if (ele.data.images.length > 1) {
                        var duration = ele.data.disableAnimation ? 0 : ele.data.duration / 1000;
                        var sec1 = (duration + ele.data.stay) * ele.data.images.length;
                        if (sec1 !== 0) {
                            elementsSeconds.push(Math.round(sec1));
                        }
                    }
                } else if (ele.type === 350) {//多视频
                    var sec2 = 0;
                    ele.data.videos.forEach(function (video) {
                        sec2 += video.duration;
                    });
                    if (sec2 !== 0) {
                        elementsSeconds.push(Math.round(sec2));
                    }
                } else if (ele.type === 150) {
                    var sec3 = (ele.layout.width / 100 + ele.data.value.length * ele.data.size / 1000) * 400 / ele.data.speed;
                    if (sec3 !== 0) {
                        elementsSeconds.push(Math.round(sec3));
                    }
                }
            });

            if (elementsSeconds.length === 0) {
                return 60;
            } else {
                return max(elementsSeconds);
            }
        };

        //计算节目播放总时长
        this.getPagesTotalTime = function (pages) {
            var total_time = 0;
            pages.forEach(function (page) {
                total_time += page.stay;
            });
            return total_time;
        };

    });
};
