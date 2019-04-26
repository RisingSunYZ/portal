package com.dragon.portal.rest.controller.rscmgmt;

import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.enm.flowable.run.CommentTypeEnum;
import com.dragon.flow.enm.flowable.run.ProcessStatusEnum;
import com.dragon.flow.vo.flowable.api.CompleteTaskApiVo;
import com.dragon.flow.vo.flowable.api.EndApiVo;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.rscmgmt.IMeetingroomApproverDao;
import com.dragon.portal.enm.metting.MeetingApplyStatusEnum;
import com.dragon.portal.model.rscmgmt.*;
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
    @Resource
    private IMeetingroomApproverDao meetingroomApproverDao;

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

   /**
    * @Author YangZhao
    * @Description  通过Id获取会议室申请信息
    * @Date 16:28 2019/3/22
    * @Param [model, id, sessionId]
    * @return java.lang.String
    **/
    @GetMapping("/getMeetingroomApplyById")
    @ApiOperation("通过Id获取会议室申请信息")
    public ReturnVo input(String id) {
        ReturnVo vo = new ReturnVo(ReturnCode.FAIL,"通过Id获取会议室申请信息失败");
        try {
            if (StringUtils.isNotBlank(id)) {
                MeetingroomApply meetingroomApply = this.meetingroomApplyService.getMeetingroomApplyById(id);
                vo = new ReturnVo(ReturnCode.SUCCESS,"通过Id获取会议室申请信息成功",meetingroomApply);
                return vo;
            }
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-getMeetingroomApplyById-通过Id获取会议室申请信息失败:" + e);
            e.printStackTrace();
        }
        return vo;
    }
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



    /**
     * @Author YangZhao
     * @Description 重新发起流程
     * @Date 11:26 2019/3/25
     * @Param [request, response, applyNo]
     * @return com.dragon.tools.vo.ReturnVo
     **/
    @PostMapping("/submitProcess")
    @ApiOperation("重新发起流程")
    public ReturnVo submitProcess(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response, String applyNo) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改状态失败");
        try {
            UserSessionInfo user = this.getUserSessionInfo(request, response);
            if (null != user && StringUtils.isNotBlank(user.getNo())) {
                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
                meetingRoom.setStatus(MeetingApplyStatusEnum.WAIT_APPROVE.getCode());
                meetingroomApplyService.updateMeetingroomApplyStatus(meetingRoom);
                CompleteTaskApiVo params = new CompleteTaskApiVo();
                params.setType(CommentTypeEnum.CXTJ);
                params.setUserCode(user.getNo());
                params.setProcessInstanceId(meetingRoom.getTaskId());

                MeetingroomApprover meetingroomApproverWhere = new MeetingroomApprover();
                meetingroomApproverWhere.setMettingroomId(meetingRoom.getMeetingroomId());
                List<MeetingroomApprover> MeetingroomApproverList = meetingroomApproverDao.getAll(meetingroomApproverWhere);
                Map<String, Object> variables = new HashMap<String, Object>();
                List<String> userIds = new ArrayList<String>();
                for (MeetingroomApprover temp : MeetingroomApproverList) {
                    userIds.add(temp.getApproverNo());
                }
                variables.put("userIds", userIds);

                params.setVariables(variables);
                flowApi.completeTask(params);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "发起流程成功！");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-submitProcess-重新发起流程失败:" + e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * @Author YangZhao
     * @Description 取消申请(没有发起流程的)
     * @Date 16:34 2019/3/22
     * @Param [request, response, applyNo]
     * @return java.lang.String
     **/
    @PostMapping("/updateMeetingroomStatus")
    @ApiOperation("取消申请(没有发起流程的)")
    public ReturnVo updateMeetingroomStatus(HttpServletRequest request, HttpServletResponse response, String applyNo) {
    	ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "终止失败");
    	try {
            UserSessionInfo user = this.getUserSessionInfo(request, response);
            if (null != user && StringUtils.isNotBlank(user.getNo())) {
                MeetingroomApplyVo meetingRoom = meetingroomApplyService.getMeetingroomApplyByApplyNo(applyNo);
                MeetingroomApplyVo meetingroomApplyVo = new MeetingroomApplyVo();
                meetingroomApplyVo.setApplyNo(applyNo);
                meetingroomApplyVo.setProposerNo(user.getNo());
                meetingroomApplyVo.setProposerNo(user.getName());
                meetingroomApplyVo.setStatus(MeetingApplyStatusEnum.END.getCode());
                this.meetingroomApplyService.updateMeetingroomApplyStatus(meetingroomApplyVo);
                try {
                    if (StringUtils.isNotBlank(meetingRoom.getTaskId())) {
                        EndApiVo vo = new EndApiVo();
                        vo.setProcessInstanceId(meetingRoom.getTaskId());
                        vo.setMessage(ProcessStatusEnum.ZZ.getMsg());
                        vo.setUserCode(user.getNo());
                        flowApi.stopProcess(vo);//取消的时候终止流程
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "取消申请成功！");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingroomApplyController-updateMeetingroomStatus-取消申请失败:" + e);
            e.printStackTrace();
        }
    	 return returnVo;
    }

}
