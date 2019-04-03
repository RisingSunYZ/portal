import { stringify } from 'qs';
import request from '../utils/request';



/**
 * 提交反馈表单
 * @param params
 * @returns {Promise<Object>}
 */
export async function referFeedback(params) {
  return request('/portal/api/hrService/sendOptionToQiyu.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 查询人员
 */
export async function getAllPerson(params) {
  return request('/portal/api/hrService/getAllPerson.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamSummaryAttendance.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamLeaveDaysStatistic.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamLeaveDetails.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamWorkOvertimeDetail.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamBusinessTripDetail.jhtml', {
    method: 'POST',
    data: stringify(params),
  });
}

/**
 * 获取部门因公外出信息
 */
export async function getUserTeamBusinessTrip(params) {
  return request('/portal/api/attendance/getUserTeamBusinessTrip.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamLateAbsenteeism.jhtml', {
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
  return request('/portal/api/attendance/getUserTeamAbsenteeism.jhtml', {
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
  return request('/portal/api/attendance/getTeamAttendanceRecord.jhtml', {
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
  return request('/portal/api/assets/getDeptAssets.jhtml', {
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
  return request('/portal/api/assets/getDeptAssetsList.jhtml', {
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
  return request('/portal/api/hrService/getAnnualList.jhtml', {
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
  return request('/portal/api/hrService/getAnnualList.jhtml', {
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
  return request('/portal/api/hrService/getAuthorizedStrengthTotal.jhtml', {
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
  return request('/portal/api/hrService/getAuthorizedStrengthList.jhtml', {
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
  return request('/portal/api/hrService/getAuthorizedStrengthDetails.jhtml', {
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
  return request(`/portal/api/performance/getTeamPerfInfo.jhtml`, {
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
  return request(`/portal/api/performance/getTeamPerfReward.jhtml`, {
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
  return request(`/portal/api/performance/getTeamPerfTotal.jhtml`, {
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
  return request(`/portal/api/train/getTrainingCourse.jhtml`, {
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
  return request(`/portal/api/train/getCourseDevelop.jhtml`, {
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
  return request(`/portal/api/train/getComplete.jhtml`, {
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
  return request(`/portal/api/train/getTrainingDetail.jhtml`, {
    method: 'POST',
    data: stringify(params),
  });
}
