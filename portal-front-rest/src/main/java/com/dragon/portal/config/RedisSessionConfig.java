package com.dragon.portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

/**
 * @author : yangzhao
 * @date : 2019/3/5
 * description : springSession 配置 实现session共享
 */
@Configuration
@EnableRedisHttpSession(maxInactiveIntervalInSeconds=86400) //启动springSession 过期时间24小时
public class RedisSessionConfig {

}
