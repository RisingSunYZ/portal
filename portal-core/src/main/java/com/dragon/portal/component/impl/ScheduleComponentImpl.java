package com.dragon.portal.component.impl;

import com.dragon.portal.component.IScheduleComponent;
import com.dragon.portal.model.rscmgmt.AppointmentVO;
import com.dragon.tools.common.ReadProperty;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import microsoft.exchange.webservices.data.core.ExchangeService;
import microsoft.exchange.webservices.data.core.PropertySet;
import microsoft.exchange.webservices.data.core.enumeration.misc.ConnectingIdType;
import microsoft.exchange.webservices.data.core.enumeration.misc.ExchangeVersion;
import microsoft.exchange.webservices.data.core.enumeration.property.BasePropertySet;
import microsoft.exchange.webservices.data.core.enumeration.property.WellKnownFolderName;
import microsoft.exchange.webservices.data.core.enumeration.service.ConflictResolutionMode;
import microsoft.exchange.webservices.data.core.enumeration.service.DeleteMode;
import microsoft.exchange.webservices.data.core.enumeration.service.SendInvitationsMode;
import microsoft.exchange.webservices.data.core.enumeration.service.SendInvitationsOrCancellationsMode;
import microsoft.exchange.webservices.data.core.exception.misc.ArgumentOutOfRangeException;
import microsoft.exchange.webservices.data.core.exception.service.local.ServiceLocalException;
import microsoft.exchange.webservices.data.core.service.item.Appointment;
import microsoft.exchange.webservices.data.core.service.item.Item;
import microsoft.exchange.webservices.data.core.service.schema.AppointmentSchema;
import microsoft.exchange.webservices.data.credential.ExchangeCredentials;
import microsoft.exchange.webservices.data.credential.WebCredentials;
import microsoft.exchange.webservices.data.misc.ImpersonatedUserId;
import microsoft.exchange.webservices.data.property.complex.MessageBody;
import microsoft.exchange.webservices.data.search.CalendarView;
import microsoft.exchange.webservices.data.search.FindItemsResults;
import org.apache.commons.lang.time.DateUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.net.URI;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

@Component
public class ScheduleComponentImpl implements IScheduleComponent {

	private static Logger logger = Logger.getLogger(ScheduleComponentImpl.class);
//	@Resource
//	private ReadProperty readProperty;
	
	private ExchangeService service = null;
	
	public final int ERROR = 0;
	public final int SUCCESS = 1;
	private void initService() {
		logger.info("开始创建ExchangeService...");
		try {
			service = new ExchangeService(ExchangeVersion.Exchange2010_SP2);
//			String adminName = readProperty.getValue("exchange.admin.name");
//			String adminPwd = readProperty.getValue("exchange.admin.password");
//			String domain = readProperty.getValue("exchange.domain");
//			String uri = readProperty.getValue("exchange.uri");
//			ExchangeCredentials credentials = new WebCredentials(adminName, adminPwd, domain);
//			service.setCredentials(credentials);
//			service.setUrl(new URI(uri));
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("【创建ExchangeService异常】:"+e.getMessage());
		}
		logger.info("创建ExchangeService成功！");
	}
	
