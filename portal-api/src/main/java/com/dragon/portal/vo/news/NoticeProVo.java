package com.dragon.portal.vo.news;

import com.dragon.portal.model.news.NewsFile;
import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.model.news.NewsNoticeProcess;
import com.dragon.portal.model.news.NewsPublishRange;

import java.io.Serializable;
import java.util.List;

public class NoticeProVo implements Serializable {

    /**
     * 公告基础数据
     */
    private NewsNotice notice;
    /**
     * 附件
     */
    private List<NewsFile> fileList;
    /**
     * 发布范围 注意
     * 如选择 YASHA 是公司    orgId:0001K310000000000ABG orgName:YASHA type:2 dataType:1
     * 其他都取部门 亚厦股份  orgId:1001K310000000027A0J orgName:亚厦股份 type:2 dataType:2
     */
    private List<NewsPublishRange> rangeList;
    /**
     * 流程相关数据
     */
    private NewsNoticeProcess process;


    public NewsNotice getNotice() {
        return notice;
    }

    public void setNotice(NewsNotice notice) {
        this.notice = notice;
    }

    public NewsNoticeProcess getProcess() {
        return process;
    }

    public void setProcess(NewsNoticeProcess process) {
        this.process = process;
    }

    public List<NewsFile> getFileList() {
        return fileList;
    }

    public void setFileList(List<NewsFile> fileList) {
        this.fileList = fileList;
    }

    public List<NewsPublishRange> getRangeList() {
        return rangeList;
    }

    public void setRangeList(List<NewsPublishRange> rangeList) {
        this.rangeList = rangeList;
    }
}
