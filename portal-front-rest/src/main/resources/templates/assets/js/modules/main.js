
    var main = {
        currentTab : null,
        sysTab : null,
        mainTab : null,
        mainCompany : null,
        leftTree : null,
        loginData : null,
        systemTitle : null,
        checkLoginTimer:null,
        init:function(){
            if(window.top!=window.self){//不存在父页面
                window.top.location.href=location.href;
            }
            // 集成IDM登录
            if(getConf().idmLogin){
                this.checkLogin();
            }

            mini.parse();
            this.sysTab=mini.get('jsMenuTabs');
            this.mainTab= mini.get('jsMainSys');
            this.mainContentBox= mini.get('jsMainContentBox');
            this.mainCompany=mini.get('jsChangeCompany');
            this.leftTree=mini.get('leftTree');
            this.leftTree.on('preload', function (e) {
                $.each(e.result.data, function (i, o) {
                    o.url = basePath + o.url;
                });
            });
            this.switchLeftBar = $('#jsSwitchLeftBar');

            this.bindEvent();
            // 加载信使类
            this.loadMessenger();
            // 加载系统配置
            // this.getSysConfigs();


        },

        onSkinChange:function(skin) {
            mini.Cookie.set('miniuiSkin', skin);
            //mini.Cookie.set('miniuiSkin', skin, 100);//100天过期的话，可以保持下次登录也是切换后的效果
            window.location.reload()
        },
        // 验证登录
        checkLogin:function(){
            main.checkHeart(false);
        },
        // 验证登录状态
        checkHeart:function(async){
            var siamTgt = cookieOpt('SIAMTGT');
            var _this = this;
            if(siamTgt){
            }else{
                siamTgt = getQueryString('siamTgt');
            }
            if(siamTgt){
                $.POST({
                    url:'/checkLogin', data:{siamTgt:siamTgt}, async:async, success:function(dt, textStatus, request){
                        if(dt.responseCode == 100){
                            cookieOpt('sid', request.getResponseHeader('sessionId'), {path:'/'});
                            //cookieOpt('SIAMTGT', siamTgt, {path:'/'});
                        }else{
                            _this.checkLoginTimer?clearInterval(_this.checkLoginTimer):{};
                            top.window.location.href = getConf().portalUrl+"/main.jhtml";
                        }
                    }
                });
            }else{
                location.href = getConf().portalUrl+"/main.jhtml";
            }
        },
        loadUserInfo:function (user) {
            // var src = (!data.user.image)?"/a/img/main/default-user-head.jpg":'data:image/jpg;base64,'+data.user.image;
          //  $('#jsLoginUserHeadImg').attr('src', getConf().portalUrl + '/website/tools/fileUpload/getPersonHeadImg.jhtml?no='+user.username);
            $('#jsLoginUserName').text(user);
        },
        getSysConfigs:function(){
            $.GET({
                url:'/managment/frame/getSysConfig', success:function(dt){
                    if(dt){
                        if(dt.sysConfigs){
                            var title = 'MOS - 管理系统';
                            $.each(dt.sysConfigs, function(i, o){
                                if(o.configKey == 'logo'){
                                    if(o.image) $('#jsLogoImage').attr('src', "data:image/jpg;base64,"+o.image);
                                }
                                if(o.configKey == 'company_name'){
                                    if(o.configValue) {
                                        $('#jsFooterCompanName').text(o.configValue);
                                        title = o.configValue;
                                    }
                                }
                                if(o.configKey == 'plain_name'){
                                    if(o.configValue) {
                                        $('#jsFooterPlatName').text(o.configValue);
                                        title += (' - '+ o.configValue);
                                    }
                                }
                            });
                            document.title = title;
                        }
                    }
                }
            });
        },

        // 加载跨域信使
        loadMessenger:function(){
            // 跨域调用方法
            var messenger = new Messenger('parent', 'MessengerMos');
            messenger.listen(function (msgs) {
                var data = eval('('+msgs+')');
                var t = data.fn;
                var msg = data.msg;
                switch(t){
                    case "showSuc":
                        showSuc(msg);
                        break;
                    case "showInfo":
                        showMsg(msg,"info");
                        break;
                    case "showWarn":
                        showMsg(msg,"warn");
                        break;
                    case "showError":
                        showMsg(msg,"error");
                        break;
                    case "showErrTips":
                        showTips(msg, 'danger');
                        break;
                    case "showSucTips":
                        showTips(msg, 'success');
                        break;
                    case "showInfoTips":
                        showTips(msg, 'info');
                        break;
                    case "showWarnTips":
                        showTips(msg, 'warning');
                        break;
                    case "showTab": //添加 或者 刷新tab 例如    showTab({id:'可以不写',text:'',url:'',refresh:true(刷新)/false(不刷新)});
                        var opt = eval('('+msg+')');
                        addBlankTab(opt);
                        break;
                    case "refreshTab": //easyui刷新tab 例如 refreshTab('系统列表')
                        //refreshMainTab(msg);
                        refreshTab(msg);
                        break;
                    case "closeTab":
                        closeTab(msg);
                        break;
                    case "closeTabEx":
                        closeTabEx(msg);
                        break;
                    case "refreshTabEx":
                        refreshTab(msg);
                        break;
                    case "mask":
                        mask(msg);
                        break;
                    case "unmask":
                        unmask(msg);
                        break;
                    case "imgPreview":
                        imgPreviewCtrl(msg);
                        break;
                }
            });
        },

        // 获取登录用户
        getLoginUser:function(){
            var _this = this;
            var url = basePath+'/app/rest/account';
            $.GET({
                url:url, success:function (data) {
                    _this.loadUserInfo(data.lastName);
                }, async:false
            });
        },

        // 退出登录
        doLogOut:function(){
            if(getConf().idmLogin){
                window.close();
                return;
            }

            var url = basePath + '/app/logout';
            $.POST({
                url:url,async:false, success:function (data) {
                    setTimeout(function(){
                        location.href=getConf().portalUrl+"/mos.jhtml";
                    }, 2000);
                   /* cookieOpt('sid', "", { path: "/" });
                    if(getConf().idmLogin){
                        $('body').append('<iframe src="'+getConf().idmLogoutUrl+'" style="width:0;height:0;padding:0;margin:0;overflow:hidden;border:0;"></iframe>');

                        setTimeout(function(){
                            location.href=getConf().portalUrl+"/mos.jhtml";
                        }, 2000);
                    }else{
                        location.href=basePath+'/login';
                    }*/
                }, error:function(dt){
                   // showWarn('网络错误， 请稍后再试！');
                    location.href=basePath+'/login';
                }
            });
        },

        // 渲染系统图标
        loadSysIcon: function(){
            var _this = this;
            for(var i = 0; i< _this.mainTab.getTabs().length ;i++){
                var obj = _this.mainTab.getTabs()[i];
                var src = !obj.image?"/a/img/main/dev-ing.png":'data:image/jpg;base64,'+obj.image;
                obj.title = '<img src="'+src+'" style="width:24px;height:24px;vertical-align: middle;" /><span style="vertical-align: middle;margin-left: 6px;">'+obj.title+'</span>';
                _this.mainTab.updateTab(_this.mainTab.getTabs()[i], obj)
            }
        },
        //修改左边的树的名称
        updateSystem: function(o) {
            if(o){
                var layout = mini.get('jsMainLayout');
                layout.updateRegion("west", { title: o.name });
                this.loadSystemIndex(o.note, o.sn);
            }
        },
        // 加载左侧菜单树
        loadLeftTree: function(sysId){
            // this.leftTree.load("/managment/frame/systemTree?systemId="+sysId);

            // this.leftTree.setUrl("/managment/frame/systemTree?systemId="+sysId);
           // this.leftTree.setUrl(basePath + "/a/js/modules/left-menu-data.json?t="+Math.random(1));

            this.leftTree.setUrl(basePath + "/org/flowExtendPriv/ajaxUserPrivMenuList?t="+Math.random(1));
        },
        bindEvent:function(){
            var _this = this;
            // 注释
             this.getLoginUser();

            // 加载用户的公司
            var sid = cookieOpt('sid');
            if(sid) {
                // _this.mainCompany.load('/managment/frame/getCompanyByUserId');
            }

            // 退出操作
            $('#jsLogOut').click(function(){
                _this.doLogOut();
            });


            // // 切换系统
            // _this.mainTab.on('beforeactivechanged', function(o){
            //     // 修改系统标题
            //     _this.updateSystem(o.tab);
            //
            //     // 加载左侧树形结构
            //     _this.loadLeftTree(o.tab.id);
            // });

            // 获取选中的公司
            // var selectedCompany = _this.mainCompany.getValue();

            // 初始化加载系统
            ///////////////////////////
            // _this.mainTab.load("/managment/frame/getUserSystems");

            // _this.loadSysIcon();

            // 获取选中的系统
            // var selectedSys = _this.mainTab.getActiveTab();
            // _this.updateSystem(selectedSys);
            // // 初始化加载系统菜单
            // if(selectedSys){
            //     _this.loadLeftTree(selectedSys.id);
            // }

            _this.loadLeftTree('');

            // 菜单点击事件
            _this.leftTree.on('nodeclick', function(e){
                // var selectedSys = _this.mainTab.getActiveTab();
                var selectedSys = {sn:'flow'}
                var node = e.node;
                if(_this.leftTree.isLeaf(node)){
                    if(node.url){
                        var url = "";
                        if(node.url.indexOf('?') != -1){
                            url = node.url + "&moduleSn="+node.moduleSn+"&systemSn="+selectedSys.sn;
                        }else{
                            url = node.url + "?moduleSn="+node.moduleSn+"&systemSn="+selectedSys.sn;
                        }
                        var getTb = _this.sysTab.getTab(node.text);
                        if(getTb){
                            var activeTab = _this.sysTab.getActiveTab();
                            if(activeTab.title==getTb.title){
                                _this.sysTab.loadTab(url, getTb);
                                return;
                            }
                            _this.sysTab.activeTab(getTb);
                            return;
                        }

                        var tab = {
                            systemSn:selectedSys.sn,
                            moduleSn:node.moduleSn,
                            title: node.text,
                            name:node.text,
                            url:url,
                            id:node.id,
                            showCloseButton:true
                        };
                        _this.sysTab.addTab(tab);
                        _this.sysTab.activeTab(tab);
                    }
                }
            });
            _this.leftTree.on('beforeload',function () {
                _this.leftTree.mask();
            });
            _this.leftTree.on('load', function () {
                _this.leftTree.collapseAll();
                _this.leftTree.expandNode(_this.leftTree.getNode(0));
            });

            $("#jsMenuTabs").bind("contextmenu", function (e) {
                var menu = mini.get("tabsMenu");
                _this.currentTab = _this.sysTab.getTabByEvent(e.originalEvent);
                if(_this.currentTab){
                    menu.showAtPos(e.pageX, e.pageY);
                    if(_this.currentTab.title == _this.sysTab.getTab(0).title){
                        e.cancel = false;
                    }
                }else{
                    e.cancel = true;
                    return true;
                }
                return false;
            });

            function closeAllButFirst() {
                var but = [_this.currentTab];
                but.push(_this.sysTab.getTab(0));
                _this.sysTab.removeAll(but);
            }

            ///////////////////////////
            $('#closeTab').on('click',function(){
                if(_this.currentTab.title == _this.sysTab.getTab(0).title){
                    return;
                }
                _this.sysTab.removeTab(_this.currentTab);
            });

            $('#closeAllBut').on('click',function(){
                closeAllButFirst();
            });
            $('#closeAll').on('click',function(){
                var but = [];
                but.push(_this.sysTab.getTab(0));
                _this.sysTab.removeAll(but);
            });

            $('#refreshTab').on('click',function(){
                _this.sysTab.reloadTab(_this.currentTab);
            });
            // 跳转到系统首页
            $('#jsSystemIndex').on('click',function(){
                _this.loadSystemIndex();
            });

            var messenger = new Messenger('iframe', 'MessengerMos');

            // 加载页面
            // _this.sysTab.on('tabload', function(o){
            //     var systemSn = o.tab.systemSn||"",
            //         systemName = _this.mainTab.getActiveTab().name ||"",
            //         companyId = _this.mainCompany.getSelected().id,
            //         companyName = _this.mainCompany.getSelected().cname,
            //         moduleSn = o.tab.moduleSn||"",
            //         moduleName = o.name||"";
            //     messenger.addTarget(o.iframe.contentWindow, 'childWindow1');
            //     var sessionId = cookieOpt('sid');
            //     var privilegeUrl = window.location.protocol+"//"+window.location.host;
            //     var obj = {
            //         skin:skin,
            //         sid:sessionId,
            //         loginUser:loginUser.user,
            //         companyId:companyId,
            //         companyName:companyName,
            //         sysSn:systemSn,
            //         sysName:systemName,
            //         mSn:moduleSn,
            //         mName:moduleName,
            //         privilegeUrl:privilegeUrl
            //     };
            //     var msg = JSON.stringify(obj);
            //     // 将消息发送到子Iframe窗口
            //     messenger.send(msg);
            //
            // });
            $('#toUserInfo').click(function(){
                if(getConf().idmLogin){
                    window.open(getConf().portalUrl+'/portal/hr/baseInfo/baseinfo.jhtml');
                }else{

                }
            });

            // 左侧菜单栏展开收起切换
            this.switchLeftBar.click(function () {
                var menuPanel = _this.mainContentBox.getPane(1);
                var menuPanelSize = 200;

                if(parseInt(menuPanel.size)>=200){
                    // 收起操作
                    menuPanelSize = 40;
                    _this.leftTree.set({visible:false});
                    $(this).find('i').addClass('fa-indent');
                    $(this).css("height","100%");
                }else{
                    // 展开操作
                    menuPanelSize = 201;
                    _this.leftTree.set({visible:true});
                    $(this).find('i').removeClass('fa-indent');
                    $(this).css("height","40px");
                }
                _this.mainContentBox.updatePane(1, {
                    size:menuPanelSize
                })
            });

            // 全屏、退出 全屏操作
           $('#jsPageMaxBtn').click(function () {
                var icon = $(this).find('i');
                if(icon.hasClass('fa-compress')){
                    // 退出全屏操作
                    var de = document;
                    if (de.exitFullscreen) {
                        de.exitFullscreen();
                    } else if (de.mozCancelFullScreen) {
                        de.mozCancelFullScreen();
                    } else if (de.webkitCancelFullScreen) {
                        de.webkitCancelFullScreen();
                    }
                    icon.addClass('fa-arrows-alt').removeClass('fa-compress');
                    $(this).attr('title', '全屏');
                }else{
                    // 全屏操作
                    var de = document.documentElement;
                    if (de.requestFullscreen) {
                        de.requestFullscreen();
                    } else if (de.mozRequestFullScreen) {
                        de.mozRequestFullScreen();
                    } else if (de.webkitRequestFullScreen) {
                        de.webkitRequestFullScreen();
                    }

                    icon.removeClass('fa-arrows-alt').addClass('fa-compress');
                    $(this).attr('title', '退出全屏');
                }
                
            });
            
            _this.mainContentBox.on('resize', function (e) {
                if(e.sender.getPane(1).size <= 80){
                    _this.leftTree.set({visible:false});
                    _this.switchLeftBar.css("height","100%");
                }else{
                    _this.leftTree.set({visible:true});
                    _this.switchLeftBar.css("height","40px");
                }
            }, this);
        },
        // 加载主页面
        loadSystemIndex:function(sysDomain, sysSn){
            var _this = this;
            var domain = '', selectedSys=null;
            var sysSnTemp = sysSn;
            if(sysDomain){
                domain = sysDomain;
            }else{
                // 获得选中系统
                selectedSys = _this.mainTab.getActiveTab();
                domain = selectedSys&&selectedSys.note;
                sysSnTemp = selectedSys&&selectedSys.sn;
            }
            var tab = _this.sysTab.getTab(0);
            tab.url = domain+'/index.html';
            tab.sysSn = sysSnTemp;
            _this.sysTab.activeTab(_this.sysTab.getTab(0));
            _this.sysTab.reloadTab(tab);
        }
    };


