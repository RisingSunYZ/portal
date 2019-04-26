package com.dragon.portal.service.cstm;

import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuUser;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @Title:常用系统菜单用户中间表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:40:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ISystemMenuUserService {

	/**
	 * 通过id得到常用系统菜单用户中间表SystemMenuUser
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public SystemMenuUser getSystemMenuUserById(String id) throws Exception;

	/**
	 * 得到所有常用系统菜单用户中间表SystemMenuUser
	 * @param systemMenuUser
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<SystemMenuUser> getAll(SystemMenuUser systemMenuUser) throws Exception;

	/**
	 * 分页查询常用系统菜单用户中间表SystemMenuUser
	 * @param systemMenuUser
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<SystemMenuUser> getPagerModelByQuery(SystemMenuUser systemMenuUser, Query query) throws Exception;

	/**
	 * 添加常用系统菜单用户中间表SystemMenuUser
	 * @param systemMenuUser
	 * @throws Exception
	 * @Description:
	 */
	public void insertSystemMenuUser(SystemMenuUser systemMenuUser) throws Exception;
	
	/**
	 * 通过id删除常用系统菜单用户中间表SystemMenuUser
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuUserById(String id) throws Exception;

	/**
	 * 通过id批量删除常用系统菜单用户中间表SystemMenuUser
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuUserByIds(String ids) throws Exception;

	/**
	 * 通过id修改常用系统菜单用户中间表SystemMenuUser
	 * @param systemMenuUser
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuUser(SystemMenuUser systemMenuUser) throws Exception;

	/**
	 * 通过ids批量修改常用系统菜单用户中间表SystemMenuUser
	 * @param ids 如："'1','2','3','4'..."
	 * @param systemMenuUser
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuUserByIds(String ids, SystemMenuUser systemMenuUser) throws Exception;


	/**
	 * 得到所有常用系统菜单用户中间表SystemMenuUser
	 * @param no
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<SystemMenu> getAllByNo(String no) throws Exception;

	/**
	 * 批量插入系统菜单用户中间表
	 * @param list(List<SystemMenuUser>)
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public void insertMenuUser(List<SystemMenuUser> list)  throws Exception;
	/**
	 * 根据工号删除系统菜单后批量保存新菜单
	 * @param list
	 * @param no
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年7月6日 下午2:51:07
	 */
	public void insertAfterDelByNo(List<SystemMenuUser> list, String no) throws Exception;
	/**
	 * 根据用户工号删除菜单数据 真删除
	 * @param no
	 * @return
	 * @Description:
	 * @author v-zhaohaishan 2017年7月6日 下午3:00:04
	 */
	public int delSystemMenuUserByNo(String no) throws Exception;
}
