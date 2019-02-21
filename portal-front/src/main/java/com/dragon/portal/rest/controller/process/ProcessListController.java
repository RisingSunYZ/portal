package com.dragon.portal.rest.controller.process;

import com.dragon.flow.api.ICusFlowApi;
import com.dragon.flow.api.IFlowApi;
import com.dragon.portal.service.basedata.IDicItemService;
import com.dragon.portal.web.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * 流程中心-表单操作
 */
@RestController
@RequestMapping("/rest/process/list")
@Api(value="流程中心-表单操作", description = "流程中心-表单操作", tags={"流程中心-表单操作 / /rest/process/list"})
public class ProcessListController extends BaseController {
    private static Logger logger = Logger.getLogger(ProcessListController.class);

    @Autowired
    private IFlowApi flowApi;
    @Autowired
    private ICusFlowApi cusFlowApi;

    /**
     * 测试
     * @param id
     * @return
     */
    @GetMapping("/test")
    @ApiOperation("通过ID获取数据")
    @ApiImplicitParam(name = "id", value = "ID", paramType = "query", required = true, dataType = "String")
    public ReturnVo test(String id){
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询数据失败");

        return returnVo;
    }

}

	