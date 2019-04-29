package com.dragon.portal.model.basedata;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

/**
 * 字典管理类
 *
 * @author wangzhiyong
 * @date 2018-10-24 12:02:34
 */
public class Dictionary extends BaseModel implements Serializable {
    /**
     * 主键
     */
    private String id;
    /**
     * 数据字典id
     */
    private String dicTypeId;

    /**
     * 字典数据类型编码
     */
    private String typeCode;

    /**
     * 编码
     */
    private String code;

    /**
     * 名称
     */
    private String name;

    /**
     * 英文名称
     */
    private String ename;
    /**
     * 中文名称
     */
    private String cname;
    /**
     * 备注
     */
    private String remark;

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

    public String getDicTypeId() {
        return dicTypeId;
    }

    public void setDicTypeId(String dicTypeId) {
        this.dicTypeId = dicTypeId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEname() {
        return ename;
    }

    public void setEname(String ename) {
        this.ename = ename;
    }

    public String getCname() {
        return cname;
    }

    public void setCname(String cname) {
        this.cname = cname;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getKeyWord() {
        return keyWord;
    }

    public void setKeyWord(String keyWord) {
        this.keyWord = keyWord;
    }

    public String getTypeCode() {
        return typeCode;
    }

    public void setTypeCode(String typeCode) {
        this.typeCode = typeCode;
    }
}
