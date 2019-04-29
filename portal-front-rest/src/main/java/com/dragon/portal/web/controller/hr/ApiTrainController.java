package com.dragon.portal.web.controller.hr;

import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.vo.ReturnVo;
import com.ys.common.vo.PagerModel;
import com.ys.common.vo.Query;
import com.ys.tools.common.JsonUtils;
import com.ys.train.api.ITrainApi;
import com.ys.train.vo.course_record.CourseDetailVo;
import com.ys.train.vo.student_manager.PersonalYearCourseResultVo;
import io.swagger.models.auth.In;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
@RestController
@RequestMapping("/portal/api/train")
public class ApiTrainController extends BaseController {

    private static Logger logger = Logger.getLogger(ApiTrainController.class);

    @Autowired
    private ITrainApi trainApi;

    /**
     * Fixme: 暂时未曾得知此方法有何作用，后期添加必要注释
     *
     * @param page
     * @param rows
     * @param time
     * @param userNo
     * @param request
     * @param response
     * @return
     */
    @RequestMapping("/queryTrain")
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
