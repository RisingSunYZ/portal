package com.dragon.portal.dao.cstm;

import com.dragon.portal.model.cstm.SystemMenuUser;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * @Title:常用系统菜单用户中间表Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:40:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface ISystemMenuUserDao {

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
	 * 到IDM常用系统菜单用户中间表SystemMenuUser
	 * @param userNo
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年7月12日 下午3:49:10
	 */
	public List<SystemMenuUser> getIdmSysMenuByNo(String userNo) throws Exception;

	/**
	 * 分页查询常用系统菜单用户中间表SystemMenuUser
	 * @param systemMenuUser
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<SystemMenuUser> getPagerModelByQuery(SystemMenuUser systemMenuUser) throws Exception;

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
	
	
	public int delSystemMenuUserByNo(String no) throws Exception;
	
	
	/**
	 * 通过id批量删除常用系统菜单用户中间表SystemMenuUser
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delSystemMenuUserByIds(@Param( value = "ids") String ids) throws Exception;
	
	/**
	 * 通过id修改常用系统菜单用户中间表SystemMenuUser
	 * @param systemMenuUser
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuUser(SystemMenuUser systemMenuUser) throws Exception;

	/**
	 * 通过ids批量修改常用系统菜单用户中间表SystemMenuUser
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateSystemMenuUserByIds(Map<String,Object> params) throws Exception;
	
	/**
	 * 根据系统id和用户id查询菜单是否存在
	 * @param systemMenuUser
	 * @return
	 * @throws Exception
	 */
	public int getByPageCount(SystemMenuUser systemMenuUser) throws Exception;
	/**
	 * 插入用户关联表
	 * @param list
	 * @return
	 * @throws Exception
	 */
	public void insertMenuUser(List<SystemMenuUser> list) throws Exception;
	
}
