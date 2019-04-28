package com.dragon.portal.service.rscmgmt.impl;

import com.dragon.flow.api.IFlowApi;
import com.dragon.flow.constant.FlowConstant;
import com.dragon.flow.enm.flowable.run.CommentTypeEnum;
import com.dragon.flow.enm.flowable.run.ProcessStatusEnum;
import com.dragon.flow.vo.flowable.api.CompleteTaskApiVo;
import com.dragon.flow.vo.flowable.api.EndApiVo;
import com.dragon.flow.vo.flowable.run.StartProcessInstanceVo;
import com.dragon.portal.constant.PortalConstant;
import com.dragon.portal.dao.rscmgmt.IMeetingroomApplyDao;
import com.dragon.portal.dao.rscmgmt.IMeetingroomApproverDao;
import com.dragon.portal.enm.metting.MeetingApplyStatusEnum;
import com.dragon.portal.model.rscmgmt.Meetingroom;
import com.dragon.portal.model.rscmgmt.MeetingroomApply;
import com.dragon.portal.model.rscmgmt.MeetingroomApplyUndoMsg;
import com.dragon.portal.model.rscmgmt.MeetingroomApprover;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.redis.RedisService;
import com.dragon.portal.service.rscmgmt.IMeetingroomApplyService;
import com.dragon.portal.service.rscmgmt.IMeetingroomApplyUndoMsgService;
import com.dragon.portal.service.rscmgmt.IMeetingroomApprovalLogService;
import com.dragon.portal.service.rscmgmt.IMeetingroomService;
import com.dragon.portal.utils.CommUtils;
import com.dragon.portal.utils.DateAndWeekUtils;
import com.dragon.portal.vo.rscmgmt.*;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;
import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import com.ys.tools.common.ReturnCode;
import com.ys.tools.vo.ReturnVo;
import com.mhome.se.api.ISendSmsApi;
import com.mhome.se.eum.SmsModeTypeEnum;
import com.mhome.se.model.sms.SmsInfo;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.vo.SimpleReturnVo;
import com.ys.ucenter.api.IOrgApi;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.model.user.Department;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.text.DecimalFormat;
import java.text.Format;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * @Title:会议室申请表Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-04-14 10:16:33
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
@Service
public class MeetingroomApplyServiceImpl implements IMeetingroomApplyService {

    @Resource
    private IMeetingroomApplyDao meetingroomApplyDao;
    @Resource
    private IMeetingroomService meetingroomService;
    @Resource
    private IPersonnelApi personnelApi;
    @Resource
    private IOrgApi orgApi;
    @Resource
    private IMeetingroomApplyUndoMsgService meetingroomApplyUndoMsgService;
    @Resource
    private IMeetingroomApprovalLogService meetingroomApprovalLogService;
    @Resource
    private IFlowApi flowApi;
    @Resource
    private CommonProperties commonProperties;
    @Resource
    private IMeetingroomApproverDao IMeetingroomApproverDao;
    @Resource
    private ISendSmsApi sendSmsApi;
    @Resource
    private RedisService redisService;

    private static final Logger logger = LoggerFactory.getLogger(MeetingroomApplyServiceImpl.class);


    @Override
    public MeetingroomApply getMeetingroomApplyById(String id) throws Exception {
        return StringUtils.isNotBlank(id) ? this.meetingroomApplyDao.getMeetingroomApplyById(id.trim()) : null;
    }

    @Override
    public List<MeetingroomApply> getAll(MeetingroomApply meetingroomApply) throws Exception {
        return null != meetingroomApply ? this.meetingroomApplyDao.getAll(meetingroomApply) : null;
    }

    @Override
    public PagerModel<MeetingroomApply> getPagerModelByQuery(MeetingroomApply meetingroomApply, Query query)
            throws Exception {
        return (null != meetingroomApply && null != query) ? this.meetingroomApplyDao.getPagerModelByQuery(meetingroomApply, query) : null;
    }

    @Override
    public void insertMeetingroomApply(MeetingroomApply meetingroomApply) throws Exception {
        if (null != meetingroomApply) {
            meetingroomApply.setId(UUIDGenerator.generate());
            meetingroomApply.setCreateTime(new Date());
            meetingroomApply.setUpdateTime(new Date());
            this.meetingroomApplyDao.insertMeetingroomApply(meetingroomApply);
        }
    }

    @Override
    public void delMeetingroomApplyById(String id) throws Exception {
        if (StringUtils.isNotBlank(id)) {
            this.meetingroomApplyDao.delMeetingroomApplyById(id.trim());
        }
    }

    @Override
    public void delMeetingroomApplyByIds(String ids) throws Exception {
        ids = this.converString(ids);
        if (StringUtils.isNotBlank(ids)) {
            this.meetingroomApplyDao.delMeetingroomApplyByIds(ids);
        }
    }

    @Override
    public void updateMeetingroomApply(MeetingroomApply meetingroomApply) throws Exception {
        if (null != meetingroomApply) {
            meetingroomApply.setUpdateTime(new Date());
            this.meetingroomApplyDao.updateMeetingroomApply(meetingroomApply);
        }
    }

    @Override
    public void updateMeetingroomApplyByApplyNo(MeetingroomApply meetingroomApply) throws Exception {
        if (null != meetingroomApply) {
            meetingroomApply.setUpdateTime(new Date());
            this.meetingroomApplyDao.updateMeetingroomApplyByApplyNo(meetingroomApply);
        }
    }


    @Override
    public void updateMeetingroomApplyByIds(String ids, MeetingroomApply meetingroomApply) throws Exception {
        ids = this.converString(ids);
        if (StringUtils.isNotBlank(ids) && null != meetingroomApply) {
            meetingroomApply.setUpdateTime(new Date());
            Map<String,Object> params = new HashMap<>();
            params.put("ids", ids);
            params.put("meetingroomApply", meetingroomApply);
            this.meetingroomApplyDao.updateMeetingroomApplyByIds(params);
        }
    }

