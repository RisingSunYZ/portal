// 流程公共配置信息
var FlowMainConfig = {
    // 本地环境
    local:{
        flowPath:basePath,     // 流程中心的基本链接
        portalPath:'http://hometest.chinayasha.com', // 企业门户地址
        filePath:imgBasePath,   // 静态服务器地址
        fileViewPath:'http://hometest.chinayasha.com/common/fileOnline.jhtml' // IDM退出地址
    },
    // 开发环境
    dev:{
        flowPath:basePath,     // 流程中心的基本链接
        portalPath:'http://hometest.chinayasha.com',
        filePath:imgBasePath,
        fileViewPath:'http://hometest.chinayasha.com/common/fileOnline.jhtml'
    },
    // 测试环境
    test:{
        flowPath:basePath,     // 流程中心的基本链接
        portalPath:'http://hometest.chinayasha.com',
        filePath:imgBasePath,
        fileViewPath:'http://hometest.chinayasha.com/common/fileOnline.jhtml'
    },
    // 生产环境
    prod:{
        flowPath:basePath,     // 流程中心的基本链接
        portalPath:'http://home.chinayasha.com',
        filePath:imgBasePath,
        fileViewPath:'http://home.chinayasha.com/common/fileOnline.jhtml'
    }
}

// 获取配置
function getFlowConf(){
    try{
        return FlowMainConfig[flowEvn];
    }catch (e){
        return FlowMainConfig['test'];
    }

}