package com.dragon.portal.enm.commom;

/**
 * @Title:菜单类型相关枚举
 * @Author:LIUXUAN
 */
public enum BizSysMenuTypeEnum {
    COMMON_AUTHORITY(1,"普通权限"),DEPARTMENT_AUTHORITY(2,"部门权限"),MOS_AUTHORITY(3,"MOS权限");

    private BizSysMenuTypeEnum(Integer code, String type) {
            this.code = code;
            this.type = type;
    }

    private Integer code;
    private String type;

    public Integer getCode() { return code; }
    public void setCode(Integer code) { this.code = code; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }


    public static BizSysMenuTypeEnum getEnumByCode(Integer code) {
        for (BizSysMenuTypeEnum enm : BizSysMenuTypeEnum.values()) {
            if (enm.getCode().intValue() == code.intValue()) {
                return enm;
            }
        }
        return null;
    }
}
