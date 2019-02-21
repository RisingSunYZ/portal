package com.dragon.portal.service.basedata;

import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字段项管理Service接口
 */
public interface IDicItemService {

    /**
     * 通过id得到字段项管理DicItem
     *
     * @param id
     * @return
     * @throws Exception
     * @Description:
     */
    public com.dragon.portal.model.basedata.DicItem getDicItemById(String id) throws Exception;

    /**
     * 通过ids批量得到字段项管理DicItem
     *
     * @param ids 如："'1','2','3','4'..."
     * @return
     * @throws Exception
     * @Description:
     */
    public List<com.dragon.portal.model.basedata.DicItem> getDicItemByIds(String ids) throws Exception;

    /**
     * 通过ids批量得到字段项管理DicItem
     *
     * @param ids
     * @return
     * @throws Exception
     * @Description:
     */
    public List<com.dragon.portal.model.basedata.DicItem> getDicItemByIdsList(List<String> ids) throws Exception;

    /**
     * 得到所有字段项管理DicItem
     *
     * @param dicItem
     * @return
     * @throws Exception
     * @Description:
     */
    public List<com.dragon.portal.model.basedata.DicItem> getAll(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception;

    /**
     * 分页查询字段项管理DicItem
     *
     * @param dicItem
     * @param query
     * @return
     * @throws Exception
     * @Description:
     */
    public PagerModel<com.dragon.portal.model.basedata.DicItem> getPagerModelByQuery(com.dragon.portal.model.basedata.DicItem dicItem, Query query) throws Exception;

    /**
     * 查询记录数
     *
     * @param dicItem
     * @return
     * @throws Exception
     * @Description:
     */
    public int getByPageCount(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception;

    /**
     * 添加字段项管理DicItem
     *
     * @param dicItem
     * @throws Exception
     * @Description:
     */
    public void insertDicItem(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception;

    /**
     * 批量添加字段项管理DicItem
     *
     * @param dicItems
     * @throws Exception
     * @Description:
     */
    public void insertDicItemBatch(List<com.dragon.portal.model.basedata.DicItem> dicItems) throws Exception;

    /**
     * 通过id删除字段项管理DicItem
     *
     * @param id
     * @throws Exception
     * @Description:
     */
    public void delDicItemById(String id) throws Exception;

    /**
     * 通过id批量删除字段项管理DicItem
     *
     * @param ids 如："'1','2','3','4'..."
     * @throws Exception
     * @Description:
     */
    public void delDicItemByIds(String ids) throws Exception;

    /**
     * 通过id批量删除字段项管理DicItem
     *
     * @param ids
     * @throws Exception
     * @Description:
     */
    public void delDicItemByIdsList(List<String> ids) throws Exception;

    /**
     * 通过id修改字段项管理DicItem
     *
     * @param dicItem
     * @throws Exception
     * @Description:
     */
    public int updateDicItem(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception;

    /**
     * 通过ids批量修改字段项管理DicItem
     *
     * @param ids     如："'1','2','3','4'..."
     * @param dicItem
     * @throws Exception
     * @Description:
     */
    public int updateDicItemByIds(String ids, com.dragon.portal.model.basedata.DicItem dicItem) throws Exception;

    /**
     * 通过ids批量修改字段项管理DicItem
     *
     * @param ids
     * @param dicItem
     * @throws Exception
     * @Description:
     */
    public int updateDicItemByIdsList(List<String> ids, com.dragon.portal.model.basedata.DicItem dicItem) throws Exception;

    /**
     * 通过id批量修改字段项管理DicItem
     *
     * @param dicItems
     * @throws Exception
     * @Description:
     */
    public int updateDicItemList(List<com.dragon.portal.model.basedata.DicItem> dicItems) throws Exception;


    /**
     * @Author huanghongjing
     * @Description 通过mainId删除数据（删除字典下的字典项）
     * @Date 9:11 2018/11/13
     * @Param
     * @return
     **/
    public void delDicItemByMainIds(String ids) throws Exception;


    /**
     * 查询最大编码
     *
     * @return
     * @throws Exception
     * @Description:
     * @author wangzhaoliao 2017年6月16日 下午5:24:07
     */
    public String getMaxCode() throws Exception;

    //------------api------------
}
