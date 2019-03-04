package com.dragon.portal.component.impl;

import com.dragon.tools.common.ReturnCode;
import com.mhome.tools.common.JsonUtils;
import com.dragon.portal.component.IMeetingComponent;
import com.dragon.portal.model.rscmgmt.AppointmentVO;
import com.dragon.tools.common.ReadProperty;
import com.dragon.tools.vo.ReturnVo;
import microsoft.exchange.webservices.data.core.ExchangeService;
import microsoft.exchange.webservices.data.core.enumeration.misc.ConnectingIdType;
import microsoft.exchange.webservices.data.core.enumeration.misc.ExchangeVersion;
import microsoft.exchange.webservices.data.core.enumeration.property.WellKnownFolderName;
import microsoft.exchange.webservices.data.core.enumeration.service.ConflictResolutionMode;
import microsoft.exchange.webservices.data.core.enumeration.service.SendInvitationsOrCancellationsMode;
import microsoft.exchange.webservices.data.core.exception.misc.ArgumentOutOfRangeException;
import microsoft.exchange.webservices.data.core.exception.service.local.ServiceLocalException;
import microsoft.exchange.webservices.data.core.service.item.Appointment;
import microsoft.exchange.webservices.data.credential.ExchangeCredentials;
import microsoft.exchange.webservices.data.credential.WebCredentials;
import microsoft.exchange.webservices.data.misc.ImpersonatedUserId;
import microsoft.exchange.webservices.data.property.complex.MessageBody;
import microsoft.exchange.webservices.data.search.CalendarView;
import microsoft.exchange.webservices.data.search.FindItemsResults;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class MeetingComponentImpl implements IMeetingComponent {

	private static Logger logger = Logger.getLogger(MeetingComponentImpl.class);
	
//	@Resource
//	private ReadProperty readProperty;
	
	private ExchangeService service = null;
	
	private void initService() {
		logger.info("开始创建ExchangeService...");
		service = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
		String adminName = null;//readProperty.getValue("exchange.admin.name");
	    String adminPwd = null;//readProperty.getValue("exchange.admin.password");
	    String domain = null;//readProperty.getValue("exchange.domain");
	    String uri = null;//readProperty.getValue("exchange.uri");
		ExchangeCredentials credentials = new WebCredentials(adminName, adminPwd, domain);
		service.setCredentials(credentials);
		try {
			service.setUrl(new URI(uri));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("创建ExchangeService异常！");
		}
		logger.info("创建ExchangeService成功！");
	}
	
	@Override
	public ReturnVo<AppointmentVO> sendMeetingInvitation(AppointmentVO appointmentVO) throws Exception{
		ReturnVo<AppointmentVO> returnVo = new ReturnVo<AppointmentVO>();
		Map<String, String> map = new HashMap<String, String>();
		try {
			if (null == service) {
				initService();
				logger.info("初始化ExchangeService成功！");
			}
			synchronized(service){
				service.setImpersonatedUserId(new ImpersonatedUserId(ConnectingIdType.SmtpAddress, appointmentVO.getEmail()));
				Appointment appointment = new Appointment(service);
				appointment.setSubject(appointmentVO.getTitle());
				appointment.setLocation(appointmentVO.getAddress());
				appointment.setBody(new MessageBody(appointmentVO.getContent()));
				
				SimpleDateFormat formatter = null;
				formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date startDate = formatter.parse(appointmentVO.getStart());
				Date endDate = formatter.parse(appointmentVO.getEnd());
				appointment.setStart(startDate);
				appointment.setEnd(endDate);
				
				//必选人员
				List<String> mandatoryEmail = appointmentVO.getMandatoryEmail();
				if(mandatoryEmail != null && mandatoryEmail.size()>0){
					for(String s : mandatoryEmail){
						if(StringUtils.isNotBlank(s)){
							//发送者不需要加入到必选人员中
							if(!s.equals(appointmentVO.getEmail())){
								appointment.getRequiredAttendees().add(s); 
							}
						}
					}
				}
				//可选人员（包含记录人员）
				List<String> optionalEmail = appointmentVO.getOptionalEmail();
				if(optionalEmail != null && optionalEmail.size()>0){
					for(String s : optionalEmail){
						if(StringUtils.isNotBlank(s)){
							//发送者不需要加入到可选人员中
							if(!s.equals(appointmentVO.getEmail())){
								appointment.getOptionalAttendees().add(s); 
							}
						}
					}
				}
				
				logger.info("设置发送人" + appointmentVO.getEmail());
				appointment.save();
				logger.info("changeKey:"+appointment.getId().getChangeKey());
				logger.info("uniqueId:"+appointment.getId().getUniqueId());
				map.put("state", "1");
				
				appointmentVO.setChangeKey(appointment.getId().getChangeKey());
				appointmentVO.setChangeId(appointment.getId().getUniqueId());
				returnVo.setData(appointmentVO);
				returnVo.setCode(ReturnCode.SUCCESS);
				returnVo.setMsg("会议发送成功");
				map.put("id", appointment.getId().getUniqueId());
				logger.info("会议发送成功！" + JsonUtils.toJson(map));
			}
		} catch (ParseException e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			logger.error("日期格式转换异常！");
			e.printStackTrace();
		} catch (ArgumentOutOfRangeException e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			logger.error("ArgumentOutOfRangeException异常！");
			e.printStackTrace();
		} catch (ServiceLocalException e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			logger.error("Exchange服务初始化异常！");
			e.printStackTrace();
		} catch (Exception e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			logger.error("发送会议邀请异常！");
			e.printStackTrace();
		}
		return returnVo;
	}

	@Override
	public ReturnVo<AppointmentVO> editMeetingInvitation(AppointmentVO appointmentVO) throws Exception{
		ReturnVo<AppointmentVO> returnVo = new ReturnVo<AppointmentVO>();
		Map<String, String> map = new HashMap<String, String>();
		try {
			if (null == service) {
				initService();
			}
			synchronized(service){
				Appointment appointment = null; 
				appointment = this.getAppointment(service, appointmentVO);
				appointment.setSubject(appointmentVO.getTitle());
				appointment.setLocation(appointmentVO.getAddress());
				appointment.setBody(new MessageBody(appointmentVO.getContent()));
				
				SimpleDateFormat formatter = null;
				formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date startDate = formatter.parse(appointmentVO.getStart());
				Date endDate = formatter.parse(appointmentVO.getEnd());
				appointment.setStart(startDate);
				appointment.setEnd(endDate);
				//必选人员
				List<String> mandatoryEmail = appointmentVO.getMandatoryEmail();
				if(mandatoryEmail != null && mandatoryEmail.size()>0){
					for(String s : mandatoryEmail){
						if(StringUtils.isNotBlank(s)){
							if(!appointmentVO.getEmail().equals(s)){
								appointment.getRequiredAttendees().add(s); 
							}
						}
					}
				}
				//可选人员（包含记录人员）
				List<String> optionalEmail = appointmentVO.getOptionalEmail();
				if(optionalEmail != null && optionalEmail.size()>0){
					for(String s : optionalEmail){
						if(!appointmentVO.getEmail().equals(s)){
							appointment.getOptionalAttendees().add(s);  
						}
						
					}
				}
				
//				Collection<TimeZoneDefinition> t = service.getServerTimeZones();
//				TimeZoneDefinition tf = null;
//				for (TimeZoneDefinition timeZoneDefinition : t) {
//					if (timeZoneDefinition.getId().equalsIgnoreCase("China Standard Time")) {
//						tf = timeZoneDefinition;
//						break;
//					}
//				}
//				appointment.setStartTimeZone(tf);
				
				ImpersonatedUserId sender = new ImpersonatedUserId(ConnectingIdType.SmtpAddress, appointmentVO.getEmail());
				service.setImpersonatedUserId(sender);
				appointment.update(ConflictResolutionMode.AlwaysOverwrite,SendInvitationsOrCancellationsMode.SendOnlyToAll);
				
				map.put("state", "1");
				map.put("id", appointment.getId().getUniqueId());
				returnVo.setData(appointmentVO);
				returnVo.setCode(ReturnCode.SUCCESS);
				returnVo.setMsg("会议发送成功");
				logger.info("会议发送修改成功！");
				logger.info("changeKey:"+appointment.getId().getChangeKey());
				logger.info("uniqueId:"+appointment.getId().getUniqueId());
			}
		} catch (ParseException e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			e.printStackTrace();
		} catch (ArgumentOutOfRangeException e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			e.printStackTrace();
		} catch (ServiceLocalException e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			e.printStackTrace();
		} catch (Exception e) {
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
			e.printStackTrace();
		}
		return returnVo;
	}
	
	/**
	 * 
	 * @param service
	 * @return Exchange Folder instance based on Exchange FolderId object
	 * @throws Exception
	 */
	public Appointment getAppointment(ExchangeService service, AppointmentVO appointmentVo) throws Exception {
		if (null == service) {
			initService();
		}
		Appointment appointment = null;
		service.setImpersonatedUserId(new ImpersonatedUserId(ConnectingIdType.SmtpAddress, appointmentVo.getEmail()));
		// 获取当前的日程
		SimpleDateFormat formatter = null;
		formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date startDate = formatter.parse(appointmentVo.getOldStart());
		Date endDate = formatter.parse(appointmentVo.getOldEnd());
		CalendarView cv = new CalendarView(startDate, endDate);
		FindItemsResults<Appointment> findResults = service.findAppointments(WellKnownFolderName.Calendar, cv);
		ok:
		for (Appointment app : findResults.getItems()) {
			if(app.getIsMeeting()){
				if(app.getId().getUniqueId().equals(appointmentVo.getChangeId())){
					logger.info(app.getSubject());
					appointment = app;
					break ok;
				}
			}
		}
		return appointment;
	}
}
