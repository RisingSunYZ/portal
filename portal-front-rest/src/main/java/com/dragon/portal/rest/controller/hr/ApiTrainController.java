package com.dragon.portal.rest.controller.hr;

import com.dragon.portal.rest.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.common.vo.PagerModel;
import com.ys.common.vo.Query;
import com.ys.train.api.ITrainApi;
import com.ys.train.vo.course_record.CourseDetailVo;
import com.ys.train.vo.student_manager.PersonalYearCourseResultVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @Description: 培训相关
 * @Author: liuxuan
 * @Since:16:47 2019/04/28
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
@Controller
@RequestMapping("/rest/portal/train")
@Api(value = "培训相关", description = "培训相关", tags={"培训 /rest/portal/train"})
public class ApiTrainController extends BaseController {

    private static Logger logger = Logger.getLogger(ApiTrainController.class);

    @Autowired
    private ITrainApi trainApi;

    /**
     *培训数据对接
     *
     * @param page
     * @param rows
     * @param time
     * @param userNo
     * @param request
     * @param response
     * @return
     */
    @ResponseBody
    @GetMapping("/queryTrain")
    @ApiOperation("HR频道培训 >> 培训数据对接")
    private ReturnVo<Map> queryTrain(Integer page, Integer rows, String time, String userNo,
                                     HttpServletRequest request, HttpServletResponse response) {
        ReturnVo<Map> returnVo = new ReturnVo<>(ReturnCode.FAIL, "获取数据失败");
        PagerModel<CourseDetailVo> pm = new PagerModel<>();
        try {
            if (StringUtils.isBlank(userNo)) {
                userNo = getUserSessionInfo(request, response).getNo();
            } else {
                userNo = new String(Base64.getDecoder().decode(userNo));
            }
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
            Query query = new Query();
            Integer pageIndex = (null != page) ? (page - 1) : 0;
            Integer pageSize = (null != rows) ? rows : 5;
            query.setPageIndex(pageIndex);
            query.setPageSize(pageSize);
            if (StringUtils.isNotBlank(userNo)) {
                PersonalYearCourseResultVo personalYearCourseResultVo = new PersonalYearCourseResultVo();
                personalYearCourseResultVo.setEmployCode(userNo);
                if (StringUtils.isNotBlank(time)) {
                    personalYearCourseResultVo.setCurrentYear(time);
                } else {
                    personalYearCourseResultVo.setCurrentYear(sdf.format(new Date()));
                }
                com.ys.common.vo.ReturnVo<PagerModel<CourseDetailVo>> vo = trainApi.getTrainDetail(personalYearCourseResultVo, query);
                if (vo != null && vo.getCode().equals("1") && null != vo.getData()) {
                    pm = vo.getData();
                }
            }
        } catch (Exception e) {
            logger.error("ITrainApi-queryTrainy异常:" + e);
        }
        Map<String, Object> maps = new HashMap<>();
        maps.put("list", pm.getData());
        Map<String, Object> pageMap = new HashMap<>();
        pageMap.put("current", page);
        pageMap.put("pageSize", rows);
        pageMap.put("total", pm.getTotal());
        maps.put("pagination", pageMap);
        returnVo = new ReturnVo<>(ReturnCode.SUCCESS, "获取数据成功", maps);
        return returnVo;
    }

}
