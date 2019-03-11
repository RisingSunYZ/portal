package com.dragon.portal.rest.controller.it;

import com.dragon.portal.config.PropertiesConfig;
import com.dragon.portal.enm.question.QuestionStatusEnum;
import com.dragon.portal.enm.question.VisitRecordEnum;
import com.dragon.portal.model.it.EventDTO;
import com.dragon.portal.model.it.QuestionFileVo;
import com.dragon.portal.model.it.QuestionKnowledge;
import com.dragon.portal.model.it.QuestionVo;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.ys.tools.common.JsonUtils;
import com.ys.tools.common.ReadProperty;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 问题反馈
 * @Title: 问题反馈
 * @Description: 问题反馈
 * @Author: cenwei
 * @Since: 2016年12月6日 下午8:21:21
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@RestController
@RequestMapping("/rest/portal/itsm")
@Api(value="问题反馈", description = "问题反馈", tags={"问题反馈 /rest/portal/itsm"})
public class ItsmController extends BaseController {
	private static Logger logger = Logger.getLogger(ItsmController.class);

	@Autowired
	private PropertiesConfig propertiesConfig;

	/**
	 * 查询热门知识
	 */
	@GetMapping("/getHotKnowledge")
	@ApiOperation("查询热门知识")
	@ApiImplicitParams({})
	public ReturnVo getHotKnowledge(){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			PagerModel<QuestionKnowledge> pm = new PagerModel<QuestionKnowledge>();
			List<QuestionKnowledge> list = new ArrayList<QuestionKnowledge>();
			String itsmBasePath = propertiesConfig.getItsmPath();
			String	param  = "datagrid&sort=browseRecord&order=desc&rows=5";
			String result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
			JSONObject json = JSONObject.fromObject(result);
			JSONArray rows = json.getJSONArray("rows");
			long total = Long.parseLong(String.valueOf(json.get("total")));
			for(int i=0;i<rows.size();i++){
				QuestionKnowledge knowledge = new QuestionKnowledge();
				knowledge.setId(rows.getJSONObject(i).getString("id"));
				knowledge.setCreateTime(rows.getJSONObject(i).getString("createTime"));
				knowledge.setCreateUser(rows.getJSONObject(i).getString("createUser.realName"));
				knowledge.setTitle(rows.getJSONObject(i).getString("title"));
				knowledge.setCategoryName(rows.getJSONObject(i).getString("category.name"));
				knowledge.setKeyword(rows.getJSONObject(i).getString("keyword"));
				list.add(knowledge);
			}
			pm.setTotal(total);
			pm.setRows(list);
			returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", pm );
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ItsmController-getHotKnowledge:"+e);
		}
		return returnVo;
	}

	/**
	 * 查询分类
	 */
	@GetMapping("/findTSCategory")
	@ApiOperation("查询分类")
	@ApiImplicitParams({})
	public ReturnVo findTSCategory(String classCode, @ApiIgnore HttpServletRequest request,
								   @ApiIgnore HttpServletResponse response){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			String itsmBasePath = propertiesConfig.getItsmPath();
			UserSessionInfo userInfo = getPersonInfo(request, response);
			String no = userInfo.getNo();
			String parentCategorys = "";
			String param = "";
			if(StringUtils.isNotBlank(classCode)){
				param = "findCategoryByParentCode&userName=" + no + "&classCode=" + classCode;
				parentCategorys = this.sendGet(itsmBasePath+"/apiFindTSCategoryController.do", param);
			}else{
				param = "findCategoryByParentCode&userName=" + no +"&classCode=eventSort";
				parentCategorys = this.sendGet(itsmBasePath+"/apiFindTSCategoryController.do", param);
			}
			JSONObject jsonObject =  JSONObject.fromObject(parentCategorys);
			returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", jsonObject.get("rows") );
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ItsmController-findTSCategory:"+e);
		}
		return returnVo;
	}

	/**
	 * 查询问题说明类型列表
	 */
	@GetMapping("/findTSType/{classCode}")
	@ApiOperation("查询问题说明类型列表")
	@ApiImplicitParams({})
	public ReturnVo findTSType(@PathVariable(name = "classCode") String classCode){
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			String itsmBasePath = propertiesConfig.getItsmPath();
			if(StringUtils.isNotBlank(classCode)){
				String param = "findDicByGroupCode&typeGroupCode=" + classCode;
				String parentCategorys = this.sendGet(itsmBasePath+"/apiFindTSTypeController.do", param);
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", parentCategorys );
			}else {
				returnVo = new ReturnVo( ReturnCode.FAIL, "参数为空，查询失败!");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ItsmController-findTSType:" + e);
		}
		return returnVo;
	}

	/**
	 * 保存问题反馈
	 */
	@GetMapping("/save")
	@ApiOperation("保存问题反馈")
	@ApiImplicitParams({})
	public ReturnVo save(EventDTO eventDTO ,@ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "保存失败!");
		try {
			String itsmBasePath = propertiesConfig.getItsmPath();
			UserSessionInfo userInfo = getPersonInfo(request, response);
			String no = userInfo.getNo();
			//设置标题  标题=最后一级分类名称+发起人用户名
			eventDTO.setTitle(eventDTO.getCategoryName()+"-"+eventDTO.getCreatorRealName());
			String param = "save&title=" + eventDTO.getTitle() + "&creatorUserName="+eventDTO.getCreateUserid() +"&creatorRealName="+eventDTO.getCreatorRealName()
					+ "&creatorByMobilePhone="+ eventDTO.getCreatorByMobilePhone() +"&description="+eventDTO.getDescription() +"&operUserName="+no
					+ "&businessAddress=" + eventDTO.getBusinessAddress() +"&categoryCode="+eventDTO.getCategoryCode()+ "&sourceCode=portal";
			String saveResult = this.sendPost(itsmBasePath + "/apiEventController.do?", param);
			JSONObject jsonObject =  JSONObject.fromObject(saveResult);
			if (jsonObject.get( "success" ).toString().equalsIgnoreCase( "true" )){
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "保存成功!", saveResult);
			}else {
				returnVo = new ReturnVo( ReturnCode.FAIL, "保存失败!");
			}

		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ItsmController-save:" + e);
		}
		return returnVo;
	}

	/**
	 * 查询我的问题列表
	 */
	@GetMapping("/ajaxList")
	@ApiOperation("查询我的问题列表")
	@ApiImplicitParams({})
	public ReturnVo ajaxList(String statusName, Query query, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
		try {
			String itsmBasePath = propertiesConfig.getItsmPath();
			PagerModel<QuestionVo> pm = new PagerModel<QuestionVo>();
			List<QuestionVo> rows = new ArrayList<QuestionVo>();

			UserSessionInfo user =  getUserSessionInfo(request,response);
			String userNo = user.getNo();
			int pageSize = query.getPageSize();
			int pageNumber = query.getPageIndex();
			String path = itsmBasePath+"/apiEventController.do?";
			String method = "getSelfSubmitEvent&userName="+userNo+"&rows="+pageSize+"&page="+pageNumber+"&statusName="+statusName;
			String result = this.sendPost(path, method);
			Map<String, Object> map = JsonUtils.getMap(result);

			long total = Long.parseLong(String.valueOf(map.get("total")));
			JSONArray json = JSONArray.fromObject(map.get("rows").toString());  // 首先把字符串转成 JSONArray  对象
			if(json.size()>0){
				QuestionVo vo = null;
				for(int i=0;i<json.size();i++){
					JSONObject job = json.getJSONObject(i);  // 遍历 jsonarray 数组，把每一个对象转成 json 对象
					String str = job.getString("category.aliasName");
					vo = new QuestionVo();
					if(!"".equals(str)){
						String[] aliasName = str.split("/");
						if(aliasName.length > 1){
							if(aliasName.length == 2){
								vo.setFristCategory(aliasName[1]);
							}else if(aliasName.length == 3){
								vo.setFristCategory(aliasName[1]);
								vo.setSecondCategory(aliasName[2]);
							}else if(aliasName.length == 4){
								vo.setFristCategory(aliasName[1]);
								vo.setSecondCategory(aliasName[2]);
								vo.setThirdCategory(aliasName[3]);
							}
						}
					}

					vo.setRealName(job.getString("tsUser.realName"));
					if(StringUtils.isNotBlank(job.getString("tsUser.mobilePhone"))){
						vo.setOfficePhone(" ("+job.getString("tsUser.mobilePhone")+") ");
					}else{
						vo.setOfficePhone("");
					}
					vo.setCreateTime(job.getString("createTime").substring(0, 16));
					vo.setStartTime(job.getString("startTime"));
					vo.setEndTime(job.getString("endTime"));
					if(StringUtils.isNotBlank(job.getString("endTime"))){
						if("selfSolve".equals(job.getString("solveFlag.typecode"))){
							vo.setStatusCode( QuestionStatusEnum.REVOKE.getCode());//状态为已撤销
							vo.setStatusName(QuestionStatusEnum.REVOKE.getName());
						}else{
							vo.setStatusCode(QuestionStatusEnum.COMPLETED.getCode());//状态为已完成
							vo.setStatusName(QuestionStatusEnum.COMPLETED.getName());
						}
					}else{
						if(StringUtils.isBlank(job.getString("startTime"))){
							vo.setStatusCode(QuestionStatusEnum.TORECEIVE.getCode());//状态为待接收
							vo.setStatusName(QuestionStatusEnum.TORECEIVE.getName());
						}else{
							vo.setStatusCode(QuestionStatusEnum.HANDEL.getCode());//状态为处理中
							vo.setStatusName(QuestionStatusEnum.HANDEL.getName());
						}
					}
					vo.setId(job.getString("id"));
					vo.setEventNo(job.getString("eventNo"));
					vo.setTitle(job.getString("title"));
					vo.setSolution(job.getString("solution"));
					vo.setQuestionDesc(job.getString("description"));
					if("".equals(job.get("visitRecord"))){
						vo.setVisitRecord( VisitRecordEnum.CANNOT_EVALUATE.getCode());//用户评价状态：不能评价
					}else{
						if("true".equals(job.get("visitRecord"))){
							vo.setVisitRecord(VisitRecordEnum.EVALUATED.getCode());//用户评价状态：已经评价
						}else if("false".equals(job.get("visitRecord"))){
							vo.setVisitRecord(VisitRecordEnum.PENDING_EVALUATE.getCode());//用户评价状态：待评价
						}
					}

					//设置附件名称 附件id
					String attachmentNames =  job.getString("attachmentNames");
					String attachmentIds =  job.getString("attachmentIds");
					String[] fileNames = null;
					String[] fileIds = null;
					if(StringUtils.isNotBlank(attachmentNames)){
						fileNames = attachmentNames.split(",");
					}
					if(StringUtils.isNotBlank(attachmentIds)){
						fileIds = attachmentIds.split(",");
					}

					List<QuestionFileVo> files =new ArrayList<QuestionFileVo>();
					QuestionFileVo fileVo = null;
					String filePath = itsmBasePath + "/apiEventController.do?viewFile&fileid=";
					if(fileNames != null && fileIds != null){
						for(int j=0;j<fileIds.length;j++){
							fileVo = new QuestionFileVo();
							fileVo.setFileId(fileIds[j]);
							fileVo.setFileName(fileNames[j]);
							fileVo.setFilePath(filePath+fileIds[j]);
							files.add(fileVo);
						}
					}
					vo.setFiles(files);
					rows.add(vo);
				}
			}
			pm.setTotal(total);
			pm.setRows(rows);
			returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功!", pm);
		} catch (NumberFormatException e) {
			e.printStackTrace();
			logger.error("ItsmController-ajaxList:" + e);
		}
		return returnVo;
	}

	/**
	 * 撤销反馈
	 */
	@GetMapping("/doFeedback/{eventId}/{solutionText}")
	@ApiOperation("撤销反馈")
	@ApiImplicitParams({})
	public ReturnVo doFeedback(@PathVariable(name = "eventId") String eventId, @PathVariable(name = "solutionText") String solutionText,
							   @ApiIgnore HttpServletRequest request,
							   @ApiIgnore HttpServletResponse response) {
		ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "撤销失败!");
		try {
			String itsmBasePath = propertiesConfig.getItsmPath();
			UserSessionInfo userInfo = getPersonInfo(request, response);
			//获取工号
			String no = userInfo.getNo();

			String param = "selfResolve&eventId="+eventId+ "&operUserName=" +no + "&solutionText=" + solutionText ;
			String saveResult = this.sendPost(itsmBasePath+"/apiEventController.do?", param);
			JSONObject jsonObject =  JSONObject.fromObject(saveResult);
			if (jsonObject.get( "success" ).toString().equalsIgnoreCase( "false" )){
				returnVo = new ReturnVo( ReturnCode.FAIL, jsonObject.get( "msg" ).toString());
			}else{
				returnVo = new ReturnVo( ReturnCode.SUCCESS, "撤销成功！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("ItsmController-doFeedback:" + e);
		}
		return returnVo;
	}

	/**
	 * 向指定 URL 发送POST方法的请求
	 *
	 * @param url
	 *            发送请求的 URL
	 * @param param
	 *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * @return 所代表远程资源的响应结果
	 */
	private String sendPost(String url, String param) {
		String encoding = "utf-8";
		PrintWriter out = null;
		BufferedReader in = null;
		String result = "";
		try {
			URL realUrl = new URL(url);
			// 打开和URL之间的连接
			URLConnection conn = realUrl.openConnection();
			// 设置通用的请求属性
			conn.setRequestProperty("accept", "*/*");
			conn.setRequestProperty("connection", "Keep-Alive");
			conn.setRequestProperty("user-agent",
					"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
			// 发送POST请求必须设置如下两行
			conn.setDoOutput(true);
			conn.setDoInput(true);
			// 获取URLConnection对象对应的输出流
			out = new PrintWriter(conn.getOutputStream());
			// 发送请求参数
			out.print(param);
			// flush输出流的缓冲
			out.flush();
			// 定义BufferedReader输入流来读取URL的响应
			in = new BufferedReader(
					new InputStreamReader(conn.getInputStream(),encoding));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			logger.error("发送 POST 请求出现异常！"+e);
			e.printStackTrace();
		}
		//使用finally块来关闭输出流、输入流
		finally{
			try{
				if(out!=null){
					out.close();
				}
				if(in!=null){
					in.close();
				}
			}
			catch(IOException ex){
				logger.error("发送 POST 请求出现异常！"+ex);
				ex.printStackTrace();
			}
		}
		return result;
	}

	/**
	 * 向指定URL发送GET方法的请求
	 *
	 * @param url
	 *            发送请求的URL
	 * @param param
	 *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * @return URL 所代表远程资源的响应结果
	 */
	private String sendGet(String url, String param) {
		String result = "";
		BufferedReader in = null;
		try {
			String urlNameString = url + "?" + param;
			URL realUrl = new URL(urlNameString);
			// 打开和URL之间的连接
			URLConnection connection = realUrl.openConnection();
			// 设置通用的请求属性
			connection.setRequestProperty("accept", "*/*");
			connection.setRequestProperty("connection", "Keep-Alive");
			connection.setRequestProperty("user-agent",
					"Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
			// 建立实际的连接
			connection.connect();
			// 获取所有响应头字段
			Map<String, List<String>> map = connection.getHeaderFields();
			// 定义 BufferedReader输入流来读取URL的响应
			in = new BufferedReader(new InputStreamReader(
					connection.getInputStream(), "utf-8"));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			logger.error("发送GET请求出现异常！"+e);
			e.printStackTrace();
		}
		// 使用finally块来关闭输入流
		finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}
		return result;
	}

}

	