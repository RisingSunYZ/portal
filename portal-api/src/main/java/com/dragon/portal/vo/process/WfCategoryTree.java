package com.dragon.portal.vo.process;

import java.util.List;

/**
 * 流程模板树形目录类
 */
public class WfCategoryTree {

    private String id;
    private String name;
    private String pid;
    private String code;
    private List<WfCategoryTree> children;

    public WfCategoryTree() {
    }
    public WfCategoryTree(String id, String name, String pid, String code) {
        this.id = id;
        this.name = name;
        this.pid = pid;
        this.code = code;
    }
    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPid() {
        return this.pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<WfCategoryTree> getChildren() {
        return this.children;
    }

    public void setChildren(List<WfCategoryTree> children) {
        this.children = children;
    }


}
