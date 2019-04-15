package com.dragon.portal.rest.controller.process;

import com.dragon.flow.api.ICusFlowApi;
import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.constant.FlowConstant;
import com.dragon.flow.enm.flowable.run.ProcessStatusEnum;
import com.dragon.flow.enm.from.FormDefultFieldEnum;
import com.dragon.flow.enm.from.FormDraftStatusEnum;
import com.dragon.flow.enm.from.ModelAppliedRangeEnum;
import com.dragon.flow.model.basedata.DicItem;
import com.dragon.flow.model.basedata.FlowCategory;
import com.dragon.flow.model.form.FormDraft;
import com.dragon.flow.model.form.FormItem;
import com.dragon.flow.model.org.UserVo;
import com.dragon.flow.vo.flowable.task.TaskQueryParamsVo;
import com.dragon.flow.vo.flowable.task.TaskVo;
import com.dragon.flow.vo.model.ModelVo;
import com.dragon.flow.vo.mongdb.QueryTaskVo;
import com.dragon.flow.vo.mongdb.SearchExecutionVo;
import com.dragon.flow.vo.mongdb.SearchTaskVo;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.rest.controller.BaseController;
import com.dragon.portal.vo.process.WfCategoryTree;
import com.dragon.portal.vo.user.UserSessionInfo;
import com.dragon.tools.common.ReturnCode;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.dragon.tools.vo.ReturnVo;
import com.dragon.tools.vo.SimpleReturnVo;
import com.ys.tools.common.JsonUtils;
import com.ys.ucenter.api.IAreaApi;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.common.Area;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import io.swagger.annotations.*;
import jdk.nashorn.internal.ir.annotations.Ignore;
import net.sf.json.JSONArray;
import net.sf.json.JsonConfig;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 流程中心-列表操作
 */
@RestController
@RequestMapping("/rest/process/list")
@Api(value="流程中心-列表操作", tags={"流程中心-列表操作 /rest/process/list"})
public class ProcessListController extends BaseController {
    private static Logger logger = Logger.getLogger(ProcessListController.class);

    @Autowired
    private IFlowApi flowApi;
    @Autowired
    private ICusFlowApi cusFlowApi;
    @Autowired
    IPersonnelApi personnelApi;
    @Autowired
    IOrgApi orgApi;
    @Autowired
    IAreaApi areaApi;
    private static SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    /**
     * 格式化时间为XX天XX小时 301天1小时
     * @param finishedTime
     * @param startTime
     * @return
     */
    private String formatTotalTime(Date finishedTime, Date startTime){
        StringBuffer sbf = new StringBuffer();
        Date date = finishedTime != null?finishedTime:new Date();

        long hour = (date.getTime()-startTime.getTime())/(60*60*1000);
        long minite = (date.getTime()-startTime.getTime() - hour*60*60*1000)/(1000);
        if(hour != 0){
            sbf.append(String.valueOf(hour/24)).append("天").append(String.valueOf(hour%24)).append("小时");
        }else{
            sbf.append(String.valueOf(minite/60)).append("分钟").append(String.valueOf(minite%60)).append("秒");
        }
        return sbf.toString();
    }

