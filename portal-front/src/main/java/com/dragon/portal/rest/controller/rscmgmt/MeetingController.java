package com.dragon.portal.rest.controller.rscmgmt;

import com.dragon.portal.component.IMeetingComponent;
import com.dragon.portal.customLabel.ApiJsonObject;
import com.dragon.portal.customLabel.ApiJsonProperty;
import com.dragon.portal.enm.metting.MeetingFileType;
import com.dragon.portal.enm.metting.MeetingPersonnelType;
import com.dragon.portal.enm.metting.MeetingStatusEnum;
import com.dragon.portal.model.rscmgmt.*;
import com.dragon.portal.model.schedule.ScheduleEvent;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.rscmgmt.*;
import com.dragon.portal.service.schedule.IScheduleEventService;
import com.dragon.portal.util.DateUtils;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.FileUtils;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.ftp.FtpTools;
import com.dragon.tools.ftp.UploadUtils;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.tools.common.JsonUtils;
import com.mhome.tools.common.UUIDGenerator;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.*;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

/**
 * 会议
 * @author ruanzg
 * @version 1.0
 * @Date 2019/2/27 16:33
 */
@RestController
@RequestMapping("/rest/portal/rscmgmt/meeting")
@Api(value="会议", description = "会议", tags={"会议 /rest/portal/rscmgmt/meeting"})
public class MeetingController extends BaseController {
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
    @Resource
    private CommonProperties commonProperties;
    @Resource
    private IScheduleEventService scheduleEventService;
    /**
     * @param request
     * @Description:新建、编辑会议页面数据保存
     */
    @PostMapping("/save")
    @ApiOperation("新建、编辑会议页面数据保存")
    public ReturnVo save(@RequestBody Meeting meeting, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                String userNo=loginUser.getNo();
                String userName=loginUser.getName();
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
    @ApiImplicitParam(name="theme",value = "主题名称",dataType = "String",paramType = "query")
    public ReturnVo<Meeting> ajaxList(@ApiIgnore Meeting meeting,Query query,
            HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        PagerModel<Meeting> pm;
        try {
            //获取登录用户信息
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                meeting.setCreator(loginUser.getNo());
                meeting.setStatus(MeetingStatusEnum.PENDIND.getCode());
                meeting.setStartTime(new Date());
                pm = this.meetingService.getPagerModelByQuery(meeting, query);
                List<Meeting> meetings = pm.getData();
                meetingService.getInitList(meetings,loginUser.getNo());
                returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
                returnVo.setData(pm);
            }
        } catch (Exception e) {
            logger.error("MeetingController-ajaxList:",e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * @param request
     * @Description:加载我的邀请页面数据
     */
    @GetMapping("/ajaxMyList")
    @ApiOperation("加载我的邀请页面数据")
    @ApiImplicitParams({
            @ApiImplicitParam(name="theme",value = "主题名称",dataType = "String",paramType = "query"),
    })
    public ReturnVo<PagerModel<Meeting>> ajaxMyList(@ApiIgnore Meeting meeting,
            Query query,HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        PagerModel<Meeting> pm;
        try {
            //获取登录用户信息
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                meeting.setCreator(loginUser.getNo());
                meeting.setStatus(MeetingStatusEnum.MY_DRAFT.getCode());
                pm = this.meetingService.getMyMeetingPagerModelByQuery(meeting, query);
                if(null != pm){
                    List<Meeting> meetings = pm.getData();
                    meetingService.getInitList(meetings,loginUser.getNo());
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
                returnVo.setData(pm);
            }
        } catch (Exception e) {
            logger.error("MeetingController-ajaxMyList:"+e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * @param query
     * @param request
     * @Description:加载历史会议页面数据
     */
    @GetMapping("/ajaxHistoryList")
    @ApiOperation("加载历史会议页面数据")
    @ApiImplicitParams({
            @ApiImplicitParam(name="theme",value = "主题名称",dataType = "String",paramType = "query"),
    })
    public ReturnVo ajaxHistoryList(@ApiIgnore Meeting meeting, Query query, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        PagerModel<Meeting> pm = null;
        try {
            //获取登录用户信息
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                meeting.setCreator(loginUser.getNo());
//                meeting.setStatus(MeetingStatusEnum.ALREADY_HELD.getCode());
                meeting.setEndTime(new Date());
                pm = this.meetingService.getPagerModelByQuery(meeting, query);
                List<Meeting> meetings = pm.getData();
                meetingService.getInitList(meetings,loginUser.getNo());
                returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
            }
        } catch (Exception e) {
            logger.error("MeetingController-ajaxHistoryList:",e);
            pm = null;
        }
        returnVo.setData(pm);
        return returnVo;
    }

    /**
     * @param meeting
     * @param query
     * @param request
     * @Description:加载我的草稿页面数据
     */
    @GetMapping("/ajaxMyDraftList")
    @ApiOperation("加载我的草稿页面数据")
    @ApiImplicitParams({
            @ApiImplicitParam(name="theme",value = "主题名称",dataType = "String",paramType = "query"),
    })
    public ReturnVo ajaxMyDraftList(@ApiIgnore Meeting meeting, Query query, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        PagerModel<Meeting> pm = null;
        try {
            //获取登录用户信息
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                meeting.setCreator(loginUser.getNo());
                meeting.setStatus(MeetingStatusEnum.MY_DRAFT.getCode());
                pm = this.meetingService.getPagerModelByQuery(meeting, query);
                List<Meeting> meetings = pm.getData();
                meetingService.getInitList(meetings,loginUser.getNo());
                returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
            }
        } catch (Exception e) {
            logger.error("MeetingController-ajaxHistoryList:"+e);
            e.printStackTrace();
        }
        returnVo.setData(pm);
        return returnVo;
    }

    /**
     * 会议答复
     * @return returnVo
     * @Description:
     * @author xietongjian 2017 上午10:52:14
     */
    @GetMapping("/reply")
    @ApiOperation("根据会议id会议答复详情")
    @ApiImplicitParams({
            @ApiImplicitParam(name="meetingId",value = "会议id",dataType = "String",paramType = "query",required = true),
    })
    public ReturnVo reply(@RequestParam String meetingId, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo<MeetingReply> returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        UserSessionInfo loginUser = getUserSessionInfo(request,response);
        MeetingReply meetingReply =new MeetingReply();
        if(StringUtils.isNotBlank(meetingId)){
            try {
                meetingReply =  meetingReplyService.getMeetingReplyByMeetingIdAndPersonNo(meetingId,loginUser.getNo());
                returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }else{
            meetingReply.setMeetingId(meetingId);
        }
        returnVo.setData(meetingReply);
        return returnVo;
    }

    /**
     * 会议答复
     * @return
     * @Description:
     * @author xietongjian 2017 上午10:52:14
     */
    @PostMapping("/saveReply")
    @ApiOperation("保存会议答复")
    public ReturnVo saveReply(@ApiJsonObject ({
            @ApiJsonProperty(key="id",description = "答复id"),
            @ApiJsonProperty(key="meetingId",description = "会议id"),
            @ApiJsonProperty(key="replyStatus",description = "答复状态"),
            @ApiJsonProperty(key="content",description = "答复内容"),
    })@RequestBody MeetingReply reply, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "答复失败");
        try {
            UserSessionInfo loginUser = getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                if(StringUtils.isNotBlank(reply.getId())){
                    MeetingReply meetingReply =  meetingReplyService.getMeetingReplyByMeetingIdAndPersonNo(reply.getMeetingId(),loginUser.getNo());
                    meetingReply.setReplyStatus(reply.getReplyStatus());
                    meetingReply.setContent(reply.getContent());
                    meetingReply.setUpdator(loginUser.getNo());
                    meetingReplyService.updateMeetingReply(meetingReply);
                }else{
                    MeetingReply meetingReply =new MeetingReply();
                    meetingReply.setMeetingId(reply.getMeetingId());
                    meetingReply.setCreator(loginUser.getNo());
                    meetingReply.setReplyStatus(reply.getReplyStatus());
                    meetingReply.setContent(reply.getContent());
                    meetingReply.setReplyName(loginUser.getNo());
                    meetingReplyService.insertMeetingReply(meetingReply);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "答复成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-saveReply:" + e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * 根据id查询会议纪要和附件
     * @return
     * @Description:
     */
    @GetMapping("/getSummaryMeeting")
    @ApiOperation("根据id查询会议纪要和附件")
    @ApiImplicitParams({
            @ApiImplicitParam(name="id",value = "会议id",dataType = "String",paramType = "query",required = true),
    })
    public ReturnVo<Map<String,Object>> getSummaryMeeting(String id ,HttpServletRequest request,HttpServletResponse response){
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败");
        try{
            Map<String,Object>map = new HashMap<>();
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                MeetingSummary meetingSummary = this.meetingSummaryService.getMeetingSummaryByMeetingId(id);
                if(meetingSummary!=null){
                    //设置编辑页面显示会议的附件
                    List<MeetingFiles> meetingSummaryFilesTmp = meetingFilesService.getMeetingFilesByMeetingId(id);

                    List<MeetingFiles> meetingSummaryFiles = new ArrayList<>();
                    String fileName="";
                    String filePath="";
                    if(CollectionUtils.isNotEmpty(meetingSummaryFilesTmp)){
                        for(MeetingFiles f : meetingSummaryFilesTmp){
                            if(f.getUseType() == MeetingFileType.MEETING_SUMMARY_FILE.getCode()){
                                meetingSummaryFiles.add(f);
                                fileName += f.getFileName()+",";
                                filePath += f.getFilePath()+",";
                            }
                        }
                        if(StringUtils.isNotBlank(fileName)){
                            meetingSummary.setFileName(fileName.substring(0, fileName.length()-1));
                        }
                        if(StringUtils.isNotBlank(filePath)){
                            meetingSummary.setFilePath(filePath.substring(0, filePath.length()-1));
                        }
                    }
                    map.put("meetingSummaryFiles", meetingSummaryFiles);
                }else{
                    meetingSummary = new MeetingSummary();
                    meetingSummary.setMeetingId(id);
                }
                map.put("meetingSummary", meetingSummary);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "查询成功");
                returnVo.setData(map);
            }

        }catch (Exception e){
            logger.error("MeetingController-getSummaryMeeting",e);
        }
        return returnVo;
    }

    /**
     * @param request
     * @Description:新建、编辑会议纪要页面数据保存
     */
    @PostMapping("/saveMeetingSummary")
    @ApiOperation("新建、编辑会议纪要页面数据保存")
    public String saveMeetingSummary(@RequestBody MeetingSummary meetingSummary, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                String userNo=loginUser.getNo();
                if(StringUtils.isBlank(meetingSummary.getId())){
                    meetingSummary.setCreator(userNo);
                    meetingSummary.setUpdator(userNo);
                    this.meetingSummaryService.insertMeetingSummary(meetingSummary);
                    returnVo = new ReturnVo(ReturnCode.SUCCESS, "添加成功");
                }else{
                    meetingSummary.setCreator(userNo);
                    meetingSummary.setUpdator(userNo);
                    meetingSummary.setDelFlag(1);
                    this.meetingSummaryService.updateMeetingSummary(meetingSummary);
                    returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功");
                }
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-update:"+e);
            e.printStackTrace();
        }
        return JsonUtils.toJson(returnVo);
    }

    /**
     * @param id
     * @param request
     * @Description:根据id查询会议
     */
    @GetMapping("/getMeetingById/{id}")
    @ApiOperation("根据id查询会议")
    @ApiImplicitParams({
            @ApiImplicitParam(name="id",value = "会议id",dataType = "String",paramType = "path",required = true),
    })
    public ReturnVo getMeetingById(@PathVariable String id,HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败");
        try {
            Map<String,Object>model = new HashMap<>();
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                if(StringUtils.isNotBlank(id)){
                    Meeting meeting = getMeetingPersonnel(id);
                    //设置编辑页面显示会议的附件
                    List<MeetingFiles> meetingFiles = meetingFilesService.getMeetingFilesByMeetingId(meeting.getId());
                    String fileName="";
                    String filePath="";
                    if(meetingFiles.size()>0){
                        for(MeetingFiles f : meetingFiles){
                            if(f.getUseType() == MeetingFileType.MEETING_CONTENT_FILE.getCode()){
                                fileName=fileName+f.getFileName()+",";
                                filePath=filePath+f.getFilePath()+",";
                            }
                        }
                        if(StringUtils.isNotBlank(fileName)){
                            meeting.setFileName(fileName.substring(0, fileName.length()-1));
                        }
                        if(StringUtils.isNotBlank(filePath)){
                            meeting.setFilePath(filePath.substring(0, filePath.length()-1));
                        }
                    }

                    //获取会议开始时间和结束时间
                    String start=DateUtils.dateToString(meeting.getStartTime(), "yyyy-MM-dd HH:mm:ss");
                    String end =DateUtils.dateToString(meeting.getEndTime(), "yyyy-MM-dd HH:mm:ss");
                    String meetingTime = start.substring(0, 10);;
                    start =start.substring(11, 16);
                    end =end.substring(11, 16);
                    meeting.setMeetingTime(meetingTime);
                    meeting.setStart(start);
                    meeting.setEnd(end);

                    meeting.setMeetingFiles(meetingFiles);

                    //设置会议回复记录
                    meeting.setUserNo(loginUser.getNo());
                    List<MeetingReply> meetingReplys = meetingReplyService.getReplyByMeetingId(meeting.getId());
                    for(MeetingReply mp : meetingReplys){
                        mp.setUpdateTimeStr(DateUtils.dateToString(mp.getUpdateTime(), "yyyy-MM-dd HH:mm:ss"));
                        mp.setReplyStatusStr(mp.getReplyStatusStr());
                    }
                    meeting.setCount(meetingReplys.size());
                    meeting.setReplyList(meetingReplys);

                    List<Meeting> meetings =new ArrayList<Meeting>();
                    meetings.add(meeting);

                    model.put("meeting", meeting);
                    model.put("mandatoryPersonList", meeting.getMandatoryPersonList());
                    model.put("optionalPersonList", meeting.getOptionalPersonList());
                    model.put("meetingFiles", meetingFiles);
                }else{
                    Meeting meeting = new Meeting();
                    meeting.setRecordPersonNo(loginUser.getNo());
                    meeting.setRecordPersonName(loginUser.getNo());
                    meeting.setStatus(MeetingStatusEnum.MY_DRAFT.getCode());
                    model.put("meeting", meeting);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "查询成功");
            }
            returnVo.setData(model);
        } catch (Exception e) {
            logger.error("MeetingController-getMeetingById:",e);
        }
        return returnVo;
    }

    /**
     * @param meeting
     * @param request
     * @Description: 新建会议发送会议邀请(先保存会议再发送邮件日程)和发送会议更新
     */
    @PostMapping("/sendInvitation")
    @ApiOperation("新建会议发送会议邀请(先保存会议再发送邮件日程)和发送会议更新")
    public ReturnVo sendInvitation(@RequestBody Meeting meeting,  HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "发送失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                String userName = loginUser.getNo();
                //设置会议发起人邮箱地址
                AppointmentVO appointmentVO = new AppointmentVO();
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> person = personnelApi.getPersonnelApiVoByNo(loginUser.getNo());
                PersonnelApiVo personnelApiVo = person.getData();
                if(personnelApiVo != null){
                    appointmentVO.setEmail(personnelApiVo.getEmail());
                    logger.info("发起人邮箱===》》》"+personnelApiVo.getEmail());
                    //会议日程---获取日程信息及接收人
                    List<ScheduleEvent> scheduleEventList = new ArrayList<>();
                    List<ScheduleEvent> scheduleList = new ArrayList<>();
                    //设置会议发起人日程
                    ScheduleEvent eventCreat = new ScheduleEvent();
                    eventCreat.setReceiveNo(userName);
                    scheduleEventList.add(eventCreat);
                    scheduleList.add(eventCreat);

                    ScheduleEvent sh;
                    List<String> newNos = new ArrayList<>();

                    //设置会议参与人---必选人员邮箱地址
                    if(StringUtils.isNotBlank(meeting.getMandatoryPersonNo())){
                        List<String> nos = new ArrayList<>();
                        List<String> mandatoryEmail = new ArrayList<>();
                        String[] personNO = meeting.getMandatoryPersonNo().split(",");
                        for(String s : personNO){
                            if(s.contains("@")){
                                mandatoryEmail.add(s.trim());
                                logger.info("必选人员邮箱===》》》"+s);
                            }else{
                                nos.add(s.trim());
                                sh = new ScheduleEvent();
                                sh.setReceiveNo(s.trim());

                                scheduleEventList.add(sh);
                                newNos.add(s.trim());
                            }
                        }
                        if(nos.size()>0){
                            com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVos = personnelApi.getPersonnelApiVoByNos(nos);
                            List<PersonnelApiVo> personnelApiVos = returnVos.getDatas();
                            if(CollectionUtils.isNotEmpty(personnelApiVos)){
                                personnelApiVos.forEach(p->mandatoryEmail.add(p.getEmail()));
                            }
                        }
                        appointmentVO.setMandatoryEmail(mandatoryEmail);//必选人员邮箱
                    }
                    //设置会议参与人---可选人员邮箱地址
                    List<String> optionalNos = new ArrayList<String>();
                    List<String> optionalEmail = new ArrayList<String>();
                    if(StringUtils.isNotBlank(meeting.getOptionalPersonNo())){
                        String[] personNO = meeting.getOptionalPersonNo().split(",");
                        for(String s : personNO){
                            if(s.contains("@")){
                                optionalEmail.add(s.trim());
                                logger.info("可选人员邮箱===》》》"+s);
                            }else{
                                optionalNos.add(s.trim());
                                sh = new ScheduleEvent();
                                sh.setCreator(userName);
                                sh.setUpdator(userName);
                                sh.setReceiveNo(s.trim());
                                scheduleEventList.add(sh);
                                newNos.add(s.trim());
                            }
                        }
                    }
                    //设置记录人员
                    if(StringUtils.isNotBlank(meeting.getRecordPersonNo())){
                        String[] personNO = meeting.getRecordPersonNo().split(",");
                        for(String s : personNO){
                            optionalNos.add(s.trim());
                            sh = new ScheduleEvent();
                            sh.setReceiveNo(s.trim());
                            scheduleEventList.add(sh);
                            newNos.add(s.trim());
                        }
                    }
                    if(CollectionUtils.isNotEmpty(optionalNos)){
                        com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVos = personnelApi.getPersonnelApiVoByNos(optionalNos);
                        List<PersonnelApiVo> optionalApiVos = returnVos.getDatas();
                        if(CollectionUtils.isNotEmpty(optionalApiVos)){
                            optionalApiVos.forEach(p->optionalEmail.add(p.getEmail()));
                        }
                    }
                    appointmentVO.setOptionalEmail(optionalEmail);//非必选人人员邮箱

                    Map<String,Object> map = new HashMap<String,Object>();
                    String start = meeting.getMeetingTime()+" "+meeting.getStart()+":00";
                    String end = meeting.getMeetingTime()+" "+meeting.getEnd()+":00";
                    appointmentVO.setAddress(meeting.getMeetingroomName());
                    appointmentVO.setContent(meeting.getContent());
                    appointmentVO.setTitle(meeting.getTheme());
                    appointmentVO.setStart(start);
                    appointmentVO.setAllDay(false);
                    appointmentVO.setEnd(end);

                    //将附件添加到内容中
                    String contentStr = meeting.getContent();
                    if(StringUtils.isNotBlank(contentStr)){
                        contentStr = contentStr +"<br/>";
                    }
                    String[] fileNames = meeting.getFileName().trim().split(",");
                    String[] filePaths = meeting.getFilePath().trim().split(",");
                    String path =commonProperties.getFtpHost();
                    if(filePaths.length>0){
                        for(int i =0;i<filePaths.length;i++){
                            contentStr = contentStr +"<a href=\""+path+filePaths[i]+"\">"+fileNames[i]+"</a>&nbsp;&nbsp;";
                        }
                    }
                    appointmentVO.setContent(contentStr);
                    //判断当前用户是否与可选,必选，记录人重复
                    for(ScheduleEvent scheduleEvent : scheduleEventList){
                        if(!scheduleList.get(0).getReceiveNo().equals(scheduleEvent.getReceiveNo())){
                            scheduleList.add(scheduleEvent);
                        }
                    }
                    if(StringUtils.isBlank(meeting.getId())){
                        //新建会议邀请
                        meeting.setCreator(userName);
                        meeting.setUpdator(userName);
                        meeting.setCreatorName(loginUser.getName());
                        meeting.setStatus(MeetingStatusEnum.PENDIND.getCode());//待召开
                        meeting.setDelFlag(1);
                        logger.info("必选人员邮箱"+appointmentVO.getMandatoryEmail());
                        logger.info("可选人员邮箱"+appointmentVO.getOptionalEmail());
                        ReturnVo<AppointmentVO> returnVoApp = metingComponent.sendMeetingInvitation(appointmentVO);
                        if(returnVoApp.getCode() == ReturnCode.SUCCESS){
                            AppointmentVO vo = returnVoApp.getData();
                            meeting.setChangeId(vo.getChangeId());
                            meeting.setChangeKey(vo.getChangeKey());
                            this.meetingService.insertMeeting(meeting);

                            for(ScheduleEvent scheduleEvent : scheduleList){
                                scheduleEvent.setId(UUIDGenerator.generate());
                                scheduleEvent.setTitle(meeting.getTheme());
                                scheduleEvent.setAddress(meeting.getMeetingroomName());
                                scheduleEvent.setContent(meeting.getContent());
                                scheduleEvent.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
                                scheduleEvent.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));

                                scheduleEvent.setCreator(userName);
                                scheduleEvent.setCreateTime(new Date());
                                scheduleEvent.setUpdator(userName);
                                scheduleEvent.setUpdateTime(new Date());

                                scheduleEvent.setDelFlag(1);
                                scheduleEvent.setType(2);
                                scheduleEvent.setIsAllDay(0);
                                scheduleEvent.setChangeId(vo.getChangeId());
                                scheduleEvent.setChangeKey(vo.getChangeKey());
                                scheduleEvent.setMeetingId(meeting.getId());

                            }
                            this.scheduleEventService.insertScheduleEvents(scheduleList);
                            returnVo = new ReturnVo(ReturnCode.SUCCESS, "发送成功");
                        }
                    }else{
                        //发送更新会议
                        Meeting mt = this.meetingService.getMeetingById(meeting.getId());
                        appointmentVO.setOldStart(DateUtils.dateToString(mt.getStartTime(), "yyyy-MM-dd HH:mm:ss"));
                        appointmentVO.setOldEnd(DateUtils.dateToString(mt.getEndTime(), "yyyy-MM-dd HH:mm:ss"));
                        meeting.setCreator(userName);
                        meeting.setUpdator(userName);
                        meeting.setCreatorName(loginUser.getName());
                        meeting.setStatus(MeetingStatusEnum.PENDIND.getCode());
                        meeting.setDelFlag(1);
                        if(mt.getChangeId() != null && mt.getChangeKey() != null){
                            appointmentVO.setChangeId(mt.getChangeId());
                            appointmentVO.setChangeKey(mt.getChangeKey());
                        }
                        ReturnVo<AppointmentVO> returnVoApp = null;

                        if(mt.getStatus() == MeetingStatusEnum.MY_DRAFT.getCode()){
                            returnVoApp = metingComponent.sendMeetingInvitation(appointmentVO);
                            if(returnVoApp.getCode()== ReturnCode.SUCCESS){
                                AppointmentVO vo = returnVoApp.getData();
                                meeting.setChangeId(vo.getChangeId());
                                meeting.setChangeKey(vo.getChangeKey());
                            }
                        }else{
                            returnVoApp = metingComponent.editMeetingInvitation(appointmentVO);
                        }
                        if(returnVoApp != null){
                            if(returnVoApp.getCode() == ReturnCode.SUCCESS){
                                this.meetingService.updateMeeting(meeting);
                                //发送会议邀请或会议更新插入会让日程
                                List addEvent =new ArrayList();
                                String editEventId = "";
                                String delEventId = "";
                                if(mt.getStatus() == MeetingStatusEnum.MY_DRAFT.getCode()){
                                    System.out.println("changeId===>>>"+meeting.getChangeId());
                                    System.out.println("changeKey===>>>"+meeting.getChangeKey());

                                    for(ScheduleEvent scheduleEvent : scheduleList){
                                        scheduleEvent.setId(UUIDGenerator.generate());
                                        scheduleEvent.setTitle(meeting.getTheme());
                                        scheduleEvent.setAddress(meeting.getMeetingroomName());
                                        scheduleEvent.setContent(meeting.getContent());
                                        scheduleEvent.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
                                        scheduleEvent.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));

                                        scheduleEvent.setCreator(userName);
                                        scheduleEvent.setCreateTime(new Date());
                                        scheduleEvent.setUpdator(userName);
                                        scheduleEvent.setUpdateTime(new Date());

                                        scheduleEvent.setDelFlag(1);
                                        scheduleEvent.setType(2);
                                        scheduleEvent.setIsAllDay(0);
                                        scheduleEvent.setChangeId(meeting.getChangeId());
                                        scheduleEvent.setChangeKey(meeting.getChangeKey());
                                        scheduleEvent.setMeetingId(meeting.getId());

                                    }
                                    this.scheduleEventService.insertScheduleEvents(scheduleList);
                                    returnVo = new ReturnVo(ReturnCode.SUCCESS, "发送成功");
                                }else{//发送会议更新时，根据所选人员添加、删除、修改日程
                                    List<ScheduleEvent> events = this.scheduleEventService.getScheduleEventByMeetingId(meeting.getId());
                                    Map oldEvent = new HashMap();
                                    if(events.size()>0){
                                        for(int i=0;i<events.size();i++){
                                            oldEvent.put(events.get(i).getReceiveNo(), events.get(i));
                                        }
                                    }
                                    //日程修改的属性
                                    ScheduleEvent updateSchdule = new ScheduleEvent();
                                    updateSchdule.setAddress(meeting.getMeetingroomName());
                                    updateSchdule.setTitle(meeting.getTheme());
                                    updateSchdule.setContent(meeting.getContent());
                                    updateSchdule.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
                                    updateSchdule.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));
                                    updateSchdule.setUpdator(userName);
                                    updateSchdule.setUpdateTime(new Date());

                                    for(int i=0;i<newNos.size();i++){
                                        if(oldEvent.get(newNos.get(i)) !=null){//需要修改的日程
                                            ScheduleEvent editSchedule = (ScheduleEvent)oldEvent.get(newNos.get(i));
                                            editEventId = editEventId + editSchedule.getId()+",";
                                            oldEvent.remove(newNos.get(i));
                                        }else{//需要添加的日程
                                            if(oldEvent.get(newNos.get(i)) == null){
                                                ScheduleEvent addSchedule = new ScheduleEvent();
                                                addSchedule.setId(UUIDGenerator.generate());
                                                addSchedule.setTitle(meeting.getTheme());
                                                addSchedule.setAddress(meeting.getMeetingroomName());
                                                addSchedule.setContent(meeting.getContent());
                                                addSchedule.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
                                                addSchedule.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));

                                                addSchedule.setCreator(userName);
                                                addSchedule.setCreateTime(new Date());
                                                addSchedule.setUpdator(userName);
                                                addSchedule.setUpdateTime(new Date());
                                                addSchedule.setReceiveNo(newNos.get(i));

                                                addSchedule.setDelFlag(1);
                                                addSchedule.setType(2);
                                                addSchedule.setIsAllDay(0);
                                                addSchedule.setChangeId(mt.getChangeId());
                                                addSchedule.setChangeKey(mt.getChangeKey());
                                                addSchedule.setMeetingId(meeting.getId());
                                                addEvent.add(addSchedule);
                                            }
                                        }
                                    }
                                    for (Object key : oldEvent.keySet()) {//要删除的日程id
                                        ScheduleEvent s = (ScheduleEvent)oldEvent.get(key);
                                        delEventId = delEventId + s.getId()+",";
                                    }

                                    if(StringUtils.isNotBlank(delEventId)){
                                        this.scheduleEventService.delScheduleEventByIds(delEventId.substring(0, delEventId.length()-1));
                                    }
                                    if(StringUtils.isNotBlank(editEventId)){
                                        this.scheduleEventService.updateScheduleEventByIds(editEventId, updateSchdule);
                                    }
                                    if(addEvent.size()>0){
                                        this.scheduleEventService.insertScheduleEvents(addEvent);
                                    }
                                    returnVo = new ReturnVo(ReturnCode.SUCCESS, "发送成功");
                                }
                            }
                        }
                    }
                    System.out.println(JSONObject.fromObject(map).toString());

                }else{
                    returnVo = new ReturnVo(ReturnCode.FAIL, "查询人员信息失败!");
                    logger.error("personnelApi.getPersonnelApiVoByNo 调用接口失败!");
                }
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-sendInvitation:"+e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //修改状态
    @GetMapping("/updateStatus")
    @ApiOperation("修改会议状态")
    @ApiImplicitParams({
            @ApiImplicitParam(name="ids",value = "多个id逗号隔开",required = true,dataType = "String",paramType = "query"),
            @ApiImplicitParam(name="status",value = "状态",required = true,dataType = "int",paramType = "query"),
    })
    public String updateStatus(@RequestParam String ids,@RequestParam Integer status, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改状态失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                String userName=loginUser.getName();
                if (StringUtils.isNotBlank(ids) && null != status) {
                    Meeting meeting = new  Meeting();
                    meeting.setUpdator(userName);
                    meeting.setDelFlag(null);
                    meeting.setStatus(status);
                    this.meetingService.updateMeetingByIds(ids, meeting);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改状态成功");
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-updateStatus:"+e);
            e.printStackTrace();
        }
        return JsonUtils.toJson(returnVo);
    }

    /**
     *@Description 上传会议附件
     *@param
     *@return
     *@Author  tuzhili
     *@Date  2018/5/15 13:42
     *@Copyright 浙江亚厦股份有限公司 2017-2018 版权所有
     */
    @PostMapping(value = "/uploadImage",headers="content-type=multipart/form-data")
    @ApiOperation("上传会议附件")
    public String uploadImage(@ApiParam MultipartFile file, String filePath){
        String fileName = "";
        String destFilePath = "";
        Boolean result = false;
        try{
            filePath = StringUtils.isBlank(filePath)?"p":filePath;
            // 获得文件：
            if(null != file){
                // FTP上传文件
                String fileExtension = UploadUtils.getExtension(file.getOriginalFilename());
                fileName = UUIDGenerator.generate() + "." + fileExtension;

                String  path = "/" + filePath + FileUtils.getDateFmtFilePath()+"/";

                InputStream inputStream = new ByteArrayInputStream(file.getBytes());
                result = ftpTools.uploadFile(inputStream, file.getOriginalFilename(), path);
                //destFilePath = path + fileName;
                destFilePath = path + file.getOriginalFilename();

                return result?"{\"error\":0,\"fileName\":\""+file.getOriginalFilename()+"\",\"url\":\"" + destFilePath+"\"}":"{\"error\":1,\"message\":\"上传失败！\"}";
            }
        }catch(Exception e){
            e.printStackTrace();
            logger.error("FileUploadController-uploadImage" + e.getMessage());
            return "{\"error\":1,\"message\":\"上传失败！\"}";
        }
        return "{\"error\":1,\"message\":\"上传失败！\"}";
    }

    /**
     * @param id
     * @param request
     * @Description:删除记录人
     */
    @GetMapping("/delPersonnel/{id}")
    @ApiOperation("删除记录人")
    public String delPersonnel(@PathVariable  String id, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "删除记录人失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                if(StringUtils.isNotBlank(id)){
                    MeetingPersonnel meetingPersonnel = new  MeetingPersonnel();
                    meetingPersonnel.setMeetingId(id);
                    meetingPersonnel.setPersonType(MeetingPersonnelType.RECORD.getCode());
                    this.meetingPersonnelService.delMeetingPersonnelByMeetingId(meetingPersonnel);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除记录人成功");
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-delPersonnel:"+e);
            e.printStackTrace();
        }
        return JsonUtils.toJson(returnVo);
    }

    /**
     * @param meetingPersonnel
     * @param request
     * @Description:新增记录人
     */
    @PostMapping("/insertPersonnel")
    @ApiOperation("保存记录人")
    public ReturnVo insertPersonnel(@ApiJsonObject({
            @ApiJsonProperty(key="meetingId",description = "会议id"),
            @ApiJsonProperty(key="personNo",description = "参加会议人员工号"),
            @ApiJsonProperty(key="personName",description = "参加会议人员姓名"),
    })@RequestBody MeetingPersonnel meetingPersonnel,HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "保存失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                String userName=loginUser.getNo();
                if(StringUtils.isNotBlank(meetingPersonnel.getMeetingId())){
                    meetingPersonnel.setPersonType(MeetingPersonnelType.RECORD.getCode());
                    meetingPersonnel.setCreator(userName);
                    meetingPersonnel.setUpdator(userName);
                    this.meetingPersonnelService.insertMeetingPersonnel(meetingPersonnel);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "保存成功");
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-insertPersonnel:"+e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //获取参加会议人员
    private Meeting getMeetingPersonnel(String id){
        Meeting meeting = new Meeting();
        try {
            meeting = this.meetingService.getMeetingById(id);
            List<MeetingPersonnel> meetingPersonnel = meetingPersonnelService.getMeetingPersonnelByMeetingId(meeting.getId());
            //必选人员工号
            String mandatoryPersonNo="";
            //必选人员
            String mandatoryPersonName="";
            //可选人员工号
            String optionalPersonNo="";
            //可选人员
            String optionalPersonName="";
            //记录人员工号
            String recordPersonNo="";
            //记录人员
            String recordPersonName="";


            //设置参加会议人员
            List<MeetingPersonnel> mandatoryPersonList = new ArrayList<MeetingPersonnel>();
            List<MeetingPersonnel> optionalPersonList = new ArrayList<MeetingPersonnel>();
            if(meetingPersonnel != null && meetingPersonnel.size()>0){
                for(MeetingPersonnel p : meetingPersonnel){
                    p.setNo(p.getPersonNo());
                    p.setName(p.getPersonName());
                    if(MeetingPersonnelType.MANDATORY.getCode().equals(p.getPersonType())){
                        mandatoryPersonNo = mandatoryPersonNo + p.getPersonNo() + ",";
                        mandatoryPersonName = mandatoryPersonName + p.getPersonName() + ",";
                        mandatoryPersonList.add(p);
                    }else if(MeetingPersonnelType.OPTIONAL.getCode().equals(p.getPersonType())){
                        optionalPersonNo = optionalPersonNo + p.getPersonNo() + ",";
                        optionalPersonName = optionalPersonName + p.getPersonName() + ",";
                        optionalPersonList.add(p);
                    }else if(MeetingPersonnelType.RECORD.getCode().equals(p.getPersonType())){
                        recordPersonNo = recordPersonNo + p.getPersonNo() + ",";
                        recordPersonName = recordPersonName + p.getPersonName() + ",";
                    }
                }
            }
            //设置显示会议的必选人员，可选人员，记录人员
            if(StringUtils.isNotBlank(mandatoryPersonNo)){
                meeting.setMandatoryPersonNo(mandatoryPersonNo.substring(0, mandatoryPersonNo.length()-1));
            }
            if(StringUtils.isNotBlank(mandatoryPersonName)){
                meeting.setMandatoryPersonName(mandatoryPersonName.substring(0, mandatoryPersonName.length()-1));
            }
            if(StringUtils.isNotBlank(optionalPersonNo)){
                meeting.setOptionalPersonNo(optionalPersonNo.substring(0, optionalPersonNo.length()-1));
            }
            if(StringUtils.isNotBlank(optionalPersonName)){
                meeting.setOptionalPersonName(optionalPersonName.substring(0, optionalPersonName.length()-1));
            }
            if(StringUtils.isNotBlank(recordPersonNo)){
                meeting.setRecordPersonNo(recordPersonNo.substring(0, recordPersonNo.length()-1));
            }
            if(StringUtils.isNotBlank(recordPersonName)){
                meeting.setRecordPersonName(recordPersonName.substring(0, recordPersonName.length()-1));
            }
            meeting.setMandatoryPersonList(mandatoryPersonList);
            meeting.setOptionalPersonList(optionalPersonList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return meeting;
    }


    /**
     * 我的草稿页面删除草稿
     * @param id
     */
    @GetMapping("/delMyDraft/{id}")
    @ApiOperation("我的草稿页面删除草稿")
    public String delMyDraft(@PathVariable String id,HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "删除草稿失败");
        try {
            UserSessionInfo loginUser =  getUserSessionInfo(request,response);
            if (null != loginUser && StringUtils.isNotBlank(loginUser.getNo())) {
                if(StringUtils.isNotBlank(id)){
                    this.meetingService.delMeetingById(id);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除草稿成功");
            }else{
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("MeetingController-dels:"+e);
            e.printStackTrace();
        }
        return JsonUtils.toJson(returnVo);
    }

}
