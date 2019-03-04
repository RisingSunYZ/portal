package com.dragon.portal.rest.controller.rscmgmt;

import com.dragon.portal.component.IMeetingComponent;
import com.dragon.portal.constant.FormConstant;
import com.dragon.portal.enm.metting.MeetingStatusEnum;
import com.dragon.portal.model.rscmgmt.Meeting;
import com.dragon.portal.model.user.UserLogin;
import com.dragon.portal.service.rscmgmt.*;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.ftp.FtpTools;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

/**
 * @author ruanzg
 * @version 1.0
 * @Date 2019/2/27 16:33
 */
@RestController
@RequestMapping("/portal/rscmgmt/meeting")
@Api(value="会议", description = "会议", tags={"会议 /portal/rscmgmt/meeting"})
public class MeetingController {
    private static Logger logger = Logger.getLogger(MeetingController.class);

    @Resource
    private IMeetingService meetingService;
    @Resource
    private IMeetingPersonnelService meetingPersonnelService;
    @Resource
    private IMeetingSummaryService meetingSummaryService;
    @Resource
    private IMeetingFilesService meetingFilesService;

    @Resource
    private FtpTools ftpTools;
    @Resource
    private IMeetingReplyService meetingReplyService;

    @Resource
    private IPersonnelApi personnelApi;

    @Resource
    private IMeetingComponent metingComponent;
//    @Resource
//    private IScheduleEventService scheduleEventService;
    /**
     * 从sesssion里获取用户
     * @param request
     * @return
     * @throws Exception
     */
    private UserLogin getUserSessionInfo(HttpServletRequest request, HttpServletResponse response){
        HttpSession session = request.getSession();
        return (UserLogin)session.getAttribute(FormConstant.SYS_USER);
    }
    /**
     * @param request
     * @Description:新建、编辑会议页面数据保存
     */
    @PostMapping("/save")
    @ApiOperation("新建、编辑会议页面数据保存")
    public ReturnVo save(@RequestBody Meeting meeting, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        try {
            UserLogin loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getUserName())) {
                String userNo=loginUser.getUserNo();
                String userName=loginUser.getRealName();
                if(StringUtils.isBlank(meeting.getId())){
                    meeting.setCreator(userNo);
                    meeting.setUpdator(userNo);
                    meeting.setCreatorName(userName);
                    this.meetingService.insertMeeting(meeting);
                    returnVo = new ReturnVo(ReturnCode.SUCCESS, "添加成功");
                }else{
                    meeting.setCreator(userNo);
                    meeting.setUpdator(userNo);
                    meeting.setCreatorName(userName);
                    meeting.setDelFlag(1);
                    this.meetingService.updateMeeting(meeting);
                    returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功");
                }
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-update:"+e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * @param request
     * @Description:加载待开会议页面数据
     */
    @GetMapping("/ajaxList")
    @ApiOperation("加载待开会议页面数据")

    public ReturnVo<Meeting> ajaxList(
            @ApiParam(name = "theme", value = "主题名称", type = "String") @RequestParam(required = false) String theme,
            @ApiParam(name = "pageIndex", value = "页数",   required = true, type = "Integer")@RequestParam int pageIndex,
            @ApiParam(name = "pageSize", value = "条数",   required = true, type = "Integer")@RequestParam int pageSize,
            HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        PagerModel<Meeting> pm = null;
        try {
            //获取登录用户信息
            UserLogin loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getUserNo())) {
                Meeting meeting = new Meeting();
                meeting.setTheme(theme);
                meeting.setCreator(loginUser.getUserNo());
                meeting.setStatus(MeetingStatusEnum.PENDIND.getCode());
                meeting.setStartTime(new Date());
                Query query = new Query();
                query.setPageIndex(pageIndex);
                query.setPageSize(pageSize);
                pm = this.meetingService.getPagerModelByQuery(meeting, query);
                List<Meeting> meetings = pm.getRows();
                meetingService.getInitList(meetings,loginUser.getUserNo());
                returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
                returnVo.setData(pm);
            }
        } catch (Exception e) {
            logger.error("MeetingController-ajaxList:",e);
            e.printStackTrace();
        }
        return returnVo;
    }

}
