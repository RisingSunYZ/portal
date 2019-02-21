package com.dragon.portal.service.basedata.impl;

import com.dragon.portal.dao.basedata.IDicItemDao;
import com.dragon.portal.service.basedata.IDicItemService;
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
import java.util.regex.Pattern;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字段项管理Service实现
 */
@Service
public class DicItemServiceImpl implements IDicItemService {

    @Autowired
    private IDicItemDao dicItemDao;

    @Override
    public com.dragon.portal.model.basedata.DicItem getDicItemById(String id) throws Exception {
        return StringUtils.isNotBlank(id) ? this.dicItemDao.getDicItemById(id.trim()) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.DicItem> getDicItemByIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        return StringUtils.isNotBlank(ids) ? this.dicItemDao.getDicItemByIds(ids) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.DicItem> getDicItemByIdsList(List<String> ids) throws Exception {
        return CollectionUtils.isNotEmpty(ids) ? this.dicItemDao.getDicItemByIdsList(ids) : null;
    }

    @Override
    public List<com.dragon.portal.model.basedata.DicItem> getAll(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception {
        return null != dicItem ? this.dicItemDao.getAll(dicItem) : null;
    }

    @Override
    public PagerModel<com.dragon.portal.model.basedata.DicItem> getPagerModelByQuery(com.dragon.portal.model.basedata.DicItem dicItem, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<com.dragon.portal.model.basedata.DicItem> page = this.dicItemDao.getPagerModelByQuery(dicItem);
        return new PagerModel<com.dragon.portal.model.basedata.DicItem>(page);
    }

    @Override
    public int getByPageCount(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception {
        return (null != dicItem) ? this.dicItemDao.getByPageCount(dicItem) : 0;
    }

    @Override
    public void insertDicItem(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception {
        if (StringUtils.isBlank(dicItem.getId())) {
            dicItem.setId(UUIDGenerator.generate());
        }
        dicItem.setCode(this.getMaxCode());
        dicItem.setCreateTime(new Date());
        dicItem.setUpdateTime(new Date());
        this.dicItemDao.insertDicItem(dicItem);
    }


    public String getMaxCode() throws Exception {
        Page<String> page = PageHelper.startPage(1,1).doSelectPage(()->{
            try {
                dicItemDao.getMaxCode();
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
        if (null!=page&&CollectionUtils.isNotEmpty(page.getResult())){
            String typeCode = page.getResult().get(0);
            String regEx = "^[1-9]\\d+$"; //
            // 如果不存在。则用默认值
            if (StringUtils.isBlank(typeCode) || !Pattern.compile(regEx).matcher(typeCode).find()) {
                typeCode = "0";
            }
            Integer code = Integer.parseInt(typeCode) + 1;
            return String.format("%08d", code);
        }
        return null;

    }

    @Override
    public void insertDicItemBatch(List<com.dragon.portal.model.basedata.DicItem> dicItems) throws Exception {
        for (com.dragon.portal.model.basedata.DicItem dicItem : dicItems) {
            if (StringUtils.isBlank(dicItem.getId())) {
                dicItem.setId(UUIDGenerator.generate());
            }
            dicItem.setCreateTime(new Date());
            dicItem.setUpdateTime(new Date());
        }
        this.dicItemDao.insertDicItemBatch(dicItems);
    }

    @Override
    public void delDicItemById(String id) throws Exception {
        if (StringUtils.isNotBlank(id)) {
            this.dicItemDao.delDicItemById(id.trim());
        }
    }

    @Override
    public void delDicItemByIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.dicItemDao.delDicItemByIds(ids);
        }
    }

    @Override
    public void delDicItemByIdsList(List<String> ids) throws Exception {
        if (CollectionUtils.isNotEmpty(ids)) {
            this.dicItemDao.delDicItemByIdsList(ids);
        }
    }

    @Override
    public int updateDicItem(com.dragon.portal.model.basedata.DicItem dicItem) throws Exception {
        dicItem.setUpdateTime(new Date());
        return this.dicItemDao.updateDicItem(dicItem);
    }

    @Override
    public int updateDicItemByIds(String ids, com.dragon.portal.model.basedata.DicItem dicItem) throws Exception {
        dicItem.setUpdateTime(new Date());
        return this.dicItemDao.updateDicItemByIds(StringTools.converString(ids), dicItem);
    }

    @Override
    public int updateDicItemByIdsList(List<String> ids, com.dragon.portal.model.basedata.DicItem dicItem) throws Exception {
        dicItem.setUpdateTime(new Date());
        return this.dicItemDao.updateDicItemByIdsList(ids, dicItem);
    }

    @Override
    public int updateDicItemList(List<com.dragon.portal.model.basedata.DicItem> dicItems) throws Exception {
        return this.dicItemDao.updateDicItemList(dicItems);
    }

    @Override
    public void delDicItemByMainIds(String ids) throws Exception {
        ids = StringTools.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.dicItemDao.delDicItemByMainIds(ids);
        }
    }

    //------------api------------

}

