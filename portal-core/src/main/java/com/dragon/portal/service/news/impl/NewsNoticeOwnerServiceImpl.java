package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsNoticeOwnerDao;
import com.dragon.portal.model.news.NewsNoticeOwner;
import com.dragon.portal.service.news.INewsNoticeOwnerService;
import com.dragon.portal.vo.news.NoticeComboTreeVo;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.*;

/**
 * @Title:发文数据管理-发文主体Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-12-29 11:46:41
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 *
 */
@Service
public class NewsNoticeOwnerServiceImpl implements INewsNoticeOwnerService {

    @Resource
    private INewsNoticeOwnerDao newsNoticeOwnerDao;

    @Override
    public NewsNoticeOwner getNewsNoticeOwnerById(String id) throws Exception {
        return StringUtils.isNotBlank(id) ? this.newsNoticeOwnerDao.getNewsNoticeOwnerById(id.trim()) : null;
    }

    @Override
    public List<NewsNoticeOwner> getAll(NewsNoticeOwner newsNoticeOwner) throws Exception {
        return null != newsNoticeOwner ? this.newsNoticeOwnerDao.getAll(newsNoticeOwner) : null;
    }

    @Override
    public PagerModel<NewsNoticeOwner> getPagerModelByQuery(NewsNoticeOwner newsNoticeOwner, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNoticeOwner> page = (null != newsNoticeOwner && null != query) ? this.newsNoticeOwnerDao.getPagerModelByQuery(newsNoticeOwner) : null;
        return new PagerModel<NewsNoticeOwner>(page);
    }

    @Override
    public void insertNewsNoticeOwner(NewsNoticeOwner newsNoticeOwner) throws Exception {
        if (null != newsNoticeOwner) {
            newsNoticeOwner.setId( UUIDGenerator.generate());
            newsNoticeOwner.setCreateTime(new Date());
            newsNoticeOwner.setUpdateTime(new Date());
            this.newsNoticeOwnerDao.insertNewsNoticeOwner(newsNoticeOwner);
        }
    }

    @Override
    public void delNewsNoticeOwnerById(String id) throws Exception {
        if (StringUtils.isNotBlank(id)) {
            this.newsNoticeOwnerDao.delNewsNoticeOwnerById(id.trim());
        }
    }

    @Override
    public void delNewsNoticeOwnerByIds(String ids) throws Exception {
        ids = this.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.newsNoticeOwnerDao.delNewsNoticeOwnerByIds(ids);
        }
    }

    @Override
    public void updateNewsNoticeOwner(NewsNoticeOwner newsNoticeOwner) throws Exception {
        if (null != newsNoticeOwner) {
            newsNoticeOwner.setUpdateTime(new Date());
            this.newsNoticeOwnerDao.updateNewsNoticeOwner(newsNoticeOwner);
        }
    }

    @Override
    public void updateNewsNoticeOwnerByIds(String ids, NewsNoticeOwner newsNoticeOwner) throws Exception {
        ids = this.converString(ids);
        if (StringUtils.isNotBlank(ids) && null != newsNoticeOwner) {
            newsNoticeOwner.setUpdateTime(new Date());

            Map<String,Object> params = new HashMap<String, Object>();
            params.put("ids", ids);
            params.put("newsNoticeOwner", newsNoticeOwner);
            this.newsNoticeOwnerDao.updateNewsNoticeOwnerByIds(params);
        }
    }

    @Override
    public List<NoticeComboTreeVo> getComboTree() throws Exception {
        List<NoticeComboTreeVo> result = new ArrayList<NoticeComboTreeVo>();
        List<NewsNoticeOwner> allPidIsNull = this.getAllPidIsNull();
        if (allPidIsNull != null && !allPidIsNull.isEmpty()) {
            for (NewsNoticeOwner temp : allPidIsNull) {
                NewsNoticeOwner where  = new NewsNoticeOwner();
                where.setStatus(1);
                where.setPid(temp.getId());
                List<NoticeComboTreeVo> list = new ArrayList<NoticeComboTreeVo>();
                List<NewsNoticeOwner> children = this.getAll(where);
                if(children!=null&&!children.isEmpty()){
                    for (NewsNoticeOwner child : children) {
                        NoticeComboTreeVo childVo = new NoticeComboTreeVo();
                        childVo.setId(child.getId());
                        childVo.setText(child.getName());
                        childVo.setSignName(child.getSignatory());
                        childVo.setSignNo(child.getSignatoryNo());
                        list.add(childVo);
                    }
                }
                NoticeComboTreeVo vo = new NoticeComboTreeVo();
                vo.setId(temp.getId());
                vo.setText(temp.getName());
                vo.setChildren(list);
                result.add(vo);
            }
        }
        return result;
    }

    @Override
    public List<NewsNoticeOwner> getAllPidIsNull() {
        return this.newsNoticeOwnerDao.getAllPidIsNull();
    }


    /**
     * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
     *
     * @param strs
     * @return
     */
    private String converString(String strs) {
        if (StringUtils.isNotBlank(strs)) {
            String[] idStrs = strs.trim().split(",");
            if (null != idStrs && idStrs.length > 0) {
                StringBuffer sbf = new StringBuffer("");
                for (String str : idStrs) {
                    if (StringUtils.isNotBlank(str)) {
                        sbf.append("'").append(str.trim()).append("'").append(",");
                    }
                }
                if (sbf.length() > 0) {
                    sbf = sbf.deleteCharAt(sbf.length() - 1);
                    return sbf.toString();
                }
            }
        }
        return "";
    }
}

