package com.dragon.portal.component;

import com.dragon.portal.model.rscmgmt.AppointmentVO;
import com.ys.tools.vo.ReturnVo;

/**
 * Exchange会议组件
 * @Title:
 * @Description:
 * @Author:xietongjian
 * @Since:2017年5月10日 上午11:03:16
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public interface IMeetingComponent {

	/**
	 * 添加会议
	 * @param appointmentVO
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 上午11:04:47
	 */
	public com.dragon.tools.vo.ReturnVo<AppointmentVO> sendMeetingInvitation(AppointmentVO appointmentVO) throws Exception;
	
	/**
	 * 修改会议
	 * @param appointmentVO
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 上午11:04:47
	 */
	public com.dragon.tools.vo.ReturnVo<AppointmentVO> editMeetingInvitation(AppointmentVO appointmentVO) throws Exception;
}
