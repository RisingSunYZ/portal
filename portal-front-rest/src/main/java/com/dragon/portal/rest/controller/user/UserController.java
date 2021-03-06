package com.dragon.portal.rest.controller.user;

import com.dragon.portal.component.IUserLoginComponent;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.idm.IIdmService;
import com.dragon.portal.service.user.IUserLoginService;
import com.dragon.portal.utils.CommUtil;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.JsonUtils;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ecnice.privilege.vo.idm.IdmReturnEntity;
import com.ecnice.privilege.vo.idm.IdmUser;
import com.ys.tools.pager.PagerModel;
import com.ys.tools.pager.Query;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.OrgTreeApiVo;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 用户相关
 */
@RestController
@RequestMapping("/rest/user")
@Api(value="用户信息")
public class UserController extends BaseController {

    private static Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    IPersonnelApi personnelApi;
    @Autowired
    IOrgApi orgApi;
    @Autowired
    IIdmService idmService;
    @Autowired
    IUserLoginService userLoginService;
    @Autowired
    Environment environment;
    @Autowired
    IUserLoginComponent userLoginComponent;
    @Autowired
    CommonProperties commonProperties;

    @ApiOperation("用户IDM登录回调")
    @GetMapping("/userLogin")
    public void userLogin(HttpServletRequest request, HttpServletResponse response){
        try {
            Cookie siamtgt = CommUtil.getCookieByName(request, "SIAMTGT");
            if(null != siamtgt){
                IdmReturnEntity idmReturnEntity = idmService.checkLoginStatus(siamtgt.getValue());
                if(null != idmReturnEntity){
                    IdmUser user = idmReturnEntity.getUser();
                    if(null != user){
                        //讲用户信息存储session
                        ReturnVo returnVo = userLoginService.loginCallback(idmReturnEntity.getUser().getUid(), request.getSession(), response);
                        if(ReturnCode.SUCCESS.equals(returnVo.getCode())){
                            response.getWriter().write("<script>top.location.href='"+environment.getProperty("idm.callback.success.url")+"'</script>"); // 授权认证成功，跳转到主页
                            return ;
                        }else{
                            logger.error("UserController-userLogin:用户IDM登录用户信息存储Session失败");
                        }
                    }
                }else{
                    logger.error("UserController-userLogin:用户IDM登录判断登录状态失败");
                }
            }else{
                logger.error("UserController-userLogin:用户IDM登录回调获取Cookie失败");
            }
            response.getWriter().write("<script>top.location.href='"+environment.getProperty("idm.callback.fail.url")+"'</script>"); // 授权认证失败
        } catch (Exception e) {
            logger.error("UserController-userLogin:用户IDM登录回调失败"+e);
            e.printStackTrace();
        }
    }

    /**
     * @param request
     * @param response
     * @return
     * @Description:获取用户信息
     */
    @GetMapping("/currentUser")
    @ApiOperation("获取用户信息")
    public ReturnVo currentUser(String siamTgt, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询数据异常");

        UserSessionInfo userSessionInfo = getUserSessionInfo(request, response);

        if(userSessionInfo == null){
            // 获取Cookiej里面值
//            String siamTgt = request.getParameter("siamTgt");
            if(StringUtils.isBlank(siamTgt)){
                Cookie cookie = CommUtil.getCookieByName(request, "SIAMTGT");
                siamTgt = null == cookie?null:cookie.getValue();
            }
            userSessionInfo = userLoginComponent.getCurrentUser(siamTgt, request, response);
            if(null != userSessionInfo){
                userSessionInfo.setUserImgUrl (StringUtils.isNotBlank(userSessionInfo.getUserImgUrl())?(commonProperties.getFtpHost() + userSessionInfo.getUserImgUrl()):null);
                returnVo.setData(userSessionInfo);
                returnVo.setCode(ReturnCode.SUCCESS);
                returnVo.setMsg("查询当前登录用户成功！");
            }else{
                returnVo.setCode(ReturnCode.FAIL);
                returnVo.setMsg("查询当前登录用户失败！");
            }
        }else{
            returnVo.setData(userSessionInfo);
            returnVo.setCode(ReturnCode.SUCCESS);
            returnVo.setMsg("获取数据成功！");
        }
        return returnVo;
    }


