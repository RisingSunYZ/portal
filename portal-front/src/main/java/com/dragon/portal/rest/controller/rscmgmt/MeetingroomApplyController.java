package com.dragon.portal.rest.controller.rscmgmt;

import com.dragon.flow.api.IFlowApi;
import com.dragon.portal.component.IProcessMainComponent;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.model.rscmgmt.Meetingroom;
import com.dragon.portal.model.rscmgmt.MeetingroomAddr;
import com.dragon.portal.model.rscmgmt.MeetingroomApply;
import com.dragon.portal.model.rscmgmt.MeetingroomTools;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.rscmgmt.IMeetingroomAddrService;
import com.dragon.portal.service.rscmgmt.IMeetingroomApplyService;
import com.dragon.portal.service.rscmgmt.IMeetingroomService;
import com.dragon.portal.service.rscmgmt.IMeetingroomToolsService;
import com.dragon.portal.vo.rscmgmt.MeetingroomApplyVo;
import com.dragon.portal.vo.rscmgmt.MeetingroomMyApplyVo;
import com.dragon.portal.vo.rscmgmt.MeetingroomViewVo;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.tools.vo.SimpleReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.user.Department;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.map.HashedMap;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * @Description:会议室申请表Controller
 * @Author:YangZhao
 * @Since:2019/3/20 14:09
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2018 ~ 2026 版权所有
 */
@RestController
@RequestMapping("/rest/portal/rscmgmt/meetingroom")
@Api(value="会议室申请", description = "会议室申请", tags={"会议室申请 /rest/portal/rscmgmt/meetingroom"})
public class MeetingroomApplyController extends BaseController {
    private static Logger logger = Logger.getLogger(MeetingroomApplyController.class);

    @Resource
    private IMeetingroomApplyService meetingroomApplyService;
    @Resource
    private IMeetingroomService meetingroomService;
    @Resource
    private IMeetingroomAddrService meetingroomAddrService;
    @Resource
    private IMeetingroomToolsService meetingroomToolsService;
    @Resource
    private IPersonnelApi personnelApi;
    @Resource
    private IOrgApi orgApi;
    @Resource
    private IFlowApi flowApi;
//    @Resource
//    private IMeetingroomApproverDao IMeetingroomApproverDao;
    @Resource
    IProcessMainComponent processMainComponent;

    /**
     * @Author YangZhao
     * @Description 获取会议室地点以及用具
     * @Date 19:09 2019/3/21
     * @Param []
     * @return java.util.Map<java.lang.String,java.lang.Object>
     **/
    @GetMapping("/getMeetingAddrsTools")
    @ApiOperation("获取会议室地点以及用具")
    public Map<String,Object> getMeetingAddrsTools() {
        Map<String,Object> res = new HashMap<>();
        try {
            //查询会议室地点数据
            MeetingroomAddr meetingroomAddr = new MeetingroomAddr();
            meetingroomAddr.setDelFlag(PortalConstant.NO_DELETE_FLAG);
            List<MeetingroomAddr> meetingroomAddrs = meetingroomAddrService.getAll(meetingroomAddr);
            //加载会议室用具
            MeetingroomTools toolQuery = new MeetingroomTools();
            toolQuery.setDelFlag(PortalConstant.NO_DELETE_FLAG);
            List<MeetingroomTools> meetingroomTools = this.meetingroomToolsService.getAll(toolQuery);
            res.put("meetingroomTools", meetingroomTools);
            res.put("meetingroomAddrs", meetingroomAddrs);
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-getMeetingAddrsTools-获取会议室地点以及用具失败:" + e);
            e.printStackTrace();
        }

        return res;
    }

