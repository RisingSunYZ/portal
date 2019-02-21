package com.dragon.portal.service.basedata.impl;

import com.dragon.portal.dao.basedata.IDictionaryDao;
import com.dragon.portal.service.basedata.IDictionaryService;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.utils.StringTools;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.ys.tools.common.UUIDGenerator;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字典管理Service实现
 */
@Service
public class DictionaryServiceImpl implements IDictionaryService {

    @Autowired
    private IDictionaryDao dictionaryDao;

    @Override
    public com.dragon.portal.model.basedata.Dictionary getDictionaryById(String id) throws Exception {
        return StringUtils.isNotBlank(id) ? this.dictionaryDao.getDictionaryById(id.trim()) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.Dictionary> getDictionaryByIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        return StringUtils.isNotBlank(ids) ? this.dictionaryDao.getDictionaryByIds(ids) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.Dictionary> getDictionaryByIdsList(List<String> ids) throws Exception {
        return CollectionUtils.isNotEmpty(ids) ? this.dictionaryDao.getDictionaryByIdsList(ids) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.Dictionary> getAll(com.dragon.portal.model.basedata.Dictionary dictionary) throws Exception {
        return null != dictionary ? this.dictionaryDao.getAll(dictionary) : null;
    }

    @Override
    public PagerModel<com.dragon.portal.model.basedata.Dictionary> getPagerModelByQuery(com.dragon.portal.model.basedata.Dictionary dictionary, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<com.dragon.portal.model.basedata.Dictionary> page = this.dictionaryDao.getPagerModelByQuery(dictionary);
        return new PagerModel<com.dragon.portal.model.basedata.Dictionary>(page);
    }

    @Override
    public int getByPageCount(com.dragon.portal.model.basedata.Dictionary dictionary) throws Exception {
        return (null != dictionary) ? this.dictionaryDao.getByPageCount(dictionary) : 0;
    }

    @Override
    public void insertDictionary(com.dragon.portal.model.basedata.Dictionary dictionary) throws Exception {
        if (StringUtils.isBlank(dictionary.getId())) {
            dictionary.setId(UUIDGenerator.generate());
        }
        String code = this.getMaxCode();
        dictionary.setCode(code);
        dictionary.setCreateTime(new Date());
        dictionary.setUpdateTime(new Date());
        this.dictionaryDao.insertDictionary(dictionary);
    }

    public String getMaxCode() throws Exception {
        Page<String> page = PageHelper.startPage(1,1).doSelectPage(()->{
            try {
                dictionaryDao.getMaxCode();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        if (null != page && CollectionUtils.isNotEmpty(page.getResult())) {
            String typeCode = page.getResult().get(0);
            String regEx = "^[1-9]\\d+$"; //
            // 如果不存在。则用默认值
            if (StringUtils.isBlank(typeCode)) {
                typeCode = "0";
            }
            Integer code = Integer.parseInt(typeCode) + 1;
            return String.format("%08d", code);
        }
        return null;
    }

    @Override
    public void insertDictionaryBatch(List<com.dragon.portal.model.basedata.Dictionary> dictionarys) throws Exception {
        for (com.dragon.portal.model.basedata.Dictionary dictionary : dictionarys) {
            if (StringUtils.isBlank(dictionary.getId())) {
                dictionary.setId(UUIDGenerator.generate());
            }
            dictionary.setCreateTime(new Date());
            dictionary.setUpdateTime(new Date());
        }
        this.dictionaryDao.insertDictionaryBatch(dictionarys);
    }

    @Override
    public void delDictionaryById(String id) throws Exception {
        if (StringUtils.isNotBlank(id)) {
            this.dictionaryDao.delDictionaryById(id.trim());
        }
    }

    @Override
    public void delDictionaryByIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.dictionaryDao.delDictionaryByIds(ids);
        }
    }

    @Override
    public void delDictionaryByIdsList(List<String> ids) throws Exception {
        if (CollectionUtils.isNotEmpty(ids)) {
            this.dictionaryDao.delDictionaryByIdsList(ids);
        }
    }

    @Override
    public int updateDictionary(com.dragon.portal.model.basedata.Dictionary dictionary) throws Exception {
        dictionary.setUpdateTime(new Date());
        return this.dictionaryDao.updateDictionary(dictionary);
    }

    @Override
    public int updateDictionaryByIds(String ids, com.dragon.portal.model.basedata.Dictionary dictionary) throws Exception {
        dictionary.setUpdateTime(new Date());
        return this.dictionaryDao.updateDictionaryByIds(StringTools.converString(ids), dictionary);
    }

    @Override
    public int updateDictionaryByIdsList(List<String> ids, com.dragon.portal.model.basedata.Dictionary dictionary) throws Exception {
        dictionary.setUpdateTime(new Date());
        return this.dictionaryDao.updateDictionaryByIdsList(ids, dictionary);
    }

    @Override
    public int updateDictionaryList(List<com.dragon.portal.model.basedata.Dictionary> dictionarys) throws Exception {
        return this.dictionaryDao.updateDictionaryList(dictionarys);
    }

    //------------api------------

}