    /**
     * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
     *
     * @param strs
     * @return
     */
    private String converString(String strs) {
        if (StringUtils.isNotBlank(strs)) {
            String[] idStrs = strs.trim().split(",");
            if (null != idStrs && idStrs.length > 0) {
                StringBuffer sbf = new StringBuffer("");
                for (String str : idStrs) {
                    if (StringUtils.isNotBlank(str)) {
                        sbf.append("'").append(str.trim()).append("'").append(",");
                    }
                }
                if (sbf.length() > 0) {
                    sbf = sbf.deleteCharAt(sbf.length() - 1);
                    return sbf.toString();
                }
            }
        }
        return "";
    }

    @Override
    public MeetingroomViewVo getMeetingroomViewVoByMeetroomId(MeetingroomViewVo meetingroomViewVo, String proposerNo) throws Exception {

        List<MeetingroomApplyViewVo> applyVos = new ArrayList<MeetingroomApplyViewVo>();
        String sdf = "yyyy-MM-dd";
        Date startDate = CommUtils.getStringToDate(meetingroomViewVo.getStartDateStr(), sdf);
        Date endDate = CommUtils.getStringToDate(meetingroomViewVo.getEndDateStr(), sdf);
        while (startDate.getTime() <= endDate.getTime()) {
            MeetingroomApplyViewVo meetingroomApplyViewVo = new MeetingroomApplyViewVo();
            meetingroomApplyViewVo.setApplyDateStr(CommUtils.getDateString(startDate, sdf));
            meetingroomApplyViewVo.setWeekDay("" + DateAndWeekUtils.getWeek(meetingroomApplyViewVo.getApplyDateStr()));
            List<MeetingroomApplyItemViewVo> applyItemVo = this.getAllByDateAndMeetingId(meetingroomApplyViewVo.getApplyDateStr(), meetingroomViewVo.getMeetingroomId(), proposerNo);
            meetingroomApplyViewVo.setApplyItemVo(applyItemVo);
            applyVos.add(meetingroomApplyViewVo);
            startDate = CommUtils.getStringToDate(DateAndWeekUtils.addDay(CommUtils.getDateString(startDate, sdf), 1), sdf);
        }
        meetingroomViewVo.setApplyVos(applyVos);
        return meetingroomViewVo;

    }

    private List<MeetingroomApplyItemViewVo> getAllByDateAndMeetingId(String applyDateStr,String meetingroomId,String proposerNo) throws Exception{
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("applyDateStr", applyDateStr);
        params.put("applyNextDateStr", DateAndWeekUtils.addDay(applyDateStr,1));
        params.put("meetingroomId", meetingroomId);
        params.put("proposerNo", proposerNo);
        List<MeetingroomApplyItemViewVo> itemViewVos = new ArrayList<MeetingroomApplyItemViewVo>();
        List<MeetingroomApply> applies = this.meetingroomApplyDao.getAllByDateAndMeetingId(params);
        for(MeetingroomApply temp:applies){
            if(temp.getStatus()== MeetingApplyStatusEnum.APPROVE.getCode()||temp.getStatus()==MeetingApplyStatusEnum.WAIT_APPROVE.getCode()){
                MeetingroomApplyItemViewVo itemViewVo = new MeetingroomApplyItemViewVo();
                itemViewVo.setStatus(temp.getStatus());
                itemViewVo.setApplyNo(temp.getApplyNo());
                itemViewVo.setApplyDateStr(applyDateStr);
                itemViewVo.setStartTimeStr(com.ys.ucenter.utils.CommUtils.getDateString(temp.getStartTime(), "HH:mm"));
                itemViewVo.setEndTimeStr(com.ys.ucenter.utils.CommUtils.getDateString(temp.getEndTime(), "HH:mm").equals("00:00")?"24:00": com.ys.ucenter.utils.CommUtils.getDateString(temp.getEndTime(), "HH:mm"));
                itemViewVo.setApplyPersonNo(temp.getProposerNo());
                itemViewVo.setApplyPersonName(temp.getProposerName());
                itemViewVos.add(itemViewVo);
            }
        }
        return itemViewVos;
    }


    @Override
    public PagerModel<MeetingroomViewVo> getPagerModelByMeetingroomViewVo(MeetingroomViewVo meetingroomViewVo, Query query) throws Exception {
        PagerModel<MeetingroomViewVo> pm = this.meetingroomService.getPagerModelByQuery(meetingroomViewVo, query);
        return pm;
    }

