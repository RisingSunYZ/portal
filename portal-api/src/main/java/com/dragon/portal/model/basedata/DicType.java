package com.dragon.portal.model.basedata;


import com.dragon.tools.common.BaseModel;

/**
 * 字段类别管理类
 *
 * @author wangzhiyong
 * @date 2018-10-24 12:02:34
 */
public class DicType extends BaseModel {
    /**
     *
     */
    private String id;
    /**
     * 名称
     */
    private String name;
    /**
     * 父节点id
     */
    private String pid;
    /**
     * 简称 code
     */
    private String code;
    /**
     * 排序
     */
    private Integer sort;

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public String getKeyWord() {
        return keyWord;
    }

    public void setKeyWord(String keyWord) {
        this.keyWord = keyWord;
    }
}