	/**
	 * 添加exchange日程信息
	 */
	@Override
	public ReturnVo<AppointmentVO> insertScheduleEvent(AppointmentVO appointmentVO) throws Exception {
		ReturnVo<AppointmentVO> returnVo = new ReturnVo<AppointmentVO>();
		if (null == service) {
			initService();
		}
		try {
			synchronized(service){
				service.setImpersonatedUserId(new ImpersonatedUserId(ConnectingIdType.SmtpAddress, appointmentVO.getEmail()));
				Appointment appointment = new Appointment(service);
				appointment.setSubject(appointmentVO.getTitle());
				appointment.setLocation(appointmentVO.getAddress());
				appointment.setBody(new MessageBody(appointmentVO.getContent()));
				appointment.setIsAllDayEvent(appointmentVO.isAllDay());
				SimpleDateFormat formatter = null;
				formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				Date startDate = formatter.parse(appointmentVO.getStart());
				Date endDate = formatter.parse(appointmentVO.getEnd());
				appointment.setStart(startDate);
				appointment.setEnd(endDate);
				/*TimeZoneDefinition tf;
			try {
				Collection<TimeZoneDefinition> t = service.getServerTimeZones();
				tf = null;
				for (TimeZoneDefinition timeZoneDefinition : t) {
					if (timeZoneDefinition.getId().equalsIgnoreCase("China Standard Time")) {
						tf = timeZoneDefinition;
						break;
					}
				}
				appointment.setStartTimeZone(tf);
			} catch (Exception e) {
				e.printStackTrace();
				logger.error("获取时区异常！");
			}*/
				appointment.setConferenceType(1);
				appointment.save(SendInvitationsMode.SendToNone);
				logger.info("设置发送人" + appointmentVO.getEmail());
				logger.info("changeKey:"+appointment.getId().getChangeKey());
				logger.info("uniqueId:"+appointment.getId().getUniqueId());
//			map.put("state", "1");
				
				appointmentVO.setChangeKey(appointment.getId().getChangeKey());
				appointmentVO.setChangeId(appointment.getId().getUniqueId());
				returnVo.setData(appointmentVO);
				returnVo.setCode(ReturnCode.SUCCESS);
				returnVo.setMsg("日程插入成功");
				logger.info("日程插入成功！");
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
			logger.error("日程插入异常！");
			e.printStackTrace();
		}
		return returnVo;
	}

	/**
	 * 修改exchange日程信息
	 */
	@Override
	public ReturnVo<AppointmentVO> updateScheduleEvent(AppointmentVO appointmentVO) throws Exception {
		ReturnVo<AppointmentVO> returnVo = new ReturnVo<AppointmentVO>();
		try {
			if (null == service) {
				initService();
			}
			synchronized(service){
				Appointment appointment = null; 
				appointment = this.getAppointment(service, appointmentVO);
				if(appointment != null){
					appointment.setSubject(appointmentVO.getTitle());
					appointment.setLocation(appointmentVO.getAddress());
					appointment.setBody(new MessageBody(appointmentVO.getContent()));
					appointment.setIsAllDayEvent(appointmentVO.isAllDay());
					
					SimpleDateFormat formatter = null;
					formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					Date startDate = formatter.parse(appointmentVO.getStart());
					Date endDate = formatter.parse(appointmentVO.getEnd());
					appointment.setStart(startDate);
					appointment.setEnd(endDate);
				}else{
					logger.info("Appointment日程对象为空！");
				}
				
				/*Collection<TimeZoneDefinition> t = service.getServerTimeZones();
			TimeZoneDefinition tf = null;
			for (TimeZoneDefinition timeZoneDefinition : t) {
				if (timeZoneDefinition.getId().equalsIgnoreCase("China Standard Time")) {
					tf = timeZoneDefinition;
					break;
				}
			}
			appointment.setStartTimeZone(tf);*/
				ImpersonatedUserId sender = new ImpersonatedUserId(ConnectingIdType.SmtpAddress, appointmentVO.getEmail());
				service.setImpersonatedUserId(sender);
				appointment.update(ConflictResolutionMode.AlwaysOverwrite,SendInvitationsOrCancellationsMode.SendToNone);
				
//			map.put("state", "1");
				returnVo.setData(appointmentVO);
				returnVo.setCode(ReturnCode.SUCCESS);
				returnVo.setMsg("日程修改成功");
				logger.info("日程修改成功！");
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
	 * 删除exchange日程信息
	 */
	@Override
	public ReturnVo<AppointmentVO> deleteScheduleEvent(AppointmentVO appointmentVO) throws Exception {
		ReturnVo<AppointmentVO> returnVo = new ReturnVo<AppointmentVO>();
		try{
			if (null == service) {
				initService();
			}
			synchronized(service){
				Appointment appointment = null; 
				appointment = this.getAppointment(service, appointmentVO);
				appointment.delete(DeleteMode.MoveToDeletedItems);
				returnVo.setCode(ReturnCode.SUCCESS);
				returnVo.setMsg("日程删除成功");
            }
		}catch(NullPointerException e){
			e.printStackTrace();
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg("exchange数据为空！");
		}catch(Exception e){
			e.printStackTrace();
			returnVo.setCode(ReturnCode.FAIL);
			returnVo.setMsg(e.getMessage());
		}
		return returnVo;
	}
	
	/**
	 * 查询exchange日程信息
	 * @param service
	 * @param appointmentVo
	 * @return
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
		startDate = DateUtils.addMinutes(startDate, -1);
		Date endDate = formatter.parse(appointmentVo.getOldEnd());
		endDate = DateUtils.addMinutes(endDate, 1);
		CalendarView cv = new CalendarView(startDate, endDate);
		FindItemsResults<Appointment> findResults = service.findAppointments(WellKnownFolderName.Calendar, cv);
		ok:
		for (Appointment app : findResults.getItems()) {
			if(app.getId().getUniqueId().equals(appointmentVo.getChangeId())){
				appointment = app;
				break ok;
			}
		}
		return appointment;
	}
	
	/**
	 * 必传字段：appointmentVo.getEmail()，appointmentVo.getOldStart()， appointmentVo.getOldEnd()
	 * 修改exchange日程信息
	 */
	public ReturnVo<Appointment> getAppointmentLoop(AppointmentVO appointmentVo) throws Exception {
		ReturnVo<Appointment> rVo = new ReturnVo<Appointment>(ReturnCode.FAIL, "");
		if (null == service) {
			initService();
		}
		
		service.setImpersonatedUserId(new ImpersonatedUserId(ConnectingIdType.SmtpAddress, appointmentVo.getEmail()));
		// 获取当前的日程
		SimpleDateFormat formatter = null;
		formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date startDate = formatter.parse(appointmentVo.getOldStart());
		Date endDate = formatter.parse(appointmentVo.getOldEnd());
		CalendarView cv = new CalendarView(startDate, endDate);
		FindItemsResults<Appointment> findResults = service.findAppointments(WellKnownFolderName.Calendar, cv);
		rVo.setDatas(findResults.getItems());
		rVo.setCode(ReturnCode.SUCCESS);
		
	    PropertySet detailedPropertySet = new PropertySet(BasePropertySet.FirstClassProperties, AppointmentSchema.Recurrence);
	    ArrayList items = findResults.getItems();
	    Iterable<Item> itms = items;
		service.loadPropertiesForItems(itms, detailedPropertySet);
		return rVo;
	}

}