   /**
    *@Description  申请会议室(单次,周期性)
    *@param
    *@return 
    *@Author  tuzhili
    *@Date  2018/5/14 17:57
    *@Copyright 浙江亚厦股份有限公司 2017-2018 版权所有
    */
    @Override
    public synchronized  SimpleReturnVo insertMeetingroomApplyByCycle(MeetingroomApplyVo meetingroomApplyVo) throws Exception {
        SimpleReturnVo returnVo = new SimpleReturnVo(ReturnCode.FAIL, "添加数据失败！");
        try {
            List<MeetingroomApply> meetingroomApplyList = new ArrayList<MeetingroomApply>();
            String applyNo = generateAppluNo();
            meetingroomApplyVo.setApplyNo(applyNo);
            String sdf = "yyyy-MM-dd";
            String taskId = null;
            Date startDate = CommUtils.getStringToDate(meetingroomApplyVo.getStartDateStr(), sdf);
            Date endDate = CommUtils.getStringToDate(meetingroomApplyVo.getEndDateStr(), sdf);
            while (startDate.getTime() <= endDate.getTime()) {
                int weekDay = DateAndWeekUtils.getWeek(CommUtils.getDateString(startDate, sdf));
                if (meetingroomApplyVo.getWeekDays().contains(String.valueOf(weekDay))) {
                    String startTime = CommUtils.getDateString(startDate, sdf) + " " + meetingroomApplyVo.getStartTimeStr();
                    String endTime = CommUtils.getDateString(startDate, sdf) + " " + meetingroomApplyVo.getEndTimeStr();
                    Date startTimeDate = CommUtils.getStringToDate(startTime, "yyyy-MM-dd HH:mm");
                    Date endTimeDate = CommUtils.getStringToDate(endTime, "yyyy-MM-dd HH:mm");
                    // 验证
                    if (startTimeDate.getTime() < new Date().getTime() || endTimeDate.getTime() < new Date().getTime()) {
                        returnVo.setResponseMsg("您申请的" + meetingroomApplyVo.getStartDateStr() + " " + meetingroomApplyVo.getStartTimeStr() + "-" + meetingroomApplyVo.getEndTimeStr() + "时间已经过期，请更改会议时间！");
                        return returnVo;
                    }
                    if (!meetingroomValidate(meetingroomApplyVo.getMeetingroomId(), applyNo, startTime, endTime)) {
                        returnVo.setResponseMsg("您申请的" + meetingroomApplyVo.getStartDateStr() + " " + meetingroomApplyVo.getStartTimeStr() + "-" + meetingroomApplyVo.getEndTimeStr() + "会议室已经被占用，请更改会议时间！");
                        return returnVo;
                    }
                    MeetingroomApply meetingroomApply = convertMeetingroomApplyVo(meetingroomApplyVo, applyNo, weekDay,
                            startTimeDate, endTimeDate);
                    meetingroomApplyList.add(meetingroomApply);
                }
                //日期加一天
                startDate = CommUtils.getStringToDate(DateAndWeekUtils.addDay(CommUtils.getDateString(startDate, sdf), 1), sdf);
            }
            //批量插入数据
            if(CollectionUtils.isNotEmpty(meetingroomApplyList)){
                this.meetingroomApplyDao.insertMeetingroomApplyByList(meetingroomApplyList);
                //待神审批的会议审核发送工作流
                if (meetingroomApplyList.get(0).getStatus() == MeetingApplyStatusEnum.WAIT_APPROVE.getCode()) {
                    //工作流
                    taskId = startOAProcessInstance(meetingroomApplyVo, applyNo);
                    MeetingroomApply meetingroomApply = new MeetingroomApply();
                    meetingroomApply.setApplyNo(meetingroomApplyVo.getApplyNo());
                    meetingroomApply.setTaskId(taskId);
                    meetingroomApplyDao.updateMeetingroomApplyByApplyNo(meetingroomApply);
                }
            }
            //如果会议室不需要审批 发送短信
            if (meetingroomApplyVo.getStatus() == MeetingApplyStatusEnum.APPROVE.getCode()) {
                //发短信
                this.sendSmsInfo(meetingroomApplyVo);
            }
        } catch (Exception e) {
            e.printStackTrace();
            returnVo.setResponseMsg("申请会议室异常！");
            return returnVo;
        }
        returnVo.setResponseCode(ReturnCode.SUCCESS);
        returnVo.setResponseMsg("申请成功！");
        return returnVo;
    }

    private String startOAProcessInstance(MeetingroomApplyVo meetingroomApplyVo, String applyNo) throws Exception {
        MeetingroomApprover meetingroomApproverWhere = new MeetingroomApprover();
        meetingroomApproverWhere.setMettingroomId(meetingroomApplyVo.getMeetingroomId());
        List<MeetingroomApprover> MeetingroomApproverList = IMeetingroomApproverDao.getAll(meetingroomApproverWhere);
        Map<String, Object> variables = new HashMap<String, Object>();
        List<String> userIds = new ArrayList<String>();
        for (MeetingroomApprover temp : MeetingroomApproverList) {
            userIds.add(temp.getApproverNo());
        }
        variables.put("userIds", userIds);
        StartProcessInstanceVo process = new StartProcessInstanceVo();
        process.setVariables(variables);
        process.setSystemSn(commonProperties.getSystemSn());
        process.setFormName(commonProperties.getMeetingroomFormName() + "-" + applyNo);
        process.setProcessDefinitionKey(commonProperties.getMeetingroomDefinitionKey());
        process.setBusinessKey(applyNo);
        process.setCurrentUserCode(meetingroomApplyVo.getProposerNo());
        process.setFlowLevelFlag(false);
        String processId="";
        com.dragon.tools.vo.ReturnVo<String> vo2= flowApi.startProcessInstanceByKey(process);
        if(FlowConstant.SUCCESS.equals(vo2)){
            processId=vo2.getData();
        }
        return processId;
    }

    private MeetingroomApply convertMeetingroomApplyVo(MeetingroomApplyVo meetingroomApplyVo, String appluNo,
                                                       int weekDay, Date startTimeDate, Date endTimeDate) throws Exception {
        MeetingroomApply meetingroomApply = new MeetingroomApply();
        meetingroomApply.setId(UUIDGenerator.generate());
        meetingroomApply.setCreateTime(new Date());
        meetingroomApply.setUpdateTime(new Date());
        meetingroomApply.setApplyNo(appluNo);
        meetingroomApply.setMeetingroomId(meetingroomApplyVo.getMeetingroomId());
        meetingroomApply.setMeetingroomName(meetingroomApplyVo.getMeetingroomName());
        meetingroomApply.setProposerNo(meetingroomApplyVo.getProposerNo());
        meetingroomApply.setProposerName(meetingroomApplyVo.getProposerName());
        meetingroomApply.setMobile(meetingroomApplyVo.getMobile());
        meetingroomApply.setDeptId(meetingroomApplyVo.getDeptId());
        meetingroomApply.setDeptName(meetingroomApplyVo.getDeptName());
        meetingroomApply.setDetailAddress(meetingroomApplyVo.getDetailAddress());
        meetingroomApply.setApplyType(meetingroomApplyVo.getApplyType());
        meetingroomApply.setStartTime(startTimeDate);
        meetingroomApply.setEndTime(endTimeDate);
        meetingroomApply.setWeekDay(weekDay);
        meetingroomApply.setRemark(meetingroomApplyVo.getRemark());
        meetingroomApply.setPeriodNo(meetingroomApplyVo.getPeriodNo());
        meetingroomApply.setCreator(meetingroomApplyVo.getProposerNo());
        meetingroomApply.setCreateTime(new Date());
        meetingroomApply.setUpdator(meetingroomApplyVo.getProposerNo());
        meetingroomApply.setUpdateTime(new Date());
        meetingroomApply.setStartDay(meetingroomApplyVo.getStartDateStr());
        meetingroomApply.setEndDay(meetingroomApplyVo.getEndDateStr());
        meetingroomApply.setStatus(makeMeetingApplyStatus(meetingroomApplyVo.getMeetingroomId()));
        meetingroomApplyVo.setStatus(meetingroomApply.getStatus());
        return meetingroomApply;
    }

