package com.dragon.portal.service.it.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.hr.IContactUsDao;
import com.dragon.portal.model.hr.ContactUs;
import com.dragon.portal.service.it.personwsdl.IContactUsService;
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
 * @Title:联系人信息配置Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 10:07:00
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class ContactUsServiceImpl implements IContactUsService {

	@Resource
	private IContactUsDao contactUsDao;

	@Override
	public ContactUs getContactUsById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.contactUsDao.getContactUsById(id.trim()) : null;
	}

	@Override
	public List<ContactUs> getAll(ContactUs contactUs) throws Exception {
		return null != contactUs ? this.contactUsDao.getAll(contactUs) : null;
	}

	@Override
	public List<ContactUs> getItAvailable() throws Exception {
		ContactUs contactUs = new ContactUs();
		contactUs.setType( PortalConstant.IT_SERVICE_FLAG);
		contactUs.setStatus(PortalConstant.STATUS_ENABLED);
		contactUs.setDelFlag(PortalConstant.NO_DELETE_FLAG);
		return this.getAll(contactUs);
	}
	
	@Override
	public List<ContactUs> getHrAvailable(String typeId) throws Exception {
		ContactUs contactUs = new ContactUs();
		contactUs.setTypeId(typeId);
		contactUs.setType(PortalConstant.HR_SERVICE_FLAG);
		contactUs.setStatus(PortalConstant.STATUS_ENABLED);
		contactUs.setDelFlag(PortalConstant.NO_DELETE_FLAG);
		return this.getAll(contactUs);
	}

	@Override
	public PagerModel<ContactUs> getPagerModelByQuery(ContactUs contactUs, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<ContactUs> page = (null != contactUs && null != query) ? this.contactUsDao.getPagerModelByQuery(contactUs) : null;
		return new PagerModel<ContactUs>(page);
	}

	@Override
	public void insertContactUs(ContactUs contactUs) throws Exception {
		if (null != contactUs) {
			contactUs.setId( UUIDGenerator.generate());
			contactUs.setCreateTime(new Date());
			contactUs.setUpdateTime(new Date());
			this.contactUsDao.insertContactUs(contactUs);
		}
	}
	
	@Override
	public void delContactUsById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.contactUsDao.delContactUsById(id);
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

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("contactUs", contactUs);
			this.contactUsDao.updateContactUsByIds(params);
		}
	}
	
	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"1,2,3,4..."这种形式
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
						sbf.append("'"+str.trim()+"'").append(",");
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

