package com.dragon.portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 拦截器配置
 *
 * @author wangzhiyong
 */
@Configuration
public class WebMvcConfigurerAdapter implements WebMvcConfigurer {


    /**
     * 请求地址拦截 前后缀都不做匹配
     *
     * @param configurer
     */
    @Override
    public void configurePathMatch(PathMatchConfigurer configurer) {
        configurer.setUseSuffixPatternMatch(true)
                .setUseTrailingSlashMatch(true);
    }

    /**
     * 静态资源配置
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/p/**")
                .addResourceLocations("classpath:/templates/page/");
        registry.addResourceHandler("/a/**")
                .addResourceLocations("classpath:/templates/assets/");
//        registry.addResourceHandler("/**")
//                .addResourceLocations("classpath:/static/");
    }

}
