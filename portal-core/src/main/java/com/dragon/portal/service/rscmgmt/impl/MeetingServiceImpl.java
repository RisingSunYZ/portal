package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.portal.component.IMeetingComponent;
import com.dragon.portal.dao.rscmgmt.IMeetingDao;
import com.dragon.portal.dao.rscmgmt.IMeetingFilesDao;
import com.dragon.portal.dao.rscmgmt.IMeetingPersonnelDao;
import com.dragon.portal.dao.schedule.IScheduleEventDao;
import com.dragon.portal.enm.metting.MeetingFileType;
import com.dragon.portal.enm.metting.MeetingPersonnelType;
import com.dragon.portal.enm.metting.MeetingStatusEnum;
import com.dragon.portal.model.rscmgmt.*;
import com.dragon.portal.model.schedule.ScheduleEvent;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.rscmgmt.*;
import com.dragon.portal.util.DateUtils;
import com.dragon.tools.common.ReturnCode;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.mhome.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.ys.tools.ftp.FtpTools;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import net.sf.json.JSONObject;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.annotation.Resource;
import java.text.ParseException;
import java.util.*;

/**
 * @Title:会议管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-31 16:24:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MeetingServiceImpl implements IMeetingService {

	private static Logger logger = Logger.getLogger(MeetingServiceImpl.class);

	@Resource
	private IMeetingDao meetingDao;
	@Resource
	private IMeetingPersonnelDao meetingPersonnelDao;
	@Resource
	private IMeetingFilesDao meetingFilesDao;
	@Resource
	private CommonProperties commonProperties;

	@Resource
	private IPersonnelApi personnelApi;
	@Resource
	private IMeetingComponent metingComponent;
	@Resource
	private IMeetingPersonnelService meetingPersonnelService;
	@Resource
	private IMeetingSummaryService meetingSummaryService;
	@Resource
	private IMeetingFilesService meetingFilesService;
	@Resource
	private IMeetingReplyService meetingReplyService;

	@Resource
	private IScheduleEventDao scheduleEventDao;

	@Override
	public Meeting getMeetingById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.meetingDao.getMeetingById(id.trim()) : null;
	}

	@Override
	public List<Meeting> getAll(Meeting meeting) throws Exception {
		return null != meeting ? this.meetingDao.getAll(meeting) : null;
	}

	@Override
	public PagerModel<Meeting> getPagerModelByQuery(Meeting meeting, Query query)
			throws Exception {
		Page<Meeting> page = null;
		if(!(ObjectUtils.isEmpty(meeting) || ObjectUtils.isEmpty(query) )){
			PageHelper.startPage(query.getPageIndex()-1,query.getPageSize());
			if(meeting.getStatus() == MeetingStatusEnum.MY_DRAFT.getCode()){
				page = meetingDao.getMyDraftPagerModelByQuery(meeting);
			}else{
				page = meetingDao.getPagerModelByQuery(meeting);
			}
		}
		return new PagerModel<Meeting>(page);
	}

	@Override
	public void insertMeeting(Meeting meeting) throws Exception {
		if (null != meeting) {
			meeting.setId(UUIDGenerator.generate());
			meeting.setCreateTime(new Date());
			meeting.setUpdateTime(new Date());

			//拼接和格式化会议开始时间和结束时间
			String meetingTime = meeting.getMeetingTime();
			String start = meeting.getStart();
			String end = meeting.getEnd();
			Date startTime = DateUtils.StringToDate(meetingTime+" "+start+":00", "yyyy-MM-dd HH:mm:ss");
			Date ednTime = DateUtils.StringToDate(meetingTime+" "+end+":00", "yyyy-MM-dd HH:mm:ss");
			meeting.setStartTime(startTime);
			meeting.setEndTime(ednTime);
			//获取参加会议人员
			List<MeetingPersonnel> personnels = getMeetingPersonnel(meeting);
			//会议附件（名称，路劲）
			List<MeetingFiles> files = getMeetingFiles(meeting);

			//批量添加会议人员
			if(CollectionUtils.isNotEmpty(personnels)){
				this.meetingPersonnelDao.insertMeetingPersonnels(personnels);
			}
			//批量添加会议附件
			if(CollectionUtils.isNotEmpty(files)){
				this.meetingFilesDao.insertMeetingFilesList(files);
			}
			this.meetingDao.insertMeeting(meeting);
		}
	}

	//获取参加会议人员
	private List<MeetingPersonnel> getMeetingPersonnel(Meeting meeting){
		List<MeetingPersonnel> personnels = new ArrayList<MeetingPersonnel>();
		if(meeting != null){
			//会议必选人员no,name
			String[]  mandatoryPersonNos = meeting.getMandatoryPersonNo().trim().split(",");
			String[]  mandatoryPersonNames = meeting.getMandatoryPersonName().trim().split(",");
			if(mandatoryPersonNos.length > 0 && mandatoryPersonNames.length > 0){
				for(int i=0;i<mandatoryPersonNos.length;i++){
					if(StringUtils.isNotBlank(mandatoryPersonNos[i])){
						MeetingPersonnel personnel = new MeetingPersonnel();
						personnel.setId(UUIDGenerator.generate());
						personnel.setMeetingId(meeting.getId());
						personnel.setPersonNo(mandatoryPersonNos[i]);
						personnel.setPersonName(mandatoryPersonNames[i]);
						personnel.setPersonType(MeetingPersonnelType.MANDATORY.getCode());
						personnel.setDelFlag(1);
						personnel.setCreateTime(new Date());
						personnel.setCreator(meeting.getCreator());
						personnel.setUpdateTime(new Date());
						personnel.setUpdator(meeting.getUpdator());
						personnels.add(personnel);
					}
				}
			}
			//可选人员no,name
			String[] optionalPersonNos = meeting.getOptionalPersonNo().trim().split(",");
			String[] optionalPersonNames = meeting.getOptionalPersonName().trim().split(",");
			if(optionalPersonNos.length > 0 && optionalPersonNames.length > 0){
				for(int i=0;i<optionalPersonNos.length;i++){
					if(StringUtils.isNotBlank(optionalPersonNos[i])){
						MeetingPersonnel personnel = new MeetingPersonnel();
						personnel.setId(UUIDGenerator.generate());
						personnel.setMeetingId(meeting.getId());
						personnel.setPersonNo(optionalPersonNos[i]);
						personnel.setPersonName(optionalPersonNames[i]);
						personnel.setPersonType(MeetingPersonnelType.OPTIONAL.getCode());
						personnel.setDelFlag(1);
						personnel.setCreateTime(new Date());
						personnel.setCreator(meeting.getCreator());
						personnel.setUpdateTime(new Date());
						personnel.setUpdator(meeting.getUpdator());
						personnels.add(personnel);
					}
				}
			}
			String[] recordPersonNos = meeting.getRecordPersonNo().trim().split(",");
			String[] recordPersonName = meeting.getRecordPersonName().trim().split(",");
			if(recordPersonNos.length > 0 && recordPersonName.length > 0){
				for(int i=0;i<recordPersonNos.length;i++){
					MeetingPersonnel personnel = new MeetingPersonnel();
					personnel.setId(UUIDGenerator.generate());
					personnel.setMeetingId(meeting.getId());
					if(StringUtils.isNotBlank(recordPersonNos[i])){
						personnel.setPersonNo(recordPersonNos[i]);
						personnel.setPersonName(recordPersonName[i]);
					}else{
						personnel.setPersonNo(meeting.getCreator());
						personnel.setPersonName(meeting.getCreatorName());
					}
					personnel.setPersonType(MeetingPersonnelType.RECORD.getCode());
					personnel.setDelFlag(1);
					personnel.setCreateTime(new Date());
					personnel.setCreator(meeting.getCreator());
					personnel.setUpdateTime(new Date());
					personnel.setUpdator(meeting.getUpdator());
					personnels.add(personnel);

				}
			}
		}
		return personnels;
	}

	//获取会议内容文件
	private List<MeetingFiles> getMeetingFiles(Meeting meeting){
		List<MeetingFiles> files = new ArrayList<MeetingFiles>();
		if(meeting != null){
			//会议内容附件（名称，路劲）
			String[] fileNames = meeting.getFileName().trim().split(",");
			String[] filePaths = meeting.getFilePath().trim().split(",");
			if(fileNames.length > 0 && filePaths.length > 0){
				for(int i=0;i<fileNames.length;i++){
					if(StringUtils.isNotBlank(fileNames[i])){
						MeetingFiles file = new MeetingFiles();
						file.setId(UUIDGenerator.generate());
						file.setMeetingId(meeting.getId());
						file.setFileName(fileNames[i]);
						file.setFilePath(filePaths[i]);
						file.setDelFlag(1);
						file.setUseType(MeetingFileType.MEETING_CONTENT_FILE.getCode());
						file.setCreateTime(new Date());
						file.setCreator(meeting.getCreator());
						file.setUpdateTime(new Date());
						file.setUpdator(meeting.getUpdator());
						files.add(file);
					}
				}
			}
		}
		return files;
	}

	@Override
	public void delMeetingById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			MeetingPersonnel meetingPersonnel = new MeetingPersonnel();
			meetingPersonnel.setMeetingId(id);
			this.meetingDao.delMeetingById(id.trim());
			this.meetingPersonnelDao.delMeetingPersonnelByMeetingId(meetingPersonnel);
			Map<String,Object> params = new HashMap<>();
			params.put("meeting_id", id);
			params.put("use_type", 1);
			this.meetingFilesDao.delMeetingFilesByMeetingId(params);
		}
	}

	@Override
	public void delMeetingByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			Map<String,Object> params = new HashMap();
			params.put("ids", ids);
			this.meetingDao.delMeetingByIds(params);
		}
	}

	@Override
	public void updateMeeting(Meeting meeting) throws Exception {
		if (null != meeting) {
			meeting.setUpdateTime(new Date());
			//this.meetingDao.updateMeeting(meeting);


			//拼接和格式化会议开始时间和结束时间
			String meetingTime = meeting.getMeetingTime();
			String start = meeting.getStart();
			String end = meeting.getEnd();
			Date startTime = DateUtils.StringToDate(meetingTime+" "+start+":00", "yyyy-MM-dd HH:mm:ss");
			Date ednTime = DateUtils.StringToDate(meetingTime+" "+end+":00", "yyyy-MM-dd HH:mm:ss");
			meeting.setStartTime(startTime);
			meeting.setEndTime(ednTime);
			//获取参加会议人员
			List<MeetingPersonnel> personnels = getMeetingPersonnel(meeting);
			//会议附件（名称，路劲）
			List<MeetingFiles> files = getMeetingFiles(meeting);

			//更新会议时先删除会议的参加人员及附件，后添加新的人员及附件
			MeetingPersonnel meetingPersonnel =new MeetingPersonnel();
			meetingPersonnel.setMeetingId(meeting.getId());
			this.meetingPersonnelDao.delMeetingPersonnelByMeetingId(meetingPersonnel);

			Map<String,Object> params = new HashMap<>();
			params.put("meeting_id", meeting.getId());
			params.put("use_type", MeetingFileType.MEETING_CONTENT_FILE.getCode());
			this.meetingFilesDao.delMeetingFilesByMeetingId(params);

			if(CollectionUtils.isNotEmpty(personnels)){
				this.meetingPersonnelDao.insertMeetingPersonnels(personnels);
			}
			if(CollectionUtils.isNotEmpty(files)){
				this.meetingFilesDao.insertMeetingFilesList(files);
			}
			this.meetingDao.updateMeeting(meeting);
		}
	}

	@Override
	public void updateMeetingByIds(String ids,Meeting meeting) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != meeting) {
			meeting.setUpdateTime(new Date());
			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("meeting", meeting);
			this.meetingDao.updateMeetingByIds(params);
		}
	}


	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
	 * @param strs
	 * @return
	 */
	private String converString(String strs) {
		if (StringUtils.isNotBlank(strs)) {
			String[] idStrs = strs.trim().split(",");
			if (null != idStrs && idStrs.length > 0) {
				StringBuffer sbf = new StringBuffer("");
				for (String str : idStrs) {
					if (StringUtils.isNotBlank(str)) {
						sbf.append("'").append(str.trim()).append("'").append(",");
					}
				}
				if (sbf.length() > 0) {
					sbf = sbf.deleteCharAt(sbf.length() - 1);
					return sbf.toString();
				}
			}
		}
		return "";
	}

	@Override
	public PagerModel<Meeting> getMyMeetingPagerModelByQuery(Meeting meeting, Query query) throws Exception {
		Page<Meeting> page = null;
		if((null != meeting && null != query)){
			PageHelper.startPage(query.getPageIndex(),query.getPageSize());
			page = meetingDao.getMyMeetingPagerModelByQuery(meeting);
		}
		return new PagerModel<Meeting>(page);
	}

	@Override
	public ReturnVo<String> addOrUpdateMeeting(Meeting meeting) throws Exception {
		ReturnVo<String> returnVo = new ReturnVo<>(ReturnCode.FAIL,"修改失败！");
		if (null != meeting && StringUtils.isNotBlank(meeting.getUserNo())) {
			String userNo=meeting.getUserNo();
			//设置会议发起人邮箱地址
			AppointmentVO appointmentVO=new AppointmentVO();

			com.ys.tools.vo.ReturnVo<PersonnelApiVo> person = personnelApi.getPersonnelApiVoByNo(userNo);
			PersonnelApiVo personnelApiVo = person.getData();
			appointmentVO.setEmail(personnelApiVo.getEmail());
			logger.info("发起人邮箱===》》》"+personnelApiVo.getEmail());
            List<ScheduleEvent> scheduleEventList = new ArrayList<>();
            List<String> newNos = new ArrayList<>();
            //设置邮箱与日程事件
			this.setMandatoryEmail(scheduleEventList,newNos,appointmentVO,meeting,userNo);

			Map<String,Object> map=new HashMap<>();
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
			if(StringUtils.isBlank(meeting.getId())){
				meeting.setCreator(userNo);
				meeting.setUpdator(userNo);
				meeting.setStatus(MeetingStatusEnum.PENDIND.getCode());
				meeting.setDelFlag(1);
				System.out.println("必选人员邮箱"+appointmentVO.getMandatoryEmail());
				System.out.println("可选人员邮箱"+appointmentVO.getOptionalEmail());
				ReturnVo<AppointmentVO> returnVoApp = metingComponent.sendMeetingInvitation(appointmentVO);
				if(returnVoApp.getCode()== ReturnCode.SUCCESS){
					AppointmentVO vo = returnVoApp.getData();
					meeting.setChangeId(vo.getChangeId());
					meeting.setChangeKey(vo.getChangeKey());
					insertMeeting(meeting);

					for(ScheduleEvent scheduleEvent : scheduleEventList){
						scheduleEvent.setId(UUIDGenerator.generate());
						scheduleEvent.setTitle(meeting.getTheme());
						scheduleEvent.setAddress(meeting.getMeetingroomName());
						scheduleEvent.setContent(meeting.getContent());
						scheduleEvent.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
						scheduleEvent.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));

						scheduleEvent.setCreator(userNo);
						scheduleEvent.setCreateTime(new Date());
						scheduleEvent.setUpdator(userNo);
						scheduleEvent.setUpdateTime(new Date());

						scheduleEvent.setDelFlag(1);
						scheduleEvent.setType(2);
						scheduleEvent.setIsAllDay(0);
						scheduleEvent.setChangeId(vo.getChangeId());
						scheduleEvent.setChangeKey(vo.getChangeKey());
						scheduleEvent.setMeetingId(meeting.getId());

					}
					this.scheduleEventDao.insertScheduleEvents(scheduleEventList);
					returnVo.setCode(ReturnCode.SUCCESS);
					returnVo.setMsg("发送成功！");
				}
			}else{
				Meeting mt = this.meetingDao.getMeetingById(meeting.getId());
				appointmentVO.setOldStart(DateUtils.dateToString(mt.getStartTime(), "yyyy-MM-dd HH:mm:ss"));
				appointmentVO.setOldEnd(DateUtils.dateToString(mt.getEndTime(), "yyyy-MM-dd HH:mm:ss"));
				meeting.setCreator(userNo);
				meeting.setUpdator(userNo);
//				meeting.setCreatorName(loginUser.getName());
				meeting.setStatus(MeetingStatusEnum.PENDIND.getCode());
				meeting.setDelFlag(1);
				if(mt.getChangeId() !=null && mt.getChangeKey() != null){
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
						this.meetingDao.updateMeeting(meeting);
						//发送会议邀请或会议更新插入会让日程
						List addEvent =new ArrayList();
						String editEventId = "";
						String delEventId = "";
						if(mt.getStatus() == MeetingStatusEnum.MY_DRAFT.getCode()){
							System.out.println("changeId===>>>"+meeting.getChangeId());
							System.out.println("changeKey===>>>"+meeting.getChangeKey());
							this.setScheduleEventList(scheduleEventList,meeting,start,end,userNo);
							this.scheduleEventDao.insertScheduleEvents(scheduleEventList);
							returnVo.setCode(ReturnCode.SUCCESS);
							returnVo.setMsg("发送成功！");
						}else{//发送会议更新时，根据所选人员添加、删除、修改日程
							List<ScheduleEvent> events = this.scheduleEventDao.getScheduleEventByMeetingId(meeting.getId());
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
							updateSchdule.setUpdator(userNo);
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

										addSchedule.setCreator(userNo);
										addSchedule.setCreateTime(new Date());
										addSchedule.setUpdator(meeting.getCreatorName());
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
								this.scheduleEventDao.delScheduleEventByIds(delEventId.substring(0, delEventId.length()-1));
							}
							if(StringUtils.isNotBlank(editEventId)){
								this.scheduleEventDao.updateScheduleEventByIds(editEventId, updateSchdule);
							}
							if(addEvent.size()>0){
								this.scheduleEventDao.insertScheduleEvents(addEvent);
							}
							returnVo.setCode(ReturnCode.SUCCESS);
							returnVo.setMsg("发送成功！");
						}
					}
				}
			}
			System.out.println(JSONObject.fromObject(map).toString());
		}else{
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg("用户信息获取失败，请重新登录");
		}
		return returnVo;
	}

	/**
	 * 初始化加载页面数据
	 * @param meetings
	 * @param userNo
	 * @return
	 */
	public List<Meeting> getInitList(List<Meeting> meetings,String userNo){
		// 通过工号数据查询人员部门(设置发起人名称，部门)
		List<String> nos = new ArrayList<String>();
		List<MeetingReply> meetingReplys = new ArrayList<MeetingReply>();
		if(meetings != null && meetings.size()>0){
			for(Meeting m : meetings){
				MeetingReply r = new MeetingReply();
				r.setMeetingId(m.getId());
				meetingReplys.add(r);
				m.setUserNo(userNo);
				nos.add(m.getCreator());
			}
			com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVo = personnelApi.getPersonnelApiVoByNos(nos);
			if(UcenterConstant.SUCCESS == returnVo.getCode()){
				List<PersonnelApiVo> personnelApiVos = returnVo.getDatas();
				if(personnelApiVos.size() > 0){
					Map map = new HashMap();
					for(PersonnelApiVo p : personnelApiVos){
						map.put(p.getNo(), p);
					}
					for(Meeting m : meetings){
						if((PersonnelApiVo)map.get(m.getCreator()) != null){
							m.setCreatorDept(((PersonnelApiVo)map.get(m.getCreator())).getDeptName());
							m.setCreatorName(((PersonnelApiVo)map.get(m.getCreator())).getName());
						}
					}
				}
			}

			Map mapPerson = new HashMap();
			List<MeetingPersonnel> meetingPersonnel = meetingPersonnelService.getRecordPerson(meetings);

			//设置会议相对应的附件
			List<MeetingFiles> files = meetingFilesService.getMeetingFiles(meetings);

			//详情页面显示会议答复内容
			List<MeetingReply> replys = meetingReplyService.getReplyByMeeting(meetingReplys);

			//设置会议对于的会议纪要内容
			List<MeetingSummary> summarys = meetingSummaryService.getSummaryByMeetingId(meetings);
			for(Meeting m : meetings){
				//必选人员
				String mandatoryPersonName="";
				//可选人员
				String optionalPersonName="";
				//记录人员
				String recordPersonName="";
				String recordPersonNo="";
				String personList= m.getCreatorName()+"、";
				String tmp = "";

				//设置参加会议人员
				List<MeetingPersonnel> mandatoryPersonList = new ArrayList<MeetingPersonnel>();
				List<MeetingPersonnel> optionalPersonList = new ArrayList<MeetingPersonnel>();
				//计算距离会议开始的时间差
				String time_difference="";
				if(new Date().getTime()<m.getStartTime().getTime()){
					try {
						time_difference = DateUtils.getDistanceTime(m.getStartTime(), new Date());
					} catch (ParseException e) {
						e.printStackTrace();
					}
					m.setTime_difference("距离开会时间还有 "+time_difference);
				}else if(new Date().getTime()>m.getStartTime().getTime() && new Date().getTime()<m.getEndTime().getTime()){
					//m.setTime_difference("会议正在进行中......");
					m.setTime_difference("0");
				}else if(new Date().getTime()>m.getEndTime().getTime()){
					m.setTime_difference("1");
				}

				List<MeetingFiles> mf = new ArrayList<MeetingFiles>();
				List<MeetingFiles> ms = new ArrayList<MeetingFiles>();
				if(meetingPersonnel != null && meetingPersonnel.size()>0){
					for(MeetingPersonnel p : meetingPersonnel){
						if(m.getId().equals(p.getMeetingId()) && !p.getPersonNo().equals(m.getCreator())){
							if(!tmp.equals(p.getPersonNo()) && p.getPersonType() != MeetingPersonnelType.RECORD.getCode()){
								personList =personList + p.getPersonName()+"、";
								tmp = p.getPersonNo();
							}
						}
						if(m.getId().equals(p.getMeetingId()) && p.getPersonType().equals(MeetingPersonnelType.MANDATORY.getCode())){
							mandatoryPersonList.add(p);
							mandatoryPersonName = mandatoryPersonName + p.getPersonName()+",";
						}else if(m.getId().equals(p.getMeetingId()) && p.getPersonType().equals(MeetingPersonnelType.OPTIONAL.getCode())){
							optionalPersonList.add(p);
							optionalPersonName = optionalPersonName + p.getPersonName()+",";
						}else if(m.getId().equals(p.getMeetingId()) && p.getPersonType().equals(MeetingPersonnelType.RECORD.getCode())){
							recordPersonName = recordPersonName + p.getPersonName()+",";
							recordPersonNo = recordPersonNo + p.getPersonNo()+",";
						}
					}
					if(StringUtils.isNotBlank(mandatoryPersonName)){
						m.setMandatoryPersonName(mandatoryPersonName.substring(0, mandatoryPersonName.length()-1));
					}
					if(StringUtils.isNotBlank(optionalPersonName)){
						m.setOptionalPersonName(optionalPersonName.substring(0, optionalPersonName.length()-1));
					}
					if(StringUtils.isNotBlank(recordPersonName)){
						m.setRecordPersonName(recordPersonName.substring(0, recordPersonName.length()-1));
					}
					if(StringUtils.isNotBlank(recordPersonNo)){
						m.setRecordPersonNo(recordPersonNo.substring(0, recordPersonNo.length()-1));
					}
					if(StringUtils.isNotBlank(personList)){
						m.setPersonList(personList.substring(0, personList.length()-1));
					}
					//列表页面查看时显示必选人员和可选人员
					m.setMandatoryPersonList(mandatoryPersonList);
					m.setOptionalPersonList(optionalPersonList);
				}

				if(files != null && files.size()>0){
					//设置会议附件
					for(MeetingFiles f : files){
						if(f.getMeetingId().equals(m.getId()) && f.getUseType() == 1){//会议主题附件
							mf.add(f);
						}else if(f.getMeetingId().equals(m.getId()) && f.getUseType() == 2){//会议纪要附件
							ms.add(f);
						}
					}
					m.setMeetingFiles(mf);
					m.setMeetingSummaryFiles(ms);
					mf = new ArrayList<MeetingFiles>();
					ms = new ArrayList<MeetingFiles>();
				}


				//设置会议详情中回复内容
				List<MeetingReply> replyList =new ArrayList<MeetingReply>();
				if(replyList != null && replys.size()>0){
					for(MeetingReply meetingReply : replys){
						meetingReply.setReplyStatusStr(meetingReply.getReplyStatusStr());
						meetingReply.setUpdateTimeStr(DateUtils.dateToString(meetingReply.getUpdateTime(), "yyyy-MM-dd HH:mm:ss"));
						if(meetingReply.getMeetingId().equals(m.getId())){
							replyList.add(meetingReply);
						}
					}
				}
				m.setCount(replyList.size());
				m.setReplyList(replyList);

				//初始化加载会议纪要内容
				if(summarys !=null && summarys.size()>0){
					for(MeetingSummary y : summarys){
						if(y.getMeetingId().equals(m.getId())){
							m.setSummaryContent(y.getContent());
						}
					}
				}
			}
		}
		return meetings;
	}

    /**
     * 设置必选人员email
     * @param appointmentVO
     * @param meeting
     */
    public void setMandatoryEmail(List<ScheduleEvent>scheduleEventList,List<String>newNos,AppointmentVO appointmentVO,Meeting meeting,String userNo){
        ScheduleEvent sh;

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
            if(CollectionUtils.isNotEmpty(nos)){
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> returnVos = personnelApi.getPersonnelApiVoByNos(nos);
                List<PersonnelApiVo> personnelApiVos = returnVos.getDatas();
                if(CollectionUtils.isNotEmpty(personnelApiVos)){
                    personnelApiVos.forEach(p->mandatoryEmail.add(p.getEmail()));
                }
            }
            appointmentVO.setMandatoryEmail(mandatoryEmail);
        }
        //设置会议参与人---可选人员邮箱地址
        List<String> optionalNos = new ArrayList<>();
        List<String> optionalEmail = new ArrayList<>();
        if(StringUtils.isNotBlank(meeting.getOptionalPersonNo())){
            String[] personNO = meeting.getOptionalPersonNo().split(",");
            for(String s : personNO){
                if(s.contains("@")){
                    optionalEmail.add(s.trim());
                    logger.info("可选人员邮箱===》》》"+s);
                }else{
                    optionalNos.add(s.trim());
                    sh = new ScheduleEvent();
                    sh.setCreator(userNo);
                    sh.setUpdator(userNo);
                    sh.setReceiveNo(s.trim());
                    scheduleEventList.add(sh);
                    newNos.add(s.trim());
                }
            }
        }
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
        appointmentVO.setOptionalEmail(optionalEmail);
    }

    /**
     * 设置日程事件信息
     * @param scheduleEventList,vo,meeting,start,end,userNo
     */
    public void setScheduleEventList(List<ScheduleEvent>scheduleEventList,AppointmentVO vo ,Meeting meeting,String start,String end,String userNo){
        for(ScheduleEvent scheduleEvent : scheduleEventList){
            scheduleEvent.setId(UUIDGenerator.generate());
            scheduleEvent.setTitle(meeting.getTheme());
            scheduleEvent.setAddress(meeting.getMeetingroomName());
            scheduleEvent.setContent(meeting.getContent());
            scheduleEvent.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
            scheduleEvent.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));

            scheduleEvent.setCreator(userNo);
            scheduleEvent.setCreateTime(new Date());
            scheduleEvent.setUpdator(userNo);
            scheduleEvent.setUpdateTime(new Date());

            scheduleEvent.setDelFlag(1);
            scheduleEvent.setType(2);
            scheduleEvent.setIsAllDay(0);
            scheduleEvent.setChangeId(vo.getChangeId());
            scheduleEvent.setChangeKey(vo.getChangeKey());
            scheduleEvent.setMeetingId(meeting.getId());
        }
    }

    /**
     * 设置日程事件信息
     * @param scheduleEventList,meeting,start,end,userNo
     */
    public void setScheduleEventList(List<ScheduleEvent>scheduleEventList,Meeting meeting,String start,String end,String userNo){
        for(ScheduleEvent scheduleEvent : scheduleEventList){
            scheduleEvent.setId(UUIDGenerator.generate());
            scheduleEvent.setTitle(meeting.getTheme());
            scheduleEvent.setAddress(meeting.getMeetingroomName());
            scheduleEvent.setContent(meeting.getContent());
            scheduleEvent.setStartTime(DateUtils.StringToDate(start, "yyyy-MM-dd HH:mm:ss"));
            scheduleEvent.setEndTime(DateUtils.StringToDate(end, "yyyy-MM-dd HH:mm:ss"));

            scheduleEvent.setCreator(userNo);
            scheduleEvent.setCreateTime(new Date());
            scheduleEvent.setUpdator(userNo);
            scheduleEvent.setUpdateTime(new Date());

            scheduleEvent.setDelFlag(1);
            scheduleEvent.setType(2);
            scheduleEvent.setIsAllDay(0);
            scheduleEvent.setChangeId(meeting.getChangeId());
            scheduleEvent.setChangeKey(meeting.getChangeKey());
            scheduleEvent.setMeetingId(meeting.getId());
        }
    }
}

