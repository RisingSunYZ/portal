package com.dragon.portal.service.fnc.impl;

import com.dragon.portal.dao.fnc.IMaterialFileDao;

import com.dragon.portal.model.fnc.MaterialFile;
import com.dragon.portal.service.fnc.IMaterialFileService;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * @Title:财务服务-资料维护Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:12:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MaterialFileServiceImpl implements IMaterialFileService {

	@Autowired
	private IMaterialFileDao materialFileDao;

	@Override
	public MaterialFile getMaterialFileById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.materialFileDao.getMaterialFileById(id.trim()) : null;
	}

	@Override
	public List<MaterialFile> getAll(MaterialFile materialFile) throws Exception {
		return null != materialFile ? this.materialFileDao.getAll(materialFile) : null;
	}

	@Override
	public PagerModel<MaterialFile> getPagerModelByQuery(MaterialFile materialFile, Query query)
			throws Exception {
		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<MaterialFile> page = (null != materialFile && null != query) ? this.materialFileDao.getPagerModelByQuery(materialFile) : null;
		return new PagerModel<MaterialFile>(page);
	}

	@Override
	public void insertMaterialFile(MaterialFile materialFile) throws Exception {
		if (null != materialFile) {
			materialFile.setId(UUIDGenerator.generate());
			materialFile.setStatus(0);
			materialFile.setCreateTime(new Date());
			materialFile.setUpdateTime(new Date());
			this.materialFileDao.insertMaterialFile(materialFile);
		}
	}
	
	@Override
	public void delMaterialFileById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.materialFileDao.delMaterialFileById(id.trim());
		}
	}
	
	@Override
	public void delMaterialFileByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.materialFileDao.delMaterialFileByIds(ids);
		}
	}
	
	@Override
	public void updateMaterialFile(MaterialFile materialFile) throws Exception {
		if (null != materialFile) {
			materialFile.setUpdateTime(new Date());
			this.materialFileDao.updateMaterialFile(materialFile);
		}
	}

	@Override
	public void updateMaterialFileByIds(String ids,MaterialFile materialFile) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != materialFile) {
			materialFile.setUpdateTime(new Date());
			this.materialFileDao.updateMaterialFileByIds(ids, materialFile);
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