    /**
     * @param userNo
     * @return
     * @Description:通过工号获取人员信息
     */
    @ApiOperation("通过工号获取人员信息")
    @ApiImplicitParam(value="人员工号",name="userNo",paramType = "query")
    @RequestMapping(value = "/getUserByNo" ,method = RequestMethod.GET)
    public String getUserByNo(String userNo,HttpServletRequest request, HttpServletResponse response) {
        Map<String,Object> person =new HashMap<String,Object>();
        try{
            PersonnelApiVo personVo=new PersonnelApiVo();
            if(StringUtils.isBlank(userNo) || "undefined".equals(userNo)){
                UserSessionInfo userSessionInfo = getLoginUser(request, response);
                userNo=userSessionInfo.getNo();
            }
            if(StringUtils.isNotBlank(userNo)) {
                userNo = base64Decode(userNo);
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> vo = personnelApi.getPersonnelApiVoByNo(userNo);
                if (vo != null && vo.getCode() == UcenterConstant.SUCCESS && vo.getData() != null) {
                    personVo = vo.getData();
                } else {
                    List<String> usernos = new ArrayList<String>();
                    usernos.add(userNo);
                    com.ys.tools.vo.ReturnVo<List<PersonnelApiVo>> vo2 = personnelApi.getPersonnelByIdsList(usernos);
                    if (vo2 != null && vo2.getCode() == UcenterConstant.SUCCESS && CollectionUtils.isNotEmpty(vo2.getData())) {
                        personVo = vo2.getData().get(0);
                    }
                }
                person.put("id", personVo.getId());
                person.put("userNo", personVo.getNo());
                person.put("userName", personVo.getName());
                person.put("userHead",commonProperties.getFtpHost() + personVo.getHeadImg());
                person.put("deptId", personVo.getDeptId());
                person.put("deptName", personVo.getDeptName());
                person.put("parentDeptId", personVo.getParentDeptId());
                person.put("parentDeptName", personVo.getParentDeptName());
                person.put("jobStation", personVo.getJobStation());
                person.put("companyName", personVo.getCompanyName());
                person.put("mobilePhone", personVo.getMobilePhone());
                person.put("shortPhone", personVo.getShortPhone());
                person.put("positionLevel", personVo.getPositionName());
                person.put("postname", personVo.getPostname());

                Double year=0.0;
                DecimalFormat df = new DecimalFormat("#0.0");
                SimpleDateFormat sdf=new SimpleDateFormat("yyyy年MM月dd日");
                if(personVo.getEnterTime()!=null){
                    year= (Double.valueOf((System.currentTimeMillis()-personVo.getEnterTime().getTime()))/1000/60/60/24/365);
                    person.put("enterTime",sdf.format(personVo.getEnterTime()));
                }
                person.put("year",df.format(year));
            }
        }catch (Exception e){
            e.printStackTrace();
            logger.error("ApiUserController-getUserByNo"+e);
        }
        return JsonUtils.toJson(person);
    }
    /**
     * 加载人员列表数据
     * @param personnelApiVo
     * @param query
     * @author xietongjian 2016 上午10:10:22
     */
    @ApiOperation("加载人员列表数据")
    @RequestMapping(value = "/ajaxListPerson",method = RequestMethod.GET)
    public String ajaxListPerson( @ApiParam("人员对象") PersonnelApiVo personnelApiVo,@ApiParam("分页对象") Query query) {
        PagerModel<PersonnelApiVo> pm = new PagerModel<PersonnelApiVo>();
        if(query != null){
            if(StringUtils.isNotBlank(query.getPage())){
                query.setPageSize(query.getRows());
            }
        }
        try {
            com.ys.tools.vo.ReturnVo<PagerModel<PersonnelApiVo>> returnVo = personnelApi.getPersonnel(personnelApiVo, query);
            if(null != returnVo && UcenterConstant.SUCCESS == returnVo.getCode().intValue()){
                pm = returnVo.getData();
            }
        } catch (Exception e) {
            logger.error("CommonController-ajaxListPerson:"+e);
            e.printStackTrace();
        }
        Map<String, Object> maps = new HashMap<>();
        maps.put("list", pm.getRows());
        Map<String, Object> pageMap = new HashMap<>();
        pageMap.put("current", StringUtils.isNotBlank(query.getPage())?Integer.parseInt(query.getPage()):1);
        pageMap.put("pageSize", query.getRows());
        pageMap.put("total", pm.getTotal());
        maps.put("pagination", pageMap);
        return JsonUtils.toJson(maps);
    }
    /**
     * 加载组织机构数据
     * @author xietongjian 2016 上午10:10:22
     */
    @ApiOperation("加载组织机构数据")
    @RequestMapping(value = "/ajaxListOrgTree",method = RequestMethod.GET)
    public String ajaxListOrgTree() {
        List<OrgTreeApiVo> orgTreeList = new ArrayList<OrgTreeApiVo>();
        try {
            com.ys.tools.vo.ReturnVo<OrgTreeApiVo> returnVo =  orgApi.getOrgTree();
            if(null != returnVo && UcenterConstant.SUCCESS == returnVo.getCode().intValue()){
                List<OrgTreeApiVo> orgTreeListTmp = returnVo.getDatas();
                for (OrgTreeApiVo vo:orgTreeListTmp){
                    if("0".equals(vo.getpId())){
                        vo.setOrgTreeApiVos(getChildrenDept(vo.getId(),orgTreeListTmp));
                        orgTreeList.add(vo);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("CommonController-ajaxListOrgTree:"+e);
            e.printStackTrace();
        }
        return JsonUtils.toJson(orgTreeList);
    }
    private List<OrgTreeApiVo> getChildrenDept(String pid,List<OrgTreeApiVo> treeList){
        List<OrgTreeApiVo> list=new ArrayList<OrgTreeApiVo>();
        for (OrgTreeApiVo vo:treeList){
            if(pid.equals(vo.getpId())){
                vo.setOrgTreeApiVos(getChildrenDept(vo.getId(),treeList));
                list.add(vo);
            }
        }
        return list;
    }
    /**
     * 对用户编号进行解密
     * @param str
     * @return
     */
    private String base64Decode(String str){
        if(StringUtils.isNotBlank(str)){
            Base64.Decoder decoder = Base64.getDecoder();
            try{
                Integer.parseInt(str);
                return str;
            }catch (Exception e){
                return new String(decoder.decode(str));
            }
        }
        return str;
    }
}
