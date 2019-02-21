package com.dragon.portal.web.controller.basedata;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.model.basedata.DicItem;
import com.dragon.portal.service.basedata.IDicItemService;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.ecnice.privilege.model.privilege.User;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字段项管理Controller
 */
@Controller
@RequestMapping("basedata/dic_item")
public class DicItemController extends BaseController {
    private static Logger logger = LoggerFactory.getLogger(DicItemController.class);

    private final String nameSpace = "dic_item";

    @Resource
    private IDicItemService dicItemService;

    //列表
    @RequestMapping("/list")
    public String list(ModelMap model, String sessionId) {
        model.addAttribute("sessionId", sessionId);
        return "/basedata/dic_item_list";
    }

    @ResponseBody
    @RequestMapping("/ajaxList")
    public PagerModel<DicItem> ajaxList(DicItem dicItem, Query query, String sessionId) {
        PagerModel<DicItem> pm = null;
        try {
            pm = this.dicItemService.getPagerModelByQuery(dicItem, query);
        } catch (Exception e) {
            logger.error("DicItemController-ajaxList:", e);
            e.printStackTrace();
        }
        return pm;
    }

    //添加
    @ResponseBody
    @RequestMapping("/insert")
    public ReturnVo add(DicItem dicItem, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "添加失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                dicItem.setCreator(userName);
                dicItem.setUpdator(userName);
                this.dicItemService.insertDicItem(dicItem);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "添加成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DicItemController-insert:", e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //添加、修改的UI
    @RequestMapping("/input")
    public String updateUI(ModelMap model, String id, String sessionId) {
        try {
            if (StringUtils.isNotBlank(id)) {
                DicItem dicItem = this.dicItemService.getDicItemById(id);
                model.addAttribute("dicItem", dicItem);
            }
        } catch (Exception e) {
            logger.error("DicItemController-updateUI:", e);
            e.printStackTrace();
        }
        return "/basedata/dic_item_input";
    }

    //修改
    @ResponseBody
    @RequestMapping("/update")
    public ReturnVo update(DicItem dicItem, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                dicItem.setUpdator(userName);
                dicItem.setDelFlag(null);
                this.dicItemService.updateDicItem(dicItem);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DicItemController-update:", e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //删除
    @ResponseBody
    @RequestMapping("/dels")
    public ReturnVo dels(String ids, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "删除失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                if (StringUtils.isNotBlank(ids)) {
                    DicItem dicItem = new DicItem();
                    dicItem.setUpdator(userName);
                    dicItem.setDelFlag(PortalConstant.DEL_FLAG);
                    this.dicItemService.updateDicItemByIds(ids, dicItem);//逻辑删除
                    //this.dicItemService.delDicItemByIds(ids); //物理删除
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DicItemController-dels:", e);
            e.printStackTrace();
        }
        return returnVo;
    }
}
