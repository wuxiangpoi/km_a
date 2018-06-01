export let tempResolution = [{
    val: '',
    name: '屏幕分辨率'
},
{
    val: '1920*1080',
    name: '1920*1080'
},
{
    val: '1080*1920',
    name: '1080*1920'
},{
    val: '1366*768',
    name: '1366*768'
},
{
    val: '768*1366',
    name: '768*1366'
},{
    val: '1024*768',
    name: '1024*768'
},
{
    val: '768*1024',
    name: '768*1024'
}]
export let payTypeOptions = [{
    val: '',
    name: '请选择收费方式'
},
{
    val: 0,
    name: '终端'
},
{
    val: 1,
    name: '门店'
}]
export let hasProgramOptions = [{
        val: '',
        name: '节目状态'
    },
    {
        val: 1,
        name: '有节目'
    },
    {
        val: 0,
        name: '无节目'
    }
]
export let terminalStatusOptions = [{
        val: '',
        name: '终端状态'
    },
    {
        val: 1,
        name: '在线'
    },
    {
        val: 2,
        name: '离线'
    },
    {
        val: 3,
        name: '异常'
    }
]
export let opOptions = [{
        val: '',
        name: '系统类型'
    },
    {
        val: 1,
        name: 'android'
    },
    {
        val: 2,
        name: 'windows'
    },
]
export let materialsTypeOptions = [{
        val: '',
        name: '素材类型'
    },
    {
        val: 0,
        name: '图片'
    },
    {
        val: 1,
        name: '视频'
    },
    {
        val: 2,
        name: '音乐'
    }
]
export let domainStatusOptions = [{
        val: '',
        name: '企业状态'
    },
    {
        val: 1,
        name: '正常'
    },
    {
        val: 0,
        name: '冻结'
    }
]
export let sendStatusOptions = [{
        val: '',
        name: '下发状态'
    },
    {
        val: 0,
        name: '正在下发'
    },
    {
        val: 1,
        name: '下发成功'
    },
    {
        val: 2,
        name: '下发失败'
    }
]
export let cmdCodeOptions = [{
        val: '',
        name: '下发命令'
    },
    {
        val: 7,
        name: '终端截屏'
    },
    {
        val: 8,
        name: '获取终端信息'
    },
    {
        val: 9,
        name: '终端初始化'
    },
    {
        val: 31,
        name: '终端App升级'
    },
    {
        val: 23,
        name: '紧急通知'
    }
]
export let materialTypeOptions = [{
        val: '',
        name: '审核类型'
    },
    {
        val: 0,
        name: '素材'
    },
    {
        val: 1,
        name: '节目'
    },
]
export let materialStatusOptions = [{
        val: '',
        name: '审核状态'
    },
    {
        val: 0,
        name: '待审核'
    },
    {
        val: 1,
        name: '审核通过'
    },
    {
        val: 5,
        name: '审核不通过'
    }
]
export let scheduleStatusOptions = [{
        val: '',
        name: '审核状态'
    },
    {
        name: '待提交审核',
        val: 0
    },
    {
        name: '审核通过',
        val: 1
    },
    {
        name: '审核中',
        val: 2
    },
    {
        name: '审核不通过',
        val: 4
    }
]