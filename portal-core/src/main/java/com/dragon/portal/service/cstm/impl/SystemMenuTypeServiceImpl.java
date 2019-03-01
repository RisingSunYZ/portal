package com.dragon.portal.service.cstm.impl;

import com.dragon.portal.dao.cstm.ISystemMenuDao;
import com.dragon.portal.dao.cstm.ISystemMenuTypeDao;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuType;
import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.service.cstm.ISystemMenuTypeService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * @Title:常用系统菜单分类Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:39:24
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Service
public class SystemMenuTypeServiceImpl implements ISystemMenuTypeService {

	@Resource
	private ISystemMenuTypeDao systemMenuTypeDao;
	
	@Resource
	private ISystemMenuDao systemMenuDao;

	@Override
	public SystemMenuType getSystemMenuTypeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.systemMenuTypeDao.getSystemMenuTypeById(id.trim()) : null;
	}

	@Override
	public List<SystemMenuType> getAll(SystemMenuType systemMenuType) throws Exception {
		return null != systemMenuType ? this.systemMenuTypeDao.getAll(systemMenuType) : null;
	}

	@Override
	public PagerModel<SystemMenuType> getPagerModelByQuery(SystemMenuType systemMenuType, Query query)
			throws Exception {
		//分页查询
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<SystemMenuType> page = (null != systemMenuType && null != query) ? this.systemMenuTypeDao.getPagerModelByQuery(systemMenuType) : null;
		return new PagerModel<SystemMenuType>(page);
	}

	@Override
	public void insertSystemMenuType(SystemMenuType systemMenuType) throws Exception {
		if (null != systemMenuType) {
			systemMenuType.setId( UUIDGenerator.generate());
			systemMenuType.setCreateTime(new Date());
			systemMenuType.setUpdateTime(new Date());
			this.systemMenuTypeDao.insertSystemMenuType(systemMenuType);
		}
	}

	@Override
	public void delSystemMenuTypeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.systemMenuTypeDao.delSystemMenuTypeById(id.trim());
		}
	}

	@Override
	public void delSystemMenuTypeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids)) {
			this.systemMenuTypeDao.delSystemMenuTypeByIds(ids);
		}
	}

	@Override
	public void updateSystemMenuType(SystemMenuType systemMenuType) throws Exception {
		if (null != systemMenuType) {
			systemMenuType.setUpdateTime(new Date());
			this.systemMenuTypeDao.updateSystemMenuType(systemMenuType);
		}
	}

	@Override
	public void updateSystemMenuTypeByIds(String ids, SystemMenuType systemMenuType) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != systemMenuType) {
			systemMenuType.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("systemMenuType", systemMenuType);
			this.systemMenuTypeDao.updateSystemMenuTypeByIds(params);
		}
	}

	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
	 * 
	 * @param strs
	 * @return
	 */
	private String converString(String strs) {
		if (StringUtils.isNotBlank(strs)) {
			String[] idStrs = strs.trim().split(",");
			if (null != idStrs && idStrs.length > 0) {
				StringBuffer sbf = new StringBuffer("");
				for (String str : idStrs) {
					if (StringUtils.isNotBlank(str)) {
						sbf.append("'").append(str.trim()).append("'").append(",");
					}
				}
				if (sbf.length() > 0) {
					sbf = sbf.deleteCharAt(sbf.length() - 1);
					return sbf.toString();
				}
			}
		}
		return "";
	}

	@Override
	public int findCountByIds(String ids) throws Exception {
		int count = 0;
		if (StringUtils.isNotBlank(ids)) {
			count = this.systemMenuTypeDao.findCountByIds(ids);
		}
		return count;
	}

	@Override
	public int updateStatusByIds(String ids, String level, SystemMenuType systemMenuType) throws Exception {
		int count = 0;
		try {
			// status==1 需要启用 status==0 需要禁用
			if (systemMenuType.getStatus() == 1) {

				// 启用前先判断等级
				if (level.equals("1")) {
					// 是一级的话直接修改一级状态
					systemMenuTypeDao.updateStatusByIds(systemMenuType);

					// 创建二级分类的实体
					SystemMenuType systemMenuType2 = new SystemMenuType();
					// 二级分类集合
					List<SystemMenuType> sm2List = null;

					// 将一级分类的id赋值给二级分类的上级分类
					systemMenuType2.setPid(systemMenuType.getId());
					// 查询未删除的
					systemMenuType2.setDelFlag(1);

					// 根据上级分类查询对应下的二级分类
					sm2List = systemMenuTypeDao.getAll(systemMenuType2);

					// 处理二级分类和三级分类
					for (SystemMenuType qt : sm2List) {
						// 改变二级分类的状态
						systemMenuType.setId(qt.getId());
						systemMenuTypeDao.updateStatusByIds(systemMenuType);

						// 将二级分类的分类id赋值给三级分类的父级id
						systemMenuType.setPid(qt.getId());
						// 修改二级分类对应下的三级分类的状态
						systemMenuTypeDao.updateStatusBypIds(systemMenuType);
					}
				} else if (level.equals("2")) {
					// 是二级的话修改二级，同时修改三级的父级
					systemMenuTypeDao.updateStatusByIds(systemMenuType);

					// 将二级分类id设置为三级分类的父id
					systemMenuType.setPid(systemMenuType.getId());
					systemMenuTypeDao.updateStatusBypIds(systemMenuType);

				} else if (level.equals("3")) {
					// 是三级分类的话直接修改三级分类
					systemMenuTypeDao.updateStatusByIds(systemMenuType);
				}

			} else if (systemMenuType.getStatus() == 0) {
				// status等于0的话需要禁用

				// 禁用前先判断level
				if (level.equals("1")) {
					// 是一级的话直接修改一级状态
					systemMenuTypeDao.updateStatusByIds(systemMenuType);

					// 创建二级分类的实体
					SystemMenuType systemMenuType2 = new SystemMenuType();
					// 二级分类集合
					List<SystemMenuType> sm2List = null;

					// 将一级分类的id赋值给二级分类的上级分类
					systemMenuType2.setPid(systemMenuType.getId());
					// 查询未删除的
					systemMenuType2.setDelFlag(1);

					// 根据上级分类查询对应下的二级分类
					sm2List = systemMenuTypeDao.getAll(systemMenuType2);

					// 处理二级分类和三级分类
					for (SystemMenuType sm : sm2List) {
						// 改变二级分类的状态
						systemMenuType.setId(sm.getId());
						systemMenuTypeDao.updateStatusByIds(systemMenuType);

						// 将二级分类的分类id赋值给三级分类的父级id
						systemMenuType.setPid(sm.getId());
						// 修改二级分类对应下的三级分类的状态
						systemMenuTypeDao.updateStatusBypIds(systemMenuType);
					}
				} else if (level.equals("2")) {
					// 是二级的话修改二级，同时修改三级的父级
					systemMenuTypeDao.updateStatusByIds(systemMenuType);

					// 将二级分类id设置为三级分类的父id
					systemMenuType.setPid(systemMenuType.getId());
					systemMenuTypeDao.updateStatusBypIds(systemMenuType);

				} else if (level.equals("3")) {
					// 是三级分类的话直接修改三级分类
					systemMenuTypeDao.updateStatusByIds(systemMenuType);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return count;
	}

	@Override
	public int getTypeSn(SystemMenuType systemMenuType) throws Exception {
		return systemMenuTypeDao.getByPageCount(systemMenuType);
	}

	//查询一级分类
	@Override
	public List<SystemMenuType> getFirstClassify() throws Exception {
		SystemMenuType systemMenuType  = new SystemMenuType();
		systemMenuType.setLevel(1);
		return systemMenuTypeDao.getAll(systemMenuType);
	}

	//查询二级三级分类 以及三级分类对应的系统菜单
	@Override
	public List<SystemMenuType> getClassify(int level, String id) throws Exception {
		List<SystemMenuType> list = new ArrayList<SystemMenuType>();
		SystemMenuType type  = new SystemMenuType(); 
		SystemMenu menu = new SystemMenu();
		type.setPid(id);
		if(level == 1){
			//查询一级分类下面的二级分类
			list = systemMenuTypeDao.getAll(type);
			for(SystemMenuType sm : list){
				//二级分类id
				menu.setSysScdId(sm.getId());
				//设置查询本地分类，idm同步过来的不查询
				menu.setIsIdmSys(0);
				//查询二级分类对应的菜单
				sm.setSystemMenu(systemMenuDao.getAllByThirdId(menu));
			}
		}
		return list;
	}
}
