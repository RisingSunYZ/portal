package com.dragon.portal.service.fnc.impl;

import com.dragon.portal.constant.YsportalConstant;
import com.dragon.portal.dao.fnc.IFncContactUsDao;
import com.dragon.portal.model.fnc.ContactUs;
import com.dragon.portal.service.fnc.IFncContactUsService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.List;

/**
 * @Title:财务服务-联系人管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:11:26
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class FncContactUsServiceImpl implements IFncContactUsService {

	@Autowired
	private IFncContactUsDao contactUsDao;

	@Override
	public ContactUs getContactUsById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.contactUsDao.getContactUsById(id.trim()) : null;
	}

	@Override
	public List<ContactUs> getAll(ContactUs contactUs) throws Exception {
		return null != contactUs ? this.contactUsDao.getAll(contactUs) : null;
	}

	@Override
	public PagerModel<ContactUs> getPagerModelByQuery(ContactUs contactUs, Query query)
			throws Exception {
		return (null != contactUs && null != query) ? this.contactUsDao.getPagerModelByQuery(contactUs, query) : null;
	}

	@Override
	public void insertContactUs(ContactUs contactUs) throws Exception {
		if (null != contactUs) {
			contactUs.setId(UUIDGenerator.generate());
			contactUs.setStatus(YsportalConstant.NO);
			contactUs.setCreateTime(new Date());
			contactUs.setUpdateTime(new Date());
			this.contactUsDao.insertContactUs(contactUs);
		}
	}
	
	@Override
	public void delContactUsById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.contactUsDao.delContactUsById(id.trim());
		}
	}
	
	@Override
	public void delContactUsByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.contactUsDao.delContactUsByIds(ids);
		}
	}
	
	@Override
	public void updateContactUs(ContactUs contactUs) throws Exception {
		if (null != contactUs) {
			contactUs.setUpdateTime(new Date());
			this.contactUsDao.updateContactUs(contactUs);
		}
	}

	@Override
	public void updateContactUsByIds(String ids,ContactUs contactUs) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != contactUs) {
			contactUs.setUpdateTime(new Date());
			this.contactUsDao.updateContactUsByIds(ids, contactUs);
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
}

