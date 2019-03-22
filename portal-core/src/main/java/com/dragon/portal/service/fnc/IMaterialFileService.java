package com.dragon.portal.service.fnc;

import com.dragon.portal.model.fnc.MaterialFile;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;


import java.util.List;

/**
 * @Title:财务服务-资料维护Service接口
 * @Description:
 * @Author:XTJ
 * @Since:重构于2019-03-11 10:45:28
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public interface IMaterialFileService {

    /**
     * 通过id得到财务服务-资料维护MaterialFile
     * @param id
     * @return
     * @throws Exception
     * @Description:
     */
    public MaterialFile getMaterialFileById(String id) throws Exception;

    /**
     * 得到所有财务服务-资料维护MaterialFile
     * @param materialFile
     * @return
     * @throws Exception
     * @Description:
     */
    public List<MaterialFile> getAll(MaterialFile materialFile) throws Exception;

    /**
     * 分页查询财务服务-资料维护MaterialFile
     * @param materialFile
     * @param query
     * @return
     * @throws Exception
     * @Description:
     */
    public PagerModel<MaterialFile> getPagerModelByQuery(MaterialFile materialFile, Query query) throws Exception;

    /**
     * 添加财务服务-资料维护MaterialFile
     * @param materialFile
     * @throws Exception
     * @Description:
     */
    public void insertMaterialFile(MaterialFile materialFile) throws Exception;

    /**
     * 通过id删除财务服务-资料维护MaterialFile
     * @param id
     * @throws Exception
     * @Description:
     */
    public void delMaterialFileById(String id) throws Exception;

    /**
     * 通过id批量删除财务服务-资料维护MaterialFile
     * @param ids 如："'1','2','3','4'..."
     * @throws Exception
     * @Description:
     */
    public void delMaterialFileByIds(String ids) throws Exception;

    /**
     * 通过id修改财务服务-资料维护MaterialFile
     * @param materialFile
     * @throws Exception
     * @Description:
     */
    public void updateMaterialFile(MaterialFile materialFile) throws Exception;

    /**
     * 通过ids批量修改财务服务-资料维护MaterialFile
     * @param ids 如："'1','2','3','4'..."
     * @param materialFile
     * @throws Exception
     * @Description:
     */
    public void updateMaterialFileByIds(String ids,MaterialFile materialFile) throws Exception;
}
