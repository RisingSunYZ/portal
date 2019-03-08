package com.dragon.portal.dao.cstm;

import com.dragon.portal.model.cstm.BizSysMenu;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @Title:业务系统菜单Dao接口
 * @Description:
 * @Author:cenwei
 * @Since:2018-02-06 15:52:18
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IBizSysMenuDao {

	/**
	 * 通过id得到业务系统菜单BizSysMenu
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public BizSysMenu getBizSysMenuById(String id) throws Exception;

	/**
	 * 得到所有业务系统菜单BizSysMenu
	 * @param bizSysMenu
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<BizSysMenu> getAll(BizSysMenu bizSysMenu) throws Exception;

	/**
	 * 分页查询业务系统菜单BizSysMenu
	 * @param bizSysMenu
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<BizSysMenu> getPagerModelByQuery(BizSysMenu bizSysMenu, Query query) throws Exception;

	/**
	 * 添加业务系统菜单BizSysMenu
	 * @param bizSysMenu
	 * @throws Exception
	 * @Description:
	 */
	public void insertBizSysMenu(BizSysMenu bizSysMenu) throws Exception;
	
	/**
	 * 通过id删除业务系统菜单BizSysMenu
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delBizSysMenuById(String id) throws Exception;
	
	/**
	 * 通过id批量删除业务系统菜单BizSysMenu
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delBizSysMenuByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改业务系统菜单BizSysMenu
	 * @param bizSysMenu
	 * @throws Exception
	 * @Description:
	 */
	public void updateBizSysMenu(BizSysMenu bizSysMenu) throws Exception;

	/**
	 * 通过ids批量修改业务系统菜单BizSysMenu
	 * @param ids 如："'1','2','3','4'..."
	 * @param bizSysMenu
	 * @throws Exception
	 * @Description:
	 */
	public void updateBizSysMenuByIds(String ids, BizSysMenu bizSysMenu) throws Exception;
    /**
     * 通过sn查询pid
     * @param sn
     * @return
     */
	public String getIdBySn(String sn);
	
	
}
