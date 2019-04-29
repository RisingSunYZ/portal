package com.dragon.portal.service.basedata;

import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.portal.model.basedata.Dictionary;

import java.util.List;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字典管理Service接口
 */
public interface IDictionaryService {

    /**
     * 通过id得到字典管理Dictionary
     *
     * @param id
     * @return
     * @throws Exception
     * @Description:
     */
    public Dictionary getDictionaryById(String id) throws Exception;

    /**
     * 通过ids批量得到字典管理Dictionary
     *
     * @param ids 如："'1','2','3','4'..."
     * @return
     * @throws Exception
     * @Description:
     */
    public List<Dictionary> getDictionaryByIds(String ids) throws Exception;

    /**
     * 通过ids批量得到字典管理Dictionary
     *
     * @param ids
     * @return
     * @throws Exception
     * @Description:
     */
    public List<Dictionary> getDictionaryByIdsList(List<String> ids) throws Exception;

    /**
     * 得到所有字典管理Dictionary
     *
     * @param dictionary
     * @return
     * @throws Exception
     * @Description:
     */
    public List<Dictionary> getAll(Dictionary dictionary) throws Exception;

    /**
     * 分页查询字典管理Dictionary
     *
     * @param dictionary
     * @param query
     * @return
     * @throws Exception
     * @Description:
     */
    public PagerModel<Dictionary> getPagerModelByQuery(Dictionary dictionary, Query query) throws Exception;

    /**
     * 查询记录数
     *
     * @param dictionary
     * @return
     * @throws Exception
     * @Description:
     */
    public int getByPageCount(Dictionary dictionary) throws Exception;

    /**
     * 添加字典管理Dictionary
     *
     * @param dictionary
     * @throws Exception
     * @Description:
     */
    public void insertDictionary(Dictionary dictionary) throws Exception;

    /**
     * 批量添加字典管理Dictionary
     *
     * @param dictionarys
     * @throws Exception
     * @Description:
     */
    public void insertDictionaryBatch(List<Dictionary> dictionarys) throws Exception;

    /**
     * 通过id删除字典管理Dictionary
     *
     * @param id
     * @throws Exception
     * @Description:
     */
    public void delDictionaryById(String id) throws Exception;

    /**
     * 通过id批量删除字典管理Dictionary
     *
     * @param ids 如："'1','2','3','4'..."
     * @throws Exception
     * @Description:
     */
    public void delDictionaryByIds(String ids) throws Exception;

    /**
     * 通过id批量删除字典管理Dictionary
     *
     * @param ids
     * @throws Exception
     * @Description:
     */
    public void delDictionaryByIdsList(List<String> ids) throws Exception;

    /**
     * 通过id修改字典管理Dictionary
     *
     * @param dictionary
     * @throws Exception
     * @Description:
     */
    public int updateDictionary(Dictionary dictionary) throws Exception;

    /**
     * 通过ids批量修改字典管理Dictionary
     *
     * @param ids        如："'1','2','3','4'..."
     * @param dictionary
     * @throws Exception
     * @Description:
     */
    public int updateDictionaryByIds(String ids, Dictionary dictionary) throws Exception;

    /**
     * 通过ids批量修改字典管理Dictionary
     *
     * @param ids
     * @param dictionary
     * @throws Exception
     * @Description:
     */
    public int updateDictionaryByIdsList(List<String> ids, Dictionary dictionary) throws Exception;

    /**
     * 通过id批量修改字典管理Dictionary
     *
     * @param dictionarys
     * @throws Exception
     * @Description:
     */
    public int updateDictionaryList(List<Dictionary> dictionarys) throws Exception;

    /**
     * 查询最大编码
     *
     * @return
     * @throws Exception
     * @Description:
     * @author wangzhaoliao 2017年6月16日 下午5:24:07
     */
    public String getMaxCode() throws Exception;

    /**
     *  通过数据类型获取所有的数据字典
     * @param typeCode
     * @return
     * @throws Exception
     */
    public List<Dictionary> getBaseDataByType(String typeCode) throws Exception;

    //------------api------------
}
