package com.dragon.portal.enm.reference;

/**
 * Dubbo接口列表
 *
 * @author wangzhiyong
 * @date 2017/9/6
 */
public enum DubboApiEnum {
    /**
     * 查询用户数据的接口
     */
    IPERSONNELAPI_GET_ALL_PERSONNEL(
            "查询用户数据的接口",
            "com.ys.ucenter.api.IPersonnelApi",
            "getAllPersonnel",
            "1.0"),

    IINVENTORYAPI_GET_PROFILE_BY_NO(
            "根据工号查询EHR基本信息",
            "com.ys.ucenter.api.IInventoryApi",
            "getProfileByNo",
            "1.0"),

    IPERSONNELAPI_GET_PERSONNELAPIVO_BY_NO(
            "根据用户工号查询用户详细信息",
            "com.ys.ucenter.api.IPersonnelApi",
            "getPersonnelApiVoByNo",
            "1.0"),

    ;






    /** 接口标题/描述 */
    private String title;

    /** 接口类名 */
    private String clazzName;
    /** 方法名 */
    private String methodName;
    /** 版本号 */
    private String version;


    DubboApiEnum(String title, String clazzName, String methodName,String version) {
        this.title = title;
        this.methodName = methodName;
        this.clazzName = clazzName;
        this.version = version;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMethodName() {
        return methodName;
    }

    public void setMethodName(String methodName) {
        this.methodName = methodName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getClazzName() {
        return clazzName;
    }

    public void setClazzName(String clazzName) {
        this.clazzName = clazzName;
    }
}
