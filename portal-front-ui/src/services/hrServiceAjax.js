import { stringify } from 'qs';
import request from '../utils/request';
import requestAjax from '@/utils/requestAjax';

/**
 * 提交反馈表单
 * @param params
 * @returns {Promise<Object>}
 */
export async function referFeedback(params) {
  return requestAjax('/portal/api/hrService/sendOptionToQiyu.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 查询人员
 */
export async function getAllPerson(params) {
  return requestAjax('/portal/api/hrService/getAllPerson.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门考勤总览数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamSummaryAttendance(params) {
  //
  // return {"year":2019,"attendance":56.36,"avgWorkHour":8.9,"leaveCount":8,"travelCount":1,"goOutCount":1,"lateOrEarlyleave":8,"absenteeismCount":174,"shiJiaCount":2,"jiaBanCount":3,"tiaoXiuCount":2,"hunJiaCount":0,"chanJiaCount":0,"bingJiaCount":1,"gongShangJiaCount":0,"sangJiaCount":1,"deptIds":["1001K31000000002GLCM","1001K31000000002GLCT"],"delFlag":1}
  return requestAjax('/portal/api/attendance/getUserTeamSummaryAttendance.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门请假天数统计表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamLeaveDaysStatistic(params) {
  return requestAjax('/portal/api/attendance/getUserTeamLeaveDaysStatistic.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门请假详情表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamLeaveDetails(params) {
  return requestAjax('/portal/api/attendance/getUserTeamLeaveDetails.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}
/**
 * 获取部门加班详情表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamWorkOvertimeDetail(params) {
  return requestAjax('/portal/api/attendance/getUserTeamWorkOvertimeDetail.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门出差详情表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamBusinessTripDetail(params) {
  return requestAjax('/portal/api/attendance/getUserTeamBusinessTripDetail.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门因公外出信息
 */
export async function getUserTeamBusinessTrip(params) {
  return requestAjax('/portal/api/attendance/getUserTeamBusinessTrip.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门迟到早退表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamLateAbsenteeism(params) {
  return requestAjax('/portal/api/attendance/getUserTeamLateAbsenteeism.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门旷工表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getUserTeamAbsenteeism(params) {
  return requestAjax('/portal/api/attendance/getUserTeamAbsenteeism.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门考勤记录数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTeamAttendanceRecord(params) {
  return requestAjax('/portal/api/attendance/getTeamAttendanceRecord.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门资产列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getDeptAssets(params) {
  //
  // return {"deptUseAssets":[{"totalNumber":519,"softWareNumber":22,"fixedNumber":497}],"deptChargeAssets":[{"totalNumber":485,"softWareNumber":11,"fixedNumber":474}]}
  return requestAjax('/portal/api/assets/getDeptAssets.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门资产列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getDeptAssetsList(params) {
  return requestAjax('/portal/api/assets/getDeptAssetsList.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 年度入职
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAnnualEntryList(params) {
  //
  // return {"pagination":{"current":0,"total":1,"pageSize":10},"list":[{"id":"000000005b5bc2c0015b61799f450099","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","position":" ","no":"00006899","name":"赵海","sex":1,"classification":"0101","enterTime":"2017-04-01 00:00:00","leavingTime":"2019-01-10 00:00:00","fromSystem":"1","isIncorporated":0,"status":0,"poststatus":0,"sortNo":1000,"synStatus":2,"synFiedReason":"待同步","idcard":"330681199304064416","alphabetic":"zhaohai","oType":"","positionLevel":0,"positionName":"","privilege":4,"leaveTimeStr":"2019-01-10","enterTimeStr":"2017-04-01","companyEmail":"zhaohai1@chinayasha.net","selfEmail":"","selfMobile":"18268880614","companyMobile":" ","mobilePhone":"18268880614","shortPhone":"660614","phone":"","addbool":0,"dcode":"1703","dname":"技术开发部","operate":2,"ccode":"200001","cname":"亚厦集团","postid":"                    ","postcode":" ","postname":" ","classcode":"0101","classname":"正式员工","job":"                    ","jobcode":" ","jobname":" ","writebackoperate":"0","writebackts":"                   ","ts":"2019-01-10 15:29:32","syncts":"2019-01-10 15:28:42","ehrid":"0001K31000000000CH0H","birthday":"0406","sAMAccountName":"zhaohai1","createTime":"2017-04-12 17:23:32","creator":"00004737","updateTime":"2019-01-10 16:37:07","updator":"00009179","delFlag":1}]}
  return requestAjax('/portal/api/hrService/getAnnualList.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 年度离职
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAnnualLeaveList(params) {
  return requestAjax('/portal/api/hrService/getAnnualList.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 团队编制统计
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAuthorizedStrengthTotal(params) {
  //
  // return {"aRank":0,"countPsndoc":27,"totalNum":1,"oRank":0,"pRank":0,"others":0,"mRank":1}
  return requestAjax('/portal/api/hrService/getAuthorizedStrengthTotal.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 团队编制列表
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAuthorizedStrengthList(params) {
  return requestAjax('/portal/api/hrService/getAuthorizedStrengthList.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 团队编制详情
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAuthorizedStrengthDetails(params) {
  return requestAjax('/portal/api/hrService/getAuthorizedStrengthDetails.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取绩效信息Table数据（团队）
 * @param params
 * @returns {Promise<void>}
 */
export async function getTeamPerfInfo(params) {
  // return [{"A":"0","B":"0","S":"0","C":"0","D":"0","level":"人数","E":"0"}]
  return requestAjax(`/portal/api/performance/getTeamPerfInfo.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取绩效奖励信息Table数据（团队）
 * @param params
 * @returns {Promise<void>}
 */
export async function getTeamPerfReward(params) {
  return requestAjax(`/portal/api/performance/getTeamPerfReward.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取团队绩效统计
 * @param params
 * @returns {Promise<void>}
 */
export async function getTeamPerfTotal(params) {
  //
  // return [{"A":"0","B":"0","S":"0","C":"0","D":"0","level":"人数","E":"0"}]
  return requestAjax(`/portal/api/performance/getTeamPerfTotal.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取培训课程Table数据（团队）
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTrainingCourse(params) {
  //
  // return {"planTrainCourse":0,"completeTrainCourse":0,"completeTrainOutCourse":0,"delFlag":1}
  return requestAjax(`/portal/api/train/getTrainingCourse.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取课程开发Table数据（团队）
 * @param params
 * @returns {Promise<Object>}
 */
export async function getCourseDevelop(params) {
  //
  // return {"quarterPlanNum":0,"actualQuarterNum":0,"delFlag":1}
  return requestAjax(`/portal/api/train/getCourseDevelop.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取人均完成Table数据（团队）
 * @param params
 * @returns {Promise<void>}
 */
export async function getComplete(params) {
  // return   {"averageHours":0.0,"averageFinishClassHours":0.0,"averageFinishElectiveHours":0.0,"averageFinishShareHours":0.0,"averageFinishTotalHours":0.0,"delFlag":1}
  return requestAjax(`/portal/api/train/getComplete.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取培训详情（团队）
 * @param params
 * @returns {Promise<void>}
 */
export async function getTrainingDetail(params) {
  return requestAjax(`/portal/api/train/getTrainingDetail.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}
