package com.dragon.portal.service.news.impl;

import com.dragon.portal.dao.news.INewsNoticeDao;
import com.dragon.portal.dao.news.INewsTypeDao;
import com.dragon.portal.model.basedata.DicType;
import com.dragon.portal.model.news.*;
import com.dragon.portal.service.news.*;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.vo.news.NoticeProVo;
import com.dragon.tools.common.JsonUtils;
import com.dragon.tools.common.UUIDGenerator;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.ys.tools.vo.ReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.model.user.Department;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Title:公告管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-21 13:49:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 *
 */
@Service
public class NewsNoticeServiceImpl implements INewsNoticeService {


    @Resource
    private INewsNoticeDao noticeDao;
    @Resource
    private INewsTypeDao newsTypeDao;
    @Resource
    private IOrgApi orgApi;
    @Resource
    private INewsFileService newsFileService;
    @Resource
    private INewsPublishRangeService newsPublishRangeService;
    @Resource
    private INewsNoticeProcessService newsNoticeProcessService;
    @Resource
    private INewsNoticeOwnerService newsNoticeOwnerService;

    @Resource
    private RedisService redisService;


    private static Logger logger = Logger.getLogger(NewsNoticeServiceImpl.class);

    @Override
    public NewsNotice getNoticeById(String id) throws Exception {
        return StringUtils.isNotBlank(id) ? this.noticeDao.getNoticeById(id.trim()) : null;
    }

    @Override
    public NewsNotice getFullById(String id) throws Exception {
        return getFullById(id, null, null);
    }

    @Override
    public NewsNotice getFullById(String id, String userNo, String deptId) throws Exception {
        List<String> orgList = null;
        if (StringUtils.isNotBlank(deptId)) {
            ReturnVo<Department> allParentsDeptById = orgApi.getAllParentsDeptById(deptId);
            orgList = new ArrayList<String>();
            for (Department department : allParentsDeptById.getDatas()) {
                orgList.add(department.getId());
            }
        }
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("rangeDeftId", orgList);
        params.put("id", id);
        params.put("userNo", userNo);

        this.noticeDao.getFullById(params);
        return StringUtils.isNotBlank(id) ? this.noticeDao.getFullById(params) : null;


    }

    @Override
    public List<NewsNotice> getAll(NewsNotice notice) throws Exception {
        return null != notice ? this.noticeDao.getAll(notice) : null;
    }

