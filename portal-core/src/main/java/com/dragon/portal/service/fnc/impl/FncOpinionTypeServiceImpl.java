package com.dragon.portal.service.fnc.impl;

import com.dragon.portal.dao.fnc.IFncOpinionTypeDao;
import com.dragon.portal.model.fnc.OpinionType;
import com.dragon.portal.service.fnc.IFncOpinionTypeService;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @Title:财务服务-意见类型Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:14:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class FncOpinionTypeServiceImpl implements IFncOpinionTypeService {

	@Autowired
	private IFncOpinionTypeDao opinionTypeDao;

	@Override
	public OpinionType getOpinionTypeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.opinionTypeDao.getOpinionTypeById(id.trim()) : null;
	}

	@Override
	public List<OpinionType> getAll(OpinionType opinionType) throws Exception {
		return null != opinionType ? this.opinionTypeDao.getAll(opinionType) : null;
	}

	@Override
	public PagerModel<OpinionType> getPagerModelByQuery(OpinionType opinionType, Query query)
			throws Exception {
		return (null != opinionType && null != query) ? this.opinionTypeDao.getPagerModelByQuery(opinionType, query) : null;
	}

	@Override
	public void insertOpinionType(OpinionType opinionType) throws Exception {
		if (null != opinionType) {
			opinionType.setId(UUIDGenerator.generate());
			opinionType.setCreateTime(new Date());
			opinionType.setUpdateTime(new Date());
			this.opinionTypeDao.insertOpinionType(opinionType);
		}
	}
	
	@Override
	public void delOpinionTypeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.opinionTypeDao.delOpinionTypeById(id.trim());
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
			this.opinionTypeDao.updateOpinionTypeByIds(ids, opinionType);
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
	public List<OpinionType> getOpinionTypeGroupByResponsible() throws Exception {
		// TODO Auto-generated method stub
		return this.opinionTypeDao.getOpinionTypeGroupByResponsible();
	}
}

