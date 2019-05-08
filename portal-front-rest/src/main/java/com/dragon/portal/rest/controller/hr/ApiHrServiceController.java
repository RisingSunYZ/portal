package com.dragon.portal.rest.controller.hr;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import com.dragon.portal.model.basedata.Dictionary;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.service.basedata.IDictionaryService;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.user.Personnel;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.ys.ucenter.constant.UcenterConstant;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Description:HR服务相关
 * @Author: liuxuan
 * @Since:2019年04月29日 09:59:21
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Controller
@RequestMapping("/rest/portal/hrService")
@Api(value="HR服务", description = "HR服务", tags={"HR服务 /rest/portal/hrService"})
public class ApiHrServiceController extends BaseController {

    private static Logger logger = Logger.getLogger(ApiHrServiceController.class);

    @Autowired
    private IDictionaryService dictionaryService;
    @Autowired
    private CommonProperties commonProperties;
    @Autowired
    private IPersonnelApi personnelApi;

    /**
     * 常用流程
     *
     * @return
     */
    @ResponseBody
    @GetMapping("/getQuickProcess")
    @ApiOperation(" HR服务 >> 获取HR快捷流程")
    public ReturnVo getQuickProcess() {
        ReturnVo<List> returnVo = new ReturnVo<>(ReturnCode.FAIL, "获取数据失败");
        try {
            List<Dictionary> commonProcessDicts = dictionaryService.getBaseDataByType(commonProperties.getTypeHrcommonProcess());
            List<Map<String, String>> listMap = new ArrayList<>();
            for (Dictionary item : commonProcessDicts) {
                String hrefStr = item.getRemark();
                Map<String, String> map = new HashMap<>();
                net.sf.json.JSONObject jsonHref = net.sf.json.JSONObject.fromObject(hrefStr);
                Object linkUrl = jsonHref.get("linkUrl");
                map.put("linkUrl", linkUrl + "");
                Object icon = jsonHref.get("icon");
                map.put("icon", icon + "");
                map.put("name", item.getName());
                map.put("id", item.getId());
                listMap.add(map);
            }
            returnVo = new ReturnVo<>(ReturnCode.SUCCESS, "获取数据成功", listMap);
        } catch (Exception e) {
            logger.error("ApiHrServiceController-getQuickProcess:", e);
        }
        return returnVo;
    }

    /**
     * 判断是否是领导
     *
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @GetMapping("/checkLeader")
    @ApiOperation(" HR服务 >> 判断是否是领导")
    public ReturnVo checkLeader(HttpServletRequest request, HttpServletResponse response) {
        UserSessionInfo userInfo = getUserSessionInfo(request, response);
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "获取数据失败");
        Personnel personnel = new Personnel();
        Integer isLeader = 0;
        if (StringUtils.isNotBlank(userInfo.getNo())) {
            personnel.setLeaderNo(userInfo.getNo());
            com.ys.tools.vo.ReturnVo<Personnel> rVo = personnelApi.getAllPersonnelExt(personnel);
            if (rVo.getCode() == UcenterConstant.SUCCESS && CollectionUtils.isNotEmpty(rVo.getDatas())) {
                isLeader = 1;
            }
            returnVo = new ReturnVo<>(ReturnCode.SUCCESS, "获取数据成功", isLeader);
        }
        return returnVo;
    }

}
