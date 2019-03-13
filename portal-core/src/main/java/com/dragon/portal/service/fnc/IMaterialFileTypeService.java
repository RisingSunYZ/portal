package com.dragon.portal.service.fnc;

import com.dragon.portal.model.fnc.MaterialFileType;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;


import java.util.List;


/**
 * @Title:财务服务-资料类型Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:13:17
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMaterialFileTypeService {

	/**
	 * 通过id得到财务服务-资料类型MaterialFileType
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public MaterialFileType getMaterialFileTypeById(String id) throws Exception;

	/**
	 * 得到所有财务服务-资料类型MaterialFileType
	 * @param materialFileType
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<MaterialFileType> getAll(MaterialFileType materialFileType) throws Exception;

	/**
	 * 分页查询财务服务-资料类型MaterialFileType
	 * @param materialFileType
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<MaterialFileType> getPagerModelByQuery(MaterialFileType materialFileType, Query query) throws Exception;

	/**
	 * 添加财务服务-资料类型MaterialFileType
	 * @param materialFileType
	 * @throws Exception
	 * @Description:
	 */
	public void insertMaterialFileType(MaterialFileType materialFileType) throws Exception;
	
	/**
	 * 通过id删除财务服务-资料类型MaterialFileType
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMaterialFileTypeById(String id) throws Exception;

	/**
	 * 通过id批量删除财务服务-资料类型MaterialFileType
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMaterialFileTypeByIds(String ids) throws Exception;

	/**
	 * 通过id修改财务服务-资料类型MaterialFileType
	 * @param materialFileType
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterialFileType(MaterialFileType materialFileType) throws Exception;

	/**
	 * 通过ids批量修改财务服务-资料类型MaterialFileType
	 * @param ids 如："'1','2','3','4'..."
	 * @param materialFileType
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterialFileTypeByIds(String ids, MaterialFileType materialFileType) throws Exception;
	
	
}
