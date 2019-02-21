package com.dragon.portal.web.controller.process;

import com.dragon.flow.api.ICusFlowApi;
import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.constant.FlowConstant;
import com.dragon.flow.enm.from.FormDefultFieldEnum;
import com.dragon.flow.model.form.FormInfo;
import com.dragon.flow.model.form.FormItem;
import com.dragon.flow.vo.form.FormDesInfoVo;
import com.dragon.portal.service.basedata.IDicItemService;
import com.dragon.portal.vo.process.BaseFormVo;
import com.dragon.portal.vo.process.ProcessMainVo;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.web.controller.BaseController;
import com.ys.tools.common.DateUtil;
import com.ys.tools.common.JsonUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/portal/process/cstm/form")
public class ProcessCstmFormController extends BaseController {
	private static Logger logger = Logger.getLogger(ProcessCstmFormController.class);

	@Autowired
	private IFlowApi flowApi;
	@Autowired
	private ICusFlowApi cusFlowApi;
	@Autowired
	private IDicItemService dicItemService;

	@ResponseBody
	@RequestMapping("/test")
	public String test(){

		return "tset";
	}


	/**
	 * 自定义表单统一表单页面
	 * @param model
	 * @param request
	 * @param response
	 * @param processMainVo
	 * @return
	 * @Description:
	 * @author xietongjian 2017 下午3:50:04
	 */
	@RequestMapping("/index")
	public String index(ModelMap model, HttpServletRequest request, HttpServletResponse response, ProcessMainVo processMainVo) {
		try {
			UserSessionInfo loginUser = this.getLoginUser(request, response);
			//根据流程实列查询流程实列和流程定义信息
			// 设置流程发起者
//			processMainVo = processMainComponent.setProcessSenderNo(processMainVo, loginUser);

			com.dragon.tools.vo.ReturnVo<FormDesInfoVo> rVo = cusFlowApi.getFormDesInfoVo(processMainVo.getModelKey(), processMainVo.getBizId());
			if(FlowConstant.SUCCESS.equals(rVo.getCode())){
				FormDesInfoVo formDesInfoVo = rVo.getData();
				FormInfo formInfo = formDesInfoVo.getFormInfo();
				List<FormItem> items = formDesInfoVo.getItems();

				Map<String, Object> formDes = formDesInfoVo.getFormDes();
				if(null == formDes){
					formDes = new HashMap<String, Object>();
				}

				if(StringUtils.isBlank(processMainVo.getBizId())){
					this.genDefaultData(formDes, loginUser);
				}

				model.put("items", JsonUtils.toJson(items));
				model.put("formDes", JsonUtils.toJson(formDes));
				model.put("formInfo", formInfo);
				this.genBaseForm(model, loginUser);

			}else{
				logger.error("调用 OA 【oaApi.getFormDesInfo()】 接口异常！" + rVo.getMsg());
			}
		} catch (Exception e) {
			logger.error("调用 OA 【oaApi.getPInfoByPId()】 接口异常！" + e);
			e.printStackTrace();
		}
		model.put("processMainVo", processMainVo);
		model.put("processMainVoJson", JsonUtils.toJson(processMainVo));
		return "/process/form/cstm-form";
	}

	/**
	 * 生成组装默认数据
	 * @param formDes
	 * @param loginUser
	 * @Description:
	 * @author xietongjian 2017 下午3:59:25
	 */
	public void genDefaultData(Map<String, Object> formDes, UserSessionInfo loginUser){
		// 设置表单默认值
		formDes.put(FormDefultFieldEnum.FQDW.getFieldName(), loginUser.getCompanyId());
		formDes.put(FormDefultFieldEnum.SJBM.getFieldName(), loginUser.getParentDepId());
		formDes.put(FormDefultFieldEnum.FQR.getFieldName(), loginUser.getNo());
		formDes.put(FormDefultFieldEnum.FQSJ.getFieldName(), DateUtil.getCurrentDateTimeToStr2());
		formDes.put(FormDefultFieldEnum.GH.getFieldName(), loginUser.getNo());
		formDes.put(FormDefultFieldEnum.FQBM.getFieldName(), loginUser.getDepId());
		formDes.put(FormDefultFieldEnum.SJHM.getFieldName(), loginUser.getMobile());
		formDes.put(FormDefultFieldEnum.ZW.getFieldName(), loginUser.getUserPost());
	}

	/**
	 * 组装BaseForm
	 * @param model
	 * @param loginUser
	 * @Description:
	 * @author xietongjian 2017 下午3:59:13
	 */
	public void genBaseForm(ModelMap model, UserSessionInfo loginUser){
		BaseFormVo baseForm = new BaseFormVo();
		baseForm.setCreator(loginUser.getNo());
		baseForm.setApplyCompany(loginUser.getCompanyName());
		baseForm.setApplyCompanyId(loginUser.getCompanyId());
		baseForm.setApplyDept(loginUser.getDepName());
		baseForm.setApplyDeptId(loginUser.getDepId());
		baseForm.setApplyerNo(loginUser.getNo());
		baseForm.setApplyerName(loginUser.getName());
		baseForm.setMobile(loginUser.getMobile());
		baseForm.setApplyDate(new Date());
		baseForm.setParentDeptId(loginUser.getParentDepId());
		baseForm.setParentDept(loginUser.getParentDepName());
		model.put("baseForm", JsonUtils.toJson(baseForm));
	}

	/**
	 * 组装BaseForm
	 * @param model
	 * @param loginUser
	 * @Description:
	 * @author xietongjian 2017 下午3:59:13
	 */
	public void genBaseForm(Map model, UserSessionInfo loginUser){
		BaseFormVo baseForm = new BaseFormVo();
		baseForm.setCreator(loginUser.getNo());
		baseForm.setApplyCompany(loginUser.getCompanyName());
		baseForm.setApplyCompanyId(loginUser.getCompanyId());
		baseForm.setApplyDept(loginUser.getDepName());
		baseForm.setApplyDeptId(loginUser.getDepId());
		baseForm.setApplyerNo(loginUser.getNo());
		baseForm.setApplyerName(loginUser.getName());
		baseForm.setMobile(loginUser.getMobile());
		baseForm.setApplyDate(new Date());
		baseForm.setParentDeptId(loginUser.getParentDepId());
		baseForm.setParentDept(loginUser.getParentDepName());
		model.put("baseForm", baseForm);
	}

}

	