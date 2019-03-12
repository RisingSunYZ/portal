package com.dragon.portal.dao.addrbook;

import com.dragon.portal.model.addrbook.TopContacts;
import com.github.pagehelper.Page;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;

import java.util.List;


/**
 * @Title:常用联系人管理Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 11:34:04
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ITopContactsDao {

	/**
	 * 通过id得到常用联系人管理TopContacts
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public TopContacts getTopContactsById(String id) throws Exception;

	/**
	 * 得到所有常用联系人管理TopContacts
	 * @param topContacts
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<TopContacts> getAll(TopContacts topContacts) throws Exception;

	/**
	 * 分页查询常用联系人管理TopContacts
	 * @param topContacts
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<TopContacts> getPagerModelByQuery(TopContacts topContacts) throws Exception;

	/**
	 * 添加常用联系人管理TopContacts
	 * @param topContacts
	 * @throws Exception
	 * @Description:
	 */
	public void insertTopContacts(TopContacts topContacts) throws Exception;
	
	/**
	 * 通过id删除常用联系人管理TopContacts
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delTopContactsById(String id) throws Exception;
	
	/**
	 * 通过id批量删除常用联系人管理TopContacts
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delTopContactsByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改常用联系人管理TopContacts
	 * @param topContacts
	 * @throws Exception
	 * @Description:
	 */
	public void updateTopContacts(TopContacts topContacts) throws Exception;

	/**
	 * 通过ids批量修改常用联系人管理TopContacts
	 * @param ids 如："'1','2','3','4'..."
	 * @param topContacts
	 * @throws Exception
	 * @Description:
	 */
	public void updateTopContactsByIds(String ids, TopContacts topContacts) throws Exception;
	
	/**
	 * 批量添加常用联系人管理TopContacts
	 * @param List<TopContacts> topContacts
	 * @throws Exception
	 * @Description:
	 */
	public void insertAddTopContacts(List<TopContacts> topContacts) throws Exception;
	
	/**
	 * 查询工号是否已经存在通讯录中，如果存在则查询出来，不存在则返回空
	 * @param ownerNo,contactNo
	 * @throws Exception
	 * @Description:
	 */
	public TopContacts getTopContactsByNo(String ownerNo, String contactNo) throws Exception;

	/**
	 * 批量修改成移除
	 * @param list
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午12:14:02
	 */
	public void updateBatchTopContactsByList(List<TopContacts> list) throws Exception;
}
