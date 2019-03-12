//package com.dragon.portal.rest.controller.addrbook;
//
//import com.dragon.portal.model.addrbook.TopContacts;
//import com.dragon.portal.rest.controller.BaseController;
//import com.dragon.portal.service.addrbook.ITopContactsService;
//import com.mhome.tools.common.JsonUtils;
//import com.mhome.tools.pager.PagerModel;
//import com.mhome.tools.pager.Query;
//import com.mhome.tools.vo.SimpleReturnVo;
//import com.ys.portal.model.addrbook.TopContacts;
//import com.ys.portal.service.addrbook.ITopContactsService;
//import com.ys.portal.web.controller.BaseController;
//import org.apache.commons.lang.StringUtils;
//import org.apache.log4j.Logger;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.ModelMap;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.ResponseBody;
//
//import javax.annotation.Resource;
//import javax.servlet.http.HttpServletRequest;
//
//
///**
// * @Title:常用联系人管理Controller
// * @Description:
// * @Author:XTJ
// * @Since:2017-03-22 11:34:04
// * @Version:1.1.0
// * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
// */
//@Controller
//@RequestMapping("/portal/addrbook/top_contacts")
//public class TopContactsController extends BaseController {
//	private static Logger logger = Logger.getLogger(TopContactsController.class);
//
//	@Resource
//	private ITopContactsService topContactsService;
//
//	//列表
//	@RequestMapping("/list")
//	public String list(ModelMap model, String sessionId) {
//		model.addAttribute("sessionId", sessionId);
//		return "/addrbook/top_contacts_list";
//	}
//
//	@ResponseBody
//	@RequestMapping("/ajaxList")
//	public String ajaxList(TopContacts topContacts, Query query, String sessionId) {
//		PagerModel<TopContacts> pm = null;
//		try {
//			pm = this.topContactsService.getPagerModelByQuery(topContacts, query);
//		} catch (Exception e) {
//			logger.error("TopContactsController-ajaxList:"+e);
//			e.printStackTrace();
//		}
//		return JsonUtils.toJson(pm);
//	}
//
//	//添加、修改的UI
//	@RequestMapping("/input")
//	public String input(ModelMap model, String id, String sessionId) {
//		try {
//			if(StringUtils.isNotBlank(id)){
//				TopContacts topContacts=this.topContactsService.getTopContactsById(id);
//				model.addAttribute("topContacts", topContacts);
//			}
//		} catch (Exception e) {
//			logger.error("TopContactsController-input:"+e);
//			e.printStackTrace();
//		}
//		return "/addrbook/top_contacts_input";
//	}
//
//	//保存
//	@ResponseBody
//	@RequestMapping("/save")
//	public String save(TopContacts topContacts, String sessionId) {
//		SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "修改失败");
//		try {
////			User user = this.getLoginUser(sessionId);
////			if (null != user && StringUtils.isNotBlank(user.getUsername())) {
////				String userName=user.getUsername();
////				if(StringUtils.isBlank(topContacts.getId())){
////					topContacts.setCreator(userName);
////					topContacts.setUpdator(userName);
////					this.topContactsService.insertTopContacts(topContacts);
////					returnVo = new SimpleReturnVo(SUCCESS, "添加成功");
////				}else{
////					topContacts.setUpdator(userName);
////					topContacts.setDelFlag(null);
////					this.topContactsService.updateTopContacts(topContacts);
////					returnVo = new SimpleReturnVo(SUCCESS, "修改成功");
////				}
////			}else{
////				returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
////			}
//		} catch (Exception e) {
//			logger.error("TopContactsController-update:"+e);
//			e.printStackTrace();
//		}
//		return JsonUtils.toJson(returnVo);
//	}
//
//
//	//删除
//	@ResponseBody
//	@RequestMapping("/dels")
//	public String dels(String ids,HttpServletRequest request, String sessionId) {
//		SimpleReturnVo returnVo = new SimpleReturnVo(ERROR, "删除失败");
//		try {
////			User user = this.getLoginUser(sessionId);
////			if (null != user && StringUtils.isNotBlank(user.getUsername())) {
////				String userName=user.getUsername();
////				if(StringUtils.isNotBlank(ids)){
////					TopContacts topContacts = new  TopContacts();
////					topContacts.setUpdator(userName);
////					topContacts.setDelFlag(CmsConstants.HAS_DELETE_FLAG);
////					this.topContactsService.updateTopContactsByIds(ids,topContacts);//逻辑删除
////					//this.topContactsService.delTopContactsByIds(ids); //物理删除
////				}
////				returnVo = new SimpleReturnVo(SUCCESS, "删除成功");
////			}else{
////				returnVo = new SimpleReturnVo(ERROR, "用户信息获取失败，请重新登录");
////			}
//		} catch (Exception e) {
//			logger.error("TopContactsController-dels:"+e);
//			e.printStackTrace();
//		}
//		return JsonUtils.toJson(returnVo);
//	}
//}
