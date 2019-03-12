package com.dragon.portal.service.fnc.impl;

import com.dragon.portal.dao.fnc.IMaterialFileTypeDao;
import com.dragon.portal.model.fnc.MaterialFileType;
import com.dragon.portal.service.fnc.IMaterialFileTypeService;
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
 * @Title:财务服务-资料类型Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:13:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MaterialFileTypeServiceImpl implements IMaterialFileTypeService {

	@Autowired
	private IMaterialFileTypeDao materialFileTypeDao;

	@Override
	public MaterialFileType getMaterialFileTypeById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.materialFileTypeDao.getMaterialFileTypeById(id.trim()) : null;
	}

	@Override
	public List<MaterialFileType> getAll(MaterialFileType materialFileType) throws Exception {
		return null != materialFileType ? this.materialFileTypeDao.getAll(materialFileType) : null;
	}

	@Override
	public PagerModel<MaterialFileType> getPagerModelByQuery(MaterialFileType materialFileType, Query query)
			throws Exception {
		return (null != materialFileType && null != query) ? this.materialFileTypeDao.getPagerModelByQuery(materialFileType, query) : null;
	}

	@Override
	public void insertMaterialFileType(MaterialFileType materialFileType) throws Exception {
		if (null != materialFileType) {
			materialFileType.setId(UUIDGenerator.generate());
			materialFileType.setCreateTime(new Date());
			materialFileType.setUpdateTime(new Date());
			this.materialFileTypeDao.insertMaterialFileType(materialFileType);
		}
	}
	
	@Override
	public void delMaterialFileTypeById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.materialFileTypeDao.delMaterialFileTypeById(id.trim());
		}
	}
	
	@Override
	public void delMaterialFileTypeByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.materialFileTypeDao.delMaterialFileTypeByIds(ids);
		}
	}
	
	@Override
	public void updateMaterialFileType(MaterialFileType materialFileType) throws Exception {
		if (null != materialFileType) {
			materialFileType.setUpdateTime(new Date());
			this.materialFileTypeDao.updateMaterialFileType(materialFileType);
		}
	}

	@Override
	public void updateMaterialFileTypeByIds(String ids,MaterialFileType materialFileType) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != materialFileType) {
			materialFileType.setUpdateTime(new Date());
			this.materialFileTypeDao.updateMaterialFileTypeByIds(ids, materialFileType);
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

