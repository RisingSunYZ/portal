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
     * 备注是否是JSON格式，1 是，0 否
     */

    private Integer ifJson;

    /**
     * 数据字典id
     */
    private String dicTypeId;

    /**
     * 字典数据类型编码
     */
    private String typeCode;


    /**
     * 类别名称
     */
    private String typeName;

    /**
     * 编码
     */
    private String code;

    /**
     * 名称
     *
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
    /**
     * 用来接收json类型的备注
     */
    private String jsonRemark;


    /**
     * 排序序号
     */

    private Integer sortNo;

    // 临时变量 用于查询
    /**
     * 查询条件
     */
    private String keyWord;



    public String getId() {
        return id;
    }

    public Integer getIfJson() {
        return ifJson;
    }

    public void setIfJson(Integer ifJson) {
        this.ifJson = ifJson;
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

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
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

    public Integer getSortNo() {
        return sortNo;
    }

    public void setSortNo(Integer sortNo) {
        this.sortNo = sortNo;
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

    public String getJsonRemark() {
        return jsonRemark;
    }

    public void setJsonRemark(String jsonRemark) {
        this.jsonRemark = jsonRemark;
    }
}
