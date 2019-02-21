package com.dragon.portal.web.controller.basedata;

import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.service.basedata.IDicTypeService;
import com.dragon.portal.service.basedata.IDictionaryService;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.utils.StringTools;
import com.dragon.tools.vo.ReturnVo;
import com.ecnice.privilege.model.privilege.User;
import org.apache.commons.collections.CollectionUtils;
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
import java.util.List;



/**
 * @author : wangzhiyong
 * @date : 2018-10-24 12:02:34
 * description : 字段类别管理Controller
 */
@Controller
@RequestMapping("basedata/dic_type")
public class DicTypeController extends BaseController {
    private static Logger logger = LoggerFactory.getLogger(DicTypeController.class);

    private final String nameSpace = "dic_type";

    @Resource
    private IDicTypeService dicTypeService;
    @Resource
    private IDictionaryService dictionaryService;

    //列表
    @RequestMapping("/list")
    public String list(ModelMap model, String sessionId) {
        model.addAttribute("sessionId", sessionId);
        return "/basedata/dic_type_list";
    }

    @ResponseBody
    @RequestMapping("/ajaxList")
    public PagerModel<com.dragon.portal.model.basedata.DicType> ajaxList(com.dragon.portal.model.basedata.DicType dicType, Query query, String sessionId) {
        PagerModel<com.dragon.portal.model.basedata.DicType> pm = null;
        try {
            pm = this.dicTypeService.getPagerModelByQuery(dicType, query);
        } catch (Exception e) {
            logger.error("DicTypeController-ajaxList:", e);
            e.printStackTrace();
        }
        return pm;
    }


    @ResponseBody
    @RequestMapping("/getAll")
    public List<com.dragon.portal.model.basedata.DicType> getAll(com.dragon.portal.model.basedata.DicType flowDicType, String sessionId) {
        try {
            List<com.dragon.portal.model.basedata.DicType> all = dicTypeService.getAll(flowDicType);
            return all;
        } catch (Exception e) {
            logger.error("FlowDicTypeController-getAll:",e);
            e.printStackTrace();
        }
        return null;
    }

    //添加
    @ResponseBody
    @RequestMapping("/insert")
    public ReturnVo insert(com.dragon.portal.model.basedata.DicType dicType, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "添加失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                dicType.setCreator(userName);
                dicType.setUpdator(userName);
                this.dicTypeService.insertDicType(dicType);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "添加成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DicTypeController-insert:", e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //添加、修改的UI
    @RequestMapping("/input")
    public String updateUI(ModelMap model, String id, String sessionId) {
        try {
            if (StringUtils.isNotBlank(id)) {
                com.dragon.portal.model.basedata.DicType dicType = this.dicTypeService.getDicTypeById(id);
                model.addAttribute("dicType", dicType);
            }
        } catch (Exception e) {
            logger.error("DicTypeController-insert:", e);
            e.printStackTrace();
        }
        return "/basedata/dic_type_input";
    }

    /**
     * 根据id 查询详情
     *
     * @param id
     * @return
     */
    @RequestMapping("/detail/{id}")
    @ResponseBody
    public ReturnVo<com.dragon.portal.model.basedata.DicType> detail(@PathVariable("id") String id) {
        ReturnVo<com.dragon.portal.model.basedata.DicType> vo = new ReturnVo<>(ReturnCode.FAIL, "查询详情失败");
        try {
            if (StringUtils.isNotBlank(id)) {
                com.dragon.portal.model.basedata.DicType formInfo = this.dicTypeService.getDicTypeById(id);
                vo = new ReturnVo<>(ReturnCode.SUCCESS, "详情查询成功", formInfo);
            } else {
                vo.setMsg("参数异常");
            }
        } catch (Exception e) {
            logger.error("DicTypeController-detail", e);
        }
        return vo;
    }

    //修改
    @ResponseBody
    @RequestMapping("/update")
    public ReturnVo update(com.dragon.portal.model.basedata.DicType dicType, HttpServletRequest request) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "修改失败");
        try {
            User user = this.getLoginUser(request);
            if (null != user && StringUtils.isNotBlank(user.getUsername())) {
                String userName = user.getUsername();
                dicType.setUpdator(userName);
                dicType.setDelFlag(null);
                this.dicTypeService.updateDicType(dicType);
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "修改成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DicTypeController-update:", e);
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
                    com.dragon.portal.model.basedata.DicType dicType = new com.dragon.portal.model.basedata.DicType();
                    dicType.setUpdator(userName);
                    dicType.setDelFlag(PortalConstant.DEL_FLAG);
                    //this.dicTypeService.updateDicTypeByIds(ids, dicType);//逻辑删除
                    this.dicTypeService.delDicTypeByIds(ids); //物理删除
                    List<String> list = StringTools.converStringToList(ids);
                    list.forEach(s->{
                        com.dragon.portal.model.basedata.Dictionary dictionary = new com.dragon.portal.model.basedata.Dictionary();
                        dictionary.setDicTypeId(s);
                        try {
                            List<com.dragon.portal.model.basedata.Dictionary> all = dictionaryService.getAll(dictionary);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    });

                }
                returnVo = new ReturnVo(ReturnCode.SUCCESS, "删除成功");
            } else {
                returnVo = new ReturnVo(ReturnCode.FAIL, "用户信息获取失败，请重新登录");
            }
        } catch (Exception e) {
            logger.error("DicTypeController-dels:", e);
            e.printStackTrace();
        }
        return returnVo;
    }

    //验证部门编码是否唯一
    @ResponseBody
    @RequestMapping("/checkCode")
    public ReturnVo checkCode(com.dragon.portal.model.basedata.DicType dicType) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL,"");
        try {
            com.dragon.portal.model.basedata.DicType f = new com.dragon.portal.model.basedata.DicType();
            f.setCode(dicType.getCode());
            List<com.dragon.portal.model.basedata.DicType> allf = dicTypeService.getAll(f);
            if (StringUtils.isNotBlank(dicType.getId())){
                //更新验证
                com.dragon.portal.model.basedata.DicType dicTypeByid = dicTypeService.getDicTypeById(dicType.getId());
                if (dicTypeByid.getCode().equals(dicType.getCode())){
                    returnVo.setCode(ReturnCode.SUCCESS);
                }else{
                    if (CollectionUtils.isNotEmpty(allf)&&allf.size()>0){
                        returnVo.setCode(ReturnCode.FAIL);
                    }
                }
            }else{
                //新增
                if (CollectionUtils.isNotEmpty(allf)&&allf.size()>0){
                    returnVo.setCode(ReturnCode.FAIL);
                }else{
                    returnVo.setCode(ReturnCode.SUCCESS);
                }
            }

        } catch (Exception e) {
            logger.error("FlowCategoryController-getCategroyBySearch:",e);
            e.printStackTrace();
        }
        return returnVo;
    }
}
