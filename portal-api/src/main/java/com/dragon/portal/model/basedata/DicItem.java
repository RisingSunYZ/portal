package com.dragon.portal.model.basedata;


import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * 字段项管理类
 *
 * @author wangzhiyong
 * @date 2018-10-24 12:02:34
 */
public class DicItem extends BaseModel implements Serializable {
    /**
     * 主键
     */
    private String id;
    /**
     * 编码
     */
    private String code;
    /**
     * 中文
     */
    private String cname;
    /**
     * 英文
     */
    private String ename;
    /**
     * i
     * 主表id
     */
    private String mainId;
    /**
     * 排序号
     */
    private Integer orderNo;

    // 临时变量 用于查询
    /**
     * 查询条件
     */
    private String keyWord;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCname() {
        return cname;
    }

    public void setCname(String cname) {
        this.cname = cname;
    }

    public String getEname() {
        return ename;
    }

    public void setEname(String ename) {
        this.ename = ename;
    }

    public String getMainId() {
        return mainId;
    }

    public void setMainId(String mainId) {
        this.mainId = mainId;
    }

    public Integer getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(Integer orderNo) {
        this.orderNo = orderNo;
    }

    public String getKeyWord() {
        return keyWord;
    }

    public void setKeyWord(String keyWord) {
        this.keyWord = keyWord;
    }
}
