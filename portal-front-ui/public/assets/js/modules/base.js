define("js/modules/base", function (require, exports, module) {
    "require:nomunge,exports:nomunge,module:nomunge";
    //require('js/modules/commons/personSelector');
    require('layer');
    var pageid = 2;
    if(typeof(_portalBasePath)=="undefined"){
    	_portalBasePath = "";
    }
    if(typeof(_seeyonBasePath)=="undefined"){
    	_seeyonBasePath = "";
    }
    Base = {
        utils: {
            init: function () {
                if(!this.validBrowser()){
                	return;
                }
            	Base.utils.bindEvent();
                Base.utils.loadPicNews();
                //Base.utils.YearActivity();
            },
            
            // 验证浏览器版本
    		validBrowser:function(){
    			var flag = true;
    			var ua = navigator.userAgent.toLowerCase();
    			var isIE = ua.indexOf("msie")>-1;
    			if(isIE){
    				// IE7及以下版本
    			    if (document.all && !document.querySelector) {
    					flag = false;
					}
    			}
    			
    			if(!flag){
    				var contentUrl = basePath + '/nonsupportBrowser.jhtml';
    				require.async("layer", function(){
    					//示范一个公告层
        				layer.open({
        					type: 2
        					,title: false //不显示标题栏
        					,closeBtn: false
        					,area: ['600px', '300px']
        					,shade: 0.8
        					,id: 'LAY_layuipro' //设定一个id，防止重复弹出
        					,resize: false
        					,btnAlign: 'c'
        					,moveType: 1 //拖拽模式，0或者1
        					,content: contentUrl
        					,success: function(layero){}
        				});
    				});
    			}
    			return flag;
    		},
    		// 验证身份证号码
    		validateIdCard:function(idCard) {
    		    //15位和18位身份证号码的正则表达式
    		    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    		    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    		    if (regIdCard.test(idCard)) {
    		        if (idCard.length == 18) {
    		            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
    		            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
    		            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
    		            for (var i = 0; i < 17; i++) {
    		                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
    		            }
    		            var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
    		            var idCardLast = idCard.substring(17);//得到最后一位身份证号码
    		            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
    		            if (idCardMod == 2) {
    		                if (idCardLast == "X" || idCardLast == "x") {
    		                    return true;
    		                    //alert("恭喜通过验证啦！");
    		                } else {
    		                    return false;
    		                    //alert("身份证号码错误！");
    		                }
    		            } else {
    		                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
    		                if (idCardLast == idCardY[idCardMod]) {
    		                    //alert("恭喜通过验证啦！");
    		                    return true;
    		                } else {
    		                    return false;
    		                    //alert("身份证号码错误！");
    		                }
    		            }
    		        }
    		    } else {
    		        //alert("身份证格式不正确!");
    		        return false;
    		    }
    		},

            //问题反馈弹框
        	questionLayer:function () {
        		require.async('layer', function(){
        			layer.open({
                        type: 2,
                        moveOut: true,
                        title : "问题反馈",
                        area : ['630px', '474px'],
                        offset : '150px',
                        content: '/portal/itsm/input.jhtml',
                        btn:["提交","取消"],
                        success:function(layero, index){
                    		layer.iframeAuto(index);
                    		$('body').trigger('resize');
                        },
                        yes: function(index, layero){
                        	var error = "";
                        	var win = $(layero.find("iframe").contents());
                     		var firstName = win.find("#firstName").val(); 				//一级分类名称
                     		var secName = win.find("#secName").val();					//二级分类名称
                     		var thirdName = win.find("#thirdName").val();				//三级分类名称
                     		var firstId = win.find("#firstId").val();					//一级分类id
                     		var secId = win.find("#secId").val();						//二级分类id
                     		var thirdId = win.find("#thirdId").val();					//三级分类id
                     		var address = win.find("#address").val();					//办公地点
                     		var case_person = win.find("#case_person").val();			//反馈者
                      		var telephone = win.find("input[id='telephone']").val();	//联系方式
                      		var question_id = win.find("#question_id").val();			//判断是否有三级分类的隐藏input  1代表没有  2代表有
                      		var linkcode = win.find("#categoryCode").val();				//最后一层的linkcode
                      		var categoryName = win.find("#categoryName").val();			//最后一层的分类名称
                      		var no = win.find("#no").val();								//反馈者工号
                      		var radioStatus = win.find("#radioStatus").val(); 			//获取radio的特定状态
                      		var radioVal = win.find("#radioValue").val();
                     		var content ="";	
                      		if(case_person ==""){
                      			layer.msg("请选择故障用户",{time:500});
                      			return false;
                      		}else if(telephone == ""){
                      			win.find("input[id='telephone']").focus();
                      			layer.msg("请输入联系方式",{time:500});
                      			return false;
                      		}else if(address == ""){
                      			win.find("#address").focus();
                      			layer.msg("请输入办公地点",{time:500});
                      			return false;
                      		}else if(firstName ==""){
                      			layer.msg("请选择所属业务",{time:500});
                      			return false;
                      		}else if(question_id == 1 && secName == ""){
                      				layer.msg("请选择所属系统",{time:500});
                          			return false;
                      		}else if(question_id == 2 && thirdName == ""){
                      				layer.msg("请选择问题分类",{time:500});
                          			return false;
                      		}else if(radioStatus == 0){
                      			layer.msg("请选择问题说明",{time:500});
                      			return false;
                      		}else if(radioStatus == 1){
                      			var textContent = win.find("textarea[id='content']").val();	
                      			if(textContent == ""){
                      				win.find("textarea[id='content']").focus();
                      				layer.msg("请输入问题说明",{time:500});
                          			return false;
                      			}else{
                      				content = radioVal + "-" + textContent;
                      			}
                      		}else if(radioStatus == 2){
                      			//等于2 取输入框的值
                      			content = win.find("textarea[id='content']").val();	
                      			if(content == ""){
                      				win.find("textarea[id='content']").focus();
                      				layer.msg("请输入问题说明",{time:500});
                          			return false;
                      			}
                      		}
                      		layer.load(1, {shade: [0.2, '#000000'], time: 20000});
                      		var iframeWin = window[layero.find('iframe')[0]['name']]; //获取窗口属性
                      		var load = iframeWin.question_load.uploader;
                 			$.ajax({
                 				type : 'POST',
                 				dataType : 'JSON',
                 				url : basePath + '/portal/itsm/save.jhtml?',
                 				data :  {
                 					createUserid : no,					//联系人工号
                 					creatorRealName : case_person,		//联系人姓名
                 					creatorByMobilePhone : telephone,	//联系人号码
                 					categoryCode : linkcode,			//最后一层分类的linkcode
                 					categoryName : categoryName,		//最后一层分类的名称
                 					businessAddress : address,		 	//办公地点
                 					description : content 				//问题描述
                 				},
                 				success : function(data) {
                 					if(data.success  == true){
                 						//判断是否选择上传文件
                 						if(win.find(".jsViewPicBox").find("li > .jsDelFile ").length>0){
                 							//给事件id赋值
                     						win.find("#eventId").val(data.obj);
                     						//上传附件
                     						load.start();
                 						}else{
                 							layer.msg("保存成功", {
             								  time: 1000 
             								}, function(){
             									layer.closeAll();
             								});   
                 						}
                 					}else{
                 						layer.msg("保存失败",{time:1000});
                 					}
                 				}
                 			})
                        },btn2: function(){}
                    })
        		});
             },
            // 绑定公共事件
            bindEvent: function () {
            	//移动端二维码弹窗位置
            	$('.mobile-box')[0]&&$('.mobile-box').hover(function(){
                    var tar  = $(this).find('.dropdown-content');
                    if((tar.offset().left+tar.outerWidth())>document.body.clientWidth){
                        tar.css('margin-right','-10px').find('.drop-icon').css('left','96%');
                    }
                },function(){
                    $(this).find('.dropdown-content').css('margin-right','-120px').find('.drop-icon').css('left','50%');
                });
                //帮助向导弹窗
                $('.icon-help').live('click', function () {
                	var body = window.top.document.body ? window.top.document.body : document.body;
                	 //获取帮助类型标识
                    var helpType=$(this).attr('help-type'); 
                    $(body).prepend('<div id="help-box" style="position: absolute;height: 100%;width: 100%;min-height: 640px;z-index: 20170101;">' +
                            '<div class="js-btn-close-div" style="position: absolute;right: 10px;"><span class="jsclose guide-close-gray-img"></span></div>' +
                            '<iframe  id="frameHelp" allowTransparency="true" frameBorder="0" scrolling="no" style="width: 100%;height: 100%;background: transparent;" src="'+_portalBasePath+'/help/helpCenter.jhtml?typeSn='+helpType+'"></iframe></div>').css('overflow','hidden');
                    // $('#help-box').load('/work-platform/help-guide.shtml');
                    $(body).find('.jsclose').live('click',function () {
                        $(body).find('#help-box').remove();
                        $(body).css('overflow','auto');
                    });
                    //自适应高度
                    winResizeOut();//页面加载完成后，执行这个函数
                    $(window).resize(function(){
                        winResizeOut();
                    });
                    function winResizeOut(){
                        var outhall = $(body).find('#help-box').height();
                        var outhaccount = outhall-570;
                        var outhhalf = outhaccount/2;
                        if(outhhalf>100){
                            outhhalf =100;
                        } else if (outhhalf<30){
                            outhhalf=30;
                        }
                        $(body).find('.js-btn-close-div').height(outhhalf);
                    }
                  //关闭按钮切换
                    $(body).find('.js-btn-close-div .jsclose').hover(function () {
                        $(this).addClass('guide-close-graymore-img').removeClass('guide-close-gray-img');
                    },function () {
                        $(this).addClass('guide-close-gray-img').removeClass('guide-close-graymore-img');
                    })
                });
                $('.jsTypeChange li')[0]&&$('.jsTypeChange li').bind('click', function () {
                    var text = $(this).text();
                    $(this).closest('.search-item').find('.curr-type').text(text);
                });
                //弹出流程窗口 //$(".jsNewWin li a").click(function(){
                $(".jsProcessWin")[0]&&$(".jsProcessWin").live('click',function(){
                	var flowId=$(this).attr("flowId");
                	Base.utils.openNewWindow(flowId);
                });
                
                // 文件预览
                $('.f-preview').die().live('click', function(){
                	var downloadUrl = $(this).attr('fileUrl'), htmlName = $(this).attr('fileName');
                	if(downloadUrl){
                		downloadUrl = encodeURIComponent(downloadUrl);
                		htmlName = encodeURIComponent(htmlName);
                		window.open('/common/fileOnline.jhtml?downloadUrl='+downloadUrl+'&htmlName='+htmlName);
                	}else{
                		var showMsg = '暂无预览！';
                		try{
	                		if(parent.layer){
	                    		parent.layer.msg(showMsg);
	                    	}else{
	                    		layer.msg(showMsg);
	                    	}
                		}catch(e){
                			alert(showMsg);
                		}
                	}
                });
                
                // 文件下载
                $('.f-download').die().live('click', function(){
                	var downloadUrl = $(this).attr('fileUrl'), htmlName = $(this).attr('fileName');
                	if(downloadUrl){
                		// 文件下载操作
                		window.location.href = '/website/tools/fileUpload/download.jhtml?path='+encodeURIComponent(downloadUrl)+'&name='+encodeURIComponent(htmlName);
                		//window.open('/downloadFile.shtml?downloadUrl='+downloadUrl+'&htmlName='+htmlName);
                	}else{
                		var showMsg = '地址错误或文件已删除！';
                		try{
	                		if(parent.layer){
	                    		parent.layer.msg(showMsg);
	                    	}else{
	                    		layer.msg(showMsg);
	                    	}
                		}catch(e){
                			alert(showMsg);
                		}
                	}
                });
                
                // 跳转到我发起的流程
                $('.to-myflow').die().live('click', function(){
                	var keyWord = $(this).attr('keyWord');
            		// 跳转到我发起的流程
            		window.open('/portal/flow/myFlow.jhtml?keyWord='+encodeURIComponent(keyWord));
                });
            },
            
          //元旦节日元素添加
            YearActivity : function(){
                setTimeout(function(){
                    if($('.footer-container')[0]){
                        var css='body{background-color: #f1f1f1;}' + '.main-container{padding: 0 30px;}';
                        $('head').append('<style type="text/css">' + css + '</style>');
                        $('body').append('<div class="year-day-icon l-year"></div><div class="year-day-icon r-year"></div>');
                    }
                },20);
            },
            loadPicNews: function () {
                //新闻轮播
        		$('.news-box')[0]&&require.async('swiper', function () {
                    var newsSwiper = new Swiper(".news-box", {
                        autoplay: 5000,
                        loop: true,
                        pagination: '.pagination',
                        paginationClickable: true
                    });
                });
            },
            openNewWindow:function(flowId) {
                var url =  _seeyonBasePath + "/seeyon/collaboration/collaboration.do?method=newColl&from&templateId="+flowId;
            	width =parseInt(screen.width)-20;
            	height =parseInt(screen.height)-80;
            	var win = window.open(url, "ctpPopup" + new Date().getTime(), "top=0,left=0,scrollbars=yes,dialog=yes,minimizable=yes,modal=open,width=" + width + ",height=" + height + ",resizable=yes");
            	if (win == null) {
            		return;
            	}
            	win.focus();
            },
            //取得查询的hash，并去除开头的#号
            getHashStringArgs:function() {
                var hashStrings = (window.location.hash.length > 0 ? window.location.hash.substring(1) : ""),
                //保持数据的对象
                hashArgs = {},
                //取得每一项hash对
                items = hashStrings.length > 0 ? hashStrings.split("&") : [], item = null,name = null,value = null, i = 0,len = items.length;
                //逐个将每一项添加到hashArgs中
                for (i = 0; i < len; i++) {
                    item = items[i].split("=");
                    name = decodeURIComponent(item[0]);
                    value = decodeURIComponent(item[1]);
                    if (name.length > 0) {
                        hashArgs[name] = value;
                    }
                }
                return hashArgs;
            },
         // 获取URL请求参数值
            getQueryString:function(name) {
            	   var url = location.search;
            	   var theRequest = new Object();
            	   if (url.indexOf("?") != -1) {
            	      var str = url.substr(1);
            	      strs = str.split("&");
            	      for(var i = 0; i < strs.length; i ++) {
            	         theRequest[strs[i].split("=")[0]]=strs[i].split("=")[1];
            	      }
            	   }
            	   var str=theRequest[name];
            	   if(typeof str !='undefined'){
            		   str=str.replace(/\+/g,' ');
            	   }
            	   return str;
        	},
        	//Js修改Url参数
        	changeURLPar:function(ref, value) {
        		var url = window.location.href;
        	    var str = "";
        	    if (url.indexOf('?') != -1)
        	        str = url.substr(url.indexOf('?') + 1);
        	    else
        	        return url + "?" + ref + "=" + value;
        	    var returnurl = "";
        	    var setparam = "";
        	    var arr;
        	    var modify = "0";
        	    if (str.indexOf('&') != -1) {
        	        arr = str.split('&');
        	        for (i in arr) {
        	            if (arr[i].split('=')[0] == ref) {
        	                setparam = value;
        	                modify = "1";
        	            } else {
        	                setparam = arr[i].split('=')[1];
        	            }
        	            returnurl = returnurl + arr[i].split('=')[0] + "=" + setparam + "&";
        	        }
        	        returnurl = returnurl.substr(0, returnurl.length - 1);
        	        if (modify == "0")
        	            if (returnurl == str)
        	                returnurl = returnurl + "&" + ref + "=" + value;
        	    } else {
        	        if (str.indexOf('=') != -1) {
        	            arr = str.split('=');
        	            if (arr[0] == ref) {
        	                setparam = value;
        	                modify = "1";
        	            } else {
        	                setparam = arr[1];
        	            }
        	            returnurl = arr[0] + "=" + setparam;
        	            if (modify == "0")
        	                if (returnurl == str)
        	                    returnurl = returnurl + "&" + ref + "=" + value;
        	        } else
        	            returnurl = ref + "=" + value;
        	    }
        	    history.replaceState(window.location.href, ref, url.substr(0, url.indexOf('?')) + "?" + returnurl);
        	},
        	//edit by <a href="http://www.jbxue.com" target="_blank">www.jbxue.com</a>
        	/*
        	 * 	// 对Date的扩展，将 Date 转化为指定格式的String
				// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
				// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
				// 例子： 
				// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
				// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
        	 * */
        	// 获取文件名格式化
			// fileArr = [{name:'文件名', path:'文件路径',id:'文件id'}];
	        genFileNameFormatter:function(fileArr, canDel){
	        	var html = '';
	        	for(var i = 0; i< fileArr.length; i++){
	        		var fileName = fileArr[i].name;
	        		var filePath = fileArr[i].path, fileId = fileArr[i].id || "";
	        		// 获取文件后缀名
	        		var fileExt = this.getFileExt(fileName);
	        		var icon = this.getFileIcon(fileExt);
	        		// 如果是图片
	        		var isImg = 'JPG,JPEG,GIF,BMP,PNG'.indexOf(fileExt.toUpperCase()) !=-1;
	        		var width = 150;
	        		html += '<div style="width:'+(canDel ? (width+25) : width)+'px" class="tb-file-opt" title="'+fileName+'" ><i style="position:absolute;left:0;top:4px;" class="icon '+icon+'"></i><span class="f-name" style="width:'+(width-24)+'px">'+fileName+'</span>'
	        		+ (canDel?'<a class="icon icon-close-md f-del"></a>':'')
	        		+ '<ul style="width:'+width+'px">'
	        		+ '<li><a class="f-download" fileUrl="'+filePath+'" fileName="'+fileName+'" href="javascript:void(0)" ><i class="icon icon-download-white"></i></a></li>'
	        		+ '<li><a fileId="'+fileId+'" class="'+(isImg?'img-preview':'f-preview')+'" fileUrl="'+filePath+'" fileName="'+fileName+'" href="javascript:void(0)" ><i class="icon icon-search-white"></i></a></li>'
	        		+ '</ul>' 
	        		+ '</div>';
	        	}
	        	return html;
	        },
	     // 获取文件后缀名
	        getFileExt:function(file_path){
	        	var fileExt = file_path.replace(/.+\./,"");
	        	return fileExt;
	        },
	        // 获取文件图标
	        getFileIcon:function(sufix){
	        	var icon = '';
	        	sufix = sufix.toUpperCase();
	        	if("JPG,JPEG,GIF,BMP,PNG".indexOf(sufix) != -1){
	        		icon = 'icon-img-blue';
	        	}else if("DOC,DOCX,DOT,DOTX,DOCM,DOTM".indexOf(sufix) != -1){
	        		icon = 'icon-doc';
	        	}else if("XLS,XLSX,XLSM,XLT,XLTX,XLTM".indexOf(sufix) != -1){
	        		icon = 'icon-exce';
	        	}else if("PPT,PPTX".indexOf(sufix) != -1){
	        		icon = 'icon-ppt';
	        	}else if("TXT".indexOf(sufix) != -1){
	        		icon = 'icon-txt';
	        	}else if("PDF".indexOf(sufix) != -1){
	        		icon = 'icon-pdf';
	        	}else if("ZIP,RAR".indexOf(sufix) != -1){
	        		icon = 'icon-zip';
		        }else{
		        	icon = 'icon-other';
		        }
	        	return icon;
	        },
        	dateFmt:function (dt, fmt) { //author: meizz 
        	    var o = {
        	        "M+": dt.getMonth() + 1, //月份 
        	        "d+": dt.getDate(), //日 
        	        "h+": dt.getHours(), //小时 
        	        "m+": dt.getMinutes(), //分 
        	        "s+": dt.getSeconds(), //秒 
        	        "q+": Math.floor((dt.getMonth() + 3) / 3), //季度 
        	        "S": dt.getMilliseconds() //毫秒 
        	    };
        	    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
        	    for (var k in o)
        	    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        	    return fmt;
        	}
        }// 框架事件
	    ,main:{
	        init:function(){
	            Base.main.bindEvent();
	        },
	        bindEvent: function(){
	            //移动端二维码弹窗位置
	            $('.mobile-box').hover(function(){
	                var tar  = $(this).find('.dropdown-content');
	                if((tar.offset().left+tar.outerWidth())>document.body.clientWidth){
	                    tar.css('margin-right','-10px').find('.drop-icon').css('left','96%');
	                }
	            },function(){
	                $(this).find('.dropdown-content').css('margin-right','-120px').find('.drop-icon').css('left','66%');
	            });
	            //顶部菜单切换
	            $('.jsServiceSel li').bind('click', function () {
	                $(this).addClass("nav-active").siblings().removeClass("nav-active");
	                var url=encodeURI( $(this).find('a').attr('l_href'));
	                $('#yashaMainFrame').attr('src',url);
	            });
	            //顶部切换
	            var hashObj = Base.utils.getHashStringArgs();
	            if(hashObj.channel!=undefined && hashObj.channel!=""){
	        	    var tarLi = $('.jsServiceSel li[channel='+hashObj.channel+']');
	        	    tarLi.addClass('nav-active').siblings().removeClass('nav-active');
	        	    var url=encodeURI(tarLi.find('a').attr('l_href'))
	        	    $('#yashaMainFrame').attr('src',url);
	            }else{
	            	var tarLi = $('.jsServiceSel li[channel=work]');
	        	    tarLi.addClass('nav-active').siblings().removeClass('nav-active');
	        	    $("#yashaMainFrame").attr("src","/portal/workplat/index.jhtml")
	            }
	            if(/dev|test/.test(window.location.host)){
		    		setTimeout(function(){
			    		var win = $("#yashaMainFrame")[0].contentWindow;
			    		$(win.document).find('.jsExchangeNav>li.un-work>a').attr('href', '/portal/flow/approvingTask.jhtml'); 
			    		$(win.document).find('.jsExchangeNav>li.progress-item>a').attr('href', '/portal/flow/approvingTask.jhtml'); 
		    		}, 500);
		    	}
	            //获取生日
	            $.get("/getBirthday.jhtml",
	            		  function(data){
	            		    if(data.code==1){
	            		    	$('.birthday-box').show();
	            		    	Base.main.birthdayOpen(5000);
	            		    }else if (data.code==2) {
	            		    	$('.birthday-box').show();
							}
	            		  },"json");
	        },
	        //首页未读公告
	        announceUnView : function(){
                require.async('layer',function(){
                    layer.open({
                        id:'announce-index',
                        type: 2,
                        title: false,
                        closeBtn: 0,
                        area: ['900px', '80%'],
                        content: '/seeyon/portal/index.do?method=announceSecond',
                        success: function () {
                        }
                    });
                });
	        },
	        // 日历弹窗的实现
            openDateLayer: function () {
                require.async(['layer','calendar'], function () {
                    var boxH = 420, boxW = 555;
                    layer.open({
                        title: false,
                        shadeClose: true,
                        type: 2,
                        scrollbar: false,
                        area: [(boxW + 'px'), boxH + 'px'], //宽高
                        content: '/portal/workplat/canlender.jhtml'
                    });
                });
            },
	        // 弹出员工风采
	        openStyle: function(id){
	        	require.async('layer', function(){
	        		layer.open({
	        	        type: 2,
	        	        title: false,
	        	        shadeClose: true,
	        	        fixed: false, 
	        	        area: ['1024px', '90%'],
	        	        content: seeyonPath+"/seeyon/yxstyle.do?method=styleShow&id="+id
	        	    });
	        	});
	        },
	        //跨域关闭帮助中心iframe
	        closeIframe:function(){
	        	var body = window.top.document.body ? window.top.document.body : document.body;
                $(body).find('#help-box').remove();
                $(body).css('overflow','auto');
            },
	        //新闻资讯页视频播放
	        videoPlay : function(_title, path){
	        	if(undefined == path){
	        		return;
	        	}
	        	path = seeyonPath + path;
	        	/**/
	        	require.async(['layer','ckplayer'], function() {
	            	layer.open({
				        type : 1,
				        title : _title,
				        area : ['1000px', '80%'],
				        content:'<div id="a1" style="width:100%;height:100%;overflow: hidden"></div>',
		                 success: function(layero, index){
		                     var flashvars={
		                         f:path,
		                         c:0,
		                         b:1
		                     };
		                     var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
		                     var video=[path+'->video/mp4'];
	
		                     CKobject.embed(seeyonPath+'/seeyon/assets/js/libs/ckplayer/ckplayer.swf','a1','ckplayer_a1','100%','100%',false,flashvars,video);
		                 }
				    });
	            });
	        },
            //生日提醒弹窗
	        birthdayOpen:function (t) {
                    layer.open({
                        id: 'birthday-index',
                        type: 1,
                        skin: 'birth-transparent',
                        title: false,
                        closeBtn: true,
                        shadeClose: true,
                        area: ['867px','650px'],
                        time: t,
                        content: '<div class="birth-box" style="position: relative;">'
                        +'<img class="bg" src="../assets/img/public/birth/birth.png" alt="图片正在加载">'
                        +'<img class="belt" src="../assets/img/public/birth/belt.png" alt="">'
                        +'<img class="star1" src="../assets/img/public/birth/star1.png" alt="">'
                        +'<img class="star2" src="../assets/img/public/birth/star2.png" alt="">'
                        +'<img class="star3" src="../assets/img/public/birth/star1.png" alt="">'
                        +'<img class="star4" src="../assets/img/public/birth/star2.png" alt="">'
                        +'<img class="candle1" src="../assets/img/public/birth/candle1.png" alt="">'
                        +'<img class="candle2" src="../assets/img/public/birth/candle2.png" alt="">'
                        +'<img class="candle3" src="../assets/img/public/birth/candle3.png" alt="">'
                        +'<img class="balloon1" src="../assets/img/public/birth/balloon1.png" alt="">'
                        +'<img class="balloon2" src="../assets/img/public/birth/balloon2.png" alt="">'
                        +'</div>',
                        success: function ( layero, index ) {
                            $('.layui-layer-close2, .layui-layer-setwin').css({'width':'100%','height':'100%','background':'transparent','cursor':'default'});
                        },
                        end: function(){
                            //右上角关闭回调
                            $('.layui-layer-setwin').remove();
                        }
                    });
            }
	    }
    };

    Base.utils.init();
    module.exports = Base;
});