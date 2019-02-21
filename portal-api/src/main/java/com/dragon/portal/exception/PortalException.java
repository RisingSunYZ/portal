package com.dragon.portal.exception;

/**
 * @Description: 流程自定义异常
 * @Author: Bruce.liu
 * @Since:13:12 2018/10/24
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
public class PortalException extends RuntimeException {

    private static final long serialVersionUID = 1L;
    private String key;
    private Object[] values;

    public PortalException() {
        super();
    }

    public PortalException(String message, Throwable throwable) {
        super(message, throwable);
    }

    public PortalException(String message) {
        super(message);
    }

    public PortalException(Throwable throwable) {
        super(throwable);
    }

    public PortalException(String key, String message) {
        super(message);
        this.key = key;
    }

    public PortalException(String key, Object value, String message) {
        super(message);
        this.key = key;
        this.values = new Object[]{value};
    }

    public PortalException(String key, Object[] values, String message) {
        super(message);
        this.key = key;
        this.values = values;
    }

    public String getKey() {
        return key;
    }

    public Object[] getValues() {
        return values;
    }
}
