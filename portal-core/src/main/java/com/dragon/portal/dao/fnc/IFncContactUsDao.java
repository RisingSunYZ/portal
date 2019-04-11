package com.dragon.portal.dao.fnc;

import com.dragon.portal.model.fnc.ContactUs;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * @Title:财务服务-联系人管理Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:11:26
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface IFncContactUsDao {

	/**
	 * 通过id得到财务服务-联系人管理ContactUs
	 * @param id
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public ContactUs getContactUsById(String id) throws Exception;

	/**
	 * 得到所有财务服务-联系人管理ContactUs
	 * @param contactUs
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<ContactUs> getAll(ContactUs contactUs) throws Exception;

	/**
	 * 分页查询财务服务-联系人管理ContactUs
	 * @param contactUs
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<ContactUs> getPagerModelByQuery(ContactUs contactUs) throws Exception;

	/**
	 * 添加财务服务-联系人管理ContactUs
	 * @param contactUs
	 * @throws Exception
	 * @Description:
	 */
	public void insertContactUs(ContactUs contactUs) throws Exception;

	/**
	 * 通过id删除财务服务-联系人管理ContactUs
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delContactUsById(String id) throws Exception;

	/**
	 * 通过id批量删除财务服务-联系人管理ContactUs
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delContactUsByIds(String ids) throws Exception;

	/**
	 * 通过id修改财务服务-联系人管理ContactUs
	 * @param contactUs
	 * @throws Exception
	 * @Description:
	 */
	public void updateContactUs(ContactUs contactUs) throws Exception;

	/**
	 * 通过ids批量修改财务服务-联系人管理ContactUs
	 * @param ids 如："'1','2','3','4'..."
	 * @param contactUs
	 * @throws Exception
	 * @Description:
	 */
	public void updateContactUsByIds(String ids, ContactUs contactUs) throws Exception;
	
	
}
