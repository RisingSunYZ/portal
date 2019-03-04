package com.dragon.portal.service.cstm;

import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuType;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;

/**
 * @Title:系统菜单列表Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-02 08:42:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ISystemMenuService {

	/**
	 * 通过id得到系统菜单列表SystemMenu
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public SystemMenu getSystemMenuById(String id) throws Exception;

	/**
	 * 得到所有系统菜单列表SystemMenu
	 * @param systemMenu
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<SystemMenu> getAll(SystemMenu systemMenu) throws Exception;

	/**
	 * 分页查询系统菜单列表SystemMenu
	 * @param systemMenu
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<SystemMenu> getPagerModelByQuery(SystemMenu systemMenu, Query query) throws Exception;

	/**
	 * 添加系统菜单列表SystemMenu
	 * @param systemMenu
	 * @throws Exception
	 * @Description:
	 */
	public void insertSystemMenu(SystemMenu systemMenu) throws Exception;
	
	/**
	 * 通过id删除系统菜单列表SystemMenu
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuById(String id) throws Exception;

	/**
	 * 通过id批量删除系统菜单列表SystemMenu
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuByIds(String ids) throws Exception;

	/**
	 * 通过id修改系统菜单列表SystemMenu
	 * @param systemMenu
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenu(SystemMenu systemMenu) throws Exception;

	/**
	 * 通过ids批量修改系统菜单列表SystemMenu
	 * @param ids 如："'1','2','3','4'..."
	 * @param systemMenu
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuByIds(String ids, SystemMenu systemMenu) throws Exception;

	/**
	 * 根据分类id和分类等级查询下级分类
	 * @param id
	 * @param level
	 * @return
	 * @throws Exception
	 */
	public List<SystemMenuType> getCateListByLevel(String id, int level)throws Exception;

	/**
	 * 根据系统传进来的菜单表进行比较，没有的话插入菜单表，并且插入关系表
	 * @param userNo
	 * @param list
	 * @return
	 * @throws Exception
	 */
	public void compareMenu(String userNo, List<SystemMenu> list) throws Exception;
	
	/**
	 * 根据用户id获取系统分类
	 * @param userNo
	 * @return List<SystemMenu>
	 * @throws Exception
	 */
	public List<SystemMenu> getSysCataList(String userNo) throws Exception;
	
	/**
	 * 查询系统标识是否重复
	 * @param systemMenu
	 * @return
	 * @throws Exception
	 */
	public int getByPageCount(SystemMenu systemMenu) throws Exception;
	
}