// 弹出提示消息
// function showSuc(msg){
// 	top.mini.showTips({
//         content: '<b>提示</b> <br/>'+msg,
//         state: 'success',	//default|success|info|warning|danger
//         x:'center',			//left|center|right
//         y: 'top',		//top|center|bottom
//         timeout:2000		//自动消失间隔时间。默认2000（2秒）。
//     });
// }

function showTips(msg, status) {
    var title = '提示';
    if(status == 'danger'){
        title = '错误';
    }else if(title == 'info'){
        title = '信息';
    }else if(title == 'success'){
        title = '成功';
    }else if(title == 'warn'){
        title = '警告';
    }
    mini.showTips({
        content: "<b>"+title+"</b> <br/>"+msg,
        state: status,
        x: 'center',
        y: 'top',
        timeout: 3000
    });
}


/**
 * 提示消息
 * @param msg
 * @param t
 * @returns
 */
function showMsg(msg,t){
    var _iconCls="";
    var title = "提示";
    switch(t){
        case "info":
            _iconCls="mini-messagebox-info";
            break;
        case "warn":
            title="警告信息";
            _iconCls="mini-messagebox-warning";
            break;
        case "error":
            title="错误提示";
            _iconCls="mini-messagebox-error";
            break;
    }
    var _w=250;
    if(msg.length>200){
        _w=650;
    }

    mini.showMessageBox({
        width: _w,
        title: title,
        buttons: ["ok"],
        message: '<div style="width: 185px;word-wrap: break-word;word-break: break-word;white-space: normal;">'+msg+'</div>',
        iconCls:_iconCls
    });
}

// 修改LOGO图片
function loadLogoImage(image){
    $('#jsLogoImage').attr('src', image);
}
// 修改底部名称
function updateFooter(cname, pname){
    if(cname) $('#jsFooterPlatName').text(cname);
    if(pname) $('#jsFooterCompanName').text(pname);
}

var loginUser = {};
