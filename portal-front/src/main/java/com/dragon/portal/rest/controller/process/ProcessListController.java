package com.dragon.portal.rest.controller.process;

import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.constant.FlowConstant;
import com.dragon.flow.enm.flowable.run.ProcessStatusEnum;
import com.dragon.flow.enm.from.ModelAppliedRangeEnum;
import com.dragon.flow.vo.flowable.task.TaskQueryParamsVo;
import com.dragon.flow.vo.flowable.task.TaskVo;
import com.dragon.flow.vo.mongdb.QueryTaskVo;
import com.dragon.flow.vo.mongdb.SearchExecutionVo;
import com.dragon.flow.vo.mongdb.SearchTaskVo;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.ORDERBY;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 流程中心-列表操作
 */
@RestController
@RequestMapping("/rest/process/list")
@Api(value="流程中心-列表操作", description = "流程中心-列表操作", tags={"流程中心-列表操作 /rest/process/list"})
public class ProcessListController extends BaseController {
    private static Logger logger = Logger.getLogger(ProcessListController.class);

    @Autowired
    private IFlowApi flowApi;
    @Autowired
    IPersonnelApi personnelApi;

    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * 查询待办事项未办理
     */
    @GetMapping("/queryTodo")
    @ApiOperation("查询待办事项未办理")
    @ApiImplicitParams({})
    public ReturnVo queryTodo(String sort, String page, Integer rows, String order, Query query, TaskQueryParamsVo param,
                                         @ApiIgnore HttpServletRequest request,
                                         @ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            PagerModel<TaskVo> pm = new PagerModel<TaskVo>();
            renderPageIndex(query, page,rows);

            UserSessionInfo user = getUserSessionInfo(request,response);
            if(user != null && StringUtils.isNotBlank(user.getNo())){
                com.ys.tools.vo.ReturnVo<PersonnelApiVo> pvo = personnelApi.getPersonnelApiVoByNo(user.getNo());
                if(pvo != null && pvo.getCode().toString().equals( PortalConstant.SUCCESS ) && pvo.getData() != null){
                    param.setUserCode(pvo.getData().getNo());
                    ReturnVo<PagerModel<TaskVo>> vo = flowApi.getAppingTasksPagerModel(param,query);
                    if (PortalConstant.SUCCESS.equals(vo.getCode())) {
                        pm = vo.getData();
                        Date date=new Date();
                        for (TaskVo task : pm.getRows()) {
                            if(task.getCreateTime()!=null){
                                long hour = (date.getTime() - task.getCreateTime().getTime())/(60*60*1000);
                                task.setStayHour(String.valueOf(hour));
                            }

                            StringBuffer sbf=new StringBuffer("");
                            if(task.getFinishedTime() != null){
                                long hour = (task.getFinishedTime().getTime()-task.getStartTime().getTime())/(60*60*1000);
                                long minite = (task.getFinishedTime().getTime()-task.getStartTime().getTime()-hour*60*60*1000)/(1000);
                                if(hour != 0){
                                    sbf.append(String.valueOf(hour/24)).append("天").append(String.valueOf(hour%24)).append("小时");
                                }else{
                                    sbf.append(String.valueOf(minite/60)).append("分钟").append(String.valueOf(minite%60)).append("秒");
                                }
                            }else{
                                long hour = (date.getTime()-task.getStartTime().getTime())/(60*60*1000);
                                long minite = (date.getTime()-task.getStartTime().getTime() - hour*60*60*1000)/(1000);
                                if(hour != 0){
                                    sbf.append(String.valueOf(hour/24)).append("天").append(String.valueOf(hour%24)).append("小时");
                                }else{
                                    sbf.append(String.valueOf(minite/60)).append("分钟").append(String.valueOf(minite%60)).append("秒");
                                }
                            }
                            task.setTotalTime(sbf.toString());
                        }
                    }

                }
                Map<String, Object> maps = new HashMap<>();
                maps.put("list", pm.getRows());

                Map<String, Object> pageMap = new HashMap<>();
                pageMap.put("current",query.getPageIndex() - 1);
                pageMap.put("pageSize", query.getPageSize());
                pageMap.put("total", pm.getTotal());
                maps.put("pagination", pageMap);
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询用户系统菜单成功！", maps );
            }else {
                // 用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("ApiProcessController-queryTodo:",e);
        }
        return returnVo;
    }

