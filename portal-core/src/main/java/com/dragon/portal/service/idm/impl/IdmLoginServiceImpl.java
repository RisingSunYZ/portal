package com.dragon.portal.service.idm.impl;

import com.alibaba.fastjson.JSON;
import com.dragon.portal.client.AuthUtils;
import com.dragon.portal.service.idm.IImdLoginService;
import com.ys.yahu.constant.YahuConstant;
import com.ys.yahu.vo.idm.IdmWraper;
import com.ys.yahu.vo.idm.LoginRvo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Service
public class IdmLoginServiceImpl implements IImdLoginService {
    private static Logger logger = LoggerFactory.getLogger(IdmLoginServiceImpl.class);
    @Resource
    private Environment environment;

    @Resource
    private AuthUtils util;

    public LoginRvo loginIDM(String userName, String password) throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("username", userName);
        params.put("password", password);
//        params.put("ticketValue", "TGT-498-HJAZvrjQHfrPayttOZ4awb6d5ID0nF3UCwQV3weugbPJUQFeJT-SIAM");
//        params.put("ticketName", "SIAMTGT");
        String rtnEntity = util.getResponseFromServer(environment.getProperty("idm_url_authenticate"), params);
        System.out.println(rtnEntity);
        LoginRvo loginRvo = JSON.parseObject(rtnEntity, LoginRvo.class);
        return loginRvo;
    }

    public IdmWraper getGrantedServices(String username) throws Exception {
		/*CloseableHttpClient httpClient = HttpClients.createDefault();
		HttpPost httpPost = new HttpPost(readProperty.getValue(YahuConstant.GETGRANTEDSERVICES) );
		SignatureUtils signatureUtils = new SignatureUtils(readProperty.getValue(YahuConstant.APPUSER) , readProperty.getValue(YahuConstant.APPSECRET));
		signatureUtils.signHeaders(httpPost);
		JSONObject object = new JSONObject();
		object.put("username", username);
		httpPost.setEntity(new StringEntity(object.toString(), ContentType.APPLICATION_JSON));
		CloseableHttpResponse response = null;
		HttpEntity entity = null;
		try {
			response = httpClient.execute(httpPost);
			entity = response.getEntity();
			return JSON.parseObject(EntityUtils.toString(entity, "UTF-8"), IdmWraper.class) ;
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			HttpClientUtils.closeQuietly(response);
			EntityUtils.consumeQuietly(entity);
			HttpClientUtils.closeQuietly(httpClient);
		}
		return null;*/

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("username", username);
        String rtn = util.getResponseFromServer(environment.getProperty(YahuConstant.GETGRANTEDSERVICES), params);
        return JSON.parseObject(rtn, IdmWraper.class);
    }

    @Override
    public String getResponseFromServer(String uid) throws Exception {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("userName", uid);
        String resultStr = util.getResponseFromServer(environment.getProperty(YahuConstant.AUTH_PATH), params);
        return resultStr;
    }

}
