package com.dragon.portal.service.cstm.impl;

import com.dragon.portal.dao.cstm.ISystemMenuDao;
import com.dragon.portal.dao.cstm.ISystemMenuTypeDao;
import com.dragon.portal.dao.cstm.ISystemMenuUserDao;
import com.dragon.portal.model.cstm.SystemMenu;
import com.dragon.portal.model.cstm.SystemMenuType;
import com.dragon.portal.model.cstm.SystemMenuUser;
import com.dragon.portal.service.cstm.ISystemMenuService;
import com.dragon.tools.common.FileUtils;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.ftp.FtpTools;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:系统菜单列表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-05-02 08:42:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class SystemMenuServiceImpl implements ISystemMenuService {
	
	private static final Logger logger = Logger.getLogger(SystemMenuServiceImpl.class);
	@Resource
	private ISystemMenuDao systemMenuDao;
	
	@Resource
	private ISystemMenuTypeDao systemMenuTypeDao;
	
	@Resource
	private ISystemMenuUserDao systemMenuUserDao;
	
	@Resource
	private FtpTools ftpTools;

	@Override
	public SystemMenu getSystemMenuById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.systemMenuDao.getSystemMenuById(id.trim()) : null;
	}

	@Override
	public List<SystemMenu> getAll(SystemMenu systemMenu) throws Exception {
		return null != systemMenu ? this.systemMenuDao.getAll(systemMenu) : null;
	}

	@Override
	public PagerModel<SystemMenu> getPagerModelByQuery(SystemMenu systemMenu, Query query)
			throws Exception {
		//分页查询
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<SystemMenu> page = (null != systemMenu && null != query) ? this.systemMenuDao.getPagerModelByQuery(systemMenu) : null;
		return new PagerModel<SystemMenu>(page);
	}

	@Override
	public void insertSystemMenu(SystemMenu systemMenu) throws Exception {
		if (null != systemMenu) {
			systemMenu.setId( UUIDGenerator.generate());
			systemMenu.setCreateTime(new Date());
			systemMenu.setUpdateTime(new Date());
			this.systemMenuDao.insertSystemMenu(systemMenu);
		}
	}
	
	@Override
	public void delSystemMenuById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.systemMenuDao.delSystemMenuById(id.trim());
		}
	}
	
	@Override
	public void delSystemMenuByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.systemMenuDao.delSystemMenuByIds(ids);
		}
	}
	
	@Override
	public void updateSystemMenu(SystemMenu systemMenu) throws Exception {
		if (null != systemMenu) {
			systemMenu.setUpdateTime(new Date());
			this.systemMenuDao.updateSystemMenu(systemMenu);
		}
	}

	@Override
	public void updateSystemMenuByIds(String ids,SystemMenu systemMenu) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != systemMenu) {
			systemMenu.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("systemMenu", systemMenu);
			this.systemMenuDao.updateSystemMenuByIds(params);
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
	public List<SystemMenuType> getCateListByLevel(String id, int level) throws Exception {
		List<SystemMenuType> list = null;
		SystemMenuType menuType = new SystemMenuType();
		menuType.setStatus(1);
		try {
			//查询一级分类
			if(level == 0){
				menuType.setLevel(1);
				list = systemMenuTypeDao.getAll(menuType);
			}else if(level == 1){
				//查询二级分类  参数id是二级分类的pId
				menuType.setLevel(2);
				menuType.setPid(id);
				list = systemMenuTypeDao.getAll(menuType);
			}else if(level == 2){
				//查询三级分类 参数id是三级分类的pId
				menuType.setLevel(3);
				menuType.setPid(id);
				list = systemMenuTypeDao.getAll(menuType);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@Override
	public void compareMenu(String userNo, List<SystemMenu> listMenu) throws Exception {
		int count=0;
		List<SystemMenu> menuList = null;
		List<SystemMenuUser> SystemMenuUserFlagList = systemMenuUserDao.getIdmSysMenuByNo(userNo);
		try {
			//根据传进来的菜单遍历去数据库查询
			for(SystemMenu tempSystem:listMenu){
				menuList = systemMenuDao.getSystemMenuBySysSn(tempSystem);
				//count小于0，说明菜单表没有菜单，插入菜单表,同时插入关系表
				if(menuList.size()==0){
					try {
						String fileName = UUIDGenerator.generate()+".png";
						String  path = "/" + "sysIcon" + FileUtils.getDateFmtFilePath() + "/";
						String destFilePath = path + fileName;
						//获取网络图片的流
						InputStream inStream  = returnBitMap(tempSystem.getSysIcon());
						//上传图片
						ftpTools.uploadFile(inStream, fileName, path);
						tempSystem.setSysIcon(destFilePath);
					}catch(Exception e){
						logger.error("SystemMenuServiceImpl-上传图片异常"+e);
						e.printStackTrace();
					}
					//插入menu表
					String id = UUIDGenerator.generate();
					tempSystem.setId(id);
					tempSystem.setStatus(1);
					tempSystem.setIsCommon(0);
					tempSystem.setIsIdmSys(1);
					tempSystem.setSortNo(1000);
					tempSystem.setCreateTime(new Date());
					tempSystem.setUpdateTime(new Date());
					systemMenuDao.insertSystemMenu(tempSystem);
					//插入关系表
					SystemMenuUser systemMenuUser = new SystemMenuUser();
					systemMenuUser.setId(UUIDGenerator.generate());
					systemMenuUser.setSysId(id);
					systemMenuUser.setUserNo(userNo);
					systemMenuUser.setStatus(1);
					systemMenuUser.setSortNo(1000);
					systemMenuUser.setCreateTime(new Date());
					systemMenuUser.setUpdateTime(new Date());
					systemMenuUserDao.insertSystemMenuUser(systemMenuUser);
				}else{
					//count大于0，说明菜单表存在数据，验证是否修改 后 去关联表里面查询是否存在该菜单，不存在的话插入
					//修改连接
					SystemMenu systemMenu = menuList.get(0);
					if(!systemMenu.getLinkUrl().equals(tempSystem.getLinkUrl())){
						systemMenu.setLinkUrl(tempSystem.getLinkUrl());
						systemMenuDao.updateSystemMenu(systemMenu);
					}
					//图标不修改了
					
					for(SystemMenuUser temp : SystemMenuUserFlagList){
						if(temp.getSysId().equals(systemMenu.getId())){
							SystemMenuUserFlagList.remove(temp);
							break;
						}
					}
					SystemMenuUser systemMenuUser  = new SystemMenuUser();
					systemMenuUser.setUserNo(userNo);
					systemMenuUser.setSysId(systemMenu.getId());
					count  = systemMenuUserDao.getByPageCount(systemMenuUser);
					if(count<=0){
						//插入关系表
						systemMenuUser.setId(UUIDGenerator.generate());
						systemMenuUser.setSysId(systemMenu.getId());
						systemMenuUser.setUserNo(userNo);
						systemMenuUser.setStatus(1);
						systemMenuUser.setSortNo(1000);
						systemMenuUser.setCreateTime(new Date());
						systemMenuUser.setUpdateTime(new Date());
						systemMenuUserDao.insertSystemMenuUser(systemMenuUser);
					}
				}
			}
			StringBuffer sb = new StringBuffer();
			for(SystemMenuUser temp : SystemMenuUserFlagList){
				sb.append("'").append(temp.getId()).append("',");
			}
			if(sb.length() > 0){
				sb.deleteCharAt(sb.length()-1);
				systemMenuUserDao.delSystemMenuUserByIds(sb.toString());
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public List<SystemMenu> getSysCataList(String userNo) throws Exception {
		List<SystemMenu> list = null;
		try {
			list = systemMenuDao.getSysCataList(userNo);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	@Override
	public int getByPageCount(SystemMenu systemMenu) throws Exception {
		return this.systemMenuDao.getByPageCount(systemMenu);
	}

	//获取url获取图片的流
	public static InputStream returnBitMap(String path) throws Exception{  
        URL url = null;  
        InputStream is =null;  
        url = new URL(path);  
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();//利用HttpURLConnection对象,我们可以从网络中获取网页数据.  
        conn.setDoInput(true);  
        conn.connect();  
        is = conn.getInputStream(); //得到网络返回的输入流  
        return is;  
    }  

}

