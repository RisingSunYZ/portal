package com.dragon.portal.dao.basedata;

import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import com.dragon.portal.model.basedata.Dictionary;
import java.util.List;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字典管理Dao接口
 */
@Mapper
@Repository
public interface IDictionaryDao {

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
    public List<Dictionary> getDictionaryByIds(@Param("ids") String ids) throws Exception;

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
     * @return
     * @throws Exception
     * @Description:
     */
    public Page<Dictionary> getPagerModelByQuery(Dictionary dictionary) throws Exception;

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
    public void delDictionaryByIds(@Param("ids") String ids) throws Exception;

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
    public int updateDictionaryByIds(@Param("ids") String ids, @Param("dictionary") Dictionary dictionary) throws Exception;

    /**
     * 通过ids批量修改字典管理Dictionary
     *
     * @param ids
     * @param dictionary
     * @throws Exception
     * @Description:
     */
    public int updateDictionaryByIdsList(@Param("ids") List<String> ids, @Param("dictionary") Dictionary dictionary) throws Exception;

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
    public List<String> getMaxCode() throws Exception;

    //------------api------------
}