    /**
     * @Author YangZhao
     * @Description 获取申请会议室详情
     * @Date 9:41 2019/3/22
     * @Param [mrId, applyNo, request, response]
     * @return java.util.Map<java.lang.String,java.lang.Object>
     **/
    @GetMapping("/apply_room")
    @ApiOperation("获取申请会议室详情")
    public Map<String,Object> apply_room(String mrId, String applyNo,@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
        UserSessionInfo loginUser = getUserSessionInfo(request, response);
        Map<String,Object> res = new HashedMap();
        try {
            //如果是修改，判断申请单号是否为空，如果不为空则为修改读取数据
            if (StringUtils.isNotBlank(applyNo)) {
                MeetingroomApplyVo meetingroomApplyVo = this.meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
                if (null != meetingroomApplyVo) {
                    mrId = meetingroomApplyVo.getMeetingroomId();
                }
                res.put("applyVo", meetingroomApplyVo);
            }
            Meetingroom meetingroom = meetingroomService.getMeetingroomById(mrId);
            if (null != meetingroom) {
                MeetingroomAddr meetingroomAddr = meetingroomAddrService.getMeetingroomAddrById(meetingroom.getAddrId());
                res.put("meetingroomAddr", meetingroomAddr);
            }

            res.put("loginUser", loginUser);
            res.put("meetingroom", meetingroom);
            res.put("currentDateTime", new Date());
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-apply_room-申请会议室、调整会议时间异常:" + e);
            e.printStackTrace();
        }
        return res;
    }

    /**
     * @Author YangZhao
     * @Description 加载会议室数据(根据当前用户所在部门开放权限)
     * @Date 14:17 2019/3/20
     * @Param [request, response, pageNumber, pageSize, meetingroomViewVo, query, sessionId]
     * @return java.lang.String
     **/
    @PostMapping("/ajaxList")
    @ApiOperation("加载会议室数据(根据当前用户所在部门开放权限)")
    public PagerModel<MeetingroomViewVo> ajaxList(@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response,@RequestBody MeetingroomViewVo meetingroomViewVo, Query query) {
        PagerModel<MeetingroomViewVo> meetingRoomViewPm = new PagerModel<>();
        try {
            UserSessionInfo user = this.getUserSessionInfo(request, response);
            if (null != user && StringUtils.isNotBlank(user.getNo())) {
                meetingroomViewVo.setRangeDeftId(getRangeDeftId(user.getDepId()));
                meetingroomViewVo.setStatus(PortalConstant.YES);
                if(StringUtils.isNotBlank(meetingroomViewVo.getConfToolsStr())) {
                	String[] toolIds = meetingroomViewVo.getConfToolsStr().split(PortalConstant.SEPARATOR);
                	List<String> toolIdsList = new ArrayList<String>();
                	for (String id : toolIds) {
                		toolIdsList.add(id);
					}
                	meetingroomViewVo.setConfTools(toolIdsList);
                }
                
                meetingRoomViewPm = this.meetingroomApplyService.getPagerModelByMeetingroomViewVo(meetingroomViewVo, query);
            }
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-ajaxList-加载会议室数据失败:" + e);
            e.printStackTrace();
        }
        return meetingRoomViewPm;
    }

