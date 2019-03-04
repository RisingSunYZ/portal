package com.dragon.portal.dao.cstm;


import com.dragon.portal.model.cstm.SystemMenu;
import com.github.pagehelper.Page;

import java.util.List;
import java.util.Map;

/**
 * @Title:系统菜单列表Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-02 08:42:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ISystemMenuDao {

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
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<SystemMenu> getPagerModelByQuery(SystemMenu systemMenu) throws Exception;

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
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuByIds(Map<String,Object> params) throws Exception;
	
	/**
	 * 查询菜单表里面是否存在数据
	 * @param systemMenu
	 * @return
	 * @throws Exception
	 */
	public  List<SystemMenu> getSystemMenuBySysSn(SystemMenu systemMenu) throws Exception;
	
	/**
	 * 查询系统分类
	 * @param userNo
	 * @return
	 * @throws Exception
	 */
	public List<SystemMenu> getSysCataList(String userNo)  throws Exception;
	
	/**
	 * 查询系统标识是否重复
	 * @param systemMenu
	 * @return
	 * @throws Exception
	 */
	public int getByPageCount(SystemMenu systemMenu) throws Exception;
	/**
	 * 根据三级分类id查询所有菜单
	 * @param systemMenu
	 * @return
	 * @throws Exception
	 */
	public List<SystemMenu> getAllByThirdId(SystemMenu systemMenu) throws Exception ;

	/**
	 * 根据工号查询工号对应的菜单
	 * @param no
	 * @return
	 * @throws Exception
	 */
	public List<SystemMenu> getAllByUserNo(String no) throws Exception ;
	
}
