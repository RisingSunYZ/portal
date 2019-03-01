package com.dragon.portal.service.cstm.impl;


import com.alibaba.dubbo.common.utils.CollectionUtils;
import com.dragon.portal.dao.cstm.ISystemMenuDao;
import com.dragon.portal.dao.cstm.ISystemMenuUserDao;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuUser;
import com.dragon.portal.service.cstm.ISystemMenuUserService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:常用系统菜单用户中间表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-28 21:40:15
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class SystemMenuUserServiceImpl implements ISystemMenuUserService {

	@Resource
	private ISystemMenuUserDao systemMenuUserDao;
	
	@Resource
	private ISystemMenuDao systemMenuDao;

	@Override
	public SystemMenuUser getSystemMenuUserById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.systemMenuUserDao.getSystemMenuUserById(id.trim()) : null;
	}

	@Override
	public List<SystemMenuUser> getAll(SystemMenuUser systemMenuUser) throws Exception {
		return null != systemMenuUser ? this.systemMenuUserDao.getAll(systemMenuUser) : null;
	}

	@Override
	public PagerModel<SystemMenuUser> getPagerModelByQuery(SystemMenuUser systemMenuUser, Query query)
			throws Exception {
		//分页查询
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<SystemMenuUser> page = (null != systemMenuUser && null != query) ? this.systemMenuUserDao.getPagerModelByQuery(systemMenuUser) : null;
		return new PagerModel<SystemMenuUser>(page);
	}

	@Override
	public void insertSystemMenuUser(SystemMenuUser systemMenuUser) throws Exception {
		if (null != systemMenuUser) {
			systemMenuUser.setId( UUIDGenerator.generate());
			systemMenuUser.setCreateTime(new Date());
			systemMenuUser.setUpdateTime(new Date());
			this.systemMenuUserDao.insertSystemMenuUser(systemMenuUser);
		}
	}
	
	@Override
	public void delSystemMenuUserById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.systemMenuUserDao.delSystemMenuUserById(id.trim());
		}
	}
	
	@Override
	public void delSystemMenuUserByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.systemMenuUserDao.delSystemMenuUserByIds(ids);
		}
	}
	
	@Override
	public void updateSystemMenuUser(SystemMenuUser systemMenuUser) throws Exception {
		if (null != systemMenuUser) {
			systemMenuUser.setUpdateTime(new Date());
			this.systemMenuUserDao.updateSystemMenuUser(systemMenuUser);
		}
	}

	@Override
	public void updateSystemMenuUserByIds(String ids,SystemMenuUser systemMenuUser) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != systemMenuUser) {
			systemMenuUser.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("systemMenuUser", systemMenuUser);
			this.systemMenuUserDao.updateSystemMenuUserByIds(params);
		}
	}
	
	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
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
	public List<SystemMenu> getAllByNo(String no) throws Exception {
		systemMenuDao.getAllByUserNo(no);
		return systemMenuDao.getAllByUserNo(no);
	}

	@Override
	public void insertMenuUser(List<SystemMenuUser> list) throws Exception {
		if(CollectionUtils.isNotEmpty(list)){
			for (SystemMenuUser systemMenuUser : list) {
				if (null != systemMenuUser) {
					systemMenuUser.setId( com.mhome.tools.common.UUIDGenerator.generate());
					systemMenuUser.setCreateTime(new Date());
				}
			}
			systemMenuUserDao.insertMenuUser(list);
		}

	}

	@Override
	public void insertAfterDelByNo(List<SystemMenuUser> list,String no) throws Exception {
		delSystemMenuUserByNo(no);
		insertMenuUser(list);
	}

	@Override
	public int delSystemMenuUserByNo(String no) throws Exception {
		return systemMenuUserDao.delSystemMenuUserByNo(no);
	}
}

