package com.dragon.portal.vo.process;

import com.dragon.tools.common.BaseModel;

import java.io.Serializable;

public class BaseProcessVo extends BaseModel implements Serializable {
    /**
     * 任务ID
     */
    private String taskId;
    /**
     * 流程实例ID
     */
    private String processInstId;
    /**
     * 业务表单ID
     */
    private String bizId;
    /**
     * 流程定义、模板Key
     */
    private String modelKey;

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public String getProcessInstId() {
        return processInstId;
    }

    public void setProcessInstId(String processInstId) {
        this.processInstId = processInstId;
    }

    public String getBizId() {
        return bizId;
    }

    public void setBizId(String bizId) {
        this.bizId = bizId;
    }

    public String getModelKey() {
        return modelKey;
    }

    public void setModelKey(String modelKey) {
        this.modelKey = modelKey;
    }
}
