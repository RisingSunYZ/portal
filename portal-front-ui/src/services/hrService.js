import request from '../utils/request';
import { stringify } from 'qs';


/**
 * GET请求例子
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

/**
 * POST请求例子
 * @param params
 * @returns {Promise<Object>}
 */
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

/**
 * 新闻banner
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryNewsBanner(params) {
  return request(`/portal/api/news/ajaxListVo.jhtml?${stringify(params)}`);
}

/**
 * 新闻公告
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryNewsNotice(params) {
  return request(`/portal/api/news/ajaxListVo.jhtml?${stringify(params)}`);
}

/**
 * 培训
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryTrainList(params) {
  // return request(`/portal/api/hrService/queryTrainList.jhtml?${stringify(params)}`);
}
/**
 * 培训
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryTrain(params) {
  return request(`/portal/api/train/queryTrain.jhtml?${stringify(params)}`);
}


/**
 *获取个人绩效表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getHrPerformanceList(params) {
  return request(`/portal/api/performance/getHrPerformanceList.jhtml${stringify(params)}?`);
}

/**
 * 获取个人绩效年份
 * @param params
 * @returns {Promise<Object>}
 */
export async function getYearList (params) {
  return request(`/portal/api/performance/getYearList.jhtml?${stringify(params)}`);
}

/**
 * 获取个人绩效评分
 * @returns {Promise<Object>}
 */
export async function getPerformanceScore (params) {
  return request(`/portal/api/performance/getPerformanceScore.jhtml?${stringify(params)}`);
}

/**
 * 获取个人资产统计
 * @param params
 * @returns {Promise<Object>}
 */
export async function getPersonalAssetsDetails(params) {
  return request(`/portal/api/assets/getPersonalAssetsDetails.jhtml?${stringify(params)}`);
}

/**
 * 获取个人资产统计
 * @param params
 * @returns {Promise<Object>}
 */
export async function getChargeAssetsDetails(params) {
  return request(`/portal/api/assets/getChargeAssetsDetails.jhtml?${stringify(params)}`);
}

/**
 * 获取资产明细
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAssetsList(params) {
  return request(`/portal/api/assets/getAssetsList.jhtml?${stringify(params)}`);
}

/**
 * 获取请假天数统计表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getLeaveDaysStatistic(params) {
  return request(`/portal/api/attendance/getLeaveDaysStatistic.jhtml?${stringify(params)}`);
}

/**
 * 获取请假详情表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getLeaveDetails(params) {
  return request(`/portal/api/attendance/getLeaveDetails.jhtml?${stringify(params)}`);
}

/**
 * 获取出差详情表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getBusinessTripDetail(params) {
  return request(`/portal/api/attendance/getBusinessTripDetail.jhtml?${stringify(params)}`);
}

/**
 * 获取迟到旷工表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getLateAbsenteeism(params) {
  return request(`/portal/api/attendance/getLateAbsenteeism.jhtml?${stringify(params)}`);
}

/**
 * 获取表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAbsenteeism(params) {
  return request(`/portal/api/attendance/getAbsenteeism?${stringify(params)}`);
}
/**
 * 获取考勤总览数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getSummaryAttendance(params) {
  return request(`/portal/api/attendance/getSummaryAttendance?${stringify(params)}`);
}
/**
 * 获取考勤记录数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAttendanceRecord(params) {
  return request(`/portal/api/attendance/getAttendanceRecord?${stringify(params)}`);
}

/**
 * 获取打卡异常信息
 */
export async function getException(params) {
  return request(`/portal/api/attendance/getException?${stringify(params)}`);
}

/**
 * 获取培训总览
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTrainingOverview(params) {
  return request(`/portal/api/train/getTrainingOverview?${stringify(params)}`);
}
/**
 * 获取培训总览
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTrainingDetails(params) {
  return request(`/portal/api/train/queryTrain?${stringify(params)}`);
}

/**
 * 获取表单信息
 */
export async function getBaseInfo(params) {
  return request(`/portal/api/person/getBaseInfo?${stringify(params)}`);
}

/**
 * 验证密码
 */
export async function checkPwd(params) {
  return request(`/portal/api/person/checkPwd?${stringify(params)}`);
}

/**
 * 获取因公外出信息
 */
export async function getBusinessTrip(params) {
  return request(`/portal/api/attendance/getBusinessTrip?${stringify(params)}`);
}
/**
 * 获取常用流程
 */
export async function getQuickProcess(params) {
  return request(`/portal/api/hrService/getQuickProcess?${stringify(params)}`);
}

/**
 *检查个人是否考勤异常
 */
export async function checkPersonExp(params) {
  return request(`/portal/api/attendance/checkPersonExp`);
}
/**
 *检查消息通知数量
 */
export async function getMsgCount(params) {
  return request(`/portal/api/person/getMsgCount`);
}

/**
 * 获取个人反馈下拉框的内容
 * @param params
 * @returns {Promise<Object>}
 */
export async function getFeedback (params) {
  return request(`/portal/api/hrService/getDicList`);
}

/**
 * 校验是否领导
 */
export async function checkLeader (params) {
  return request(`/portal/api/hrService/checkLeader`);
}
/**
 * 联系我们
 */
export async function getContactUs (params) {
  return request(`/portal/api/hrService/getContactUs`);
}