    /**
     * 验证 添加的会议申请时间是否冲突
     *
     * @return true 通过验证 false 不通过验证
     * @throws Exception
     * @Description:
     * @author v-zhaohaishan 2017年4月17日 上午10:22:17
     */
    private boolean meetingroomValidate(String meetingroomId, String applyNo, String startTime, String endTime) throws Exception {
        Map<String,Object> params = new HashMap<String, Object>();
        params.put("meetingroomId", meetingroomId);
        params.put("startTime", startTime);
        params.put("endTime", endTime);
        params.put("applyNo", applyNo);
        if (this.meetingroomApplyDao.countMeetingroomApplyByTime(params) > 0) {
            return false;
        }
        return true;
    }

    /**
     * 会议审批状态赋值
     *
     * @param meetingroomId
     * @return
     * @throws Exception
     * @Description:
     * @author v-zhaohaishan 2017年4月19日 上午9:59:59
     */
    private Integer makeMeetingApplyStatus(String meetingroomId) throws Exception {
        Meetingroom meetingroom = meetingroomService.getMeetingroomById(meetingroomId);
        if (meetingroom.getNeedApproval() == 1) {
            return MeetingApplyStatusEnum.WAIT_APPROVE.getCode();
        } else {
            return MeetingApplyStatusEnum.APPROVE.getCode();
        }

    }

    @Override
    public PagerModel<MeetingroomApply> getPagerModelByMeetingroomMyApplyVo(
            MeetingroomApply meetingroomApply, Query query) throws Exception {
        Page<MeetingroomApply> page = null;
        PageHelper.startPage(query.getInitPageIndex(),query.getPageSize());
        page = meetingroomApplyDao.getPagerModelByQueryOfMyApply(meetingroomApply);

        PagerModel<MeetingroomApply> pm = new PagerModel<>();
        pm.setRows(page);
        pm.setTotal(page.getTotal());
        return pm;

    }

    @Override
    public PagerModel<MeetingroomMyApplyVo> handleMeetData(PagerModel<MeetingroomApply> pm){

        PagerModel<MeetingroomMyApplyVo> MeetingroomMyApplyVoPm = new PagerModel<MeetingroomMyApplyVo>();
        List<MeetingroomMyApplyVo> list = new ArrayList<MeetingroomMyApplyVo>(pm.getRows().size());

        for (MeetingroomApply temp : pm.getRows()) {
            MeetingroomMyApplyVo MeetingroomMyApplyVo = new MeetingroomMyApplyVo();
            MeetingroomMyApplyVo.setApplyNo(temp.getApplyNo());
            MeetingroomMyApplyVo.setApplyTime(temp.getCreateTime());
            MeetingroomMyApplyVo.setApplyType(temp.getApplyType());
            MeetingroomMyApplyVo.setMeetingroomId(temp.getMeetingroomId());
            MeetingroomMyApplyVo.setMeetingroomName(temp.getMeetingroomName());
            MeetingroomMyApplyVo.setStatus(makeMyApplyStatus(temp));
            String endTimeStr = CommUtils.getDateString(temp.getEndTime(), "HH:mm").equals("00:00") ? "24:00" : CommUtils.getDateString(temp.getEndTime(), "HH:mm");
            if (temp.getApplyType() == 1) {
                MeetingroomMyApplyVo.setUseDate(temp.getStartDay() + "至" + temp.getEndDay());
                MeetingroomMyApplyVo.setUseTime(convertWeekDays(temp.getWeekDays()) + ";" + CommUtils.getDateString(temp.getStartTime(), "HH:mm")
                        + "-" + endTimeStr);
            } else {
                MeetingroomMyApplyVo.setUseDate(CommUtils.getDateString(temp.getStartTime(), "yyyy-MM-dd"));
                MeetingroomMyApplyVo.setUseTime(CommUtils.getDateString(temp.getStartTime(), "yyyy-MM-dd HH:mm")
                        + "-" + endTimeStr);
            }
            MeetingroomMyApplyVo.setTaskId(temp.getTaskId());
            MeetingroomMyApplyVo.setApplyUser(temp.getProposerName());
            MeetingroomMyApplyVo.setApplyDept(temp.getDeptName());
            list.add(MeetingroomMyApplyVo);
        }
        MeetingroomMyApplyVoPm.setTotal(pm.getTotal());
        MeetingroomMyApplyVoPm.setRows(list);
        return MeetingroomMyApplyVoPm;
    }

    private static String convertWeekDays(String weekDays) {
        return weekDays.replace("1", "星期一").replace("2", "星期二").replace("3", "星期三").replace("4", "星期四")
                .replace("5", "星期五").replace("6", "星期六").replace("7", "星期日");
    }

