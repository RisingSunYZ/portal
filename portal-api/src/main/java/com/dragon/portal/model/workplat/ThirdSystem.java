package com.dragon.portal.model.workplat;

/**
 * Created by v-wangliqiang on 2016/11/21.
 */
public class ThirdSystem {
    private String id;
    private String iconImageSrc;
    private String appName;
    private String appEName;
    private String iconImage;
    private String appUrl;

    public String getAppName() {
        return appName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIconImageSrc() {
        return iconImageSrc;
    }

    public void setIconImageSrc(String iconImageSrc) {
        this.iconImageSrc = iconImageSrc;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    public String getAppEName() {
        return appEName;
    }

    public void setAppEName(String appEName) {
        this.appEName = appEName;
    }

    public String getIconImage() {
        return iconImage;
    }

    public void setIconImage(String iconImage) {
        this.iconImage = iconImage;
    }

    public String getAppUrl() {
        return appUrl;
    }

    public void setAppUrl(String appUrl) {
        this.appUrl = appUrl;
    }
}
