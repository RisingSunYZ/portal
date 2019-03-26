package com.dragon.portal.rest.controller.fnc;

import com.dragon.portal.constant.YsportalConstant;
import com.dragon.portal.model.fnc.*;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.fnc.*;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.mhome.tools.common.JsonUtils;

import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @Title:财务服务
 * @Description:
 * @Author:zhaohaishan
 * @Since: 重构于2019年03月11日 上午10:25:30（liuxuan）
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Controller
@RequestMapping("rest/portal/fnc")
@Api(value="门户首页（工作台）-财务服务", description = "门户首页（工作台）-财务服务", tags={"门户首页（工作台）-财务服务 /rest/portal/fnc"})
public class FncController extends BaseController {

    private static Logger logger = Logger.getLogger(FncController.class);
    @Autowired
    private CommonProperties commonProperties;
    @Autowired
    private IMaterialFileService materialFileService;
    @Autowired
    private IMaterialFileTypeService materialFileTypeService;
    @Autowired
    private IFncOpinionTypeService opinionTypeService;
    @Autowired
    private IFncOpinionService opinionService;
    @Autowired
    private IFncContactUsService contactUsService;

    @ResponseBody
    @GetMapping("/index")
    @ApiOperation("财务服务首页 数据组装")
    @ApiImplicitParams({})
    public String index(HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "数据查询失败");
        try {
            Map<String, Object> dataMap = new HashMap<String, Object>();
            UserSessionInfo session = this.getUserSessionInfo(request,response);
            dataMap.put("session", session);
            Query query = new Query();
            query.setPageSize(3);
            MaterialFileType materialFileType = new MaterialFileType();
            PagerModel<MaterialFileType> pagerModel = this.materialFileTypeService.getPagerModelByQuery(materialFileType, query);
            dataMap.put("fileTypeList", pagerModel.getRows());
            query.setPageSize(10);
            int i= 0;
            Map<String,List<MaterialFile>> map = new HashMap<>();
            for(MaterialFileType temp : pagerModel.getRows()){
                i++;
                MaterialFile materialFile = new MaterialFile();
                materialFile.setTypeId(temp.getId());
                materialFile.setStatus(YsportalConstant.STATUS_ENABLED);
                PagerModel<MaterialFile> pmFile = materialFileService.getPagerModelByQuery(materialFile, query);
                map.put("fileList"+i, pmFile.getRows());
            }
            dataMap.put("fileListMap", map);
            //联系人
            ContactUs contactUs = new ContactUs();
            contactUs.setStatus(YsportalConstant.STATUS_ENABLED);
            query.setPageSize(2);
            PagerModel<ContactUs> pagerModelByQuery = contactUsService.getPagerModelByQuery(contactUs, query);
            dataMap.put("contactUsList",pagerModelByQuery.getRows());
            //意见建议
            Opinion opinion = new Opinion();
            opinion.setStatus(YsportalConstant.STATUS_ENABLED);
            opinion.setCreatorNo(session.getNo());
            List<Opinion> opinionList = opinionService.getAll(opinion);
            dataMap.put("opinionList", opinionList);
            returnVo.setCode(ReturnCode.SUCCESS);
            returnVo.setMsg("数据查询成功");
            returnVo.setData(dataMap);
        } catch (Exception e) {
            logger.info("FncController-index:",e);
        }
        return JsonUtils.toJson(returnVo);
    }

    /**
     * 原为 获取意见与建议页面
     * 现为 获取意见与建议页面内下拉框选项数据
     * @Description:
     * @author zhaohaishan 2017年9月6日 下午3:55:29
     */
    @ResponseBody
    @GetMapping("/getOpinionPage")
    @ApiOperation("获取意见与建议页面下拉框选项数据")
    @ApiImplicitParams({})
    public ReturnVo getOpinionPage() {
        // TODO Auto-generated method stub
        OpinionType opinionType = new OpinionType();
        List<OpinionType> opinionTypeList = new ArrayList<>();
        ReturnVo<List> returnVo = new ReturnVo(ReturnCode.FAIL,"查询数据失败");
        try {
             opinionTypeList = opinionTypeService.getAll(opinionType);
             if (null != opinionTypeList) {
                 returnVo.setCode(ReturnCode.SUCCESS);
                 returnVo.setMsg("获取数据成功");
                 returnVo.setData(opinionTypeList);
             }
        } catch (Exception e) {
            logger.info("FncController-index:getOpinionPage",e);
        }
        return returnVo;
    }

    /**
     * 添加意见与建议
     * @Description:
     * @author zhaohaishan 2017年9月6日 下午3:55:54
     */
    @ResponseBody
    @RequestMapping("/addOpinion")
    @ApiOperation("添加建议")
    @ApiImplicitParams({})
    public ReturnVo addOpinion(HttpServletRequest request, HttpServletResponse response, @RequestBody Map<String,String> map){
        // TODO Auto-generated method stub
        ReturnVo returnVo = new ReturnVo<>(ReturnCode.FAIL, "意见提出失败，请联系管理员！");
        String typeId = map.get("typeId");
        String content = map.get("content");
        UserSessionInfo session = this.getUserSessionInfo(request,response);
        OpinionType opinionTypeById = null;
        try {
            opinionTypeById = opinionTypeService.getOpinionTypeById(typeId);
            if(session==null){
                returnVo.setMsg("您还没有登录");
                return returnVo;
            }else if(opinionTypeById==null){
                returnVo.setMsg("请选着正确的意见分类");
                return returnVo;
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        Opinion opinion = new Opinion();
        opinion.setContent(content);
        opinion.setTypeId(typeId);
        opinion.setTypeName(opinionTypeById.getName());
        opinion.setCreatorTel(session.getMobile());
        opinion.setCreator(session.getName());
        opinion.setCreatorNo(session.getNo());
        opinion.setResponsibleNo(opinionTypeById.getResponsibleNo());
        opinion.setResponsiblePerson(opinionTypeById.getResponsibleName());
        try {
            opinionService.insertOpinionAndSendEmail(opinion);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        returnVo.setCode(ReturnCode.SUCCESS);
        returnVo.setMsg("感谢您的提出的意见,请您耐心等待管理员反馈。");
        return returnVo;
    }

    /**
     * 获取未读数量
     * @param request
     * @param response
     * @return
     * @Description:
     * @author zhaohaishan 2017年9月13日 下午4:41:46
     */
    @ResponseBody
    @GetMapping("/getOpinionReadNum")
    @ApiOperation("获取未读数量")
    @ApiImplicitParams({})
    public ReturnVo getOpinionReadNum(HttpServletRequest request, HttpServletResponse response){
        UserSessionInfo session = this.getUserSessionInfo(request,response);
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "获取数据失败！");
        try {
            if(StringUtils.isNotBlank(session.getNo())){
                Opinion opinion = new Opinion();
                opinion.setStatus(YsportalConstant.STATUS_ENABLED);
                opinion.setIsRead(YsportalConstant.STATUS_DISABLED);
                opinion.setCreatorNo(session.getNo());
                List<Opinion> all = opinionService.getAll(opinion);
                returnVo.setCode(ReturnCode.SUCCESS);
                returnVo.setMsg(String.valueOf(all.size()));
            }
        }catch (Exception e) {
            logger.info("getOpinionRead 跟新意见读取状态失败");
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * 更新已读状态
     * @param request
     * @param response
     * @Description:
     * @author zhaohaishan 2017年9月13日 下午4:41:57
     */
    @ResponseBody
    @GetMapping("/updateOpinionRead")
    @ApiOperation("更新已读状态")
    @ApiImplicitParams({})
    public void updateOpinionRead(HttpServletRequest request, HttpServletResponse response){
        UserSessionInfo session = this.getUserSessionInfo(request,response);
        try {
            if(StringUtils.isBlank(session.getNo())){
                return;
            }
            Opinion opinion = new Opinion();
            opinion.setStatus(YsportalConstant.STATUS_ENABLED);
            opinion.setIsRead(YsportalConstant.STATUS_DISABLED);
            opinion.setCreatorNo(session.getNo());
            List<Opinion> all = opinionService.getAll(opinion);
            StringBuffer ids = new StringBuffer();
            int i = 0;
            int size = all.size();
            for(Opinion temp : all){
                i++;
                ids.append(temp.getId());
                if(i!=size)ids.append(",");
            }
            opinion.setIsRead(YsportalConstant.STATUS_ENABLED);
            opinionService.updateOpinionByIds(ids.toString(),opinion);
        } catch (Exception e) {
            logger.info("updateOpinionRead 跟新意见读取状态失败");
            e.printStackTrace();
        }
    }

    /**
     * 文件下载
     * @Description:
     * @param request
     * @param response
     * @return
     */
    @GetMapping("/download")
    @ApiOperation("下载")
    @ApiImplicitParams({})
    public String downloadFile(String id, HttpServletRequest request, HttpServletResponse response) {
        BufferedInputStream bis = null;
        try {
            String ftpHost = commonProperties.getFtpHost();
            MaterialFile materialFileById = materialFileService.getMaterialFileById(id);
            String userAgent = request.getHeader("User-Agent");
            String fileName = "";
            //针对IE或者以IE为内核的浏览器：
            if (userAgent.contains("MSIE")||userAgent.contains("Trident")) {
                fileName = java.net.URLEncoder.encode(materialFileById.getName(), "UTF-8");
            } else {
                //非IE浏览器的处理：
                fileName = new String(materialFileById.getName().getBytes("UTF-8"),"iso-8859-1");
            }
            String path = materialFileById.getFilePath();
            URL url = new URL(ftpHost+path);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();//利用HttpURLConnection对象,我们可以从网络中获取网页数据.
            conn.setDoInput(true);
            conn.connect();
            InputStream is = conn.getInputStream(); //得到网络返回的输入流
            response.setContentType("application/force-download");// 设置强制下载不打开
            response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);// 设置文件名
            byte[] buffer = new byte[1024];
            bis = new BufferedInputStream(is);
            OutputStream os = response.getOutputStream();
            int i = bis.read(buffer);
            while (i != -1) {
                os.write(buffer, 0, i);
                i = bis.read(buffer);
            }
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
        } finally {
            if (bis != null) {
                try {
                    bis.close();
                } catch (IOException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    /**
     * 原为 资料下载列表页面
     * 现为 资料下载列表页面内数据
     * @return
     * @Description:
     * @author zhaohaishan 2017年9月13日 下午3:23:06
     */
    @ResponseBody
    @GetMapping("/materialFilePage")
    @ApiOperation("下载页面数据")
    @ApiImplicitParams({})
    public ReturnVo materialFilePage() {
        MaterialFileType materialFileType = new MaterialFileType();
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "数据获取失败" );
        Query query = new Query();
        try {
            PagerModel<MaterialFileType> pmpmFileType = materialFileTypeService.getPagerModelByQuery(materialFileType, query);
            if (null != pmpmFileType) {
                returnVo.setCode(ReturnCode.SUCCESS);
                returnVo.setMsg("数据获取成功");
                returnVo.setData(pmpmFileType);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * 资料文件数据
     * @param materialFile
     * @return
     * @Description:
     * @author zhaohaishan 2017年9月13日 下午3:23:23
     */
    @ResponseBody
    @GetMapping("/ajaxListMaterialFile")
    @ApiOperation("资料文件数据")
    @ApiImplicitParams({})
    public ReturnVo ajaxList(MaterialFile materialFile,Integer page,Integer rows) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"获取数据失败");
        PagerModel<MaterialFile> pm = null;
        Query query = new Query();
        query.setPageSize(rows);
        query.setPageIndex(page-1);
        try {
            materialFile.setStatus(YsportalConstant.STATUS_ENABLED);
            pm = this.materialFileService.getPagerModelByQuery(materialFile, query);
            if (null != pm) {
                returnVo.setData(pm);
                returnVo.setCode(ReturnCode.SUCCESS);
                returnVo.setMsg("获取数据成功");
            }
        } catch (Exception e) {
            logger.error("MaterialFileController-ajaxList:"+e);
            e.printStackTrace();
        }
        return returnVo;
    }

}