    @Override
    public SimpleReturnVo updateMeetingroomApplyByCycle(MeetingroomApplyVo meetingroomApplyVo) throws Exception {

        SimpleReturnVo returnVo = new SimpleReturnVo(ReturnCode.FAIL, "修改数据失败！");

        try {
            int flag = 0;//flag = 1 表示是审批通过会议室申请要重新发起流程 flag = 2表示是驳回和撤回状态的会议室申请不需要更新状态
            MeetingroomApply meetingroomApplyWhere = new MeetingroomApply();
            meetingroomApplyWhere.setApplyNo(meetingroomApplyVo.getApplyNo());
            List<MeetingroomApply> list = getAll(meetingroomApplyWhere);
            Integer status = list.get(0).getStatus();
            //审批通过的会议记录 待使用 使用中 修改 要重新发起工作流
            if (status == MeetingApplyStatusEnum.APPROVE.getCode() && list.get(0).getEndTime().getTime() > new Date().getTime()
                    && makeMeetingApplyStatus(list.get(0).getMeetingroomId()) == 0) {
                flag = 1;
            } else if (status == MeetingApplyStatusEnum.REVOKE.getCode() || status == MeetingApplyStatusEnum.REJCET.getCode()) {
                flag = 2;
            }

            String taskApplyNo = "";
            if (list.size() > 1 && list.get(0).getApplyType() == 1) {
                // 周期性会议申请记录修改 周期性会议记录不予许修改
                returnVo.setResponseMsg("您申请的会议记录是周期性会议，不允许修改");
                return returnVo;
//				//删除
//				StringBuffer ids = new StringBuffer();
//				for(MeetingroomApply temp : list){
//					if(!isAllowedToUpdate(temp)){
//						returnVo.setResponseMsg("该申请的会议室记录状态不允许修改！");
//						return returnVo;
//					}
//					ids.append(temp.getId()).append(",");
//				}
//				ids.deleteCharAt(ids.length()-1);
//				this.delMeetingroomApplyByIds(ids.toString());
//				
//				List<MeetingroomApply> meetingroomApplyList = new ArrayList<MeetingroomApply>();
//				
//				String sdf = "yyyy-MM-dd";
//				Date startDate = CommUtils.getStringToDate(meetingroomApplyVo.getStartDateStr(), sdf);
//				Date endDate = CommUtils.getStringToDate(meetingroomApplyVo.getEndDateStr(), sdf);
//				while (startDate.getTime() <= endDate.getTime()) {
//					int weekDay = DateAndWeekUtils.getWeek(CommUtils.getDateString(startDate,sdf));
//					String startTime = CommUtils.getDateString(startDate,sdf) +" " + meetingroomApplyVo.getStartTimeStr();
//					String endTime =  CommUtils.getDateString(startDate,sdf) + " " + meetingroomApplyVo.getEndTimeStr();
//					Date startTimeDate = CommUtils.getStringToDate(startTime,"yyyy-MM-dd HH:mm");
//					Date endTimeDate = CommUtils.getStringToDate(endTime,"yyyy-MM-dd HH:mm");
//					if(startTimeDate.getTime() < new Date().getTime()||endTimeDate.getTime() < new Date().getTime()){
//						returnVo.setResponseMsg("您申请的"+meetingroomApplyVo.getStartDateStr()+" " + meetingroomApplyVo.getStartTimeStr()+"-"+meetingroomApplyVo.getEndTimeStr()+"时间已经过期，请更改会议时间！");
//						return returnVo;
//					}
//					if(meetingroomApplyVo.getWeekDays().contains(String.valueOf(weekDay))){
//						// 验证
//						if(!meetingroomValidate(meetingroomApplyVo.getMeetingroomId(),startTime,endTime)){
//							returnVo.setResponseMsg("您申请的"+meetingroomApplyVo.getStartDateStr()+" " + meetingroomApplyVo.getStartTimeStr()+"-"+meetingroomApplyVo.getEndTimeStr()+"会议室已经被占用，请更改会议时间！");
//							return returnVo;
//						}
//						MeetingroomApply meetingroomApply = convertMeetingroomApplyVo(meetingroomApplyVo, meetingroomApplyVo.getApplyNo(), weekDay,
//								startTimeDate, endTimeDate);
//						meetingroomApplyList.add(meetingroomApply);
//					}
//					startDate = CommUtils.getStringToDate(DateAndWeekUtils.addDay(CommUtils.getDateString(startDate, sdf), 1), sdf);
//				}
//				
//				//重新添加
//				this.meetingroomApplyDao.insertMeetingroomApplyByList(meetingroomApplyList);
            } else {
                // 单次会议申请记录修改
                MeetingroomApply meetingroomApply = list.get(0);
                if (!isAllowedToUpdate(meetingroomApply)) {
                    returnVo.setResponseMsg("该申请的会议室记录状态不允许修改！");
                    return returnVo;
                }
                String startTime = CommUtils.getDateString(meetingroomApply.getStartTime(), "yyyy-MM-dd") + " " + meetingroomApplyVo.getStartTimeStr();
                String endTime = CommUtils.getDateString(meetingroomApply.getEndTime(), "yyyy-MM-dd") + " " + meetingroomApplyVo.getEndTimeStr();
                //验证
                if (!meetingroomValidate(meetingroomApply.getMeetingroomId(), meetingroomApply.getApplyNo(), startTime, endTime)) {
                    returnVo.setResponseMsg("您申请的" + meetingroomApplyVo.getStartDateStr() + " " + meetingroomApplyVo.getStartTimeStr() + "-" + meetingroomApplyVo.getEndTimeStr() + "会议室已经被占用，请更改会议时间！");
                    return returnVo;
                }

                meetingroomApply.setStartTime(CommUtils.getStringToDate(startTime, "yyyy-MM-dd HH:mm"));
                meetingroomApply.setEndTime(CommUtils.getStringToDate(endTime, "yyyy-MM-dd HH:mm"));
                meetingroomApply.setMobile(meetingroomApplyVo.getMobile());
                meetingroomApply.setRemark(meetingroomApplyVo.getRemark());

                //如果调整时间前的会议室申请已经审批通过  记录源资源时间
                if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.APPROVE.getCode() && flag == 1) {
                    meetingroomApply.setStatus(makeMeetingApplyStatus(meetingroomApplyVo.getMeetingroomId()));
                    meetingroomApply.setOldId(meetingroomApply.getId());
                    meetingroomApply.setApplyNo(generateAppluNo());
                    MeetingroomApply oldMeetingroomApply = new MeetingroomApply();
                    oldMeetingroomApply.setId(meetingroomApply.getId());
                    oldMeetingroomApply.setDelFlag(PortalConstant.DEL_FLAG);
                    this.updateMeetingroomApply(oldMeetingroomApply);
                    this.insertMeetingroomApply(meetingroomApply);
                } else if (flag == 2) {
                    //如果是驳回和测回修改重新提交流程
                    meetingroomApply.setStatus(MeetingApplyStatusEnum.WAIT_APPROVE.getCode());
                    this.updateMeetingroomApply(meetingroomApply);
                    CompleteTaskApiVo params = new CompleteTaskApiVo();
                    params.setType(CommentTypeEnum.CXTJ);
                    params.setUserCode(meetingroomApply.getProposerNo());
                    params.setProcessInstanceId(meetingroomApply.getTaskId());
                    MeetingroomApprover meetingroomApproverWhere = new MeetingroomApprover();
                    meetingroomApproverWhere.setMettingroomId(meetingroomApply.getMeetingroomId());
                    List<MeetingroomApprover> MeetingroomApproverList = IMeetingroomApproverDao.getAll(meetingroomApproverWhere);
                    Map<String, Object> variables = new HashMap<String, Object>();
                    List<String> userIds = new ArrayList<String>();
                    for (MeetingroomApprover temp : MeetingroomApproverList) {
                        userIds.add(temp.getApproverNo());
                    }
                    variables.put("userIds", userIds);
                    params.setVariables(variables);
                    flowApi.completeTask(params);
                } else {
                    meetingroomApply.setStatus(makeMeetingApplyStatus(meetingroomApplyVo.getMeetingroomId()));
                    this.updateMeetingroomApply(meetingroomApply);
                    meetingroomApplyVo.setStatus(meetingroomApply.getStatus());
                    sendSmsInfo(meetingroomApplyVo);
                }
                taskApplyNo = meetingroomApply.getApplyNo();
            }
            if (flag == 1) {
                String taskId = startOAProcessInstance(meetingroomApplyVo, taskApplyNo);
                MeetingroomApply meetingroomApply = new MeetingroomApply();
                meetingroomApply.setApplyNo(taskApplyNo);
                meetingroomApply.setTaskId(taskId);
                meetingroomApplyDao.updateMeetingroomApplyByApplyNo(meetingroomApply);
            }






        } catch (Exception e) {
            e.printStackTrace();
            returnVo.setResponseMsg("修改会议室异常！");
        }
        returnVo.setResponseCode(ReturnCode.SUCCESS);
        returnVo.setResponseMsg("修改成功！");
        return returnVo;

    }

    @Override
    public void updateMeetingroomApplyStatus(MeetingroomApplyVo meetingroomApplyVo) throws Exception {
        // TODO Auto-generated method stub
        logger.info("updateMeetingroomApplyStatus=========更新会议状态==========" + meetingroomApplyVo.getStatus());
        Integer status = meetingroomApplyVo.getStatus();
        MeetingroomApply meetingroomApplyWhere = new MeetingroomApply();
        meetingroomApplyWhere.setApplyNo(meetingroomApplyVo.getApplyNo());
        List<MeetingroomApply> list = getAll(meetingroomApplyWhere);
        //过滤条件
        if (list == null) {
            return;
        }
        meetingroomApplyVo = this.getMeetingroomApplyByApplyNo(meetingroomApplyVo.getApplyNo());
        //如果是取消申请不需要验证  验证： 验证 当前会议室申请为待审批状态 并且时间没有过期 才可以正常审批
        if (status != MeetingApplyStatusEnum.CANCEL.getCode() && status != MeetingApplyStatusEnum.END.getCode()) {
            if (CommUtils.getStringToDate(meetingroomApplyVo.getStartDateStr() + " " + meetingroomApplyVo.getStartTimeStr(), "yyyy-MM-dd HH:mm").getTime() < new Date().getTime()) {
                return;
            }
        }
        meetingroomApplyVo.setStatus(status);
        if (list.size() > 1 && list.get(0).getApplyType() == 1) {
            // 周期性会议申请记录修改
            StringBuffer ids = new StringBuffer();
            for (MeetingroomApply temp : list) {
                ids.append(temp.getId()).append(",");
            }
            ids.deleteCharAt(ids.length() - 1);
            MeetingroomApply meetingroomApply = new MeetingroomApply();
            meetingroomApply.setStatus(meetingroomApplyVo.getStatus());
            meetingroomApply.setRemark(meetingroomApplyVo.getRemark());
            this.updateMeetingroomApplyByIds(ids.toString(), meetingroomApply);
        } else {
            // 单次会议申请记录修改
            MeetingroomApply meetingroomApply = list.get(0);
            meetingroomApply.setStatus(meetingroomApplyVo.getStatus());
            meetingroomApply.setRemark(meetingroomApplyVo.getRemark());
            this.updateMeetingroomApply(meetingroomApply);

            if (meetingroomApplyVo.getStatus() == MeetingApplyStatusEnum.NO_APPROVE.getCode() && StringUtils.isNotBlank(meetingroomApply.getOldId())) {
                MeetingroomApply oldMeetingroomApply = new MeetingroomApply();
                oldMeetingroomApply.setId(meetingroomApply.getOldId());
                oldMeetingroomApply.setDelFlag(PortalConstant.NO_DELETE_FLAG);
                this.updateMeetingroomApply(oldMeetingroomApply);
            } else if (meetingroomApplyVo.getStatus() == MeetingApplyStatusEnum.APPROVE.getCode() && StringUtils.isNotBlank(meetingroomApply.getOldId())) {
                MeetingroomApply oldMeetingroomApply = new MeetingroomApply();
                oldMeetingroomApply.setId(meetingroomApply.getOldId());
                oldMeetingroomApply.setStatus(MeetingApplyStatusEnum.NO_APPROVE.getCode());
                oldMeetingroomApply.setDelFlag(PortalConstant.DEL_FLAG);
                this.updateMeetingroomApply(oldMeetingroomApply);
            }

        }

        //发短信
        this.sendSmsInfo(meetingroomApplyVo);

        //写log
        if (meetingroomApplyVo.getStatus() == MeetingApplyStatusEnum.CANCEL.getCode()) {
            MeetingroomApplyUndoMsg meetingroomApplyUndoMsg = new MeetingroomApplyUndoMsg();
            meetingroomApplyUndoMsg.setApplyNo(meetingroomApplyVo.getApplyNo());
            meetingroomApplyUndoMsg.setUndoRemark(meetingroomApplyVo.getMessage());
            meetingroomApplyUndoMsgService.insertMeetingroomApplyUndoMsg(meetingroomApplyUndoMsg);
        }
//		else if(meetingroomApplyVo.getStatus()==MeetingApplyStatusEnum.APPROVE.getCode()||meetingroomApplyVo.getStatus()==MeetingApplyStatusEnum.NO_APPROVE.getCode()){
//			MeetingroomApprovalLog meetingroomApprovalLog = new MeetingroomApprovalLog();
//			meetingroomApprovalLog.setApplyNo(meetingroomApplyVo.getApplyNo());
//			meetingroomApprovalLog.setApprovalOpinion(meetingroomApplyVo.getMessage());
//			meetingroomApprovalLog.setApproverNo(meetingroomApplyVo.getApproverNo());
//			meetingroomApprovalLog.setApproverName(meetingroomApplyVo.getApproverName());
//			meetingroomApprovalLogService.insertMeetingroomApprovalLog(meetingroomApprovalLog);
//		}

    }

    @Override
    public MeetingroomApplyVo getMeetingroomApplyByApplyNo(String applyNo) throws Exception {
        MeetingroomApplyVo meetingroomApplyVo = new MeetingroomApplyVo();
        MeetingroomApply meetingroomApply = meetingroomApplyDao.getMeetingroomApplyByApplyNo(applyNo);
        if (meetingroomApply != null) {
            BeanUtils.copyProperties(meetingroomApply, meetingroomApplyVo);
            meetingroomApplyVo.setStartDateStr(meetingroomApply.getStartDay());
            meetingroomApplyVo.setEndDateStr(meetingroomApply.getEndDay());
            meetingroomApplyVo.setStartTimeStr(CommUtils.getDateString(meetingroomApply.getStartTime(), "HH:mm"));
            meetingroomApplyVo.setEndTimeStr(CommUtils.getDateString(meetingroomApply.getEndTime(), "HH:mm").equals("00:00") ? "24:00" : CommUtils.getDateString(meetingroomApply.getEndTime(), "HH:mm"));
            ReturnVo<PersonnelApiVo> returnVo = personnelApi.getPersonnelApiVoByNo(meetingroomApplyVo.getProposerNo());
            PersonnelApiVo personnelApiVo = returnVo.getDatas().get(0);
            meetingroomApplyVo.setJobStation(personnelApiVo.getJobStation());//岗位
            meetingroomApplyVo.setCompanyName(personnelApiVo.getCompanyName());//发起单位
            meetingroomApplyVo.setTaskId(meetingroomApply.getTaskId());
            //上级部门
            ReturnVo<Department> Departments = orgApi.getAllParentsDeptById(meetingroomApplyVo.getDeptId());
            if (Departments.getDatas().size() == 1) {
                meetingroomApplyVo.setPreDeptName(Departments.getDatas().get(0).getName());
            } else {
                meetingroomApplyVo.setPreDeptName(Departments.getDatas().get(1).getName());
            }
            return meetingroomApplyVo;
        } else {
            return null;
        }
    }

    /**
     * 判断当前会议记录是否允许修改
     *
     * @param meetingroomApply
     * @return
     * @Description:
     * @author v-zhaohaishan 2017年4月21日 上午10:01:39
     */
    private boolean isAllowedToUpdate(MeetingroomApply meetingroomApply) {
        if (meetingroomApply != null) {
            if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.WAIT_APPROVE.getCode()) {
                return true;
            } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.APPROVE.getCode()) {
                //已使用不允许修改
                if (meetingroomApply.getEndTime().getTime() < new Date().getTime()) {
                    return false;
                }
                return true;
            } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.REJCET.getCode()) {
                return true;
            } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.REVOKE.getCode()) {
                return true;
            }
        }
        return false;
    }

    /**
     * 批量设置 会议申请记录为过期并终止流程
     *
     * @Description:
     * @author v-zhaohaishan 2017年4月21日 上午10:08:25
     */
    @Override
    public void updateMeetingroomApplyStatusToExpireByList(List<MeetingroomApply> list) throws Exception {
        MeetingroomApply meetingroomApply = new MeetingroomApply();
        meetingroomApply.setStatus(MeetingApplyStatusEnum.EXPIRE.getCode());
        StringBuffer ids = new StringBuffer();
        for (MeetingroomApply temp : list) {
            if ((temp.getStatus() == MeetingApplyStatusEnum.WAIT_APPROVE.getCode() ||
                    temp.getStatus() == MeetingApplyStatusEnum.REVOKE.getCode() ||
                    temp.getStatus() == MeetingApplyStatusEnum.REJCET.getCode())
                    && temp.getStartTime().getTime() < new Date().getTime()) {
                ids.append(temp.getId()).append(",");
                EndApiVo vo = new EndApiVo();
                vo.setProcessInstanceId(temp.getTaskId());
                vo.setMessage(ProcessStatusEnum.ZZ.getMsg());
                vo.setUserCode(temp.getProposerNo());
                flowApi.stopProcess(vo);//取消的时候终止流程
            }
        }
        if (ids.length() > 0) {
            ids.deleteCharAt(ids.length() - 1);
            this.updateMeetingroomApplyByIds(ids.toString(), meetingroomApply);
        }
    }

    /**
     * 获取在我的申请中显示的状态
     *
     * @param meetingroomApply
     * @return
     * @Description:
     * @author v-zhaohaishan 2017年4月21日 上午11:30:51
     */
    private Integer makeMyApplyStatus(MeetingroomApply meetingroomApply) {
        //-1:异常 ;0:审批 ；1待使用 ;2使用中 ;3已使用;4过期未审批;5已取消;6不通过,7撤回;8驳回)
        if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.WAIT_APPROVE.getCode()) {
            return 0;
        } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.APPROVE.getCode()) {
            Date now = new Date();
            Date startTime = meetingroomApply.getStartTime();
            Date endTime = CommUtils.getStringToDate(CommUtils.getDateString(meetingroomApply.getStartTime(), "yyyy-MM-dd") + " " + CommUtils.getDateString(meetingroomApply.getEndTime(), "HH:mm"), "yyyy-MM-dd HH:mm");

            if (startTime.getTime() > now.getTime()) {
                return 1;
            } else if (startTime.getTime() <= now.getTime() && endTime.getTime() >= now.getTime()) {
                return 2;
            } else if (endTime.getTime() < now.getTime()) {
                return 3;
            } else {
                return -1;
            }

        } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.NO_APPROVE.getCode()) {
            return 6;
        } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.EXPIRE.getCode()) {
            return 4;
        } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.CANCEL.getCode() ||
                meetingroomApply.getStatus() == MeetingApplyStatusEnum.END.getCode()) {
            return 5;
        } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.REVOKE.getCode()) {
            return 7;
        } else if (meetingroomApply.getStatus() == MeetingApplyStatusEnum.REJCET.getCode()) {
            return 8;
        } else {
            return -1;
        }
    }

    /**
     * 发短信
     *
     * @param meetingroomApplyVo
     * @Description:
     * @author v-zhaohaishan 2017年4月21日 下午1:19:39
     */
    private void sendSmsInfo(MeetingroomApplyVo meetingroomApplyVo) {
        try {
            logger.info("开始发送短信...");
            logger.info("meetingroomApplyVo:", meetingroomApplyVo.toString());
            MeetingApplyStatusEnum statusEnum = MeetingApplyStatusEnum.getEnumByCode(meetingroomApplyVo.getStatus());
            if (statusEnum == MeetingApplyStatusEnum.NO_APPROVE || statusEnum == MeetingApplyStatusEnum.APPROVE) {
                SmsInfo smsInfo = null;//new SmsInfo(statusEnum == MeetingApplyStatusEnum.APPROVE ? readProperty.getValue("sms.suceess") : readProperty.getValue("sms.failure"));
                smsInfo.setType(SmsModeTypeEnum.PROMPT.getType());
                smsInfo.setTelNum(meetingroomApplyVo.getMobile());
                //smsInfo.setTelNum("18641023673");
                //这两个参数是模板中的参数
                StringBuffer content = new StringBuffer();

                SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
                SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy年MM月dd日");
                String startDateStr = sdf2.format(sdf1.parse(meetingroomApplyVo.getStartDateStr()));
                String endDateStr = sdf2.format(sdf1.parse(meetingroomApplyVo.getEndDateStr()));

                if (meetingroomApplyVo.getApplyType() == 0) {
                    content.append("{\"name\":\"").append(meetingroomApplyVo.getProposerName()).
                            append("\",\"meetingCode\":\"").append(meetingroomApplyVo.getMeetingroomName()).
                            append("\",\"meetingTime\":\"").append(startDateStr).append(" ").append(meetingroomApplyVo.getStartTimeStr()).append("-").append(meetingroomApplyVo.getEndTimeStr()).
                            append("\"}");
                } else if (meetingroomApplyVo.getApplyType() == 1) {
                    content.append("{\"name\":\"").append(meetingroomApplyVo.getProposerName()).
                            append("\",\"meetingCode\":\"").append(meetingroomApplyVo.getMeetingroomName()).
                            append("\",\"meetingTime\":\"").append(startDateStr).append("到").append(endDateStr).append("(").
                            append(convertWeekDays(meetingroomApplyVo.getWeekDays())).append(")").
                            append(meetingroomApplyVo.getStartTimeStr()).append("-").
                            append(meetingroomApplyVo.getEndTimeStr()).
                            append("\"}");
                }
                logger.info("================smsInfo.content:", content.toString());
                logger.info("================smsInfo:", smsInfo.toString());
                smsInfo.setContent(content.toString().replace("会议室", ""));
                sendSmsApi.sendSmsInfo(smsInfo);
            }
        } catch (Exception e) {
            logger.error("=====================发短信异常=====================" + e.getMessage());
        }
    }

    @Override
    public int countMeetingroomApplyByMeetingroomId(String meetingroomId) throws Exception {
        // TODO Auto-generated method stub
        meetingroomId = this.converString(meetingroomId);
        if (meetingroomId.equals("")) {
            return 0;
        }
        return meetingroomApplyDao.countMeetingroomApplyByMeetingroomId(meetingroomId);
    }

    private String generateAppluNo() throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
        Format df = new DecimalFormat("000");
        String day = sdf.format(new Date()).substring(0, 8);
        return "HYS" + day + df.format(redisService.getAtomicInterger(sdf.parse(day + " 23:59:59")));
    }
}

