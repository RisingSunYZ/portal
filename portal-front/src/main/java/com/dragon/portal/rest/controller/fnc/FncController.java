package com.dragon.portal.rest.controller.fnc;

import com.dragon.portal.config.FtpConfig;
import com.dragon.portal.constant.YsportalConstant;
import com.dragon.portal.model.fnc.Opinion;
import com.dragon.portal.model.fnc.OpinionType;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.fnc.*;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.mhome.tools.common.JsonUtils;
import com.mhome.tools.vo.SimpleReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * @Title:财务服务
 * @Description:
 * @Author:zhaohaishan
 * @Since: 重构于2019年03月11日 上午10:25:30
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Controller
@RequestMapping("rest/portal/fnc")
@Api(value="门户首页（工作台）-财务服务", description = "门户首页（工作台）-财务服务", tags={"门户首页（工作台）-财务服务 /rest/portal/fnc"})
public class FncController extends BaseController {

    private static Logger logger = Logger.getLogger(FncController.class);
    @Autowired
    private FtpConfig ftpConfig;
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

    /**
     * 添加意见与建议
     * @Description:
     * @author zhaohaishan 2017年9月6日 下午3:55:54
     */
    @ResponseBody
    @GetMapping("/addOpinion")
    @ApiOperation("添加建议")
    @ApiImplicitParams({})
    public SimpleReturnVo addOpinion(HttpServletRequest request, HttpServletResponse response, String content, String typeId){
        // TODO Auto-generated method stub

        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "意见提出失败，请联系管理员！");

        UserSessionInfo session = this.getUserSessionInfo(request,response);
        OpinionType opinionTypeById = null;
        try {
            opinionTypeById = opinionTypeService.getOpinionTypeById(typeId);
            if(session==null){
                returnVo.setResponseMsg("您还没有登录");
                return returnVo;
            }else if(opinionTypeById==null){
                returnVo.setResponseMsg("请选着正确的意见分类");
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
        returnVo.setResponseCode(SUCCESS);
        returnVo.setResponseMsg("感谢您的提出的意见,请您耐心等待管理员反馈。");
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
    @RequestMapping("/getOpinionReadNum")
    public SimpleReturnVo getOpinionReadNum(HttpServletRequest request, HttpServletResponse response){
        UserSessionInfo session = this.getUserSessionInfo(request,response);
        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "获取数据失败！");
        try {
            if(StringUtils.isNotBlank(session.getNo())){
                Opinion opinion = new Opinion();
                opinion.setStatus(YsportalConstant.STATUS_ENABLED);
                opinion.setIsRead(YsportalConstant.STATUS_DISABLED);
                opinion.setCreatorNo(session.getNo());
                List<Opinion> all = opinionService.getAll(opinion);
                returnVo.setResponseCode(SUCCESS);
                returnVo.setResponseMsg(String.valueOf(all.size()));
            }
        }catch (Exception e) {
            logger.info("getOpinionRead 跟新意见读取状态失败");
            e.printStackTrace();
        }
        return returnVo;
    }
}
