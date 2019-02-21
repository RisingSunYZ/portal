<!DOCTYPE html>
<html lang="en">
<head>
    <title>流程中心</title>
    <link rel="icon" href="${basePath}/a/img/main/favicon.ico" mce_href="../a/img/main/favicon.ico" type="image/x-icon">
    <script src="${basePath}/a/scripts/boot.js" type="text/javascript"></script>

    <link href="${basePath}/a/css/newMain.css" rel="stylesheet" type="text/css" />
    <script src="${basePath}/a/js/modules/main.js" type="text/javascript"></script>
    <script src="${basePath}/a/js/modules/menu.js" type="text/javascript"></script>

    <script>
        var basePath = '${basePath}';
        $(function(){
            main.init();
        });
    </script>
</head>
<body>
<div id="jsMainLayout" class="mini-layout" style="width:100%;height:100%;border:none;" splitSize="0">
    <div region="north" id="jsMainHeader"  showSplit="false" showHeader="false" height="52" showSplitIcon="false" style="overflow:hidden;border:none;display:none;">
        <div class="header-main mini-splitter" handlerSize="0" allowResize="false" style="width:100%;height:52px;z-index:9;background:#252a2f">
            <div size="332" showCollapseButton="false">
                <div class="logo">
                    <div class="logoBox">
                        <img id="jsLogoImage" src="${basePath}/a/img/public/logo.png" />
                    </div>
                </div>
            </div>
            <div showCollapseButton="false">
                <#--<div class="nav navbar-nav top-menu">
                    <div id="mainMenu"></div>
                </div>-->

                <div class="topbar">
                    <#--<div class="topbar-item topbar-item-dropdown">
                        <a href="javascript:void(0);" class="topbar-btn topbar-item-dropdown-toggle">
                            <span>基本信息</span>
                        </a>
                        <ul class="topbar-item-dropdown-memu">
                            <li class="topbar-item-btn">
                                <a href="http://10.10.15.75:15682/#/queues" target="flowMainFrame" ><span>页面跳转</span></a>
                            </li>
                            <li class="topbar-item-btn">
                                <a href="http://10.10.20.210:8889/companyNav.html" target="flowMainFrame" ><span>跳转二</span></a>
                            </li>
                            <li class="topbar-item-btn"><a href="http://10.10.12.246/zentao/my/" target="flowMainFrame"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                        </ul>
                    </div>
                    <div class="topbar-item topbar-item-dropdown">
                        <a href="javascript:void(0);" class="topbar-btn topbar-item-dropdown-toggle">
                            <span>表单管理</span>
                        </a>
                        <ul class="topbar-item-dropdown-memu">
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                        </ul>
                    </div>
                    <div class="topbar-item topbar-item-dropdown">
                        <a href="javascript:void(0);" class="topbar-btn topbar-item-dropdown-toggle">
                            <span>流程管理</span>
                        </a>
                        <ul class="topbar-item-dropdown-memu">
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>菜单一</span></a></li>
                        </ul>
                    </div>-->
                    <div class="topbar-item topbar-console-home">
                        <a href="javascript:void(0);" class="topbar-btn" id="jsPageMaxBtn" title="全屏">
                            <span><i class="fa fa-arrows-alt"></i></span>
                        </a>
                    </div>

                    <div class="topbar-item topbar-console-home">
                        <a href="javascript:void(0);" class="topbar-btn">
                            <span><i class="fa fa-home"></i>首页</span>
                        </a>
                    </div>

                    <div class="topbar-item topbar-item-dropdown usr-box">
                        <a href="javascript:void(0);" class="topbar-item-dropdown-toggle topbar-btn" >
                            <img class="topbar-user-avatar" src="https://oss.aliyuncs.com/aliyun_id_photo_bucket/default_handsome.jpg" >
                            <span id="jsLoginUserName" class="" style="color: white"></span>
                        </a>
                        <ul class="topbar-item-dropdown-memu">
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>个人中心</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);"><span>系统设置</span></a></li>
                            <li class="topbar-item-btn"><a href="javascript:void(0);" id="jsLogOut"><span>退出</span></a></li>
                        </ul>
                    </div>
                    <div class="topbar-item topbar-item-dropdown usr-box">

                    </div>

                </div>

            </div>
        </div>

    </div>


    <#--<div showHeader="false" splitSize="0" title="-" showSplit="false"  showSplitIcon="false"
         showProxyText="false" region="west" width="52" allowResize="false" expanded="true" >
    </div>-->


    <div class="footer-box" region="south" showSplit="false" showHeader="false" height="30" style="text-align: center;height: 30px;line-height: 30px;display:none;" >
        <span id="jsFooterCompanName">浙江亚厦集团</span><span id="jsFooterPlatName">流程中心</span> © 2018-2030
    </div>
    <div region="center" style="margin:0;padding:0;border:none;" bodyStyle="border:none;overflow:hidden;" >
        <div id="jsMainContentBox" class="mini-splitter" allowResize="true" style="border:none;width:100%;height:100%;">
            <div size="200" style="overflow:visible;border:none;" showCollapseButton="true" >

                <div id="jsSwitchLeftBar" style="text-align:center;height:40px;line-height:40px;background:#192129;color:white;cursor:pointer;">
                    <i style="" class="fa fa-dedent"></i>
                </div>
                <div class="mini-fit" style="background: rgb(37, 42, 47);">
                    <ul id="leftTree" class="mini-tree" style="width:100%;height:100%;background: rgb(37, 42, 47);"
                        enableHotTrack="true"
                        ajaxOptions='{async:true}'
                        expandOnLoad="0"
                        textField="text" idField="id" parentField="pid" showCheckbox="false"
                        expandOnNodeClick="true" resultAsTree="false"
                        iconField="icon" showTreeLines="false" showTreeIcon="false">
                    </ul>
                </div>




                <#--<div class="sidebar">
                    <div class="sidebar-menu-wrapper">
                        <div class="product-all"  >
                            <div class="product-all-wrapper">
                                <span class="product-all-icon-box">
                                    <i class="fa fa-navicon " ></i>
                                </span>
                            </div>
                        </div>


                        <ul class="sidebar-products">
                            <li class="product-item" style="transform: translate3d(0px, 0px, 0px);">
                                <span class="product-item-icon-box">
                                    <i class="fa fa-gears"></i>
                                </span>
                                <a href="javascript:void(0);" class="product-item-link" title="" >
                                    <span class="product-item-name" >基础数据</span>
                                </a>
                                <div class="sidebar-toolbar">
                                    <span class="sidebar-icon-box">
                                        <i class="topbar-sidebar-more fa fa-chevron-right"></i>
                                    </span>
                                    <div class="child-item">
                                        <ul >
                                            <li class="product-item" style="transform: translate3d(0px, 0px, 0px);">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/company/list" title="公司管理" >
                                                    <span class="product-item-name" >公司管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/department/list" title="部门管理" >
                                                    <span class="product-item-name" >部门管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/flow_category/list" title="分类管理" >
                                                    <span class="product-item-name" >分类管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/userVo/list" title="人员管理" >
                                                    <span class="product-item-name" >人员管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/groupVo/list" title="用户组管理" >
                                                    <span class="product-item-name" >用户组管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/company/list" title="权限值管理" >
                                                    <span class="product-item-name" >权限值管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/flow_system/list" title="系统管理" >
                                                    <span class="product-item-name" >系统管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/company/list" title="流程底表管理" >
                                                    <span class="product-item-name" >流程底表管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/position_level/list" title="岗级管理" >
                                                    <span class="product-item-name" >岗级管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" url="${basePath}/basedata/company/list" title="数据字典管理" >
                                                    <span class="product-item-name" >数据字典管理</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>


                            <li class="product-item" style="transform: translate3d(0px, 40px, 0px);">
                                <span class="product-item-icon-box">
                                    <i class="fa fa-sitemap"></i>
                                </span>
                                <a href="javascript:void(0);" class="product-item-link" title="表单管理" >
                                    <span class="product-item-name" >表单管理</span>
                                </a>
                                <div class="sidebar-toolbar">
                                    <span class="sidebar-icon-box">
                                        <i class="topbar-sidebar-more fa fa-chevron-right"></i>
                                    </span>
                                    <div class="child-item">
                                        <ul >
                                            <li class="product-item" style="transform: translate3d(0px, 0px, 0px);">
                                                <a class="product-item-link"  href="javascript:void(0);" title="业务流程模型管理" >
                                                    <span class="product-item-name" >业务流程模型管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="业务流程定义管理" >
                                                    <span class="product-item-name" >业务流程定义管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="业务表单管理" >
                                                    <span class="product-item-name" >业务表单管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="自定义表单管理" >
                                                    <span class="product-item-name" >自定义表单管理</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>

                            <li class="product-item" style="transform: translate3d(0px, 80px, 0px);">
                                <span class="product-item-icon-box">
                                    <i class="fa fa-group"></i>
                                </span>
                                <a href="javascript:void(0);" class="product-item-link" title="流程管理" >
                                    <span class="product-item-name" >流程管理</span>
                                </a>
                                <div class="sidebar-toolbar">
                                    <span class="sidebar-icon-box">
                                        <i class="topbar-sidebar-more fa fa-chevron-right"></i>
                                    </span>
                                    <div class="child-item">
                                        <ul >
                                            <li class="product-item" style="transform: translate3d(0px, 0px, 0px);">
                                                <a class="product-item-link"  href="javascript:void(0);" title="流程模型管理" >
                                                    <span class="product-item-name" >流程模型管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="流程定义管理" >
                                                    <span class="product-item-name" >流程定义管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="业务流程管理" >
                                                    <span class="product-item-name" >业务流程管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="流程实例管理" >
                                                    <span class="product-item-name" >流程实例管理</span>
                                                </a>
                                            </li>
                                            <li class="product-item">
                                                <a class="product-item-link"  href="javascript:void(0);" title="流程任务管理" >
                                                    <span class="product-item-name" >流程任务管理</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>-->
            </div>
            <div style="border:none;" showCollapseButton="false">
                <#--<div id="jsMainTabs" class="mini-tabs" activeIndex="0"
                     style="width:100%;height:100%;">
                    <div title="首页" url="http://10.10.20.210:8889/companyNav.html" showCloseButton="false" >
                        首页
                    </div>
                </div>-->

                    <div id="jsMenuTabs" class="mini-tabs" activeIndex="0" style="height:100%;border:none;" >
                        <div title="系统首页" id="jsIndexPage" showCloseButton="false">
                            <div style="margin:20px;color:#ccc;font-size:24px;font-weight:normal;">流程中心</div>
                        </div>
                    </div>

                    <ul id="tabsMenu" class="mini-contextmenu"  style="display:none;z-index:9999999">
                        <li iconCls="fa fa-close" id="closeTab" >关闭标签页</li>
                        <li iconCls="fa fa-adjust" id="closeAllBut">关闭其他标签页</li>
                        <li iconCls="fa fa-ban" id="closeAll">关闭所有标签页</li>
                        <li class="separator"></li>
                        <li iconCls="fa fa-refresh" id="refreshTab">刷新</li>
                    </ul>

                <#--<iframe src="http://10.20.30.81:86/page/index.html"
                        id="flowMainFrame" name="flowMainFrame" frameborder="0"
                        scrolling="none" style="position: relative;left: 0px;border:none;width:100%;height:100%;margin:0;padding:0;"></iframe>-->
            </div>
        </div>
    </div>
</div>

</body>
</html>
