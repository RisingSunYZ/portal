package com.dragon.portal.component;

import com.dragon.portal.model.rscmgmt.AppointmentVO;
import com.dragon.tools.vo.ReturnVo;
import microsoft.exchange.webservices.data.core.service.item.Appointment;


/**
 * exchange日程组件
 * @author v-luozongfang
 *
 */
public interface IScheduleComponent {
	/**
	 * 添加日程信息
	 * @param appointmentVO
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public ReturnVo<AppointmentVO> insertScheduleEvent(AppointmentVO appointmentVO) throws Exception;
	
	/**
	 * 修改日程信息
	 * @param appointmentVO
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public ReturnVo<AppointmentVO> updateScheduleEvent(AppointmentVO appointmentVO) throws Exception;
	
	/**
	 * 删除日程信息
	 * @param appointmentVO
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public ReturnVo<AppointmentVO> deleteScheduleEvent(AppointmentVO appointmentVO) throws Exception;

	/**
	 * 通过用户邮箱，时间段获取Exchange里面的日程
	 * @param appointmentVo
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 上午9:03:05
	 */
	public ReturnVo<Appointment> getAppointmentLoop(AppointmentVO appointmentVo) throws Exception;
}
