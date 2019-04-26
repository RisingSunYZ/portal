package com.dragon.portal.service.it;


import com.dragon.portal.model.it.MaterialType;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;

/**
 * @Title:资料类型Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:01:10
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMaterialTypeService {

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
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MaterialType> getPagerModelByQuery(MaterialType materialType, Query query) throws Exception;

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
	 * @param ids 如："'1','2','3','4'..."
	 * @param materialType
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterialTypeByIds(String ids, MaterialType materialType) throws Exception;
	
	
}
