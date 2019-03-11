package com.dragon.portal.dao.it;

import com.dragon.portal.model.it.MaterialType;
import com.github.pagehelper.Page;

import java.util.List;
import java.util.Map;

/**
 * @Title:资料类型Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:01:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMaterialTypeDao {

	/**
	 * 通过id得到资料类型MaterialType
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MaterialType getMaterialTypeById(String id) throws Exception;

	/**
	 * 得到所有资料类型MaterialType
	 * @param materialType
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MaterialType> getAll(MaterialType materialType) throws Exception;

	/**
	 * 分页查询资料类型MaterialType
	 * @param materialType
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<MaterialType> getPagerModelByQuery(MaterialType materialType) throws Exception;

	/**
	 * 添加资料类型MaterialType
	 * @param materialType
	 * @throws Exception
	 * @Description:
	 */
	public void insertMaterialType(MaterialType materialType) throws Exception;
	
	/**
	 * 通过id删除资料类型MaterialType
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMaterialTypeById(String id) throws Exception;
	
	/**
	 * 通过id批量删除资料类型MaterialType
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMaterialTypeByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改资料类型MaterialType
	 * @param materialType
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterialType(MaterialType materialType) throws Exception;

	/**
	 * 通过ids批量修改资料类型MaterialType
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterialTypeByIds(Map<String,Object> params) throws Exception;
	
	
}
