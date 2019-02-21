package com.dragon.portal.web.controller.user;

import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Description:
 * @author: xietongjian
 * @Since: 2019/2/21 13:34
 * @Version: 1.1.0
 * @Copyright: Copyright (c) 亚厦股份有限公司 2018 ~ 2020 版权所有
 */
@RestController
@RequestMapping("/portal/user/userLogin")
@Api(value="用户登录", description = "用户登录", tags={"用户登录 / /portal/user/userLogin"})
public class UserLoginController extends BaseController{

    private static Logger logger = LoggerFactory.getLogger(UserLoginController.class);


    /**
     * Test
     * @param id
     * @return
     */
    @GetMapping("/getById/{id}")
    @ApiOperation("通过ID获取数据")
    @ApiImplicitParam(name = "id", value = "ID", paramType = "path", required = true, dataType = "String")
    public ReturnVo getById(@PathVariable String id) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败！");
        try {

            returnVo.setMsg("查询数据成功！");
        } catch (Exception e) {
            logger.error("ApplicationsController-getById:", e);
            e.printStackTrace();
            returnVo.setMsg("通过ID：【"+id+"】查询数据异常！" + e.getMessage());
        }
        return returnVo;
    }

}
