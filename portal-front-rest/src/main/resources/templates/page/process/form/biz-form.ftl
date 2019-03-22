<!DOCTYPE HTML>
<html lang="en">
<head>
    <title>亚厦股份 - 业务表单</title>
    <link rel="stylesheet" href="/assets/js/libs/bootstrap-3.3.7/css/bootstrap.css"/>
<#include "/form/form_include.ftl">
    <link rel="stylesheet" href="/assets/css/easyui-form.css"/>
    <style>
    	${(bizFormInfo.cssContent)!''}
    </style>
</head>
<body >

<#-- 表单内容 -->
<form id="jsProcessForm" class="jsValidForm">
<#-- 判断节点是否可以编辑：值为true可以编辑；值为其他不可以编辑 -->
    <input value="${(isEditData)!''}" type='hidden' id="jsIsEditData" />
${(bizFormInfo.htmlContent)!''}
</form>

</body>
<script>

    var processMainVoJson = ${processMainVoJson!"{}"};
    var loginUserJson = ${loginUserJson!"{}"};

    seajs.use('js/modules/base');
    // 组装数据接口
    var ApiData = {
        doPost:function(fn, data){
            ApiData['"'+fn+'"'] = function(params, callback){
                data['params'] = params;
                $.ajax({
                    url:'/common/doApiData.jhtml',
                    data:data,
                    type:'POST',
                    dataType:'JSON',
                    async:false,
                    beforeSend:function(){

                    },
                    success:function(dt){
                        callback(dt);
                    }, error:function(){
                        console.error('接口异常！');
                    }
                });
            }
        }
        // 获取接口数据
	<#if (bizFormInfo.bizFormDatas)??>
		<#list bizFormInfo.bizFormDatas as item>
            ,${item.method}: function(params, callback){
            var data = {className:'${item.className}', method:'${item.method}', version:'${item.version}'};
            if(params){
                data['params'] = params;
            }
            $.ajax({
                url:'/common/doApiData.jhtml',
                data:data,
                type:'POST',
                dataType:'JSON',
                async:false,
                beforeSend:function(){

                },
                success:function(dt){
                    callback(dt);
                }, error:function(){
                    console.error('接口异常！');
                }
            });
        }
		</#list>
	</#if>
    }
	<#--
    // 获取接口数据
    <#if (bizFormInfo.bizFormDatas)??>
        <#list bizFormInfo.bizFormDatas as item>
        ApiData.doPost('${item.method}', {className:'${item.className}', method:'${item.method}', version:'${item.version}'});
        </#list>
    </#if>
-->

    // 显示JS内容
	${(bizFormInfo.jsContent)!''}

    /**
     * 表单公共的引用类
     */
    /*
    define("js/modules/form/biz-form-main",function(require,exports,module){
        require.async('layer');
        require('validform');
        require('serializejson');
        //require('js/modules/form/form-common');
        var pLayer = null;
        BizForm={
            init:function(){
                console.log(processMainVoJson);
                console.log(loginUserJson);
            }
        }
        module.exports = BizForm;
    });
    seajs.use(['js/modules/form/biz-form-main'], function (m) {
        m.init();
    });
    */

    YSForm = {
        formSubmit: function () {
            return BizForm.save(2);
        },
        formSave: function () {
            //layer.msg('save');
            return BizForm.save(1);
        }
        //,
        // 审批节点根据条件(是否可以编辑)调用此方法
        // formApprove: function(callback){
        // expAccount.formApprove(callback);
        // }
    };

</script>
</html>
