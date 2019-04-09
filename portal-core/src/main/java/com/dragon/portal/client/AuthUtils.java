package com.dragon.portal.client;

import net.sf.json.JSONObject;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.utils.HttpClientUtils;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;

@Configuration
public class AuthUtils {

	private static SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss'Z'");

	@Value("${idm.appuser}")
	protected String appuser;
	@Value("${idm.appinfo}")
	protected String appinfo;
	@Value("${idm.appkey}")
	protected String appkey;
	@Value("${idm.api.url}")
	private String idmApiUrl;
	@Value("${idm.api.user}")
	private String idmApiUser;
	@Value("${idm.api.key}")
	private String idmApiKey;

	/**
	 * idm登录相关
	 * @param url
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public String getResponseFromServer(String url, Map<String, Object> params) throws Exception {
		HttpPost httpPost = new HttpPost(url);
		createSignHeader(httpPost, params);
		JSONObject object = JSONObject.fromObject(params);
		httpPost.setEntity(new ByteArrayEntity(object.toString().getBytes(), ContentType.APPLICATION_JSON));
		return execute(httpPost);
	}

	/**
	 * IDM接口相关
	 * @param url
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public String getApiResponseFromServer(String url, Map<String, Object> params) throws Exception {
		HttpPost httpPost = new HttpPost(idmApiUrl + url);
		createSignHeader(httpPost, params);
		JSONObject object = JSONObject.fromObject(params);
		httpPost.setEntity(new ByteArrayEntity(object.toString().getBytes(), ContentType.APPLICATION_JSON));
		return execute(httpPost);
	}

	private String execute(HttpUriRequest request) throws Exception {
		CloseableHttpClient client = null;
		CloseableHttpResponse resp = null;
		try {
			client = HttpClientBuilder.create().build();
			resp = client.execute(request);
			return EntityUtils.toString(resp.getEntity());
		} catch(Exception e){
			e.printStackTrace();
		} finally {
			HttpClientUtils.closeQuietly(resp);
			HttpClientUtils.closeQuietly(client);
		}
		return null;
	}

	private void createSignHeader(HttpUriRequest request, Map<String, Object> params) throws Exception {
		request.addHeader("appuser", appuser);

		String randomcode = RandomStringUtils.random(10, true, true);
		request.addHeader("randomcode", randomcode);

		Calendar now = Calendar.getInstance();
		String timestamp = sdf.format(now.getTime());
		request.addHeader("timestamp", timestamp);

		String data = StringUtils.join(appuser, randomcode, timestamp);
		String encodekey = DigestUtils.sha256Hex( StringUtils.join(data, "{", appkey, "}"));
		request.addHeader("encodekey", encodekey);

		JSONObject object = JSONObject.fromObject(params);
		String paramData = StringUtils.join(object.toString(), "&", appkey);
		String signature = DigestUtils.md5Hex(paramData).toUpperCase();
		request.addHeader("sign", signature);

		request.addHeader("appinfo", appinfo);
		request.addHeader("Content-Type", "application/json");
	}

	/**
	 * 添加IDM-Api接口消息头
	 * @param request
	 * @param params
	 * @throws Exception
	 */
	private void createApiSignHeader(HttpUriRequest request, Map<String, Object> params) throws Exception {
		request.addHeader("appuser", idmApiUser);

		String randomcode = RandomStringUtils.random(10, true, true);
		request.addHeader("randomcode", randomcode);

		Calendar now = Calendar.getInstance();
		String timestamp = sdf.format(now.getTime());
		request.addHeader("timestamp", timestamp);

		String data = StringUtils.join(idmApiUser, randomcode, timestamp);
		String encodekey = DigestUtils.sha256Hex( StringUtils.join(data, "{", idmApiKey, "}"));
		request.addHeader("encodekey", encodekey);

		JSONObject object = JSONObject.fromObject(params);
		String paramData = StringUtils.join(object.toString(), "&", idmApiKey);
		String signature = DigestUtils.md5Hex(paramData).toUpperCase();
		request.addHeader("sign", signature);

		request.addHeader("appinfo", appinfo);
		request.addHeader("Content-Type", "application/json");
	}

	public String getAppuser() {
		return appuser;
	}

	public void setAppuser(String appuser) {
		this.appuser = appuser;
	}

	public String getAppkey() {
		return appkey;
	}

	public void setAppkey(String appkey) {
		this.appkey = appkey;
	}


	public String getAppinfo() {
		return appinfo;
	}

	public void setAppinfo(String appinfo) {
		this.appinfo = appinfo;
	}

	public static SimpleDateFormat getSdf() {
		return sdf;
	}

	public static void setSdf(SimpleDateFormat sdf) {
		AuthUtils.sdf = sdf;
	}

	public String getIdmApiUrl() {
		return idmApiUrl;
	}

	public void setIdmApiUrl(String idmApiUrl) {
		this.idmApiUrl = idmApiUrl;
	}

	public String getIdmApiUser() {
		return idmApiUser;
	}

	public void setIdmApiUser(String idmApiUser) {
		this.idmApiUser = idmApiUser;
	}

	public String getIdmApiKey() {
		return idmApiKey;
	}

	public void setIdmApiKey(String idmApiKey) {
		this.idmApiKey = idmApiKey;
	}
}
