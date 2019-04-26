package com.dragon.portal.service.addrbook;

import com.dragon.portal.model.addrbook.TopContacts;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;


import java.util.List;

/**
 * @Title:常用联系人管理Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 11:34:04
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ITopContactsService {

	/**
	 * 通过id得到常用联系人管理TopContacts
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public TopContacts getTopContactsById(String id) throws Exception;
	
	/**
	 * 查询工号是否已经存在通讯录中，如果存在则查询出来，不存在则返回空
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午1:38:19
	 */
	public TopContacts getTopContactsByNo(String ownerNo, String contactNo) throws Exception;
	
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
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<TopContacts> getPagerModelByQuery(TopContacts topContacts, Query query) throws Exception;

	/**
	 * 添加常用联系人管理TopContacts
	 * @param topContacts
	 * @throws Exception
	 * @Description:
	 */
	public void insertTopContacts(TopContacts topContacts) throws Exception;
	
	/**
	 * 批量添加常用联系人TopContacts
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午1:38:19
	 */
	public void insertAddTopContacts(String no, List<String> nos) throws Exception;
	
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

	/**批量移除常用联系人
	 * @param ownerNo
	 * @param nosArr
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 上午11:58:08
	 */
	public void deleteAddTopContacts(String ownerNo, List<String> nosArr) throws Exception;
	
}
