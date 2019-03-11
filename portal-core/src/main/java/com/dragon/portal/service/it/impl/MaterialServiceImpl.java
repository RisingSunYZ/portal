package com.dragon.portal.service.it.impl;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.it.IMaterialDao;
import com.dragon.portal.model.it.Material;
import com.dragon.portal.service.it.IMaterialService;
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
 * @Title:资料维护Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:00:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class MaterialServiceImpl implements IMaterialService {

	@Autowired
	private IMaterialDao materialDao;

	@Override
	public Material getMaterialById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.materialDao.getMaterialById(id.trim()) : null;
	}

	@Override
	public List<Material> getAll(Material material) throws Exception {
		return null != material ? this.materialDao.getAll(material) : null;
	}

	@Override
	public PagerModel<Material> getPagerModelByQuery(Material material, Query query)
			throws Exception {

		PageHelper.startPage(query.getPageIndex(), query.getPageSize());
		Page<Material> page = (null != material && null != query) ? this.materialDao.getPagerModelByQuery(material) : null;
		return new PagerModel<Material>(page);
	}

	@Override
	public void insertMaterial(Material material) throws Exception {
		if (null != material) {
			material.setId( UUIDGenerator.generate());
			material.setCreateTime(new Date());
			material.setUpdateTime(new Date());
			material.setStatus( PortalConstant.STATUS_ENABLED);
			this.materialDao.insertMaterial(material);
		}
	}
	
	@Override
	public void delMaterialById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.materialDao.delMaterialById(id.trim());
		}
	}
	
	@Override
	public void delMaterialByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.materialDao.delMaterialByIds(ids);
		}
	}
	
	@Override
	public void updateMaterial(Material material) throws Exception {
		if (null != material) {
			material.setUpdateTime(new Date());
			this.materialDao.updateMaterial(material);
		}
	}

	@Override
	public void updateMaterialByIds(String ids,Material material) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != material) {
			material.setUpdateTime(new Date());

			Map<String,Object> params = new HashMap<String, Object>();
			params.put("ids", ids);
			params.put("material", material);
			this.materialDao.updateMaterialByIds(params);
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

