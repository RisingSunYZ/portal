package com.dragon.portal.vo.process;

/**
 * 转办对象
 */
public class ProcessSubmitVo extends BaseProcessVo{
    /**
     * 附言
     */
    private String attachMsg;
    /**
     * 添加的附件
     */
    private String headAttAdd;
    /**
     * 删除的附件
     */
    private String headAttDel;
    /**
     * 添加的关联流程
     */
    private String headRefAdd;
    /**
     * 删除的关联流程
     */
    private String headRefDel;
    /**
     * 添加的附言
     */
    private String attachMsgAttAdd;
    /**
     * 删除的附言
     */
    private String attachMsgAttDel;

    public String getAttachMsg() {
        return attachMsg;
    }

    public void setAttachMsg(String attachMsg) {
        this.attachMsg = attachMsg;
    }

    public String getHeadAttAdd() {
        return headAttAdd;
    }

    public void setHeadAttAdd(String headAttAdd) {
        this.headAttAdd = headAttAdd;
    }

    public String getHeadAttDel() {
        return headAttDel;
    }

    public void setHeadAttDel(String headAttDel) {
        this.headAttDel = headAttDel;
    }

    public String getHeadRefAdd() {
        return headRefAdd;
    }

    public void setHeadRefAdd(String headRefAdd) {
        this.headRefAdd = headRefAdd;
    }

    public String getHeadRefDel() {
        return headRefDel;
    }

    public void setHeadRefDel(String headRefDel) {
        this.headRefDel = headRefDel;
    }

    public String getAttachMsgAttAdd() {
        return attachMsgAttAdd;
    }

    public void setAttachMsgAttAdd(String attachMsgAttAdd) {
        this.attachMsgAttAdd = attachMsgAttAdd;
    }

    public String getAttachMsgAttDel() {
        return attachMsgAttDel;
    }

    public void setAttachMsgAttDel(String attachMsgAttDel) {
        this.attachMsgAttDel = attachMsgAttDel;
    }
}