    @Override
    public PagerModel<NewsNotice> getPagerModelByQuery(NewsNotice notice, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNotice> page = (null != notice && null != query) ? this.noticeDao.getPagerModelByQuery(notice) : null;
        return new PagerModel<NewsNotice>(page);
    }

    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryOfAdmin(NewsNotice notice, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNotice> page = (null != notice && null != query) ? this.noticeDao.getPagerModelByQueryOfAdmin(notice) : null;
        return new PagerModel<NewsNotice>(page);
    }

    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryOfRange(NewsNotice notice, Query query,String userNo)
            throws Exception {
        //分页查询
        PageHelper.startPage(query.getPageIndex(), query.getPageSize(),query.getSortField()+" "+query.getSortOrder());
        Page<NewsNotice> page = (null != notice && null != query) ? this.noticeDao.getPagerModelByQueryOfRange(notice) : null;
        return new PagerModel<NewsNotice>(page);
    }


    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryOfRangeRedis(NewsNotice notice, Query query, String userNo)  throws Exception{
        String temp = "";
        PagerModel<NewsNotice> newsNotices = null;
        List<NewsNotice> newsNoticesList=null;
        try{
            if(null!=query.getSqlOrderBy()){
                temp = query.getSqlOrderBy().keySet().iterator().next();
            }
            String key = "newsNotice" + (StringUtils.isNotBlank(userNo) ? userNo : "") +
                    notice.getTypeId() + temp + query.getPageSize();
            if(redisService.exists(key)){
                Object redisValue = redisService.get( key );
                net.sf.json.JSONObject value = null;
                if ( null != redisValue && !"null".equals(redisValue) ){
                    value = JSONObject.fromObject( redisValue );
                    newsNoticesList = (List<NewsNotice>) JSONArray.toList(value.getJSONArray("data"), new NewsNotice(), new JsonConfig());
                }
                long total = null != value && !"null".equals(value) ? value.getLong("total") : 0L;
                newsNotices = new PagerModel<NewsNotice>();
                newsNotices.setRows(newsNoticesList);
                newsNotices.setData(newsNoticesList);
                newsNotices.setTotal(total);
            }else{
                String val= "";
                if(null != notice && null != query){
                    //分页查询
                    PageHelper.startPage(query.getPageIndex(), query.getPageSize());
                    Page<NewsNotice> page = this.noticeDao.getPagerModelByQueryOfRange(notice);
                    newsNotices = new PagerModel<NewsNotice>(page);
                    val = JsonUtils.toJson(newsNotices);
                }
                redisService.set( key, val, 60*30L );
            }
        }catch (Exception e){
            e.printStackTrace();
            logger.error("NewsNoticeServiceImpl-getPagerModelByQueryOfRangeRedis发文缓存异常"+e);
        }
        return newsNotices;

    }

    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryOfRangeApi(NewsNotice notice, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNotice> page = (null != notice && null != query) ? this.noticeDao.getPagerModelByQueryOfRangeApi(notice) : null;
        return new PagerModel<NewsNotice>(page);
    }

    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryOfImage(NewsNotice notice, Query query)
            throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNotice> page = (null != notice && null != query) ? this.noticeDao.getPagerModelByQueryOfImage(notice) : null;
        return new PagerModel<NewsNotice>(page);
    }

    @Override
    public void insertNotice(NewsNotice notice) throws Exception {
        if (null != notice) {
            notice.setId( UUIDGenerator.generate());
            notice.setCreateTime(new Date());
            //notice.setUpdateTime(new Date());
            notice.setVisitCount(0);
            notice.setThumbsUp(0);
            notice.setCommentCount(0);
            if (notice.getPublishStatus() == null) {
                notice.setPublishStatus(0);
            }
            if (notice.getPublishStatus() == 1 && notice.getPublishTime() == null) {
                notice.setPublishTime(new Date());
            }
            this.noticeDao.insertNotice(notice);
        }
    }

    @Override
    public void delNoticeById(String id) throws Exception {
        if (StringUtils.isNotBlank(id)) {
            this.noticeDao.delNoticeById(id.trim());
        }
    }

    @Override
    public void delNoticeByIds(String ids) throws Exception {
        ids = this.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.noticeDao.delNoticeByIds(ids);
        }
    }

    @Override
    public void updateNotice(NewsNotice notice) throws Exception {
        if (null != notice) {
            notice.setUpdateTime(new Date());
            if (notice.getPublishTime() == null && notice.getPublishStatus() != null && notice.getPublishStatus() == 1) {
                notice.setPublishTime(new Date());
            }
            this.noticeDao.updateNotice(notice);
            try{
                //发文成功后清空缓存
                this.redisService.removePattern( "ys_portalnewsNotice*" );
            }catch(Exception e){
                e.printStackTrace();
                logger.error("NewsNoticeServiceImpl-updateNotice发文成功后清空缓存异常:" + e);
            }
        }
    }

    @Override
    public void updateNoticeByIds(String ids, NewsNotice notice) throws Exception {
        ids = this.converString(ids);
        if (StringUtils.isNotBlank(ids) && null != notice) {
            notice.setUpdateTime(new Date());

            Map<String,Object> params = new HashMap<String, Object>();
            params.put("ids", ids);
            params.put("notice", notice);
            this.noticeDao.updateNoticeByIds(params);
        }
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

    @Override
    public int getNoticeByTypeId(String ids) throws Exception {
        ids = this.converString(ids);
        return (StringUtils.isNotBlank(ids)) ? this.noticeDao.getNoticeByTypeId(ids) : 0;
    }

    @Override
    public List<NewsNotice> getNoticeByType(String typeSn, Integer count) throws Exception {
        NewsType newsType = newsTypeDao.queryNewsTypeBySn(typeSn);
        String id = newsType.getId();

        Map<String,Object> params = new HashMap<String, Object>();
        params.put("id", id);
        params.put("count", count);
        List<NewsNotice> notices = this.noticeDao.getNoticesByTypeSn( params );
        return notices;
    }

    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryOfRangeSearch(NewsNotice notice, Query query) throws Exception {
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNotice> page = (null != notice && null != query) ? this.noticeDao.getPagerModelByQueryOfRangeSearch(notice) : null;
        return new PagerModel<NewsNotice>(page);
    }

    @Override
    public List<NewsNotice> getNewsByKeyword(String typeId, String keyword, List<String> rangeDeftId, String id) throws Exception {
        if (StringUtils.isBlank(keyword)) {
            return null;
        } else {
            Map<String,Object> params = new HashMap<String, Object>();
            String[] split = keyword.split(" ");
            params.put("typeId", typeId);
            params.put("keywords", split);
            params.put("max", 5);
            params.put("rangeDeftId", rangeDeftId);
            params.put("id", id);

            return noticeDao.getNewsByKeyword(params);
        }
    }

    @Override
    public int incrementNoticeCommentCount(NewsNotice notice) throws Exception {
        return noticeDao.incrementNoticeCommentCount(notice);
    }

    @Override
    public void insertProNotice(NoticeProVo noticeProVo) throws Exception {
        NewsNoticeProcess process = noticeProVo.getProcess();
        NewsNotice notice = noticeProVo.getNotice();
        if (notice != null && process != null) {
            notice.setCreateCompanyName(process.getCompany());
            notice.setCreateCompanyId(process.getCompanyId());
            notice.setCreateDeptmentId(process.getDeptmentId());
            notice.setCreateDeptmentName(process.getDeptment());
            notice.setCreator(process.getNo());
//            notice.setArticleNo(this.getNoticeNoByOwnId(notice.getOwnerId()));
            this.insertNotice(notice);
            if (StringUtils.isNotBlank(process.getId())) {
                process.setNewNoticeId(notice.getId());
                process.setUpdator(process.getNo());
                newsNoticeProcessService.updateNewsNoticeProcess(process);
            } else {
                process.setCode(newsNoticeProcessService.getNoticeCode());
                process.setNewNoticeId(notice.getId());
                process.setCreator(process.getNo());
                newsNoticeProcessService.insertNewsNoticeProcess(process);
            }
            //附件
            List<NewsFile> fileList = noticeProVo.getFileList();
            if (fileList != null && !fileList.isEmpty()) {
                for (NewsFile file : fileList) {
                    file.setRefId(notice.getId());
                    file.setCreator(process.getNo());
                    file.setFileSize(file.getFileSize());
                    newsFileService.insertNewsFile(file);
                }
            }
            //获取部门信息
            List<NewsPublishRange> rangeList = noticeProVo.getRangeList();
            if (rangeList != null && !rangeList.isEmpty()) {
                for (NewsPublishRange range : rangeList) {
                    range.setNewsNoticeId(notice.getId());
                    range.setCreator(process.getNo());
                    newsPublishRangeService.insertNewsPublishRange(range);
                }
            }
        }
    }

    @Override
    public NoticeProVo getProNoticeByCode(String code) throws Exception {
        NewsNoticeProcess where = new NewsNoticeProcess();
        where.setCode(code);
        List<NewsNoticeProcess> all = newsNoticeProcessService.getAll(where);
        if (all != null && !all.isEmpty()) {
            NoticeProVo noticeProVo = new NoticeProVo();
            NewsNoticeProcess noticeProcess = all.get(0);
            String newNoticeId = noticeProcess.getNewNoticeId();
            NewsNotice fullById = this.getFullById(newNoticeId);
            //附件
            NewsFile newsFile = new NewsFile();
            newsFile.setRefId(newNoticeId);
            List<NewsFile> files = newsFileService.getAll(newsFile);
            //获取部门信息
            NewsPublishRange newsPublishRange = new NewsPublishRange();
            newsPublishRange.setNewsNoticeId(newNoticeId);
            List<NewsPublishRange> NewsPublishRangeList = newsPublishRangeService.getAll(newsPublishRange);
            //组装
            noticeProVo.setNotice(fullById);
            noticeProVo.setProcess(noticeProcess);
            noticeProVo.setRangeList(NewsPublishRangeList);
            noticeProVo.setFileList(files);
            return noticeProVo;
        }
        return null;
    }

    @Override
    public void updateProNotice(NoticeProVo noticeProVo) throws Exception {

        NewsNoticeProcess process = noticeProVo.getProcess();

        if (StringUtils.isNotBlank(process.getId())) {
            newsNoticeProcessService.updateNewsNoticeProcess(process);
            NewsNotice notice = noticeProVo.getNotice();
            this.updateNotice(notice);
            //保存部门信息 先删除 再保存
            List<NewsPublishRange> rangeList = noticeProVo.getRangeList();
            newsPublishRangeService.delNewsPublishRangeByNId(notice.getId());
            if (rangeList != null && !rangeList.isEmpty()) {
                for (NewsPublishRange temp : rangeList) {
                    temp.setNewsNoticeId(notice.getId());
                    this.newsPublishRangeService.insertNewsPublishRange(temp);
                }
            }
            //附件
            List<NewsFile> fileList = noticeProVo.getFileList();
            if (fileList != null && !fileList.isEmpty()) {
                for (NewsFile file : fileList) {
                    if (StringUtils.isNotBlank(file.getId())) {
                        file.setUpdator(process.getNo());
                        file.setFileSize(file.getFileSize());
                        this.newsFileService.updateNewsFile(file);
                    } else {
                        file.setRefId(notice.getId());
                        file.setCreator(process.getNo());
                        file.setFileSize(file.getFileSize());
                        this.newsFileService.insertNewsFile(file);
                    }
                }
            }

        }
    }

    @Override
    public void delNoticeFile(String fileId) throws Exception {
        this.newsFileService.delNewsFileById(fileId);
    }

    @Override
    public void UpdateProStatusByCode(Integer status, String code) throws Exception {
        NewsNoticeProcess newsNoticeProcess = new NewsNoticeProcess();
        newsNoticeProcess.setStatus(status);
        newsNoticeProcess.setCode(code);
        this.newsNoticeProcessService.updateNewsNoticeProcessByCode(newsNoticeProcess);
    }


    @Override
    public int subNoticeTumbsUp(NewsNotice notice) throws Exception {
        return noticeDao.subNoticeTumbsUp(notice);
    }

    @Override
    public int addNoticeTumbsUp(NewsNotice notice) throws Exception {
        return noticeDao.addNoticeTumbsUp(notice);
    }

    @Override
    public String getNoticeNoByOwnId(String ownId) throws Exception {
        String noticeNo = null;
        if (StringUtils.isNotBlank(ownId)) {
            NewsNoticeOwner newsNoticeOwner = newsNoticeOwnerService.getNewsNoticeOwnerById(ownId);
            Date d = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
            String dateNowStr = sdf.format(d);
            noticeNo = noticeDao.getNoticeNoByOwnId(ownId);
            if (StringUtils.isBlank(noticeNo)) {
                noticeNo = newsNoticeOwner.getShortName() + "[" + dateNowStr + "]" + "001号";
            } else {
                String nowYear = noticeNo.substring(0, 4);
                if (nowYear.equals(dateNowStr)) {
                    String thisNo = Integer.parseInt(noticeNo) + 1 + "";
                    noticeNo = newsNoticeOwner.getShortName() + "[" + thisNo.substring(0, 4) + "]" + thisNo.substring(4) + "号";
                } else {
                    noticeNo = newsNoticeOwner.getShortName() + "[" + dateNowStr + "]" + "001号";
                }
            }
        }
        return noticeNo;
    }

    @Override
    public List<NewsNotice> getAllByQueryOfRangeSearch(NewsNotice notice) throws Exception {
        return noticeDao.getAllByQueryOfRangeSearch(notice);
    }

    @Override
    public List<NewsNotice> getExportData(NewsNotice notice){
        return noticeDao.getExportData(notice);
    }
    @Override
    public PagerModel<NewsNotice> getPagerModelByQueryForAll(NewsNotice notice,Query query){
        PageHelper.startPage(query.getPageIndex(), query.getPageSize());
        Page<NewsNotice> page = (null != notice && null != query) ? noticeDao.getPagerModelByQueryForAll(notice) : null;
        return new PagerModel<NewsNotice>(page);
    };


}