    /**
     * @Author YangZhao
     * @Description 根据日期加载会议室申请数据
     * @Date 16:44 2019/3/21
     * @Param [request, response, meetingroomViewVo]
     * @return com.dragon.portal.vo.rscmgmt.MeetingroomViewVo
     **/
    @PostMapping("/ajaxApplyList")
    @ApiOperation("根据日期加载会议室申请数据")
    public MeetingroomViewVo ajaxApplyList(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response,@RequestBody MeetingroomViewVo meetingroomViewVo) {
        MeetingroomViewVo meetingRoomViewPm = new MeetingroomViewVo();
        try {
            UserSessionInfo user = this.getUserSessionInfo(request, response);
            if (null != user && StringUtils.isNotBlank(user.getNo())) {
                meetingRoomViewPm = this.meetingroomApplyService.getMeetingroomViewVoByMeetroomId(meetingroomViewVo, user.getNo());
            }
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-ajaxApplyList-根据日期加载会议室申请数据异常:" + e);
            e.printStackTrace();
        }
        return meetingRoomViewPm;
    }
//
//    //添加、修改的UI
//    @RequestMapping("/input")
//    public String input(ModelMap model, String id, String sessionId) {
//        try {
//            if (StringUtils.isNotBlank(id)) {
//                MeetingroomApply meetingroomApply = this.meetingroomApplyService.getMeetingroomApplyById(id);
//                model.addAttribute("meetingroomApply", meetingroomApply);
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-input:" + e);
//            e.printStackTrace();
//        }
//        return "/rscmgmt/meetingroom_apply_input";
//    }
//
    /**
     * @Author YangZhao
     * @Description 会议室添加修改
     * @Date 10:14 2019/3/22
     * @Param [request, response, meetingroomApplyVo]
     * @return com.dragon.tools.vo.ReturnVo
     **/
    @PostMapping("/save")
    @ApiOperation("会议室添加修改")
    public ReturnVo save(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response,@RequestBody MeetingroomApplyVo meetingroomApplyVo) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        SimpleReturnVo simpleReturnVo = new SimpleReturnVo(com.ys.tools.common.ReturnCode.FAIL, "修改失败");
        try {
            UserSessionInfo user = this.getUserSessionInfo(request, response);
            if (null != user && StringUtils.isNotBlank(user.getNo())) {
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> rVo = this.personnelApi.getPersonnelApiVoByNo(user.getNo());
                if (null != rVo && UcenterConstant.SUCCESS == rVo.getCode()) {
                    PersonnelApiVo personnel = rVo.getData();
                    String userName = user.getNo();
                    Meetingroom mr = this.meetingroomService.getMeetingroomById(meetingroomApplyVo.getMeetingroomId());
                    MeetingroomAddr mrAddr = meetingroomAddrService.getMeetingroomAddrById(mr.getAddrId());
                    meetingroomApplyVo.setProposerNo(userName);
                    meetingroomApplyVo.setProposerName(user.getName());
                    meetingroomApplyVo.setDeptId(personnel.getDeptId());
                    meetingroomApplyVo.setDeptName(personnel.getDeptName());
                    meetingroomApplyVo.setDetailAddress(mrAddr.getAddress() + "-" + mr.getFloorNum() + "楼-" + mr.getName());
                    if (StringUtils.isBlank(meetingroomApplyVo.getId())) {
                        //添加申请会议室
                        simpleReturnVo = this.meetingroomApplyService.insertMeetingroomApplyByCycle(meetingroomApplyVo);
                    } else {
                        //修改申请会议室
                        simpleReturnVo = this.meetingroomApplyService.updateMeetingroomApplyByCycle(meetingroomApplyVo);
                    }

                    if(com.ys.tools.common.ReturnCode.SUCCESS == simpleReturnVo.getResponseCode()){
                        returnVo.setCode(ReturnCode.SUCCESS);
                    }else{
                        returnVo.setCode(ReturnCode.FAIL);
                    }
                    returnVo.setMsg(simpleReturnVo.getResponseMsg());
                }
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-save-修改会议室数据失败:" + e);
            e.printStackTrace();
        }
        return returnVo;
    }
//
//    //我的申请列表
//    @RequestMapping("/myApplyList")
//    public String myApplyList(ModelMap model, String sessionId) {
//        model.addAttribute("sessionId", sessionId);
//        try {
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//        return "/rscmgmt/meeting/meetingroom_myapply_list";
//    }
//
    /**
     * @Author YangZhao
     * @Description //查询我的申请加载数据
     * @Date 19:13 2019/3/21
     * @Param [model, meetingRoomApply, query, request, response, sessionId]
     * @return java.lang.String
     **/
    @PostMapping("/myApplyAjaxList")
    @ApiOperation("查询我的申请加载数据")
    public PagerModel<MeetingroomMyApplyVo> myApplyAjaxList(@RequestBody MeetingroomApply meetingRoomApply, Query query,@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
        PagerModel<MeetingroomMyApplyVo> myApplyPm = new PagerModel<>();
        try {
            UserSessionInfo user = this.getUserSessionInfo(request, response);
            meetingRoomApply.setProposerNo(user.getNo());
            myApplyPm = this.meetingroomApplyService.getPagerModelByMeetingroomMyApplyVo(meetingRoomApply, query);
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-myApplyAjaxList-查询我的申请加载数据失败:" + e);
            e.printStackTrace();
        }
        return myApplyPm;
    }
//
//    /**
//     * 取消申请
//     *
//     * @param request
//     * @param applyNo
//     * @param sessionId
//     * @return
//     * @Description:
//     * @author xietongjian 2017 下午8:29:02
//     */
//    @RequestMapping("/cancelApply")
//    public String cancelApply(ModelMap model, HttpServletRequest request, String applyNo, String sessionId) {
//
//
//        return "/rscmgmt/meeting/meetingroom_cancelapply";
//    }
//
//    //修改状态
//    @ResponseBody
//    @RequestMapping("/updateStatus")
//    public String updateStatus(HttpServletRequest request, HttpServletResponse response, String applyNo, String cancelRemark, Integer status, String sessionId) {
//        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "修改状态失败");
//        try {
//            UserSessionInfo user = this.getUserSessionInfo(request, response);
//            if (null != user && StringUtils.isNotBlank(user.getNo())) {
//                MeetingroomApplyVo meetingroomApplyVo = new MeetingroomApplyVo();
//                meetingroomApplyVo.setApplyNo(applyNo);
//                meetingroomApplyVo.setProposerNo(user.getNo());
//                meetingroomApplyVo.setProposerNo(user.getName());
//                meetingroomApplyVo.setStatus(MeetingApplyStatusEnum.CANCEL.getCode());
//                meetingroomApplyVo.setMessage(cancelRemark);
//                this.meetingroomApplyService.updateMeetingroomApplyStatus(meetingroomApplyVo);
//                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
//                try {
//                    if (StringUtils.isNotBlank(meetingRoom.getTaskId())) {
//                        EndApiVo vo = new EndApiVo();
//                        vo.setProcessInstanceId(meetingRoom.getTaskId());
//                        vo.setMessage(ProcessStatusEnum.ZZ.getMsg());
//                        vo.setUserCode(user.getNo());
//                        flowApi.stopProcess(vo);//取消的时候终止流程
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//
//                returnVo = new SimpleReturnVo(SUCCESS, "取消申请成功！");
//            } else {
//                returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-updateStatus:" + e);
//            e.printStackTrace();
//        }
//        return JsonUtils.toJson(returnVo);
//    }
//
//
//    //删除
//    @ResponseBody
//    @RequestMapping("/dels")
//    public String dels(HttpServletRequest request, HttpServletResponse response, String ids, String sessionId) {
//        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "删除失败");
//        try {
//            UserSessionInfo user = this.getUserSessionInfo(request, response);
//            if (null != user && StringUtils.isNotBlank(user.getNo())) {
//                String userName = user.getNo();
//                if (StringUtils.isNotBlank(ids)) {
//                    MeetingroomApply meetingroomApply = new MeetingroomApply();
//                    meetingroomApply.setUpdator(userName);
//                    meetingroomApply.setDelFlag(PortalConstant.DEL_FLAG);
//                    this.meetingroomApplyService.updateMeetingroomApplyByIds(ids, meetingroomApply);//逻辑删除
//                    //this.meetingroomApplyService.delMeetingroomApplyByIds(ids); //物理删除
//                }
//                returnVo = new SimpleReturnVo(SUCCESS, "删除成功");
//            } else {
//                returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-dels:" + e);
//            e.printStackTrace();
//        }
//        return JsonUtils.toJson(returnVo);
//    }
//
    private List<String> getRangeDeftId(String deptId) {
        if (StringUtils.isNotBlank(deptId)) {
            List<String> rangeDeftId = new ArrayList<String>();
            com.ys.tools.vo.ReturnVo<Department> Departments = orgApi.getAllParentsDeptById(deptId);
            for (Department temp : Departments.getDatas()) {
                rangeDeftId.add(temp.getId());
            }
            return rangeDeftId;
        } else {
            return null;
        }
    }
//
//    /**
//     * 方法描述：取消流程
//     * @param request
//     * @param response
//     * @param applyNo
//     * @param sessionId
//     * @return
//     */
//    @ResponseBody
//    @RequestMapping("/cancelProcess")
//    public String cancelProcess(HttpServletRequest request, HttpServletResponse response, String applyNo, String sessionId) {
//        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "修改状态失败");
//        try {
//            UserSessionInfo user = this.getUserSessionInfo(request, response);
//            if (null != user && StringUtils.isNotBlank(user.getNo())) {
//                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
//                EndApiVo vo = new EndApiVo();
//                vo.setProcessInstanceId(meetingRoom.getTaskId());
//                vo.setMessage(ProcessStatusEnum.ZZ.getMsg());
//                vo.setUserCode(user.getNo());
//                com.dragon.tools.vo.ReturnVo<String> vo2= flowApi.stopProcess(vo);//取消的时候终止流程
//                if (FlowConstant.SUCCESS.equals(vo2.getCode())) {
//                    returnVo.setResponseCode(PortalConstant.SUCCESS);
//                    returnVo.setResponseMsg("流程终止成功");
//                }
//            } else {
//                returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-cancelProcess:" + e);
//            e.printStackTrace();
//        }
//        return JsonUtils.toJson(returnVo);
//    }
//
//
//    /**
//     * 方法描述：重新发起流程
//     * @param request
//     * @param response
//     * @param applyNo
//     * @param sessionId
//     * @return
//     */
//    @ResponseBody
//    @RequestMapping("/submitProcess")
//    public String submitProcess(HttpServletRequest request, HttpServletResponse response, String applyNo, String sessionId) {
//        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "修改状态失败");
//        try {
//            UserSessionInfo user = this.getUserSessionInfo(request, response);
//            if (null != user && StringUtils.isNotBlank(user.getNo())) {
//                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
//                meetingRoom.setStatus(MeetingApplyStatusEnum.WAIT_APPROVE.getCode());
//                meetingroomApplyService.updateMeetingroomApplyStatus(meetingRoom);
//                CompleteTaskApiVo params = new CompleteTaskApiVo();
//                params.setType(CommentTypeEnum.CXTJ);
//                params.setUserCode(user.getNo());
//                params.setProcessInstanceId(meetingRoom.getTaskId());
//
//                MeetingroomApprover meetingroomApproverWhere = new MeetingroomApprover();
//                meetingroomApproverWhere.setMettingroomId(meetingRoom.getMeetingroomId());
//                List<MeetingroomApprover> MeetingroomApproverList = IMeetingroomApproverDao.getAll(meetingroomApproverWhere);
//                Map<String, Object> variables = new HashMap<String, Object>();
//                List<String> userIds = new ArrayList<String>();
//                for (MeetingroomApprover temp : MeetingroomApproverList) {
//                    userIds.add(temp.getApproverNo());
//                }
//                variables.put("userIds", userIds);
//
//                params.setVariables(variables);
//                flowApi.completeTask(params);
//                returnVo = new SimpleReturnVo(SUCCESS, "发起流程成功！");
//            } else {
//                returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-submitProcess:" + e);
//            e.printStackTrace();
//        }
//        return JsonUtils.toJson(returnVo);
//    }
//
//    /**
//    * 方法描述：撤回流程
//    * @param request
//    * @param response
//    * @param applyNo
//    * @param sessionId
//    * @return
//    */
//    @ResponseBody
//    @RequestMapping("/pullBackProcess")
//    public String pullBackProcess(HttpServletRequest request, HttpServletResponse response, String applyNo, String sessionId) {
//        SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "修改状态失败");
//        try {
//            UserSessionInfo user = this.getUserSessionInfo(request, response);
//            if (null != user && StringUtils.isNotBlank(user.getNo())) {
//                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
//                meetingRoom.setStatus(MeetingApplyStatusEnum.REVOKE.getCode());
//                meetingroomApplyService.updateMeetingroomApplyStatus(meetingRoom);
//                String taskId = "";
//                //根据流程实列查询流程实列和流程定义信息
//                com.dragon.tools.vo.ReturnVo<ActReProcdefExtendVo> rVo = flowApi.getPInfoByPId(meetingRoom.getTaskId());
//                if (FlowConstant.SUCCESS.equals(rVo.getCode())) {
//                    if (StringUtils.isBlank(rVo.getData().getTaskId())) {
//                        returnVo = new SimpleReturnVo(ERROR, "撤销失败,taskId为空");
//                        return JsonUtils.toJson(returnVo);
//                    } else {
//                        ReturnVo<String> revokeVo=processMainComponent.revoke(user.getNo(),rVo.getData().getTaskId(),null);
//                        returnVo = new SimpleReturnVo(revokeVo.getCode(), revokeVo.getMsg());
//                    }
//                } else {
//                    logger.error("调用 OA 【oaApi.getPInfoByPId()】 接口异常！" + rVo.getMsg());
//                }
//            } else {
//                returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-pullBackProcess:" + e);
//            e.printStackTrace();
//        }
//        return JsonUtils.toJson(returnVo);
//    }
//
//    /**
//     * 方法描述：取消申请(没有发起流程的)
//     * @param request
//     * @param response
//     * @param applyNo
//     * @param sessionId
//     * @return
//     */
//    @ResponseBody
//    @RequestMapping("/updateMeetingroomStatus")
//    public String updateMeetingroomStatus(HttpServletRequest request, HttpServletResponse response, String applyNo,String sessionId) {
//    	SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "终止失败");
//    	try {
//            UserSessionInfo user = this.getUserSessionInfo(request, response);
//            if (null != user && StringUtils.isNotBlank(user.getNo())) {
//                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
//                MeetingroomApplyVo meetingroomApplyVo = new MeetingroomApplyVo();
//                meetingroomApplyVo.setApplyNo(applyNo);
//                meetingroomApplyVo.setProposerNo(user.getNo());
//                meetingroomApplyVo.setProposerNo(user.getName());
//                meetingroomApplyVo.setStatus(MeetingApplyStatusEnum.END.getCode());
//                this.meetingroomApplyService.updateMeetingroomApplyStatus(meetingroomApplyVo);
//                try {
//                    if (StringUtils.isNotBlank(meetingRoom.getTaskId())) {
//                        EndApiVo vo = new EndApiVo();
//                        vo.setProcessInstanceId(meetingRoom.getTaskId());
//                        vo.setMessage(ProcessStatusEnum.ZZ.getMsg());
//                        vo.setUserCode(user.getNo());
//                        flowApi.stopProcess(vo);//取消的时候终止流程
//                    }
//                } catch (Exception e) {
//                    e.printStackTrace();
//                }
//                returnVo = new SimpleReturnVo(SUCCESS, "取消申请成功！");
//            } else {
//                returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
//            }
//        } catch (Exception e) {
//            logger.error("MeetingroomApplyController-updateMeetingroomStatus:" + e);
//            e.printStackTrace();
//        }
//    	 return JsonUtils.toJson(returnVo);
//    }
//
//    @RequestMapping(value = "/userInfo")
//    public String userInfo(ModelMap model, HttpServletRequest request, HttpServletResponse response, String userNo){
//        try {
//            if(StringUtils.isNotBlank(userNo)){
//                ReturnVo<PersonnelApiVo> returnVo = personnelApi.getPersonnelApiVoByNo(userNo);
//                if(UcenterConstant.SUCCESS == returnVo.getCode().intValue()){
//                    PersonnelApiVo personVo = returnVo.getData();
//                    model.put("personVo", personVo);
//                }
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            logger.error("调用MDM查询用户信息接口异常！" + e);
//        }
//        return "/common/common-userinfo";
//    }


}
