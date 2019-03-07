package com.dragon.portal.rest.controller.it;

import com.dragon.portal.enm.question.QuestionStatusEnum;
import com.dragon.portal.enm.question.VisitRecordEnum;
import com.dragon.portal.model.it.*;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.ys.tools.common.JsonUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


/**
 * @Title: It知识库
 * @Description:ITSMContrller
 * @Author:cenwei
 * @Since:2016年12月6日 下午8:21:21
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Controller
@RequestMapping("/portal/itsm")
@Api(value="IT知识库", description = "IT知识库", tags={"IT知识库 /portal/itsm"})
public class ItsmController extends BaseController {
	private static Logger logger = Logger.getLogger(ItsmController.class);
	
	@Resource
	private CommonProperties commonProperties;
	


	/**
	 * ITSM : 查询分类接口
	 * @param request
	 * @param response
	 * @param classCode
	 * @return
	 */
    @GetMapping("/apiFindTSCategoryController")
    @ApiOperation("查询分类接口")
	public ReturnVo apiFindTSCategoryController(HttpServletRequest request, HttpServletResponse response,  String classCode){
        ReturnVo returnVo ;
        String itsmBasePath = commonProperties.getItsmPath();
		UserSessionInfo userInfo = getPersonInfo(request, response);
		String no = userInfo.getNo();
		String parentCategorys = "";
		String param = "";
		if(StringUtils.isNotBlank(classCode)){
			param = "findCategoryByParentCode&userName=" + no + "&classCode=" + classCode;
			parentCategorys = this.sendGet(itsmBasePath+"/apiFindTSCategoryController.do", param);
		}else{
			param = "findCategoryByParentCode&userName=" + no +"&classCode=eventSort";
			//logger.info(itsmBasePath+"/apiFindTSCategoryController.do"+param);
			parentCategorys = this.sendGet(itsmBasePath+"/apiFindTSCategoryController.do", param);
		}
		JSONObject jsonObject =  JSONObject.fromObject(parentCategorys);
        returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
        returnVo.setData(JsonUtils.toJson(jsonObject.get("rows")));
		return returnVo;
	}
	/**
	 * ITSM : 查询数据字典接口
	 * @param request
	 * @param response
	 * @param classCode
	 * @return
	 */
    @GetMapping("/apiFindTSTypeController")
    @ApiOperation("查询数据字典接口")
	public ReturnVo apiFindTSTypeController(HttpServletRequest request, HttpServletResponse response, String classCode){
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
	    String itsmBasePath = commonProperties.getItsmPath();
		String parentCategorys = "";
		if(StringUtils.isNotBlank(classCode)){
			String param = "findDicByGroupCode&typeGroupCode=" + classCode;
			parentCategorys = this.sendGet(itsmBasePath+"/apiFindTSTypeController.do", param);
            returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
            returnVo.setData(parentCategorys);
		}
		return returnVo;
	}

    @GetMapping("/ajaxList")
    @ApiOperation("查询分页列表数据")
    @ApiImplicitParam(name="statusName",value = "类型",dataType = "String",paramType = "query",required = true)
    public ReturnVo ajaxList( String statusName,Query query, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
        try {
            String itsmBasePath = commonProperties.getItsmPath();
            PagerModel<QuestionVo> pm = new PagerModel();
            List<QuestionVo> rows = new ArrayList();
            UserSessionInfo user = getUserSessionInfo(request, response);
            String userNo = user.getNo();
            int pageSize = query.getPageSize();
            int pageNumber = query.getPageNumber();
            String path = commonProperties.getItsmPath() + "/apiEventController.do?";
//		String method = "getSelfSubmitEvent&userName=admin&rows="+pageSize+"&page="+pageNumber+"&statusName="+statusName;
            String method = "getSelfSubmitEvent&userName=" + userNo + "&rows=" + pageSize + "&page=" + pageNumber + "&statusName=" + statusName;
            String result = this.sendPost(path, method);

            Map<String, Object> map = JsonUtils.getMap(result);
            long total = Long.parseLong(String.valueOf(map.get("total")));
            JSONArray json = JSONArray.fromObject(map.get("rows").toString());  // 首先把字符串转成 JSONArray  对象
            if (json.size() > 0) {
                QuestionVo vo = null;
                for (int i = 0; i < json.size(); i++) {
                    JSONObject job = json.getJSONObject(i);  // 遍历 jsonarray 数组，把每一个对象转成 json 对象
                    String str = job.getString("category.aliasName");
                    vo = new QuestionVo();
                    if (!"".equals(str)) {
                        String[] aliasName = str.split("/");
                        if (aliasName.length > 1) {
                            if (aliasName.length == 2) {
                                vo.setFristCategory(aliasName[1]);
                            } else if (aliasName.length == 3) {
                                vo.setFristCategory(aliasName[1]);
                                vo.setSecondCategory(aliasName[2]);
                            } else if (aliasName.length == 4) {
                                vo.setFristCategory(aliasName[1]);
                                vo.setSecondCategory(aliasName[2]);
                                vo.setThirdCategory(aliasName[3]);
                            }
                        }
                    }

                    vo.setRealName(job.getString("tsUser.realName"));
                    if (StringUtils.isNotBlank(job.getString("tsUser.mobilePhone"))) {
                        vo.setOfficePhone(" (" + job.getString("tsUser.mobilePhone") + ") ");
                    } else {
                        vo.setOfficePhone("");
                    }
                    vo.setCreateTime(job.getString("createTime").substring(0, 16));
                    vo.setStartTime(job.getString("startTime"));
                    vo.setEndTime(job.getString("endTime"));
                    if (StringUtils.isNotBlank(job.getString("endTime"))) {
                        if ("selfSolve".equals(job.getString("solveFlag.typecode"))) {
                            vo.setStatusCode(QuestionStatusEnum.REVOKE.getCode());//状态为已撤销
                            vo.setStatusName(QuestionStatusEnum.REVOKE.getName());
                        } else {
                            vo.setStatusCode(QuestionStatusEnum.COMPLETED.getCode());//状态为已完成
                            vo.setStatusName(QuestionStatusEnum.COMPLETED.getName());
                        }
                    } else {
                        if (StringUtils.isBlank(job.getString("startTime"))) {
                            vo.setStatusCode(QuestionStatusEnum.TORECEIVE.getCode());//状态为待接收
                            vo.setStatusName(QuestionStatusEnum.TORECEIVE.getName());
                        } else {
                            vo.setStatusCode(QuestionStatusEnum.HANDEL.getCode());//状态为处理中
                            vo.setStatusName(QuestionStatusEnum.HANDEL.getName());
                        }
                    }
                    vo.setId(job.getString("id"));
                    vo.setEventNo(job.getString("eventNo"));
                    vo.setTitle(job.getString("title"));
                    vo.setSolution(job.getString("solution"));
                    vo.setQuestionDesc(job.getString("description"));
                    if ("".equals(job.get("visitRecord"))) {
                        vo.setVisitRecord(VisitRecordEnum.CANNOT_EVALUATE.getCode());//用户评价状态：不能评价
                    } else {
                        if ("true".equals(job.get("visitRecord"))) {
                            vo.setVisitRecord(VisitRecordEnum.EVALUATED.getCode());//用户评价状态：已经评价
                        } else if ("false".equals(job.get("visitRecord"))) {
                            vo.setVisitRecord(VisitRecordEnum.PENDING_EVALUATE.getCode());//用户评价状态：待评价
                        }
                    }

                    //设置附件名称 附件id
                    String attachmentNames = job.getString("attachmentNames");
                    String attachmentIds = job.getString("attachmentIds");
                    String[] fileNames = null;
                    String[] fileIds = null;
                    if (StringUtils.isNotBlank(attachmentNames)) {
                        fileNames = attachmentNames.split(",");
                    }
                    if (StringUtils.isNotBlank(attachmentIds)) {
                        fileIds = attachmentIds.split(",");
                    }

                    List<QuestionFileVo> files = new ArrayList<QuestionFileVo>();
                    QuestionFileVo fileVo = null;
                    String filePath = itsmBasePath + "/apiEventController.do?viewFile&fileid=";
                    if (fileNames != null && fileIds != null) {
                        for (int j = 0; j < fileIds.length; j++) {
                            fileVo = new QuestionFileVo();
                            fileVo.setFileId(fileIds[j]);
                            fileVo.setFileName(fileNames[j]);
                            fileVo.setFilePath(filePath + fileIds[j]);
                            files.add(fileVo);
                        }
                    }
                    vo.setFiles(files);
                    rows.add(vo);
                }
            }
            pm.setTotal(total);
            pm.setRows(rows);
            returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
            returnVo.setData(pm);
        }catch (Exception e){
            logger.error("",e);
        }
		return returnVo;
	}

	/**
	 * ITSM - 保存请求
	 * @param request
	 * @param response
	 * @param eventDTO
	 * @return
	 */
    @PostMapping("/save")
    @ApiOperation("保存问题案例")
	public ReturnVo save(HttpServletRequest request, HttpServletResponse response, @RequestBody  EventDTO eventDTO) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
	    String saveResult = "";
		try {
			String itsmBasePath = commonProperties.getItsmPath();
			UserSessionInfo userInfo = getPersonInfo(request, response);
			String no = userInfo.getNo();
			//设置标题  标题=最后一级分类名称+发起人用户名
			eventDTO.setTitle(eventDTO.getCategoryName()+"-"+eventDTO.getCreatorRealName());
			String param = "save&title=" + eventDTO.getTitle() + "&creatorUserName="+eventDTO.getCreateUserid() +"&creatorRealName="+eventDTO.getCreatorRealName()
			//String method = "save&title=" + eventDTO.getTitle() + "&creatorUserName=00006416" +"&creatorRealName=00006416"
					+ "&creatorByMobilePhone="+ eventDTO.getCreatorByMobilePhone() +"&description="+eventDTO.getDescription() +"&operUserName="+no
					+ "&businessAddress=" + eventDTO.getBusinessAddress() +"&categoryCode="+eventDTO.getCategoryCode()+ "&sourceCode=portal";
			saveResult = this.sendPost(itsmBasePath+"/apiEventController.do?", param);
            returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
            returnVo.setData(saveResult);
		} catch (Exception e) {
			logger.error("保存问题请求出错，错误原因"+e);
		}
		return returnVo;
	}

	/**
	 * 描述：ITSM 文件上传 - 适用于富文本编辑框
	 * @param questFiles
	 * @return
	 */
    @PostMapping(value = "/uploadFile",headers="content-type=multipart/form-data")
    @ApiOperation("ITSM 文件上传 - 适用于富文本编辑框")
	public String uploadFile(@RequestParam(value = "questFiles", required = false) MultipartFile questFiles, String eventId, String sessionId, String filePath){
		String itsmBasePath = commonProperties.getItsmPath();
		String url = itsmBasePath +"/apiEventController.do?saveFiles";
		String result = "";
		//创建httpClient
		CloseableHttpClient httpClient = HttpClients.createDefault();
		try {
			//获取名称
			String fileName = questFiles.getOriginalFilename();
			//无后缀名的名称
			String name = questFiles.getOriginalFilename().split("\\.")[0];
			HttpPost httpPost = new HttpPost(url);
			MultipartEntityBuilder builder = MultipartEntityBuilder.create();
			builder.setCharset( Charset.forName("UTF-8"));
			builder.addBinaryBody("eventFile", questFiles.getInputStream(), ContentType.MULTIPART_FORM_DATA, fileName); //文件流
			builder.addTextBody("eventId", eventId);
			builder.addTextBody("fileName", name,ContentType.APPLICATION_JSON);	//类似浏览器提交,对应input的name和value
			HttpEntity entity = builder.build();
			httpPost.setEntity(entity);
			HttpResponse response = httpClient.execute(httpPost);// 执行提交
			HttpEntity responseEntity = response.getEntity();
            if (responseEntity != null) {
                // 将响应内容转换为字符串
                result = EntityUtils.toString(responseEntity, Charset.forName("UTF-8"));
            }
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}


	/**
	 * 描述：查看评价UI
	 * @param request
	 * @param response
	 * @return
	 */
	@GetMapping("/getAssessResultByEventId/{eventId}")
	@ApiOperation("查看评价UI")
	@ApiImplicitParam(name = "eventId", value = "eventId", paramType = "query", required = true, dataType = "String")
	public ReturnVo lookAssess(HttpServletRequest request, HttpServletResponse response,  String eventId) {
		ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"查询失败");
		try {
			String itsmBasePath = commonProperties.getItsmPath();
			String param = "viewVisitRecord&eventId="+eventId;
			String assessResult = this.sendPost(itsmBasePath+"/apiVisitRecordController.do?", param);
			returnVo = new ReturnVo(ReturnCode.SUCCESS,"查询成功");
			returnVo.setData(assessResult);
		} catch (Exception e) {
			logger.error("查看评价出错,出错原因"+e);
		}
		return returnVo;
	}

	/**
	 * ITSM - 保存评价 投诉(投诉的时候 分数全部默认为0)
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/saveVisitRecord")
	public String saveVisitRecord(HttpServletRequest request, HttpServletResponse response, RecodeDTO recodeDTO) {
		String saveResult = "";
		String no ="";
		String itsmBasePath ="";
		String param ="";
		try {
			itsmBasePath = commonProperties.getItsmPath();
			UserSessionInfo userInfo = getPersonInfo(request, response);
			//获取工号
			no = userInfo.getNo();
			param = "saveVisitRecord&eventId="+ recodeDTO.getEventId() + "&eventCreateUserName=" + no
					+ "&remark=" + recodeDTO.getRemark() + "&respondSpeed="+recodeDTO.getRespondSpeed()
					+ "&solveSpeed="+ recodeDTO.getSolveSpeed() +"&serviceAttitude="+recodeDTO.getServiceAttitude();
			saveResult = this.sendPost(itsmBasePath+"/apiVisitRecordController.do?", param);
		} catch (Exception e) {
			logger.error("保存评价，投诉接口出错，错误原因"+e);
		}
		return saveResult;
	}


	/**
	 * ITSM - 撤销反馈
	 * @param request
	 * @param response
	 * @return
	 */
	@ResponseBody
	@RequestMapping("/apiEventController")
	@GetMapping("/apiEventController/{eventId}")
	@ApiOperation("查看评价UI")
	public String apiEventController(HttpServletRequest request, HttpServletResponse response,  String eventId, String solutionText) {
		String saveResult = "";
		String no = "";
		String param  = "";
		try {
			String itsmBasePath = commonProperties.getItsmPath();
			UserSessionInfo userInfo = getPersonInfo(request, response);
			//获取工号
			no = userInfo.getNo();
			param = "selfResolve&eventId="+eventId+ "&operUserName=" +no + "&solutionText=" + solutionText ;
			saveResult = this.sendPost(itsmBasePath+"/apiEventController.do?", param);
		} catch (Exception e) {
			logger.error("撤销反馈出错，错误原因"+e);
		}
		return saveResult;
	}


	/**
	 * 方法描述：加载知识分类树形结构
	 * 拼接树形菜单步骤。
	 * 1. 调用分类接口查询 查询一级分类名称，分类 linkcode
	 * 2. 调用知识列表接口，根据linkcode 查询个数
	 * 3. 递归查询拼接
	 */
	@ResponseBody
	@RequestMapping("/knowledgeCategory")
	public String getKnowledgeCategory(String classCode){
		StringBuffer sb = new StringBuffer();
		String itsmBasePath = commonProperties.getItsmPath();
		String cCode = StringUtils.isBlank(classCode)?"knowledgeSort":classCode;
		String param = "findCategoryByParentCode&classCode="+cCode;
		String result="";
		String str="";
		try {
			//获取分类，以及分类对应的数量
			result = this.sendPost(itsmBasePath+"/apiFindTSCategoryController.do?", param);
			JSONObject jsons = JSONObject.fromObject(result);
			JSONArray rows = jsons.getJSONArray("rows");
			for(int i=0;i<rows.size();i++){
				String state = (String) rows.getJSONObject(i).get("state");
				String name ="";
				String linkCode="";
				if(state.equals("closed")){
					//获取名称，linkCode
					name = (String) rows.getJSONObject(i).get("name");
					linkCode = (String) rows.getJSONObject(i).get("linkCode");
					//获取分类对应的知识个数
					param = "datagrid&isSearchSub=true&linkCode="+linkCode;
					result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
					jsons = JSONObject.fromObject(result);
					Integer total = (Integer) jsons.get("total");
					name = name + "(" + total + ")";
					rows.getJSONObject(i).element("name", name);
					rows.getJSONObject(i).element("isParent", true);
				}else{
					//获取名称，linkCode
					name = (String) rows.getJSONObject(i).get("name");
					linkCode = (String) rows.getJSONObject(i).get("linkCode");
					//获取分类对应的知识个数
					param = "datagrid&isSearchSub=true&linkCode="+linkCode;
					result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
					jsons = JSONObject.fromObject(result);
					Integer total = (Integer) jsons.get("total");
					name = name + "(" + total + ")";
					rows.getJSONObject(i).element("name", name);
				}
			}
			if(StringUtils.isBlank(classCode)){
				result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", "datagrid");
				int num = (Integer) JSONObject.fromObject(result).get("total");
				String name =   "知识分类(" + num + ")";
				str = "[{id:'0', name:'"+name+"',children:"+rows.toString()+", open:true}]";
			}else{
				str = rows.toString();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return str;
	}

	/**
	 * 方法描述: 递归获取知识分类的子菜单
	 * @param json
	 * @return String
	 */
	public String getKnlgCagy(JSONObject json,String itsmBasePath){
		StringBuffer sb = new StringBuffer();
		//获取 classCode
		String classCode = json.getString("classCode");
		//请求知识分类路径
		String param = "findCategoryByParentCode&classCode=" + classCode;
		//得到请求结果
		String result = this.sendPost(itsmBasePath+"/apiFindTSCategoryController.do?", param);
		//将字符转成json
		JSONObject jsonCagy = JSONObject.fromObject(result);
		//获取分类个数
		JSONArray rows = jsonCagy.getJSONArray("rows");

		//遍历每个分类
		for(int i=0;i<rows.size();i++){
			if(i != 0){
				sb.append(",");
			}
			//如果state 为closed，说明还有子节点，递归拼接子节点
			String state = (String) rows.getJSONObject(i).get("state");
			if(state.equals("closed")){
				//获取名称，linkCode
				String name = (String) rows.getJSONObject(i).get("name");
				String linkCode = (String) rows.getJSONObject(i).get("linkCode");
				//获取分类对应的知识个数
				param = "datagrid&isSearchSub=true&linkCode="+linkCode;
				result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
				int total = (Integer) JSONObject.fromObject(result).get("total");
				sb.append("{\"id\":\"").append((String) rows.getJSONObject(i).get("id")).append("\"");
				sb.append(",\"name\":\"").append(name+"("+total+")").append("\"");
				sb.append(",\"linkCode\":\"").append(linkCode).append("\"");
				sb.append(",\"state\":\"").append("closed").append("\"");
				//嵌套的子节点递归放进来
				sb.append(",\"children\":[");
				sb.append(getKnlgCagy(rows.getJSONObject(i),itsmBasePath));
				sb.append("]}");
			}else{
				//获取名称，linkCode
				String name = (String) rows.getJSONObject(i).get("name");
				String linkCode = (String) rows.getJSONObject(i).get("linkCode");
				//获取分类对应的知识个数
				param = "datagrid&isSearchSub=true&linkCode="+linkCode;
				result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
				int total = (Integer) JSONObject.fromObject(result).get("total");
				//logger.info("name"+i+"="+name+"("+total+")");

				sb.append("{\"id\":\"").append((String) rows.getJSONObject(i).get("id")).append("\"");
				sb.append(",\"linkCode\":\"").append(linkCode).append("\"");
				sb.append(",\"state\":\"").append("open").append("\"");
				sb.append(",\"name\":\"").append(name+"("+total+")").append("\"}");
			}
		}
		return sb.toString();
	}

	/**
	 * 方法描述:查询知识列表
	 * @param request
	 * @param response
	 * @param query	分页
	 * @param model
	 * @param keyword 关键字
	 * @return json
	 */
	@ResponseBody
	@RequestMapping("/apiKnowledgeController")
	public String apiKnowledgeController(HttpServletRequest request, HttpServletResponse response, Query query, ModelMap model, String keyword, String linkCode) {
		PagerModel<QuestionKnowledge> pm = new PagerModel<QuestionKnowledge>();
		List<QuestionKnowledge> list = new ArrayList<QuestionKnowledge>();
		int pageSize = query.getRows();
		String pageNumber = query.getPage();
		try {
			/*if(StringUtils.isNotBlank(keyword)){
				keyword = new String(keyword.getBytes("ISO-8859-1"), "UTF-8");
			}*/
			String itsmBasePath = commonProperties.getItsmPath();
			String param = "datagrid&isSearchSub=true"+"&rows="+pageSize+"&page="+pageNumber;
			if(StringUtils.isNotBlank(keyword)){
				param = "datagrid&isSearchSub=true&keyword="+keyword+"&rows="+pageSize+"&page="+pageNumber;
			}
			//linkCode为空默认查询全部
			if(StringUtils.isNotBlank(linkCode)){
				param  = param + "&linkCode="+linkCode;
			}
			String result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
			JSONObject json = JSONObject.fromObject(result);
			JSONArray rows = json.getJSONArray("rows");
			long total = Long.parseLong(String.valueOf(json.get("total")));
			for(int i=0;i<rows.size();i++){
				QuestionKnowledge knowledge = new QuestionKnowledge();
				//System.out.println("categoryName="+rows.getJSONObject(i).get("category.name"));
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
			//logger.info("pm="+JsonUtils.toJson(pm));
		} catch (Exception e) {
			logger.error("查询知识库出错，错误原因"+e);
		}
		return JsonUtils.toJson(pm);
	}

	/**
	 * 方法描述: 热门知识
	 * @param request
	 * @param response
	 * @return	json
	 */
	@ResponseBody
	@RequestMapping("/getHotKnowledge")
	public String getHotKnowledge(HttpServletRequest request, HttpServletResponse response){
		PagerModel<QuestionKnowledge> pm = new PagerModel<QuestionKnowledge>();
		List<QuestionKnowledge> list = new ArrayList<QuestionKnowledge>();
		try {
			String itsmBasePath = commonProperties.getItsmPath();
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
		} catch (Exception e) {
			logger.error("查询知识库出错，错误原因"+e);
		}
		return JsonUtils.toJson(pm);
	}

	/**
	 * 方法描述 : 知识详情页面
	 * @param request
	 * @param response
	 * @param model
	 * @return String
	 */
	@RequestMapping("/knowledgeDetail")
	public String knowledgeDetail(HttpServletRequest request, HttpServletResponse response, ModelMap model, String id) {
		QuestionKnowledgeDetail knowledge = new QuestionKnowledgeDetail();
		List<QuestionFileVo> files =new ArrayList<QuestionFileVo>();
		String itsmBasePath = commonProperties.getItsmPath();
		String param = "getKonwledgeDetial&id="+id;
		try {
			String result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
			JSONObject json = JSONObject.fromObject(result);
			knowledge.setTitle(json.getString("title"));
			knowledge.setCreateTime(json.getString("createTime"));
			knowledge.setCreateUserName(json.getString("creator"));
			knowledge.setBrowseRecord(json.getInt("browseRecord"));
			knowledge.setContent(json.getString("content").replaceAll("ueditor", itsmBasePath+"/ueditor"));
			//处理附件
			JSONArray attachmentDTO = json.getJSONArray("attachmentDTO");
			if(attachmentDTO.size()>0){
				QuestionFileVo fileVo = null;
				for(int i=0;i<attachmentDTO.size();i++){
					fileVo = new QuestionFileVo();
					fileVo.setFileName(attachmentDTO.getJSONObject(i).getString("name")+"."+attachmentDTO.getJSONObject(i).getString("extend"));
					fileVo.setFilePath(itsmBasePath+"/"+attachmentDTO.getJSONObject(i).getString("url"));
					files.add(fileVo);
				}
				knowledge.setFiles(files);
			}
			model.addAttribute("files", files);//附件
			model.addAttribute("knowledge", knowledge);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "/it/it-knlg-detail";
	}

	/**
	 * 方法描述: 查询ITSM知识详情
	 * @param request
	 * @param id 知识id
	 * @return json
	 */
	@ResponseBody
	@RequestMapping("/getKonwledgeDetial")
	public String getKonwledgeDetial(HttpServletRequest request,String id){
		QuestionKnowledgeDetail knowledge = new QuestionKnowledgeDetail();
		String itsmBasePath = commonProperties.getItsmPath();
		String param = "getKonwledgeDetial&id=297ed9f85cab1b70015cab1e08c41b0b";
		try {
			String result = this.sendPost(itsmBasePath+"/apiKnowledgeController.do?", param);
			JSONObject json = JSONObject.fromObject(result);
			knowledge.setTitle(json.getString("title"));
			knowledge.setCreateTime(json.getString("createTime"));
			knowledge.setCreateUserName(json.getString("createUserName"));
			knowledge.setBrowseRecord(json.getInt("browseRecord"));
			//处理附件
			JSONArray attachmentDTO = json.getJSONArray("attachmentDTO");
			if(attachmentDTO.size()>0){
				List<QuestionFileVo> files =new ArrayList<QuestionFileVo>();
				QuestionFileVo fileVo = null;
				for(int i=0;i<attachmentDTO.size();i++){
					fileVo = new QuestionFileVo();
					fileVo.setFileName(attachmentDTO.getJSONObject(i).getString("name")+"."+attachmentDTO.getJSONObject(i).getString("extend"));
					fileVo.setFilePath(itsmBasePath+attachmentDTO.getJSONObject(i).getString("url"));
					files.add(fileVo);
				}
				knowledge.setFiles(files);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return JsonUtils.toJson(knowledge);
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
                    connection.getInputStream()));
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
    
}

	