    /**
     * 查询待办事项未办理
     */
    @GetMapping("/queryTodo")
    @ApiOperation("查询待办事项未办理")
    @ApiImplicitParams({})
    public ReturnVo queryTodo(String page, Integer rows, Query query, TaskQueryParamsVo param,
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
                            String sbf = formatTotalTime(task.getFinishedTime(), task.getStartTime());
                            task.setTotalTime(sbf);
                        }
                    }
                }
                Map<String, Object> maps = genPager(pm, query);
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
                Map<String, Object> maps = genPager(pm, query);
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
                Map<String, Object> maps = genPager(pm, query);
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
     * 获取草稿数量
     * @param formDraft
     * @param query
     * @param request
     * @param response
     * @return
     */
    @GetMapping("/ajaxListMyDraftCount")
    @ApiOperation("获取草稿数量")
    public ReturnVo ajaxListMyDraftCount(@ApiIgnore FormDraft formDraft,@ApiIgnore Query query, @ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        try {
            UserSessionInfo user=getUserSessionInfo(request,response);
            if (null != user){
                formDraft.setCreator(user.getNo());
                formDraft.setStatus( FormDraftStatusEnum.CG.getStatus());
                ReturnVo<PagerModel<FormDraft>> vo = flowApi.getFormDraftPagerModel(formDraft,query);
                if (null != vo && FlowConstant.SUCCESS.equals(vo.getCode()) &&null != vo.getData()){
                    returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询草稿数量成功！", vo.getData().getTotal() );
                }else{
                    returnVo = new ReturnVo( ReturnCode.FAIL, "查询草稿数量失败！");
                }
            }else {
                // 用户未登录
                returnVo = new ReturnVo( ReturnCode.FAIL, "用户未登录！" );
            }
        }catch(Exception e){
            e.printStackTrace();
            logger.error("ProcessListController-ajaxListMyDraftCount-查询草稿数量失败",e);
        }
        return returnVo;
    }

    /**
     * 删除草稿
     * @param map
     * @param request
     * @param response
     * @return
     */
    @ApiOperation("删除草稿")
    @RequestMapping(value = "/delDraft",method = RequestMethod.POST)
    public ReturnVo<Map<String, Object>> delDraft( @RequestBody @ApiParam(value = "流程参数对象") Map<String,String> map, HttpServletRequest request, HttpServletResponse response) {
        ReturnVo<Map<String, Object>> returnVo = new ReturnVo<Map<String, Object>>(FlowConstant.ERROR, "删除失败");
        try {
            if(map.containsKey("businessKey")){
                ReturnVo<String> vo=flowApi.updateFormDraftStatus(map.get("businessKey"), FormDraftStatusEnum.SC.getStatus());
                if(FlowConstant.SUCCESS.equals(vo.getCode())){
                    Query query=new Query();
                    query.setPageSize(PortalConstant.MAX_PAGE_SIZE);
                    Map<String, Object> maps = getMyDraft(query,null,null, new FormDraft(), request, response);
                    returnVo = new ReturnVo<Map<String, Object>>(FlowConstant.SUCCESS, "删除成功");
                    returnVo.setData(maps);
                }
            }

        } catch (Exception e) {
            logger.error("ApplyController-delDraft:"+e);
            e.printStackTrace();
        }
        return returnVo;
    }

    /**
     * 表单模板目录
     * @param modelVo
     * @param name
     * @param rows
     * @param query
     * @param page
     * @param request
     * @param response
     * @return
     */
    @ApiOperation("表单模板列表")
    @GetMapping("/ajaxListModel")
    @ApiImplicitParams({
            @ApiImplicitParam(value="类别Id",name="categoryId",dataType = "String",paramType = "query")
    })
    public String ajaxListModel(ModelVo modelVo,@ApiIgnore String name,@ApiIgnore Integer rows,@ApiIgnore Query query,@ApiIgnore String page,@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
        PagerModel<ModelVo> pm=new PagerModel<>();
        modelVo.setModelName(name);
        query.setPageSize(PortalConstant.MAX_PAGE_SIZE);
        try {
            if("myDraft".equals(modelVo.getCategoryId())){
                FormDraft formDraft=new FormDraft();
                formDraft.setName(modelVo.getModelName());
                Map<String, Object> maps = getMyDraft(query, page,rows,formDraft, request, response);
                return JsonUtils.toJson(maps.get("list"));
            }else{
                ReturnVo<PagerModel<ModelVo>> vo=flowApi.getModelByCategory(modelVo,query);
                if(vo!=null && FlowConstant.SUCCESS.equals(vo.getCode()) && vo.getData()!=null ){
                    pm=vo.getData();
                    pm.setRows(pm.getData());
                }
            }
        } catch (Exception e) {
            logger.error("ProcessListController-ajaxListModel:-获取表单模板列表失败",e);
        }

        return JsonUtils.toJson(pm.getRows());
    }

    /**
     * 获取表单模板目录
     * @param wfCategoryVo
     * @return
     */
    @GetMapping("/ajaxListWfCategory")
    @ApiOperation("获取表单模板目录")
    public ReturnVo ajaxListWfCategory(@ApiIgnore FlowCategory wfCategoryVo) {
        ReturnVo returnVo = new ReturnVo(ReturnCode.FAIL, "查询失败!");
        List<WfCategoryTree> wfCategoryTrees=new ArrayList<>();
        try {
            ReturnVo<List<FlowCategory>> vo=flowApi.getWfCategoryVoAll(wfCategoryVo);
            if(null != vo && FlowConstant.SUCCESS.equals(vo.getCode()) && CollectionUtils.isNotEmpty(vo.getData())){
                List<FlowCategory> list=vo.getData();
                WfCategoryTree wfCategoryTree = new WfCategoryTree("myDraft","我的草稿","","my_draft");
                wfCategoryTrees.add(wfCategoryTree);
                for(FlowCategory vo2 : list){
                    if(StringUtils.isBlank(vo2.getPid())){
                        WfCategoryTree wfCategoryTree2 = new WfCategoryTree(vo2.getId(),vo2.getName(),vo2.getPid(),vo2.getCode());
                        getChildren(vo2.getId(),wfCategoryTree2);
                        wfCategoryTrees.add(wfCategoryTree2);
                    }
                }
                returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功!",wfCategoryTrees);
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("ProcessListController-ajaxListWfCategory-查询表单模板目录失败",e);
        }
        return returnVo;
    }

    /**
     * 递归方法
     * @param pid
     * @param parent
     */
    private void getChildren(String pid,WfCategoryTree parent){
        FlowCategory wfCategory = new FlowCategory();
        wfCategory.setPid(pid);
        try{
            ReturnVo<List<FlowCategory>> returnVo = flowApi.getWfCategoryVoAll(wfCategory);
            if(returnVo!=null&&returnVo.getData()!=null&&FlowConstant.SUCCESS.equals(returnVo.getCode())){
                List<WfCategoryTree> list = new ArrayList<WfCategoryTree>();
                if(returnVo.getData().size()>0){
                    for(FlowCategory vo : returnVo.getData()){
                        WfCategoryTree wfCategoryTree = new WfCategoryTree(vo.getId(),vo.getName(),vo.getPid(),vo.getCode());
                        getChildren(vo.getId(),wfCategoryTree);
                        list.add(wfCategoryTree);
                    }
                    parent.setChildren(list);
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            logger.error("ProcessListController-getChildren-查询表单模板目录子节点失败",e);
        }

    }

    /**
     * 获取我的草稿
     * @param query
     * @param page
     * @param rows
     * @param formDraft
     * @param request
     * @param response
     * @return
     */
    private Map<String, Object> getMyDraft(Query query,String page,Integer rows, FormDraft formDraft, HttpServletRequest request, HttpServletResponse response) {
        UserSessionInfo user=getUserSessionInfo(request,response);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 HH:mm:ss");
        renderPageIndex(query, page,rows);
        PagerModel<FormDraft> pm=new PagerModel<FormDraft>();
        if(user!=null && StringUtils.isNotBlank(user.getNo())){
            formDraft.setCreator(user.getNo());
            formDraft.setStatus(FormDraftStatusEnum.CG.getStatus());
            try {
                ReturnVo<PagerModel<FormDraft>> vo = flowApi.getFormDraftPagerModel(formDraft,query);
                if(vo!=null && FlowConstant.SUCCESS.equals(vo.getCode()) && vo.getData()!=null){
                    pm = vo.getData();
                    pm.getRows().forEach(draft -> {
                        if(draft.getStatus()!=null){
                            for(FormDraftStatusEnum e : FormDraftStatusEnum.values()){
                                if(e.getStatus().equals(draft.getStatus())){
                                    draft.setStatusName(e.getName());
                                }
                            }
                        }
                        if(draft.getCreateTime()!=null){
                            draft.setCreateTimeStr(sdf.format(draft.getCreateTime()));
                        }
                    });
                }
            } catch (Exception e) {
                e.printStackTrace();
                logger.error("获取草稿数据异常！" +  e);
            }
        }
        return genPager(pm, query);
    }

    /**
     * 组装前端分页器
     * @param pm
     * @param query
     * @return
     */
    public Map genPager(PagerModel pm, Query query){
        Map<String, Object> maps = new HashMap<>();
        maps.put("list", pm.getRows());
        Map<String, Object> pageMap = new HashMap<>();
        pageMap.put("current", query.getPageIndex()-1);
        pageMap.put("pageSize", query.getPageSize());
        pageMap.put("total", pm.getTotal());
        maps.put("pagination", pageMap);
        return maps;
    }


    /**
     * 查询是否有表单查询权限
     * @param request
     * @param response
     * @return
     */
    @ApiOperation("查询是否有表单查询权限")
    @GetMapping("/hasPermission")
    public ReturnVo hasPermission(@ApiIgnore HttpServletRequest request,@ApiIgnore HttpServletResponse response) {
        UserSessionInfo user=this.getUserSessionInfo(request, response);
        ReturnVo vo = new ReturnVo(ReturnCode.FAIL, "查询是否有表单查询权限异常");
        try {
            if(null != user){
                vo = flowApi.hasAuthorization(user.getNo());
                if(FlowConstant.SUCCESS.equals(vo.getCode())){
                    vo = new ReturnVo(ReturnCode.SUCCESS, "查询是否有表单查询权限成功",vo.getData());
                }else{
                    logger.error(vo.getMsg());
                }
            }
        } catch (Exception e) {
            logger.error("ProcessListController-hasPermission查询是否有表单查询权限异常:"+e);
            e.printStackTrace();
        }
        return vo;
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
     * @param startTimeStr
     * @param endTimeStr
     * @return
     * @throws ParseException
     */
    private String getProcessTime( String startTimeStr, String endTimeStr) throws ParseException {
        startTimeStr=startTimeStr.substring(0,startTimeStr.length()-2);
        Date startTime=sdf.parse(startTimeStr);
        Date endTime = StringUtils.isNotBlank(endTimeStr)?sdf.parse(endTimeStr.substring(0,endTimeStr.length()-2)):null;
        return formatTotalTime(endTime, startTime);
    }

    /**
     *
     * @param request
     * @return
     * @Description:表单查询模板目录
     */
    @ApiOperation("表单查询右侧模板目录树")
    @ApiImplicitParams({
            @ApiImplicitParam(value="关键字",name="keyword",dataType = "String",paramType = "query")
    })
    @RequestMapping(value="/getWfCategoryByUser",method = RequestMethod.GET)
    public ReturnVo getWfCategoryByUser(String keyword, @Ignore HttpServletRequest request, @Ignore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        //增加一个树结构的list
        List<WfCategoryTree> listTree = new ArrayList<WfCategoryTree>();
        UserSessionInfo user=this.getUserSessionInfo(request, response);
        try {
            if(user!=null && StringUtils.isNotBlank(user.getNo())){
                ReturnVo<LinkedHashSet<FlowCategory>> vo=flowApi.getProcessListByUser(user.getNo(), keyword);
                if(vo!=null && FlowConstant.SUCCESS.equals(vo.getCode()) && CollectionUtils.isNotEmpty(vo.getData())){
                    List<FlowCategory> list = new ArrayList<FlowCategory>(vo.getData());
                    //查找出pid为空的数据
                    list.forEach(item->{
                        if(StringUtils.isBlank(item.getPid())){
                            //将数据封装成树结构的数据
                            WfCategoryTree wfCategoryTree = new WfCategoryTree(item.getId(),item.getName(),item.getPid(),item.getCode());
                            //用递归方法查找出下级，下下级的数据
                            getTreeChildren(item.getId(),wfCategoryTree, list);
                            //加入到树结构的list中
                            listTree.add(wfCategoryTree);
                        }
                    });
                }
            }
            returnVo=new ReturnVo(ReturnCode.SUCCESS,"查询成功",listTree);
        } catch (Exception e) {
            logger.error("ApiProcessController-getWfCategoryByUser:",e);
        }
        return returnVo;
    }

    //递归方法
    @ApiIgnore
    private void getTreeChildren(String pid,WfCategoryTree parent,List<FlowCategory> wfCategoryVoList){
        //创建子类的树结构list
        List<WfCategoryTree> list = new ArrayList<WfCategoryTree>();
        if(CollectionUtils.isNotEmpty(wfCategoryVoList)){
            //循环总的list(这样省略了查询数据库)
            wfCategoryVoList.forEach(vo->{});
            wfCategoryVoList.forEach(vo->{
                if(pid.equals(vo.getPid())){
                    WfCategoryTree wfCategoryTree = new WfCategoryTree(vo.getId(),vo.getName(),vo.getPid(),vo.getCode());
                    getTreeChildren(vo.getId(),wfCategoryTree,wfCategoryVoList);
                    list.add(wfCategoryTree);
                }
            });
            parent.setChildren(list);
        }
    }

    /**
     * @param request
     * @return
     * @Description:表单查询结果
     */
    @ApiOperation("表单查询结果")
    @ApiImplicitParams({
            @ApiImplicitParam(value="页数",name="page",dataType = "String", paramType = "query"),
            @ApiImplicitParam(value="每页几行",name="rows",dataType = "Integer", paramType = "query")
    })
    @RequestMapping(value = "/getFormDataList" ,method = RequestMethod.GET)
    public ReturnVo getFormDataList(QueryTaskVo param, String page,Integer rows,@Ignore HttpServletRequest request,@Ignore HttpServletResponse response) {
        ReturnVo returnVo = new ReturnVo( ReturnCode.FAIL, "查询失败!");
        PagerModel<Map<String, Object>> pm=new PagerModel<Map<String,Object>>();
        Query query=new Query();
        UserSessionInfo user=this.getUserSessionInfo(request, response);
        Set<String> userNos=new HashSet<String>();
        Set<String> deptIds=new HashSet<String>();
        String deptField= FormDefultFieldEnum.FQBM.getFieldName();
        String companyField= FormDefultFieldEnum.FQDW.getFieldName();
        String userField= FormDefultFieldEnum.FQR.getFieldName();
        renderPageIndex(query, page,rows);
        try {
            if(user!=null && StringUtils.isNotBlank(user.getNo())){
                ReturnVo<PagerModel<Map<String, Object>>> vo= flowApi.getSearchDesProcessBase(param,query);
                if(vo!=null && FlowConstant.SUCCESS.equals(vo.getCode()) && vo.getData()!=null ){
                    pm=vo.getData();
                    for (Map<String,Object> item : pm.getData()) {
                        Iterator<String> it=item.keySet().iterator();
                        //遍历map里面的每一个字段
                        String value=(String)item.get(deptField);
                        if(StringUtils.isNotBlank(value)){
                            deptIds.add(value);
                        }
                        String value2=(String)item.get(userField);
                        if(StringUtils.isNotBlank(value2)){
                            userNos.add(value2);
                        }
                    }
                    Map<String, com.dragon.flow.model.org.Department> deptMap=this.getDeptVoMapByNos(new ArrayList<String>(deptIds));
                    Map<String, com.dragon.flow.model.org.Company> comMap=this.getComVoMapByNos();
                    Map<String, UserVo> userMap=this.getPersonnelVoMapByNos(new ArrayList<String>(userNos));
                    for (Map<String,Object> item : pm.getData()) {
                        //翻译自定义表单的人员选择器
                        String userNo=(String)item.get(userField);
                        if(StringUtils.isNotBlank(userNo)){
                            item.put("sponsor",userMap.get(userNo).getUserName());
                        }
                        //翻译自定义表单的部门选择器
                        String deptId=(String)item.get(deptField);
                        if(StringUtils.isNotBlank(deptId)){
                            item.put("launch_department",deptMap.get(deptId).getName());
                        }
                        //翻译自定义表单的公司选择器
                        String comId=(String)item.get(companyField);
                        if(StringUtils.isNotBlank(comId)){
                            item.put("launch_company",comMap.get(comId).getCname());
                        }
                    }
                    pm.setRows(pm.getData());
                }
            }

            Map<String, Object> maps = genPager(pm, query);
            returnVo = new ReturnVo( ReturnCode.SUCCESS, "查询成功！", maps );
        } catch (Exception e) {
            logger.error("MyApplyController-getFormDesList:",e);
        }
        return returnVo;
    }

    /**
     * 导出流程模板
     * @param modelVo
     * @param request
     * @param response
     * @return
     */
    @GetMapping("/exportProcessModel")
    @ApiOperation("导出流程模板")
    public String exportProcessModel(ModelVo modelVo,HttpServletRequest request, HttpServletResponse response){
        SimpleReturnVo returnVo = new SimpleReturnVo(ReturnCode.FAIL, "导出失败");
        List<ModelVo> list=new ArrayList<>();
        UserSessionInfo user=getUserSessionInfo(request,response);
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        try {
            if (null != user && StringUtils.isNotBlank(user.getNo())) {
                ReturnVo<List<ModelVo>> vo = flowApi.exportProcessModelInfoByQuery(modelVo);
                if(CollectionUtils.isNotEmpty(vo.getData())){
                    list=vo.getData();
                }
                if(CollectionUtils.isNotEmpty(list)){
                    // 声明一个工作薄
                    HSSFWorkbook workbook=new HSSFWorkbook();
                    // 生成一个表格
                    HSSFSheet sheet=workbook.createSheet("导出流程模板列表");
                    //字体样式一用于设置表头
                    HSSFCellStyle style=workbook.createCellStyle();
                    // 设置这些样式
                    style.setFillForegroundColor(HSSFColor.BLACK.index);
                    style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
                    style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                    style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                    style.setBorderRight(HSSFCellStyle.BORDER_THIN);
                    style.setBorderTop(HSSFCellStyle.BORDER_THIN);
                    style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                    style.setVerticalAlignment(HSSFCellStyle.ALIGN_CENTER);
                    style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
                    // 生成一个字体
                    HSSFFont font = workbook.createFont();
                    font.setColor(HSSFColor.WHITE.index);
                    font.setFontHeightInPoints((short) 8);
                    font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
                    font.setFontName("微软雅黑");
                    // 把字体应用到当前的样式
                    style.setFont(font);
                    // 生成并设置另一个样式
                    HSSFCellStyle style2 = workbook.createCellStyle();
                    style2.setFillForegroundColor(HSSFColor.WHITE.index);
                    style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
                    style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                    style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                    style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
                    style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
                    style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                    style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
                    // 生成另一个字体
                    HSSFFont font2 = workbook.createFont();
                    font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
                    // 把字体应用到当前的样式
                    style2.setFont(font2);
                    String[] titles=new String[]{"所属系统","应用范围","流程目录","流程模板名称","流程模板所属单位","流程模板归属部门","流程owner","流程BP"};

                    for (int i=0;i<titles.length;i++){
                        sheet.setDefaultColumnStyle(i,style2);
                        sheet.setColumnWidth(i,6000);
                    }
                    // 生成表头样式
                    HSSFCellStyle style0 = workbook.createCellStyle();
                    style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
                    style0.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 居中
                    style0.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
                    style0.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
                    style0.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
                    style0.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
                    // 生成表头字体
                    HSSFFont font0 = workbook.createFont();
                    font0.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
                    font0.setFontName("黑体");
                    font0.setFontHeightInPoints((short) 14);// 设置字体大小
                    // 把字体应用到当前的样式
                    style0.setFont(font0);
                    //第一行
                    HSSFRow row0= sheet.createRow(0);
                    row0.setHeight((short)500);
                    HSSFCell cell0 = row0.createCell(0);
                    cell0.setCellValue("流程清单");
                    //合并单元格CellRangeAddress构造参数依次表示起始行，截至行，起始列， 截至列
                    sheet.addMergedRegion(new CellRangeAddress(0,0,0,titles.length-1));//合并单元格
                    cell0.setCellStyle(style0);
                    //第二行
                    HSSFRow row1= sheet.createRow(1);
                    row1.setHeight((short)500);
                    HSSFCell cell1 = row1.createCell(0);
                    cell1.setCellValue("导出人:"+user.getName()+"   "+"导出时间:"+sdf.format(new Date()));
                    //合并单元格CellRangeAddress构造参数依次表示起始行，截至行，起始列， 截至列
                    sheet.addMergedRegion(new CellRangeAddress(1,1,0,titles.length-1));//合并单元格
                    cell1.setCellStyle(style2);
                    //第三行
                    HSSFRow row= sheet.createRow(2);
                    row.setHeight((short)600);
                    for (int i = 0; i < titles.length; i++) {
                        HSSFCell cell = row.createCell(i);
                        cell.setCellStyle(style);
                        HSSFRichTextString text = new HSSFRichTextString(titles[i]);
                        cell.setCellValue(text);
                    }
                    for (int i=0;i<list.size();i++) {
                        ModelVo rowVo=list.get(i);
                        row=sheet.createRow(i+3);
                        row.setHeight((short)500);
                        for(int j=0;j<titles.length;j++){
                            HSSFCell cell = row.createCell(j);
                            cell.setCellStyle(style2);
                            switch (j) {
                                case 0:
                                    cell.setCellValue(rowVo.getSystemName());
                                    break;
                                case 1:
                                    cell.setCellValue(rowVo.getAppliedRangeName());
                                    break;
                                case 2:
                                    cell.setCellValue(rowVo.getBelongCategoryStr());
                                    break;
                                case 3:
                                    cell.setCellValue(rowVo.getModelName());
                                    break;
                                case 4:
                                    cell.setCellValue(rowVo.getOwnCompanyName());
                                    break;
                                case 5:
                                    cell.setCellValue(rowVo.getOwnDeptName());
                                    break;
                                case 6:
                                    cell.setCellValue(rowVo.getFlowOwnerName());
                                    break;
                                case 7:
                                    cell.setCellValue(rowVo.getProcessDockingName());
                                    break;
                            }
                        }
                    }
                    returnVo = new SimpleReturnVo(ReturnCode.SUCCESS, "导出成功");
                    String fileName=new String(sheet.getSheetName().getBytes("UTF-8"),"ISO-8859-1");
                    try {
                        response.setContentType("application/vnd.ms-excel");
                        response.setHeader("Content-disposition", "attachment;filename="+fileName+".xls");
                        OutputStream ouputStream = response.getOutputStream();
                        workbook.write(ouputStream);
                        ouputStream.flush();
                        ouputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }else{
                    returnVo = new SimpleReturnVo(ReturnCode.FAIL, "导出列表为空!");
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("导出流程模板", e);
        }
        return JsonUtils.toJson(returnVo);
    }

    /**
     * 导出表单查询结果
     * @param param
     * @param formName
     * @param response
     * @param request
     * @return
     */
    @GetMapping("/export2Excel")
    @ApiOperation("根据条件导出表单查询结果")
    public String export2Excel(QueryTaskVo param, String formName, HttpServletResponse response, HttpServletRequest request){
        SimpleReturnVo returnVo = new SimpleReturnVo(ReturnCode.FAIL, "导出失败");
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat sdftime=new SimpleDateFormat("yyyy-MM-dd hh:MM:ss");
        PagerModel<Map<String, Object>> pm=new PagerModel<Map<String,Object>>();
        UserSessionInfo user=this.getUserSessionInfo(request, response);
        List<String> userNos=new ArrayList<String>();
        List<String> deptIds=new ArrayList<String>();
        List<String> userFields=new ArrayList<String>();//人员选择器的字段列表
        List<String> deptFields=new ArrayList<String>();//部门选择器的字段列表
        List<String> companyFields=new ArrayList<String>();//公司选择器的字段列表
        List<String> fileFields=new ArrayList<String>();//上传文件字段的名称列表
        List<String> areaFields=new ArrayList<String>();//地址的字段列表
        Map<String,String> areaMap=this.getAreaMap();//地区字典项
        Map<String,List<Map<String, String>>> dicMap=new HashMap<String, List<Map<String,String>>>();
        String[] fieldArr=new String[]{"code","process_type"};
        String[] titles=new String[]{"流程实例编号","流程状态"};
        Query query=new Query();
        query.setPageSize(10000);
        try {
            if(user!=null && org.apache.commons.lang.StringUtils.isNotBlank(user.getNo())) {
                ReturnVo<PagerModel<Map<String, Object>>> vo = flowApi.ExportSearchFormDesList(param, query);
                if (vo != null && FlowConstant.SUCCESS.equals(vo.getCode()) && vo.getData() != null) {
                    ReturnVo<List<FormItem>> vo2 = cusFlowApi.getFormItemByCode(param.getProcessDefinitionKey());
                    if (vo != null && CollectionUtils.isNotEmpty(vo2.getData())) {
                        List<FormItem> list = vo2.getData();
                        for (FormItem formItem : list) {
                            //将自定义表单字段根据控件进行分类
                            switch (formItem.getType()) {
                                case "user":
                                    userFields.add(formItem.getFieldName());
                                    break;
                                case "dept":
                                    deptFields.add(formItem.getFieldName());
                                    break;
                                case "company":
                                    companyFields.add(formItem.getFieldName());
                                    break;
                                case "upload":
                                    fileFields.add(formItem.getFieldName());
                                    break;
                                case "deptgroup":
                                    //公司部门多选同用同一个控件
                                    deptFields.add(formItem.getFieldName());
                                    companyFields.add(formItem.getFieldName());
                                    break;
                                case "usergroup":
                                    userFields.add(formItem.getFieldName());
                                    break;
                                case "address":
                                    areaFields.add(formItem.getFieldName());
                                    break;
                                default:
                                    break;
                            }
                            titles = ArrayUtils.add(titles, formItem.getLabelName());
                            fieldArr = ArrayUtils.add(fieldArr, formItem.getFieldName());
                        }
                        dicMap = getDictMap(list);//获取所有自定义表单字典，用于翻译
                    }
                    pm = vo.getData();
                    for (Map<String, Object> item : pm.getData()) {
                        Iterator<String> it = item.keySet().iterator();
                        while (it.hasNext()) {
                            String key = it.next();
                            //翻译字典项-s
                            if (dicMap.keySet().contains(key)) {
                                List<Map<String, String>> dict = dicMap.get(key);
                                if (org.apache.commons.lang.StringUtils.isNotBlank((String) item.get(key))) {
                                    StringBuffer itemTexts = new StringBuffer("");
                                    List<String> itemCodeList = Arrays.asList(((String) item.get(key)).split("\\$#"));
                                    if (itemCodeList.size() > 1) {
                                        //长度大于说明是多行子表单进行1，2，3编号
                                        for (int i = 0; i < itemCodeList.size(); i++) {
                                            List<String> itemCodes = Arrays.asList((itemCodeList.get(i)).split(","));//多选情况下，需要先按,切割在进行翻译
                                            StringBuffer itemTextsInner = new StringBuffer("");
                                            for (Map<String, String> map : dict) {
                                                for (String code : itemCodes) {
                                                    if (code.equals(map.get("code"))) {
                                                        itemTextsInner.append(map.get("text")).append(",");
                                                    }
                                                }
                                            }
                                            if (itemTextsInner.length() > 1) {
                                                itemTexts.append(i + 1).append("、");
                                                itemTextsInner.deleteCharAt(itemTextsInner.length() - 1);
                                                itemTexts.append(itemTextsInner).append(" ");
                                            }
                                        }
                                        if (itemTexts.length() > 0) {
                                            item.put(key, itemTexts.toString());
                                        }
                                    } else {
                                        List<String> itemCodes = Arrays.asList(itemCodeList.get(0).split(","));//多选情况下，需要先按,切割在进行翻译
                                        for (Map<String, String> map : dict) {
                                            for (String code : itemCodes) {
                                                if (code.equals(map.get("code"))) {
                                                    itemTexts.append(map.get("text")).append(",");
                                                }
                                            }
                                        }
                                        if (itemTexts.length() > 0) {
                                            item.put(key, itemTexts.deleteCharAt(itemTexts.length() - 1).toString());
                                        }
                                    }
                                }
                                //翻译字典项-e
                                //筛选人员，部门，公司进行翻译
                            } else if (userFields.contains(key)) {
                                String value = (String) item.get(key);
                                if (org.apache.commons.lang.StringUtils.isNotBlank(value)) {
                                    //如果是多行子表单进行1，2，3编号
                                    List<String> itemCodeList = Arrays.asList(((String) item.get(key)).split("\\$#"));
                                    if (itemCodeList.size() > 0) {
                                        for (int i = 0; i < itemCodeList.size(); i++) {
                                            if (org.apache.commons.lang.StringUtils.isNotBlank(itemCodeList.get(i))) {
                                                List<String> userNoItems = Arrays.asList((itemCodeList.get(i)).split(","));
                                                for (String no : userNoItems) {
                                                    userNos.add(no);
                                                }
                                            }
                                        }
                                    }
                                }
                            } else if (deptFields.contains(key)) {
                                String value = (String) item.get(key);
                                if (org.apache.commons.lang.StringUtils.isNotBlank(value)) {
                                    //如果是多行子表单进行1，2，3编号
                                    List<String> itemCodeList = Arrays.asList(((String) item.get(key)).split("\\$#"));
                                    if (itemCodeList.size() > 0) {
                                        for (int i = 0; i < itemCodeList.size(); i++) {
                                            if (org.apache.commons.lang.StringUtils.isNotBlank(itemCodeList.get(i))) {
                                                List<String> deptItems = Arrays.asList((itemCodeList.get(i)).split(","));
                                                for (String id : deptItems) {
                                                    deptIds.add(id);
                                                }
                                            }
                                        }
                                    }
                                }
                                //翻译地址
                            } else if (areaFields.contains(key)) {
                                String value = (String) item.get(key);
                                if (org.apache.commons.lang.StringUtils.isNotBlank(value)) {
                                    //如果是多行子表单进行1，2，3编号
                                    List<String> itemCodeList = Arrays.asList(((String) item.get(key)).split("\\$#"));
                                    if (itemCodeList.size() > 1) {
                                        StringBuffer bf = new StringBuffer("");
                                        for (int i = 0; i < itemCodeList.size(); i++) {
                                            List<String> areaItems = Arrays.asList((itemCodeList.get(i)).split(","));
                                            StringBuffer bf2 = new StringBuffer("");
                                            if (areaItems.size() > 1) {
                                                for (int j = 0; j < areaItems.size() - 1; j++) {
                                                    bf2.append(areaMap.get(areaItems.get(j))).append(",");
                                                }
                                                bf2.append(areaItems.get(areaItems.size() - 1));
                                                if (bf2.length() > 0) {
                                                    bf.append(i + 1).append("、").append(bf2).append(" ");
                                                }
                                            }
                                        }
                                        item.put(key, bf.toString());
                                    } else {
                                        List<String> areaItems = Arrays.asList((value).split(","));
                                        if (areaItems.size() > 1) {
                                            StringBuffer bf = new StringBuffer("");
                                            for (int i = 0; i < areaItems.size() - 1; i++) {
                                                bf.append(areaMap.get(areaItems.get(i))).append(",");
                                            }
                                            bf.append(areaItems.get(areaItems.size() - 1));
                                            if (bf.length() > 0) {
                                                item.put(key, bf.toString());
                                            }
                                        }
                                    }
                                }
                            } else {
                                //其他输入框如果是多行子表单进行1，2，3编号
                                if (item.get(key) instanceof String && org.apache.commons.lang.StringUtils.isNotBlank((String) item.get(key))) {
                                    List<String> itemCodeList = Arrays.asList(((String) item.get(key)).split("\\$#"));
                                    StringBuffer bf = new StringBuffer("");
                                    if (itemCodeList.size() > 1) {
                                        for (int i = 0; i < itemCodeList.size(); i++) {
                                            bf.append(i + 1).append("、").append(itemCodeList.get(i)).append(" ");
                                        }
                                        item.put(key, bf.toString());
                                    } else {
                                        if(itemCodeList.size()>0)
                                            item.put(key, itemCodeList.get(0));
                                    }
                                }
                            }
                        }
                    }
                    Map<String, com.dragon.flow.model.org.Department> deptMap = this.getDeptVoMapByNos(deptIds);
                    Map<String, com.dragon.flow.model.org.Company> comMap = this.getComVoMapByNos();
                    Map<String, UserVo> userMap = this.getPersonnelVoMapByNos(userNos);
                    for (Map<String, Object> item : pm.getData()) {
                        //翻译自定义表单的人员选择器（包含多选）
                        for (String field : userFields) {
                            String value = (String) item.get(field);
                            if (org.apache.commons.lang.StringUtils.isNotBlank(value)) {
                                List<String> itemCodeList = Arrays.asList((value).split("\\$#"));
                                //如果是多行子表单进行1，2，3编号
                                if (itemCodeList.size() > 1) {
                                    StringBuffer bf = new StringBuffer("");
                                    for (int i = 0; i < itemCodeList.size(); i++) {
                                        if (org.apache.commons.lang.StringUtils.isNotBlank(itemCodeList.get(i))) {
                                            List<String> userNoItems = Arrays.asList((itemCodeList.get(i)).split(","));
                                            StringBuffer bf2 = new StringBuffer("");
                                            for (String no : userNoItems) {
                                                UserVo person = userMap.get(no);
                                                if (person != null) {
                                                    bf2.append(person.getUserName()).append("，");
                                                }
                                            }
                                            if (bf2.length() > 1) {
                                                bf2.deleteCharAt(bf2.length() - 1);
                                                bf.append(i + 1).append(",").append(bf2).append(" ");
                                            }
                                        }
                                    }
                                    if (bf.length() > 0) {
                                        item.put(field, (bf).toString());
                                    }
                                } else {
                                    List<String> userNoItems = Arrays.asList((itemCodeList.get(0)).split(","));
                                    StringBuffer bf = new StringBuffer("");
                                    for (String no : userNoItems) {
                                        UserVo person = userMap.get(no);
                                        if (person != null) {
                                            bf.append(person.getUserName()).append("，");
                                        }
                                    }
                                    if (bf.length() > 0) {
                                        item.put(field, (bf.deleteCharAt(bf.lastIndexOf("，"))).toString());
                                    }
                                }
                            }
                        }
                        //翻译自定义表单的部门选择器
                        for (String field : companyFields) {
                            String value = (String) item.get(field);
                            if (org.apache.commons.lang.StringUtils.isNotBlank(value)) {
                                //如果是多行子表单进行1，2，3编号
                                List<String> itemCodeList = Arrays.asList((value).split("\\$#"));
                                if (itemCodeList.size() > 1) {
                                    StringBuffer bf = new StringBuffer("");
                                    for (int i = 0; i < itemCodeList.size(); i++) {
                                        if (org.apache.commons.lang.StringUtils.isNotBlank(itemCodeList.get(i))) {
                                            StringBuffer bf2 = new StringBuffer("");
                                            List<String> companyItems = Arrays.asList((itemCodeList.get(i)).split(","));
                                            for (String id : companyItems) {
                                                com.dragon.flow.model.org.Company com = comMap.get(id);
                                                if (com != null) {
                                                    bf2.append(com.getCname()).append("，");
                                                }
                                            }
                                            if (bf2.length() > 1) {
                                                bf2.deleteCharAt(bf2.length() - 1);
                                                bf.append(i + 1).append(",").append(bf2).append(" ");
                                            }
                                        }
                                    }
                                    if (bf.length() > 0) {
                                        item.put(field, (bf).toString());
                                    }
                                } else {
                                    List<String> companyItems = Arrays.asList((itemCodeList.get(0)).split(","));
                                    StringBuffer bf = new StringBuffer("");
                                    for (String id : companyItems) {
                                        com.dragon.flow.model.org.Company com = comMap.get(id);
                                        if (com != null) {
                                            bf.append(com.getCname()).append("，");
                                        }
                                    }
                                    if (bf.length() > 0) {
                                        item.put(field, (bf.deleteCharAt(bf.lastIndexOf("，"))).toString());
                                    }
                                }
                            }

                        }
                        //翻译自定义表单的公司选择器
                        for (String field : deptFields) {

                            String value = (String) item.get(field);
                            if (org.apache.commons.lang.StringUtils.isNotBlank(value)) {
                                //如果是多行子表单进行1，2，3编号
                                List<String> itemCodeList = Arrays.asList((value).split("\\$#"));
                                if (itemCodeList.size() > 1) {
                                    StringBuffer bf = new StringBuffer("");
                                    for (int i = 0; i < itemCodeList.size(); i++) {
                                        if (org.apache.commons.lang.StringUtils.isNotBlank(itemCodeList.get(i))) {
                                            StringBuffer bf2 = new StringBuffer("");
                                            List<String> deptItems = Arrays.asList((itemCodeList.get(i)).split(","));
                                            for (String id : deptItems) {
                                                com.dragon.flow.model.org.Department dept = deptMap.get(id);
                                                if (dept != null) {
                                                    bf.append(dept.getName()).append("，");
                                                }
                                            }
                                            if (bf2.length() > 1) {
                                                bf2.deleteCharAt(bf2.length() - 1);
                                                bf.append(i + 1).append(",").append(bf2).append(" ");
                                            }
                                        }
                                    }
                                    if (bf.length() > 0) {
                                        item.put(field, (bf).toString());
                                    }
                                } else {
                                    List<String> deptItems = Arrays.asList((itemCodeList.get(0)).split(","));
                                    StringBuffer bf = new StringBuffer("");
                                    for (String id : deptItems) {
                                        com.dragon.flow.model.org.Department dept = deptMap.get(id);
                                        if (dept != null) {
                                            bf.append(dept.getName()).append("，");
                                        }
                                    }
                                    if (bf.length() > 0) {
                                        item.put(field, (bf.deleteCharAt(bf.lastIndexOf("，"))).toString());
                                    }
                                }
                            }
                        }

                    }
                }

                // 声明一个工作薄
                HSSFWorkbook workbook = new HSSFWorkbook();
                // 生成一个表格
                HSSFSheet sheet = workbook.createSheet("表单查询");
                // 设置表格默认列宽度为15个字节
                sheet.setDefaultColumnWidth(15);
                //字体样式一用于设置表头
                HSSFCellStyle style = workbook.createCellStyle();
                // 设置这些样式
                style.setFillForegroundColor(HSSFColor.BLACK.index);
                style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
                style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                style.setBorderRight(HSSFCellStyle.BORDER_THIN);
                style.setBorderTop(HSSFCellStyle.BORDER_THIN);
                style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                style.setVerticalAlignment(HSSFCellStyle.ALIGN_CENTER);
                style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
                // 生成一个字体
                HSSFFont font = workbook.createFont();
                font.setColor(HSSFColor.WHITE.index);
                font.setFontHeightInPoints((short) 8);
                font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
                font.setFontName("微软雅黑");
                // 把字体应用到当前的样式
                style.setFont(font);
                // 生成并设置另一个样式
                HSSFCellStyle style2 = workbook.createCellStyle();
                style2.setFillForegroundColor(HSSFColor.WHITE.index);
                style2.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
                style2.setBorderBottom(HSSFCellStyle.BORDER_THIN);
                style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);
                style2.setBorderRight(HSSFCellStyle.BORDER_THIN);
                style2.setBorderTop(HSSFCellStyle.BORDER_THIN);
                style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);
                style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);
                // 生成另一个字体
                HSSFFont font2 = workbook.createFont();
                font2.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
                // 把字体应用到当前的样式
                style2.setFont(font2);

                // 生成表头样式
                HSSFCellStyle style0 = workbook.createCellStyle();
                style0.setAlignment(HSSFCellStyle.ALIGN_CENTER); // 居中
                style0.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
                style0.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
                style0.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
                style0.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
                // 生成表头字体
                HSSFFont font0 = workbook.createFont();
                font0.setBoldweight(HSSFFont.BOLDWEIGHT_NORMAL);
                font0.setFontName("黑体");
                font0.setFontHeightInPoints((short) 14);// 设置字体大小
                // 把字体应用到当前的样式
                style0.setFont(font0);
                //第一行
                HSSFRow row0 = sheet.createRow(0);
                row0.setHeight((short) 500);
                HSSFCell cell0 = row0.createCell(0);
                cell0.setCellStyle(style0);
                cell0.setCellValue(formName);
                //合并单元格CellRangeAddress构造参数依次表示起始行，截至行，起始列， 截至列
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, titles.length - 1));//合并单元格
                //第二行
                HSSFRow row1 = sheet.createRow(1);
                row1.setHeight((short) 500);
                HSSFCell cell1 = row1.createCell(0);
                cell1.setCellStyle(style2);
                cell1.setCellValue("导出人:" + user.getName() + "   " + "导出时间:" + sdf.format(new Date()) + "   导出系统:门户");
                //合并单元格CellRangeAddress构造参数依次表示起始行，截至行，起始列， 截至列
                sheet.addMergedRegion(new CellRangeAddress(1, 1, 0, 3));//合并单元格
                //第三行
                HSSFRow row = sheet.createRow(2);
                row.setHeight((short) 600);

                for (int i = 0; i < titles.length; i++) {
                    HSSFCell cell = row.createCell(i);
                    cell.setCellStyle(style);
                    HSSFRichTextString text = new HSSFRichTextString(titles[i]);
                    cell.setCellValue(text);
                }
                for (int i = 0; i < pm.getData().size(); i++) {
                    Map<String, Object> rowVo = pm.getData().get(i);
                    row = sheet.createRow(i + 3);
                    row.setHeight((short) 500);
                    for (int j = 0; j < fieldArr.length; j++) {
                        HSSFCell cell = row.createCell(j);
                        cell.setCellStyle(style2);
                        Object obj = rowVo.get(fieldArr[j]);
                        if (obj != null) {
                            if (Timestamp.class.equals(obj.getClass())) {
                                cell.setCellValue(sdftime.format((Date) obj));
                            }
                            if (Date.class.equals(obj.getClass())) {
                                cell.setCellValue(sdf.format((Date) obj));
                            } else if (fileFields.contains(fieldArr[j])) {
                                String pathJson = (String) obj;
                                StringBuffer fileName = new StringBuffer("");
                                if (org.apache.commons.lang.StringUtils.isNotBlank(pathJson)) {
                                    JSONArray jsonArray = JSONArray.fromObject(pathJson);
                                    List<Map<String, Object>> pathList = jsonArray.toList(jsonArray, new HashMap<String, Object>(), new JsonConfig());
                                    for (Map<String, Object> file : pathList) {
                                        fileName.append(file.get("name")).append(",");
                                    }
                                    if (fileName.length() > 0) {
                                        cell.setCellValue(fileName.deleteCharAt(fileName.lastIndexOf(",")).toString());
                                    }
                                }
                            } else {
                                cell.setCellValue(String.valueOf(obj));
                            }
                        } else {
                            cell.setCellValue("");
                        }
                    }
                }
                returnVo = new SimpleReturnVo(ReturnCode.SUCCESS, "导出成功");
                String fileName = new String(sheet.getSheetName().getBytes("UTF-8"), "ISO-8859-1");
                try {
                    response.setContentType("application/vnd.ms-excel");
                    response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xls");
                    OutputStream ouputStream = response.getOutputStream();
                    workbook.write(ouputStream);
                    ouputStream.flush();
                    ouputStream.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return JsonUtils.toJson(returnVo);
    }
    @ApiIgnore
    private Map<String,String> getAreaMap(){
        Map<String, String> map = new HashMap<String, String>();

        try {
            com.ys.tools.vo.ReturnVo<List<Area>> cvo = areaApi.getAllArea();
            if(cvo.getCode()== UcenterConstant.SUCCESS && CollectionUtils.isNotEmpty(cvo.getData())){
                for(Area vo : cvo.getData()){
                    map.put(vo.getCode(), vo.getName());
                }
            }else{
                logger.info("调用区域数据出错！" + cvo.getMsg());
            }
        } catch (Exception e) {
            logger.error("调用区域主数据接口【areaApi.getAllArea】异常！" + e);
            e.printStackTrace();
        }
        return map;

    }
    @ApiIgnore
    private Map<String, com.dragon.flow.model.org.Department> getDeptVoMapByNos(List<String> ids){
        Map<String, com.dragon.flow.model.org.Department> dMap = new HashMap<String, com.dragon.flow.model.org.Department>();

        try {
            List<com.dragon.flow.model.org.Department> list = flowApi.getDepartmentByIdList(ids);
            if(CollectionUtils.isNotEmpty(list)) {
                list.forEach(vo->dMap.put(vo.getId(), vo));
            }
        } catch (Exception e) {
            logger.error("调用部门主数据接口【flowApi.getDepartmentByIdsList(nos)】异常！" + e);
            e.printStackTrace();
        }
        return dMap;
    }
    @ApiIgnore
    private Map<String, UserVo> getPersonnelVoMapByNos(List<String> nos){
        Map<String, UserVo> pMap = new HashMap<String, UserVo>();

        try {
            List<UserVo> list = flowApi.getUserInfoByNoList(nos);
            if(CollectionUtils.isNotEmpty(list)){
                list.forEach(vo->pMap.put(vo.getUserId(), vo));
            }
        } catch (Exception e) {
            logger.error("调用人员主数据接口【personnelApi.getPersonnelApiVoByNos(nos)】异常！" + e);
            e.printStackTrace();
        }
        return pMap;
    }
    @ApiIgnore
    private Map<String, com.dragon.flow.model.org.Company> getComVoMapByNos(){
        Map<String, com.dragon.flow.model.org.Company> cMap = new HashMap<String, com.dragon.flow.model.org.Company>();

        try {
            List<com.dragon.flow.model.org.Company> list = flowApi.getCompanyAll(new com.dragon.flow.model.org.Company());
            if(CollectionUtils.isNotEmpty(list)){
                list.forEach(vo->cMap.put(vo.getId(), vo));
            }
        } catch (Exception e) {
            logger.error("调用公司主数据接口【orgApi.getAllCompany】异常！" + e);
            e.printStackTrace();
        }
        return cMap;
    }

    @ApiIgnore
    private Map<String,List<Map<String, String>>> getDictMap(List<FormItem> list) {
        Map<String,List<Map<String, String>>> dictMap=new HashMap<String, List<Map<String,String>>>();
        for (FormItem formItem : list) {
            if(org.apache.commons.lang.StringUtils.isNotBlank(formItem.getAjaxurl())){
                DicItem dictionaryitem=new DicItem();
                dictionaryitem.setMainId(formItem.getAjaxurl());
                ReturnVo<List<Map<String, String>>> returnVo=null;
                try {
                    returnVo = flowApi.getDicItem(dictionaryitem);
                } catch (Exception e) {
                    e.printStackTrace();
                    logger.error("获取数据字典接口异常！" + e);
                }
                if(null != returnVo && FlowConstant.SUCCESS.equals(returnVo.getCode())&& CollectionUtils.isNotEmpty(returnVo.getData())){
                    dictMap.put(formItem.getFieldName(), returnVo.getData());
                }
            }
        }
        return dictMap;
    }
}

	