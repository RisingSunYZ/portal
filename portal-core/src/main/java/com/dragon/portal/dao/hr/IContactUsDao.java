package com.dragon.portal.dao.hr;

import com.dragon.portal.model.hr.ContactUs;
import com.github.pagehelper.Page;

import java.util.List;
import java.util.Map;


/**
 * @Title:联系人信息配置Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 10:07:00
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IContactUsDao {

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
	 * 分页查询联系人信息配置ContactUs
	 * @param contactUs
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<ContactUs> getPagerModelByQuery(ContactUs contactUs) throws Exception;

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
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateContactUsByIds(Map<String,Object> params) throws Exception;
	
	
}
