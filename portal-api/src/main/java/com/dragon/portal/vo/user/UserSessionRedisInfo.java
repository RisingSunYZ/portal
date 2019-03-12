package com.dragon.portal.vo.user;

import com.dragon.portal.utils.CommUtils;

import java.io.Serializable;
import java.util.HashMap;

/**
 * @Title:用户会话Redis缓存信息
 * @Description:
 * @Author:xietongjian
 * @Since:2017年4月28日 上午10:12:34
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public class UserSessionRedisInfo extends HashMap<String, Object> implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -3913065798686434153L;

	//对象唯一标识
	private String usid = "";
	
	public String getUsid() {
		return usid;
	}

	public void setUsid(String usid) {
		this.usid = usid;
	}

	/**
	 * 根据key存对象
	 * @param key
	 * @param value
	 * @return
	 */
	public Object putValue(String key,Object value) {
		if(CommUtils.isEmpty(key)) return null;
		return this.put(key, value);
	}
	
	/**
	 * 根据key取对象
	 * @param key
	 * @return
	 */
	public String getValue(String key) {
		if(CommUtils.isEmpty(key)) return null;
		Object o = this.get(key);
		if(o instanceof String) {
			return (String) this.get(key);
		}
		return CommUtils.toStr(o);
	}
	
	/**
	 * 根据key移除对象
	 * @param key
	 * @return
	 */
	public Object removeSessionInfo(String key) {
		if(!CommUtils.isEmpty(key)) {
			return this.remove(key);
		}
		return null;
	}
	@Override
	public String toString() {
		return "UserSessionRedisInfo [usid=" + usid + "]";
	}
}
