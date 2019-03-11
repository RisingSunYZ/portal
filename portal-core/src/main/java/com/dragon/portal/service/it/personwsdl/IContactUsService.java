package com.dragon.portal.service.it.personwsdl;


import com.dragon.portal.model.hr.ContactUs;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;

/**
 * @Title:联系人信息配置Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 10:07:00
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IContactUsService {

	/**
	 * 通过id得到联系人信息配置ContactUs
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public ContactUs getContactUsById(String id) throws Exception;

	/**
	 * 得到所有联系人信息配置ContactUs
	 * @param contactUs
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<ContactUs> getAll(ContactUs contactUs) throws Exception;
	
	/**
	 * 得到所有联系人信息配置ContactUs
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<ContactUs> getItAvailable() throws Exception;
	
	/**
	 * 得到所有联系人信息配置ContactUs
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<ContactUs> getHrAvailable(String typeId) throws Exception;

	/**
	 * 分页查询联系人信息配置ContactUs
	 * @param contactUs
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<ContactUs> getPagerModelByQuery(ContactUs contactUs, Query query) throws Exception;

	/**
	 * 添加联系人信息配置ContactUs
	 * @param contactUs
	 * @throws Exception
	 * @Description:
	 */
	public void insertContactUs(ContactUs contactUs) throws Exception;
	
	/**
	 * 通过id删除联系人信息配置ContactUs
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delContactUsById(String id) throws Exception;

	/**
	 * 通过id批量删除联系人信息配置ContactUs
	 * @param ids 如："1,2,3,4..."
	 * @throws Exception
	 * @Description:
	 */
	public void delContactUsByIds(String ids) throws Exception;

	/**
	 * 通过id修改联系人信息配置ContactUs
	 * @param contactUs
	 * @throws Exception
	 * @Description:
	 */
	public void updateContactUs(ContactUs contactUs) throws Exception;

	/**
	 * 通过ids批量修改联系人信息配置ContactUs
	 * @param ids 如："1,2,3,4..."
	 * @param contactUs
	 * @throws Exception
	 * @Description:
	 */
	public void updateContactUsByIds(String ids, ContactUs contactUs) throws Exception;
	
	
}
