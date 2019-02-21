package com.dragon.portal.service.basedata;

import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字段类别管理Service接口
 */
public interface IDicTypeService {

    /**
     * 通过id得到字段类别管理DicType
     *
     * @param id
     * @return
     * @throws Exception
     * @Description:
     */
    public com.dragon.portal.model.basedata.DicType getDicTypeById(String id) throws Exception;

    /**
     * 通过ids批量得到字段类别管理DicType
     *
     * @param ids 如："'1','2','3','4'..."
     * @return
     * @throws Exception
     * @Description:
     */
    public List<com.dragon.portal.model.basedata.DicType> getDicTypeByIds(String ids) throws Exception;

    /**
     * 通过ids批量得到字段类别管理DicType
     *
     * @param ids
     * @return
     * @throws Exception
     * @Description:
     */
    public List<com.dragon.portal.model.basedata.DicType> getDicTypeByIdsList(List<String> ids) throws Exception;

    /**
     * 得到所有字段类别管理DicType
     *
     * @param dicType
     * @return
     * @throws Exception
     * @Description:
     */
    public List<com.dragon.portal.model.basedata.DicType> getAll(com.dragon.portal.model.basedata.DicType dicType) throws Exception;

    /**
     * 分页查询字段类别管理DicType
     *
     * @param dicType
     * @param query
     * @return
     * @throws Exception
     * @Description:
     */
    public PagerModel<com.dragon.portal.model.basedata.DicType> getPagerModelByQuery(com.dragon.portal.model.basedata.DicType dicType, Query query) throws Exception;

    /**
     * 查询记录数
     *
     * @param dicType
     * @return
     * @throws Exception
     * @Description:
     */
    public int getByPageCount(com.dragon.portal.model.basedata.DicType dicType) throws Exception;

    /**
     * 添加字段类别管理DicType
     *
     * @param dicType
     * @throws Exception
     * @Description:
     */
    public void insertDicType(com.dragon.portal.model.basedata.DicType dicType) throws Exception;

    /**
     * 批量添加字段类别管理DicType
     *
     * @param dicTypes
     * @throws Exception
     * @Description:
     */
    public void insertDicTypeBatch(List<com.dragon.portal.model.basedata.DicType> dicTypes) throws Exception;

    /**
     * 通过id删除字段类别管理DicType
     *
     * @param id
     * @throws Exception
     * @Description:
     */
    public void delDicTypeById(String id) throws Exception;

    /**
     * 通过id批量删除字段类别管理DicType
     *
     * @param ids 如："'1','2','3','4'..."
     * @throws Exception
     * @Description:
     */
    public void delDicTypeByIds(String ids) throws Exception;

    /**
     * 通过id批量删除字段类别管理DicType
     *
     * @param ids
     * @throws Exception
     * @Description:
     */
    public void delDicTypeByIdsList(List<String> ids) throws Exception;

    /**
     * 通过id修改字段类别管理DicType
     *
     * @param dicType
     * @throws Exception
     * @Description:
     */
    public int updateDicType(com.dragon.portal.model.basedata.DicType dicType) throws Exception;

    /**
     * 通过ids批量修改字段类别管理DicType
     *
     * @param ids     如："'1','2','3','4'..."
     * @param dicType
     * @throws Exception
     * @Description:
     */
    public int updateDicTypeByIds(String ids, com.dragon.portal.model.basedata.DicType dicType) throws Exception;

    /**
     * 通过ids批量修改字段类别管理DicType
     *
     * @param ids
     * @param dicType
     * @throws Exception
     * @Description:
     */
    public int updateDicTypeByIdsList(List<String> ids, com.dragon.portal.model.basedata.DicType dicType) throws Exception;

    /**
     * 通过id批量修改字段类别管理DicType
     *
     * @param dicTypes
     * @throws Exception
     * @Description:
     */
    public int updateDicTypeList(List<com.dragon.portal.model.basedata.DicType> dicTypes) throws Exception;

    //------------api------------
}
