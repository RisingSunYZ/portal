package com.dragon.portal.service.basedata.impl;

import com.dragon.portal.dao.basedata.IDicTypeDao;
import com.dragon.portal.service.basedata.IDicTypeService;
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
 * description : 字段类别管理Service实现
 */
@Service
public class DicTypeServiceImpl implements IDicTypeService {

    @Autowired
    private IDicTypeDao dicTypeDao;

    @Override
    public com.dragon.portal.model.basedata.DicType getDicTypeById(String id) throws Exception {
        return StringUtils.isNotBlank(id) ? this.dicTypeDao.getDicTypeById(id.trim()) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.DicType> getDicTypeByIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        return StringUtils.isNotBlank(ids) ? this.dicTypeDao.getDicTypeByIds(ids) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.DicType> getDicTypeByIdsList(List<String> ids) throws Exception {
        return CollectionUtils.isNotEmpty(ids) ? this.dicTypeDao.getDicTypeByIdsList(ids) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.DicType> getAll(com.dragon.portal.model.basedata.DicType dicType) throws Exception {
        return null != dicType ? this.dicTypeDao.getAll(dicType) : null;
    }

    @Override
    public PagerModel<com.dragon.portal.model.basedata.DicType> getPagerModelByQuery(com.dragon.portal.model.basedata.DicType dicType, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<com.dragon.portal.model.basedata.DicType> page = this.dicTypeDao.getPagerModelByQuery(dicType);
        return new PagerModel<com.dragon.portal.model.basedata.DicType>(page);
    }

    @Override
    public int getByPageCount(com.dragon.portal.model.basedata.DicType dicType) throws Exception {
        return (null != dicType) ? this.dicTypeDao.getByPageCount(dicType) : 0;
    }

    @Override
    public void insertDicType(com.dragon.portal.model.basedata.DicType dicType) throws Exception {
        if (StringUtils.isBlank(dicType.getId())) {
            dicType.setId(UUIDGenerator.generate());
        }
        dicType.setCreateTime(new Date());
        dicType.setUpdateTime(new Date());
        this.dicTypeDao.insertDicType(dicType);
    }

    @Override
    public void insertDicTypeBatch(List<com.dragon.portal.model.basedata.DicType> dicTypes) throws Exception {
        for (com.dragon.portal.model.basedata.DicType dicType : dicTypes) {
            if (StringUtils.isBlank(dicType.getId())) {
                dicType.setId(UUIDGenerator.generate());
            }
            dicType.setCreateTime(new Date());
            dicType.setUpdateTime(new Date());
        }
        this.dicTypeDao.insertDicTypeBatch(dicTypes);
    }

    @Override
    public void delDicTypeById(String id) throws Exception {
        if (StringUtils.isNotBlank(id)) {
            this.dicTypeDao.delDicTypeById(id.trim());
        }
    }

    @Override
    public void delDicTypeByIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.dicTypeDao.delDicTypeByIds(ids);
        }
    }

    @Override
    public void delDicTypeByIdsList(List<String> ids) throws Exception {
        if (CollectionUtils.isNotEmpty(ids)) {
            this.dicTypeDao.delDicTypeByIdsList(ids);
        }
    }

    @Override
    public int updateDicType(com.dragon.portal.model.basedata.DicType dicType) throws Exception {
        dicType.setUpdateTime(new Date());
        return this.dicTypeDao.updateDicType(dicType);
    }

    @Override
    public int updateDicTypeByIds(String ids, com.dragon.portal.model.basedata.DicType dicType) throws Exception {
        dicType.setUpdateTime(new Date());
        return this.dicTypeDao.updateDicTypeByIds(StringTools.converString(ids), dicType);
    }

    @Override
    public int updateDicTypeByIdsList(List<String> ids, com.dragon.portal.model.basedata.DicType dicType) throws Exception {
        dicType.setUpdateTime(new Date());
        return this.dicTypeDao.updateDicTypeByIdsList(ids, dicType);
    }

    @Override
    public int updateDicTypeList(List<com.dragon.portal.model.basedata.DicType> dicTypes) throws Exception {
        return this.dicTypeDao.updateDicTypeList(dicTypes);
    }

    //------------api------------

}

