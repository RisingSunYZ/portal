package com.dragon.portal.rest.controller.hr;

import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.atds.api.IAtdsApi;
import com.ys.atds.model.personal.Personnel;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Description:HR服务-考勤相关
 * @Author: liuxuan
 * @Since:2019年04月29日 10:29:21
 */
@Controller
@RequestMapping("/rest/portal/attendance")
public class ApiAttendanceController extends BaseController {

    private static Logger logger = Logger.getLogger(ApiAttendanceController.class);

    @Autowired
    private IAtdsApi atdsApi;

    /**
     * 检查个人是否考勤异常
     *
     * @param request
     * @param response
     * @param userNo
     * @return
     */
    @RequestMapping("/checkPersonExp")
    public ReturnVo checkPersonExp(HttpServletRequest request, HttpServletResponse response, String userNo) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "获取数据失败");
        Map<String, String> map = new HashMap<>();
        UserSessionInfo userInfo = getPersonInfo(request, response);
        if (StringUtils.isNotBlank(userNo)) {
            userNo = new String(Base64.getDecoder().decode(userNo));
        } else {
            userNo = userInfo.getNo();
        }
        Personnel personnel = new Personnel();
        personnel.setNo(userNo);
        //考勤异常数据
        try {
            SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
            Calendar rightNow = Calendar.getInstance();
            rightNow.setTime(df.parse(df.format(new Date())));
            rightNow.set(Calendar.DATE, 1);
            com.mhome.tools.vo.ReturnVo<Integer> rtep = atdsApi.getHasExptPersonCount(personnel, rightNow.getTime(), new Date());
            if (rtep != null && rtep.getData() != null && rtep.getData() > 0) {
                map.put("attendanceData", "1");
            } else {
                map.put("attendanceData", "0");
            }
            returnVo = new ReturnVo<Map>(ReturnCode.SUCCESS, "获取数据成功", map);
        } catch (Exception e) {
            logger.error("ApiAttendanceController-checkPersonExp" + e);
            e.printStackTrace();
        }
        return returnVo;
    }

}

