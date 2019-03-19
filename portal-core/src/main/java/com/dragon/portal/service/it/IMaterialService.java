package com.dragon.portal.service.it;

import com.dragon.portal.model.it.Material;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;

/**
 * @Title:资料维护Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2016-12-07 15:00:38
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface IMaterialService {

	/**
	 * 通过id得到资料维护Material
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public Material getMaterialById(String id) throws Exception;

	/**
	 * 得到所有资料维护Material
	 * @param material
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<Material> getAll(Material material) throws Exception;

	/**
	 * 分页查询资料维护Material
	 * @param material
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<Material> getPagerModelByQuery(Material material, Query query) throws Exception;

	/**
	 * 添加资料维护Material
	 * @param material
	 * @throws Exception
	 * @Description:
	 */
	public void insertMaterial(Material material) throws Exception;
	
	/**
	 * 通过id删除资料维护Material
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delMaterialById(String id) throws Exception;

	/**
	 * 通过id批量删除资料维护Material
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delMaterialByIds(String ids) throws Exception;

	/**
	 * 通过id修改资料维护Material
	 * @param material
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterial(Material material) throws Exception;

	/**
	 * 通过ids批量修改资料维护Material
	 * @param ids 如："'1','2','3','4'..."
	 * @param material
	 * @throws Exception
	 * @Description:
	 */
	public void updateMaterialByIds(String ids, Material material) throws Exception;
	
	
}
