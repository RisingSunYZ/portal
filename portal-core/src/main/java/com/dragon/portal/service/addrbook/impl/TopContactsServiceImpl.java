package com.dragon.portal.service.addrbook.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.addrbook.ITopContactsDao;
import com.dragon.portal.model.addrbook.TopContacts;
import com.dragon.portal.model.cstm.SystemMenuUser;
import com.dragon.portal.service.addrbook.ITopContactsService;
import com.dragon.tools.pager.PagerModel;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.mhome.tools.common.UUIDGenerator;
import com.dragon.tools.pager.Query;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @Title:常用联系人管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-22 11:34:04
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class TopContactsServiceImpl implements ITopContactsService {

	@Resource
	private ITopContactsDao topContactsDao;

	@Override
	public TopContacts getTopContactsById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.topContactsDao.getTopContactsById(id.trim()) : null;
	}
	
	/**
	 * 查询工号是否已经存在通讯录中，如果存在则查询出来，不存在则返回空
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午1:38:19
	 */
	public TopContacts getTopContactsByNo(String ownerNo, String contactNo) throws Exception{
		return (StringUtils.isNotBlank(ownerNo) && StringUtils.isNotBlank(contactNo)) ? this.topContactsDao.getTopContactsByNo(ownerNo, contactNo) : null;
	}
	
	@Override
	public List<TopContacts> getAll(TopContacts topContacts) throws Exception {
		return null != topContacts ? this.topContactsDao.getAll(topContacts) : null;
	}

	@Override
	public PagerModel<TopContacts> getPagerModelByQuery(TopContacts topContacts, Query query)
			throws Exception {
		//分页查询
		PageHelper.startPage(query.getInitPageIndex(), query.getPageSize());
		Page<TopContacts> page = (null != topContacts && null != query) ? this.topContactsDao.getPagerModelByQuery(topContacts) : null;
		return new PagerModel<>(page);
	}

	@Override
	public void insertTopContacts(TopContacts topContacts) throws Exception {
		if (null != topContacts) {
			topContacts.setId(UUIDGenerator.generate());
			topContacts.setCreateTime(new Date());
			topContacts.setUpdateTime(new Date());
			this.topContactsDao.insertTopContacts(topContacts);
		}
	}
	
	/**
	 * 批量添加常用联系人TopContacts
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 下午1:38:19
	 */
	@Override
	public void insertAddTopContacts(String no, List<String> nos) throws Exception{
		if(StringUtils.isNotBlank(no) && CollectionUtils.isNotEmpty(nos)){
			List<TopContacts> list =new ArrayList<TopContacts>();
			for(String contactNo :nos){
				TopContacts topContacts = new TopContacts();
				topContacts.setId(UUIDGenerator.generate());
				topContacts.setOwnerNo(no);
				topContacts.setContactNo(contactNo);
				topContacts.setSortNo(PortalConstant.BASE_INDEX);
				topContacts.setCreateTime(new Date());
				topContacts.setCreator(no);
				topContacts.setUpdateTime(new Date());
				topContacts.setUpdator(no);
				topContacts.setDelFlag(PortalConstant.NO_DELETE_FLAG);
				list.add(topContacts);
			}
			this.topContactsDao.insertAddTopContacts(list);
		}
	}
	
	@Override
	public void delTopContactsById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.topContactsDao.delTopContactsById(id.trim());
		}
	}
	
	@Override
	public void delTopContactsByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.topContactsDao.delTopContactsByIds(ids);
		}
	}
	
	@Override
	public void updateTopContacts(TopContacts topContacts) throws Exception {
		if (null != topContacts) {
			topContacts.setUpdateTime(new Date());
			this.topContactsDao.updateTopContacts(topContacts);
		}
	}

	@Override
	public void updateTopContactsByIds(String ids,TopContacts topContacts) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != topContacts) {
			topContacts.setUpdateTime(new Date());
			this.topContactsDao.updateTopContactsByIds(ids, topContacts);
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
	public void deleteAddTopContacts(String ownerNo, List<String> nosArr) throws Exception {
		if(StringUtils.isNotBlank(ownerNo) && CollectionUtils.isNotEmpty(nosArr)){
			List<TopContacts> list =new ArrayList<TopContacts>();
			for(String contactNo :nosArr){
				TopContacts topContacts = new TopContacts();
				topContacts.setOwnerNo(ownerNo);
				topContacts.setContactNo(contactNo);
				topContacts.setUpdateTime(new Date());
				topContacts.setUpdator(ownerNo);
				topContacts.setDelFlag(PortalConstant.DEL_FLAG);
				list.add(topContacts);
			}
			this.topContactsDao.updateBatchTopContactsByList(list);
		}
	}
	
}

