package com.dragon.portal.web.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @Auther: huanghongjing
 * @Date: 2018/9/26 14:09
 * @Description:
 */
@Controller
@RequestMapping("/")
public class IndexController extends BaseController {
    private static final Logger logger = LoggerFactory.getLogger(IndexController.class);



    //登陆界面
    @RequestMapping("/login")
    public String login() {
        return "/login";
    }

/*
    //登陆验证
    @ResponseBody
    @RequestMapping("/login_check")
    public ReturnVo loginCheck(ModelMap model, UserVo userVo, String isRemember, HttpServletResponse response, HttpServletRequest request, HttpSession httpSession) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "登陆失败！！");
        try {
            List<UserVo> all = iUserVoService.getAll(userVo);
            if (CollectionUtils.isNotEmpty(all)) {
                UserVo userVoInfo = all.get(0);
                //记住密码
                if (StringUtils.isNotBlank(isRemember) && "1".equals(isRemember)) {
                    CookiesUtil.put(response, "userNo", userVoInfo.getId(), "/", 60 * 60 * 24);
                    httpSession.setAttribute("userInfor", userVoInfo);
                }
                returnVo.setCode(ReturnCode.SUCCESS);
                returnVo.setMsg("登陆成功！！");
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("IndexController-loginCheck", e);
        }
        return returnVo;
    }*/


    //主界面
    @RequestMapping("/main")
    public String mainIndex() {
        return "main";
    }


}
