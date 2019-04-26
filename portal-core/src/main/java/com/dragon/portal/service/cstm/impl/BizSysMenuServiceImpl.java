package com.dragon.portal.service.cstm.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.cstm.IBizSysMenuDao;
import com.dragon.portal.model.cstm.BizSysMenu;
import com.dragon.portal.service.cstm.IBizSysMenuService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Title:业务系统菜单Service实现
 * @Description:
 * @Author:cenwei
 * @Since:2018-02-06 15:52:18
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class BizSysMenuServiceImpl implements IBizSysMenuService {

	@Resource
	private IBizSysMenuDao bizSysMenuDao;

	@Override
	public BizSysMenu getBizSysMenuById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.bizSysMenuDao.getBizSysMenuById(id.trim()) : null;
	}

	@Override
	public List<BizSysMenu> getAll(BizSysMenu bizSysMenu) throws Exception {
		return null != bizSysMenu ? this.bizSysMenuDao.getAll(bizSysMenu) : null;
	}
	public List<BizSysMenu> getMenuTree(String pid){
		List<BizSysMenu> resultMenus  = new ArrayList<BizSysMenu>();
		List<BizSysMenu> tempMenus  = new ArrayList<BizSysMenu>();
		BizSysMenu bizSysMenu = new BizSysMenu();
		bizSysMenu.setStatus(PortalConstant.STATUS_ENABLED);
		try {
			List<BizSysMenu> allMenus  = bizSysMenuDao.getAll(bizSysMenu);
			BizSysMenu menu  = bizSysMenuDao.getBizSysMenuById(pid);
			resultMenus.add(menu);
			tempMenus.add(menu);
			getInnerCollection(tempMenus,allMenus,resultMenus);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMenus;
	}
	
	private void getInnerCollection(List<BizSysMenu> sublist,List<BizSysMenu> alllist,List<BizSysMenu> resultlist){
		List<BizSysMenu> tempMenus  = new ArrayList<BizSysMenu>();
		for (BizSysMenu subMenu : sublist) {
			for (BizSysMenu allMenu : alllist) {
				if(null!=allMenu.getPid() && allMenu.getPid().equals(subMenu.getId())){
					tempMenus.add(allMenu);
				}
			}
		}
		resultlist.addAll(tempMenus);
		if(CollectionUtils.isNotEmpty(tempMenus)){
			getInnerCollection(tempMenus,alllist,resultlist);
		}
	}
	@Override
	public PagerModel<BizSysMenu> getPagerModelByQuery(BizSysMenu bizSysMenu, Query query)
			throws Exception {
		return (null != bizSysMenu && null != query) ? this.bizSysMenuDao.getPagerModelByQuery(bizSysMenu, query) : null;
	}

	@Override
	public void insertBizSysMenu(BizSysMenu bizSysMenu) throws Exception {
		if (null != bizSysMenu) {
			bizSysMenu.setId(UUIDGenerator.generate());
			bizSysMenu.setCreateTime(new Date());
			bizSysMenu.setUpdateTime(new Date());
			this.bizSysMenuDao.insertBizSysMenu(bizSysMenu);
		}
	}
	
	@Override
	public void delBizSysMenuById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.bizSysMenuDao.delBizSysMenuById(id.trim());
		}
	}
	
	@Override
	public void delBizSysMenuByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.bizSysMenuDao.delBizSysMenuByIds(ids);
		}
	}
	
	@Override
	public void updateBizSysMenu(BizSysMenu bizSysMenu) throws Exception {
		if (null != bizSysMenu) {
			bizSysMenu.setUpdateTime(new Date());
			this.bizSysMenuDao.updateBizSysMenu(bizSysMenu);
		}
	}

	@Override
	public void updateBizSysMenuByIds(String ids,BizSysMenu bizSysMenu) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != bizSysMenu) {
			bizSysMenu.setUpdateTime(new Date());
			this.bizSysMenuDao.updateBizSysMenuByIds(ids, bizSysMenu);
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
	public String getIdBySn(String sn) {
		return StringUtils.isNotBlank(sn) ? this.bizSysMenuDao.getIdBySn(sn.trim()) : null;
	}
}

