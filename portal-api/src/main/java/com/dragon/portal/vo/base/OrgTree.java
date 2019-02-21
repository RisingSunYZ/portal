package com.dragon.portal.vo.base;

import com.ys.ucenter.model.vo.OrgTreeApiVo;

import java.io.Serializable;
import java.util.List;

public class OrgTree implements Serializable {


    /**
     *
     */

    private static final long serialVersionUID = 1L;
    /**
     * 节点ID
     */
    private String id;
    /**
     * 编码
     */
    private String code;
    /**
     * 节点父级ID
     */
    private String pId;
    /**
     * 节点名称
     */
    private String text;
    /**
     * 展开状态
     */
    private String open;
    /**
     * 类型 1:公司；2:部门 @see OrgTreeEnum
     */
    private String type;
    /**
     * 公司ID
     */
    private String companyId;
    /**
     * 子节点
     */
    private String[] children;
    /**
     * 子节点数据
     */
    private List<OrgTreeApiVo> orgTreeApiVos;
    /**
     * 节点状态，'open' 或 'closed'。
     */
    private String state;
    /**
     * 如果 公司下 第一个部门  和公司 同名  则合并   1合并 空代表没合并
     */
    private String isMerge;

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

    public String getpId() {
        return pId;
    }

    public void setpId(String pId) {
        this.pId = pId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getOpen() {
        return open;
    }

    public void setOpen(String open) {
        this.open = open;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String[] getChildren() {
        return children;
    }

    public void setChildren(String[] children) {
        this.children = children;
    }

    public List<OrgTreeApiVo> getOrgTreeApiVos() {
        return orgTreeApiVos;
    }

    public void setOrgTreeApiVos(List<OrgTreeApiVo> orgTreeApiVos) {
        this.orgTreeApiVos = orgTreeApiVos;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getIsMerge() {
        return isMerge;
    }

    public void setIsMerge(String isMerge) {
        this.isMerge = isMerge;
    }

}

	