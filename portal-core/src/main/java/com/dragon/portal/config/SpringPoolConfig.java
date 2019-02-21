package com.dragon.portal.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ThreadPoolExecutor;

/**
 * @Description: spring 线程池配置
 * @Author: Bruce.liu
 * @Since:11:36 2018/6/14
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@Configuration
@EnableAsync
public class SpringPoolConfig {
    /**
     * 线程池维护线程的最少数量
     */
    private int corePoolSize = 5;
    /**
     * 线程池维护线程的最大数量
     */
    private int maxPoolSize = 30;
    /**
     * 缓存队列
     */
    private int queueCapacity = 500;
    /**
     * 允许的空闲时间
     */
    private int keepAlive = 60;

    @Bean
    public ThreadPoolTaskExecutor createExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        /**
         * rejection-policy：当pool已经达到max size的时候，如何处理新任务
         * CALLER_RUNS：不在新线程中执行任务，而是由调用者所在的线程来执行
         *
         */
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setKeepAliveSeconds(keepAlive);
        executor.initialize();
        return executor;
    }


}
