package com.dragon.portal.service.hr.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.hr.IOpinionTypeDao;
import com.dragon.portal.model.hr.OpinionType;
import com.dragon.portal.service.hr.IOpinionTypeService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:意见分类Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-08 10:15:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class OpinionTypeServiceImpl implements IOpinionTypeService {

	@Autowired
	private IOpinionTypeDao opinionTypeDao;

	@Override
	public OpinionType getOpinionTypeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.opinionTypeDao.getOpinionTypeById(id.trim()) : null;
	}

	@Override
	public List<OpinionType> getAll(OpinionType opinionType) throws Exception {
		return null != opinionType ? this.opinionTypeDao.getAll(opinionType) : null;
	}

	@Override
	public List<OpinionType> getAvailable() throws Exception {
		OpinionType opinionType = new OpinionType();
		opinionType.setDelFlag( PortalConstant.NO_DELETE_FLAG);
		return this.getAll(opinionType);
	}

	@Override
	public PagerModel<OpinionType> getPagerModelByQuery(OpinionType opinionType, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<OpinionType> page = (null != opinionType && null != query) ? this.opinionTypeDao.getPagerModelByQuery(opinionType) : null;
		return new PagerModel<OpinionType>(page);
	}

	@Override
	public void insertOpinionType(OpinionType opinionType) throws Exception {
		if (null != opinionType) {
			opinionType.setId( UUIDGenerator.generate());
			opinionType.setCreateTime(new Date());
			opinionType.setUpdateTime(new Date());
			this.opinionTypeDao.insertOpinionType(opinionType);
		}
	}
	
	@Override
	public void delOpinionTypeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.opinionTypeDao.delOpinionTypeById(id);
		}
	}
	
	@Override
	public void delOpinionTypeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.opinionTypeDao.delOpinionTypeByIds(ids);
		}
	}
	
	@Override
	public void updateOpinionType(OpinionType opinionType) throws Exception {
		if (null != opinionType) {
			opinionType.setUpdateTime(new Date());
			this.opinionTypeDao.updateOpinionType(opinionType);
		}
	}

	@Override
	public void updateOpinionTypeByIds(String ids,OpinionType opinionType) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != opinionType) {
			opinionType.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("opinionType", opinionType);
			this.opinionTypeDao.updateOpinionTypeByIds(params);
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

