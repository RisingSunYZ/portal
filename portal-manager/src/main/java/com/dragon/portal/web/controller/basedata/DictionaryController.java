package com.dragon.portal.web.controller.basedata;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.service.basedata.IDicItemService;
import com.dragon.portal.service.basedata.IDictionaryService;
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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;


/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字典管理Controller
 */
@Controller
@RequestMapping("basedata/dictionary")
public class DictionaryController extends BaseController {
    private static Logger logger = LoggerFactory.getLogger(DictionaryController.class);

    private final String nameSpace = "dictionary";

    @Resource
    private IDictionaryService dictionaryService;
    @Resource
    private IDicItemService dicItemService;

    //列表
    @RequestMapping("/list")
    public String list(ModelMap model, String sessionId) {
        model.addAttribute("sessionId", sessionId);
        return "/basedata/dictionary_list";
    }

    @ResponseBody
    @RequestMapping("/ajaxList")
    public PagerModel<com.dragon.portal.model.basedata.Dictionary> ajaxList(com.dragon.portal.model.basedata.Dictionary dictionary, Query query, String sessionId) {
        PagerModel<com.dragon.portal.model.basedata.Dictionary> pm = null;
        try {
            pm = this.dictionaryService.getPagerModelByQuery(dictionary, query);
        } catch (Exception e) {
            logger.error("DictionaryController-ajaxList:", e);
            e.printStackTrace();
        }
        return pm;
    }

    //添加
    @ResponseBody
    @RequestMapping("/insert")
    public ReturnVo add(com.dragon.portal.model.basedata.Dictionary dictionary, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "添加失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                dictionary.setCreator(userName);
                dictionary.setUpdator(userName);
                this.dictionaryService.insertDictionary(dictionary);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "添加成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DictionaryController-insert:", e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //添加、修改的UI
    @RequestMapping("/input")
    public String updateUI(ModelMap model, String id, String sessionId) {
        try {
            if (StringUtils.isNotBlank(id)) {
                com.dragon.portal.model.basedata.Dictionary dictionary = this.dictionaryService.getDictionaryById(id);
                model.addAttribute("dictionary", dictionary);
            }
        } catch (Exception e) {
            logger.error("DictionaryController-updateUI:", e);
            e.printStackTrace();
        }
        return "/basedata/dictionary_input";
    }

    /**
     * 根据id 查询详情
     *
     * @param id
     * @return
     */
    @RequestMapping("/detail/{id}")
    @ResponseBody
    public ReturnVo<com.dragon.portal.model.basedata.Dictionary> detail(@PathVariable("id") String id) {
        ReturnVo<com.dragon.portal.model.basedata.Dictionary> vo = new ReturnVo<>(ReturnCode.FAIL, "查询详情失败");
        try {
            if (StringUtils.isNotBlank(id)) {
                com.dragon.portal.model.basedata.Dictionary formInfo = this.dictionaryService.getDictionaryById(id);
                vo = new ReturnVo<>(ReturnCode.SUCCESS, "详情查询成功", formInfo);
            } else {
                vo.setMsg("参数异常");
            }
        } catch (Exception e) {
            logger.error("DictionaryController-detail", e);
        }
        return vo;
    }

    //修改
    @ResponseBody
    @RequestMapping("/update")
    public ReturnVo update(com.dragon.portal.model.basedata.Dictionary dictionary, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                dictionary.setUpdator(userName);
                dictionary.setDelFlag(null);
                this.dictionaryService.updateDictionary(dictionary);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DictionaryController-update:", e);
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
                    com.dragon.portal.model.basedata.Dictionary dictionary = new com.dragon.portal.model.basedata.Dictionary();
                    dictionary.setUpdator(userName);
                    dictionary.setDelFlag(PortalConstant.DEL_FLAG);
                    //this.dictionaryService.updateDictionaryByIds(ids, dictionary);//逻辑删除
                    this.dictionaryService.delDictionaryByIds(ids); //物理删除
                    //删除数据字典项
                    dicItemService.delDicItemByMainIds(ids);
                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DictionaryController-dels:", e);
            e.printStackTrace();
        }
        return returnVo;
    }
}