    /**
     * 查询待办事项未办理数量
     */
    @GetMapping("/queryTodoCount")
    @ApiOperation("查询待办事项未办理数量")
    @ApiImplicitParams({})
    public ReturnVo queryTodoCount(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            UserSessionInfo user=getUserSessionInfo(request,response);
            String userNo = user.getNo();

            TaskQueryParamsVo params=new TaskQueryParamsVo();
            params.setUserCode(userNo);

            Integer count = flowApi.getApprovingCountBySql(params);
            count = null != count ? count : 0;
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", count );
        }catch(Exception e){
            e.printStackTrace();
            logger.error("ApiProcessController-queryTodoCount",e);
        }
        return returnVo;
    }

    /**
     * 查询待办事项已办理
     */
    @GetMapping("/queryAlreadyDo")
    @ApiOperation("查询待办事项未办理")
    @ApiImplicitParams({})
    public ReturnVo queryAlreadyDo(String sort, String page , Integer rows, String order, Query query, QueryTaskVo param,
                                              @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            PagerModel<SearchTaskVo> pm = new PagerModel<SearchTaskVo>();
            renderPageIndex(query,page,rows);

            UserSessionInfo user = getUserSessionInfo(request,response);
            if(user != null && StringUtils.isNotBlank(user.getNo())){
                param.setAssignee(user.getNo());
                if(StringUtils.isBlank(param.getProcessStatus())){
                    param.setProcessStatus(null);
                }
                ReturnVo<PagerModel<SearchTaskVo>> vo = flowApi.getMyCompletedTask(param,query);
                if(vo != null && PortalConstant.SUCCESS.equals(vo.getCode()) && vo.getData() != null
                        && vo.getData().getRows() != null){
                    pm=vo.getData();
                    for (SearchTaskVo task : pm.getRows()) {
                        task.setStartTime(getProcessTime(task.getProcInstStartTime(),task.getProcInstEndTime()));
                    }
                }
                Map<String, Object> maps = new HashMap<>();
                maps.put("list", pm.getRows());

                Map<String, Object> pageMap = new HashMap<>();
                pageMap.put("current",query.getPageIndex()-1);
                pageMap.put("pageSize", query.getPageSize());
                pageMap.put("total", pm.getTotal());
                maps.put("pagination", pageMap);
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", maps );
            }else {
                // 用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }
        } catch (Exception e) {
            logger.error("ApiProcessController-queryAlreadyDo:",e);
        }

        return returnVo;
    }

    /**
     * 获取类型枚举数据
     */
    @GetMapping("/getProcessEnums")
    @ApiOperation("获取类型枚举数据")
    @ApiImplicitParams({})
    public ReturnVo getProcessStatus() {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "获取类型枚举数据失败!");
        try{
            List<Map<String, String>> list = ModelAppliedRangeEnum.getAllinfo();
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "获取类型枚举数据成功！", list );
        }catch(Exception e){
            e.printStackTrace();
            logger.error("ApiProcessController-getProcessEnums",e);
        }

        return returnVo;
    }

    /**
     * 查询我的已发起流程
     */
    @GetMapping("/getAlreadySend")
    @ApiOperation("查询我的已发起流程")
    @ApiImplicitParams({})
    public ReturnVo getAlreadySend(String sort,String page,Integer rows, String order, Query query,
                                   QueryTaskVo param, @ApiIgnore HttpServletRequest request, @ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            PagerModel<SearchExecutionVo> pm = new PagerModel<SearchExecutionVo>();
            renderPageIndex(query, page, rows);

            UserSessionInfo user=getUserSessionInfo(request, response);
            if(user != null && StringUtils.isNotBlank(user.getNo())){
                param.setCreator(user.getNo());
                ReturnVo<PagerModel<SearchExecutionVo>> vo = flowApi.getMySubmitProcessInstance(param, query);
                if(vo != null && FlowConstant.SUCCESS.equals(vo.getCode()) && vo.getData() != null && vo.getData().getRows() != null){
                    pm = vo.getData();
                    for (SearchExecutionVo task : pm.getRows()) {
                        task.setEndTime(getProcessTime(task.getStartTime(),task.getEndTime()));
                        if(StringUtils.isNotBlank(task.getStartTime()) && -1 != task.getStartTime().lastIndexOf(".")){
                            int index = task.getStartTime().lastIndexOf(".");
                            task.setStartTime(task.getStartTime().substring(0, index));
                        }
                        if(StringUtils.isNotBlank(task.getProcessStatus())){
                            task.setStatus( ProcessStatusEnum.getEnumMsgByType(task.getProcessStatus()));
                        }
                    }
                }
                Map<String, Object> maps = new HashMap<>();
                maps.put("list", pm.getRows());

                Map<String, Object> pageMap = new HashMap<>();
                pageMap.put("current", query.getPageIndex()-1);
                pageMap.put("pageSize", query.getPageSize());
                pageMap.put("total", pm.getTotal());
                maps.put("pagination", pageMap);
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", maps );
            }else {
                // 用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("ApiProcessController-getAlreadySend:",e);
        }
        return returnVo;
    }

    /**
     * 封装Query对象
     * @param query
     * @param page
     * @param rows
     */
    private void renderPageIndex(Query query, String page,Integer rows) {
        if(StringUtils.isNotBlank(page)){
            query.setPageIndex(Integer.valueOf(page));
            query.setPageSize(rows);
        }
    }

    /**
     *
     * @param startTimeStr
     * @param endTimeStr
     * @return
     * @throws ParseException
     */
    private String getProcessTime( String startTimeStr,String endTimeStr) throws ParseException {
        Date date=new Date();
        StringBuffer sbf=new StringBuffer("");
        startTimeStr=startTimeStr.substring(0,startTimeStr.length()-2);
        Date startTime=sdf.parse(startTimeStr);
        if(StringUtils.isNotBlank(endTimeStr)){
            endTimeStr=endTimeStr.substring(0,endTimeStr.length()-2);
            Date endTime=sdf.parse(endTimeStr);
            long hour=(endTime.getTime()-startTime.getTime())/(60*60*1000);
            long minite=(endTime.getTime()-startTime.getTime()-hour*60*60*1000)/(1000);
            if(hour!=0){
                sbf.append(String.valueOf(hour/24)).append("天").append(String.valueOf(hour%24)).append("小时");
            }else{
                sbf.append(String.valueOf(minite/60)).append("分钟").append(String.valueOf(minite%60)).append("秒");
            }
        }else{
            long hour=(date.getTime()-startTime.getTime())/(60*60*1000);
            long minite=(date.getTime()-startTime.getTime()-hour*60*60*1000)/(1000);
            if(hour!=0){
                sbf.append(String.valueOf(hour/24)).append("天").append(String.valueOf(hour%24)).append("小时");
            }else{
                sbf.append(String.valueOf(minite/60)).append("分钟").append(String.valueOf(minite%60)).append("秒");
            }
        }
        return sbf.toString();
    }

}

	