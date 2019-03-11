package com.dragon.portal.service.it.impl;

import com.dragon.portal.dao.it.IMaterialTypeDao;
import com.dragon.portal.model.it.MaterialType;
import com.dragon.portal.service.it.IMaterialTypeService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:资料类型Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:01:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MaterialTypeServiceImpl implements IMaterialTypeService {

	@Autowired
	private IMaterialTypeDao materialTypeDao;

	@Override
	public MaterialType getMaterialTypeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.materialTypeDao.getMaterialTypeById(id.trim()) : null;
	}

	@Override
	public List<MaterialType> getAll(MaterialType materialType) throws Exception {
		return null != materialType ? this.materialTypeDao.getAll(materialType) : null;
	}

	@Override
	public PagerModel<MaterialType> getPagerModelByQuery(MaterialType materialType, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<MaterialType> page = (null != materialType && null != query) ? this.materialTypeDao.getPagerModelByQuery(materialType) : null;
		return new PagerModel<MaterialType>(page);
	}

	@Override
	public void insertMaterialType(MaterialType materialType) throws Exception {
		if (null != materialType) {
			materialType.setId( UUIDGenerator.generate());
			materialType.setCreateTime(new Date());
			materialType.setUpdateTime(new Date());
			this.materialTypeDao.insertMaterialType(materialType);
		}
	}
	
	@Override
	public void delMaterialTypeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.materialTypeDao.delMaterialTypeById(id.trim());
		}
	}
	
	@Override
	public void delMaterialTypeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.materialTypeDao.delMaterialTypeByIds(ids);
		}
	}
	
	@Override
	public void updateMaterialType(MaterialType materialType) throws Exception {
		if (null != materialType) {
			materialType.setUpdateTime(new Date());
			this.materialTypeDao.updateMaterialType(materialType);
		}
	}

	@Override
	public void updateMaterialTypeByIds(String ids,MaterialType materialType) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != materialType) {
			materialType.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("materialType", materialType);
			this.materialTypeDao.updateMaterialTypeByIds(params);
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

