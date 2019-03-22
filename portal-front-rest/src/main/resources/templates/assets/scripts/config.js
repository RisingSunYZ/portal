// 公共配置信息
var MainConfig = {
    // 配置当前所属环境
    evn:/mos\.chinayasha\.com/.test(window.location.host)?'prod':/mostest\.chinayasha\.com/.test(window.location.host)?'test':/10\.10\.20\.41|10\.10\.20\.235/.test(window.location.host)?'dev':'local',
    // 本地环境
    local:{
        idmLogin:false,     // 是否启用IDM登录
        portalUrl:'http://home.chinayasha.com', // 企业门户地址
        staticBasePath:'http://10.10.20.204',   // 静态服务器地址
        idmLogoutUrl:'' // IDM退出地址
    },
    // 开发环境
    dev:{
        idmLogin:false,
        portalUrl:'http://hometest.chinayasha.com',
        staticBasePath:'http://10.10.20.204',
        idmLogoutUrl:'https://idmtest.chinayasha.com:8443/siam/logout'
    },
    // 测试环境
    test:{
        idmLogin:true,
        portalUrl:'http://hometest.chinayasha.com',
        staticBasePath:'http://10.10.20.204',
        idmLogoutUrl:'https://idmtest.chinayasha.com:8443/siam/logout'
    },
    // 生产环境
    prod:{
        idmLogin:true,
        portalUrl:'http://home.chinayasha.com',
        staticBasePath:'http://file.chinayasha.com',
        idmLogoutUrl:'https://siam.chinayasha.com:8443/siam/logout'
    }
}