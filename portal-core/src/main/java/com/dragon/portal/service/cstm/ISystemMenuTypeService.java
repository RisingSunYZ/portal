package com.dragon.portal.service.cstm;


import com.dragon.portal.model.cstm.SystemMenuType;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;

/**
 * @Title:常用系统菜单分类Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:39:24
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ISystemMenuTypeService {

	/**
	 * 通过id得到常用系统菜单分类SystemMenuType
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public SystemMenuType getSystemMenuTypeById(String id) throws Exception;

	/**
	 * 得到所有常用系统菜单分类SystemMenuType
	 * @param systemMenuType
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<SystemMenuType> getAll(SystemMenuType systemMenuType) throws Exception;

	/**
	 * 分页查询常用系统菜单分类SystemMenuType
	 * @param systemMenuType
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<SystemMenuType> getPagerModelByQuery(SystemMenuType systemMenuType, Query query) throws Exception;

	/**
	 * 添加常用系统菜单分类SystemMenuType
	 * @param systemMenuType
	 * @throws Exception
	 * @Description:
	 */
	public void insertSystemMenuType(SystemMenuType systemMenuType) throws Exception;
	
	/**
	 * 通过id删除常用系统菜单分类SystemMenuType
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuTypeById(String id) throws Exception;

	/**
	 * 通过id批量删除常用系统菜单分类SystemMenuType
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuTypeByIds(String ids) throws Exception;

	/**
	 * 通过id修改常用系统菜单分类SystemMenuType
	 * @param systemMenuType
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuType(SystemMenuType systemMenuType) throws Exception;

	/**
	 * 通过ids批量修改常用系统菜单分类SystemMenuType
	 * @param ids 如："'1','2','3','4'..."
	 * @param systemMenuType
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuTypeByIds(String ids, SystemMenuType systemMenuType) throws Exception;
	/**
	 * 删除分类前根据id查询是否有子级分类
	 * @param ids
	 * @return
	 * @throws Exception
	 */
	public int findCountByIds(String ids) throws Exception;

	/**
	 * 修改状态
	 * @param ids
	 * @param level
	 * @param systemMenuType
	 * @return
	 * @throws Exception
	 */
	public int updateStatusByIds(String ids, String level, SystemMenuType systemMenuType) throws Exception;
	/**
	 * 根据分类标识查询数据库是否存在
	 * @param systemMenuType
	 * @return
	 * @throws Exception
	 */
	public int getTypeSn(SystemMenuType systemMenuType) throws Exception;

	/**
	 * 查询一级分类菜单
	 * @return
	 * @throws Exception
	 */
	public List<SystemMenuType> getFirstClassify() throws Exception;
	/**
	 * 查询二级三级分类菜单
	 * @param systemMenuType
	 * @return
	 * @throws Exception
	 */
	public List<SystemMenuType> getClassify(int level, String id) throws Exception;
	
}
