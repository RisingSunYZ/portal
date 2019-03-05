package com.dragon.portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;

/**
 * @author ruanzg
 * @version 1.0
 * @Date 2019/3/4 16:11
 */
@Configuration
@EnableRedisHttpSession
public class RedisSessionConfig {

}
