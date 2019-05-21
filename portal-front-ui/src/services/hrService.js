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
 * 培训
 * @param params
 * @returns {Promise<Object>}
 */
export async function queryTrain(params) {
  return request(`/rest/portal/train/queryTrain?${stringify(params)}`);
}


/**
 *获取个人绩效表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getHrPerformanceList(params) {
  //FIXME
  return request(`/portal/api/performance/getHrPerformanceList.jhtml?${stringify(params)}`);
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
  // FIXME 接口对接
  // return {"pfNumber":1,"qxlist":[{"id":"8a8a8fc0680e171801680e4291f70026","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personJd":"8a8a8fb65926f9b901592701aeab2749","personCode":"00004737","name":"刘文军","billId":"8a8a8fbd680cd84701680cde78a9000d","billCode":"GFRS00221180","type":10,"subType":90,"flowStime":"2019-01-02 00:00:00","startTime":"2019-01-02 09:00:00","endTime":"2019-01-02 12:00:00","day":0.5,"remark":"送孩子他妈到火车站","sourceName":"流程中心","timestamp":1546427404000,"typeName":"请假","procInstId":"084daead1d6211e9a3a3507b9dc529a6","proDefKey":"GFRS0022","subTypeStr":"调休","createTime":"2019-01-02 19:11:10","creator":"sys","updateTime":"2019-01-02 19:11:10","updator":"sys","delFlag":1}],"alist":{"工伤假":80,"事假":10,"婚假":30,"哺乳假":50,"产假":40,"丧假":70,"其他":100,"病假":20,"陪护假":60,"调休":90}}
  return request(`/portal/api/attendance/getLeaveDetails.jhtml?${stringify(params)}`);
}

/**
 * 获取出差详情表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getBusinessTripDetail(params) {
  // FIXME 接口对接
  // return {}
  return request(`/portal/api/attendance/getBusinessTripDetail.jhtml?${stringify(params)}`);
}

/**
 * 获取迟到旷工表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getLateAbsenteeism(params) {
  // FIXME
  // return {"pfNumber":0,"lalist":[]}
  return request(`/portal/api/attendance/getLateAbsenteeism.jhtml?${stringify(params)}`);
}

/**
 * 获取表格数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAbsenteeism(params) {
  // return {"pfNumber":12,"ealist":[{"id":"8a949e5d6a9fcdd0016a9fce1d455349","no":"00004737","name":"刘文军","personId":"8a8a8fb65926f9b901592701aeab2749","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","absenteeismDay":1.0,"absenteeismTime":"2019-05-01 00:00:00","typeName":"旷工","createTime":"2019-05-10 11:34:06","creator":"sys","updateTime":"2019-05-10 11:34:06","updator":"sys","delFlag":1},{"id":"8a949e5d6a9fcdd0016a9fce1d49534a","no":"00004737","name":"刘文军","personId":"8a8a8fb65926f9b901592701aeab2749","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","absenteeismDay":1.0,"absenteeismTime":"2019-05-02 00:00:00","typeName":"旷工","createTime":"2019-05-10 11:34:06","creator":"sys","updateTime":"2019-05-10 11:34:06","updator":"sys","delFlag":1},{"id":"8a949e5d6a9fcdd0016a9fce1d51534b","no":"00004737","name":"刘文军","personId":"8a8a8fb65926f9b901592701aeab2749","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","absenteeismDay":1.0,"absenteeismTime":"2019-05-03 00:00:00","typeName":"旷工","createTime":"2019-05-10 11:34:06","creator":"sys","updateTime":"2019-05-10 11:34:06","updator":"sys","delFlag":1},{"id":"8a949e3869b791db0169b79e30a700f8","no":"00004737","name":"刘文军","personId":"8a8a8fb65926f9b901592701aeab2749","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","absenteeismDay":1.0,"absenteeismTime":"2019-03-01 00:00:00","typeName":"旷工","createTime":"2019-03-26 09:29:51","creator":"admin","updateTime":"2019-03-26 09:29:51","updator":"admin","delFlag":1},{"id":"8a949e3869b791db0169b79e30ac00f9","no":"00004737","name":"刘文军","personId":"8a8a8fb65926f9b901592701aeab2749","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","absenteeismDay":1.0,"absenteeismTime":"2019-03-04 00:00:00","typeName":"旷工","createTime":"2019-03-26 09:29:51","creator":"admin","updateTime":"2019-03-26 09:29:51","updator":"admin","delFlag":1}]}
  return request(`/portal/api/attendance/getAbsenteeism.jhtml?${stringify(params)}`);
}
/**
 * 获取考勤总览数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getSummaryAttendance(params) {
  // return {"no":"00004737","year":2019,"shouldWorkday":21.0,"normalWorkday":9.0,"attendance":42.86,"moreAttendanceToOthers":36.36,"avgWorkHour":9.7,"leaveCount":0,"leaveDay":0.0,"travelCount":0,"travelDay":0.0,"goOutCount":0,"lateOrEarlyleave":0,"absenteeism":12.0,"absenteeismCount":12,"delFlag":1}
  return request(`/portal/api/attendance/getSummaryAttendance.jhtml?${stringify(params)}`);
}
/**
 * 获取考勤记录数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAttendanceRecord(params) {
  // FIXME 接口对接
  // return {"data":"刘文军","datas":[{"sdate":"2019-05-01 00:00:00","type":30,"staticDayList":[{"id":"8a8a946b6a4d0303016a85bc372e0072","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-01 00:00:00","isWorkday":1,"startGwork":"2019-05-01 09:00:00","endGwork":"2019-05-01 18:00:00","startXwork":"2019-05-01 12:00:00","endXwork":"2019-05-01 13:00:00","startCwork":"2019-05-01 09:00:00","endCwork":"2019-05-01 18:00:00","type":90,"subType":140,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1},{"id":"8a8a946b6a4d0303016a85bc37360073","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-01 00:00:00","isWorkday":1,"startGwork":"2019-05-01 09:00:00","endGwork":"2019-05-01 18:00:00","startXwork":"2019-05-01 12:00:00","endXwork":"2019-05-01 13:00:00","startCwork":"2019-05-01 09:00:00","endCwork":"2019-05-01 18:00:00","type":90,"subType":150,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1}],"lateStatus":0,"leaveEarlyStatus":0,"monNotPunch":1,"aftNotPunch":1,"monAbnormalFlow":1,"monFlowStatus":"未处理","aftAbnormalFlow":1,"aftFlowStatus":"未处理"},{"sdate":"2019-05-02 00:00:00","type":30,"staticDayList":[{"id":"8a8a946b6a4d0303016a85bc37ee0077","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-02 00:00:00","isWorkday":1,"startGwork":"2019-05-02 09:00:00","endGwork":"2019-05-02 18:00:00","startXwork":"2019-05-02 12:00:00","endXwork":"2019-05-02 13:00:00","startCwork":"2019-05-02 09:00:00","endCwork":"2019-05-02 18:00:00","type":90,"subType":140,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1},{"id":"8a8a946b6a4d0303016a85bc37f10078","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-02 00:00:00","isWorkday":1,"startGwork":"2019-05-02 09:00:00","endGwork":"2019-05-02 18:00:00","startXwork":"2019-05-02 12:00:00","endXwork":"2019-05-02 13:00:00","startCwork":"2019-05-02 09:00:00","endCwork":"2019-05-02 18:00:00","type":90,"subType":150,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1}],"lateStatus":0,"leaveEarlyStatus":0,"monNotPunch":1,"aftNotPunch":1,"monAbnormalFlow":1,"monFlowStatus":"未处理","aftAbnormalFlow":1,"aftFlowStatus":"未处理"},{"sdate":"2019-05-03 00:00:00","type":30,"staticDayList":[{"id":"8a8a946b6a4d0303016a85bc38ad007f","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-03 00:00:00","isWorkday":1,"startGwork":"2019-05-03 09:00:00","endGwork":"2019-05-03 18:00:00","startXwork":"2019-05-03 12:00:00","endXwork":"2019-05-03 13:00:00","startCwork":"2019-05-03 09:00:00","endCwork":"2019-05-03 18:00:00","type":90,"subType":140,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1},{"id":"8a8a946b6a4d0303016a85bc38b30081","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-03 00:00:00","isWorkday":1,"startGwork":"2019-05-03 09:00:00","endGwork":"2019-05-03 18:00:00","startXwork":"2019-05-03 12:00:00","endXwork":"2019-05-03 13:00:00","startCwork":"2019-05-03 09:00:00","endCwork":"2019-05-03 18:00:00","type":90,"subType":150,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1}],"lateStatus":0,"leaveEarlyStatus":0,"monNotPunch":1,"aftNotPunch":1,"monAbnormalFlow":1,"monFlowStatus":"未处理","aftAbnormalFlow":1,"aftFlowStatus":"未处理"},{"sdate":"2019-05-04 00:00:00","type":40,"staticDayList":[{"id":"8a8a946b6a4d0303016a85bc394c0085","companyId":"0001K310000000008TK6","deptId":"1001K31000000002GLCT","personId":"8a8a8fb65926f9b901592701aeab2749","code":"00004737","name":"刘文军","sdate":"2019-05-04 00:00:00","isWorkday":0,"startGwork":"2019-05-04 09:00:00","endGwork":"2019-05-04 18:00:00","startXwork":"2019-05-04 12:00:00","endXwork":"2019-05-04 13:00:00","startCwork":"2019-05-04 09:00:00","endCwork":"2019-05-04 18:00:00","type":300,"lateOrLeaveEarlyMinutes":0,"createTime":"2019-05-05 10:04:26","creator":"sys","updateTime":"2019-05-05 10:04:26","updator":"sys","delFlag":1}],"lateStatus":0,"leaveEarlyStatus":0,"monNotPunch":0,"aftNotPunch":0,"monAbnormalFlow":0,"aftAbnormalFlow":0}]}
  return request(`/portal/api/attendance/getAttendanceRecord.jhtml?${stringify(params)}`);
}

/**
 * 获取打卡异常信息
 */
export async function getException(params) {
  // FIXME
  // return [{"id":"8a8a946b6a4d0303016a85bc38ad007f","sdate":"2019-05-03 00:00:00","dateStr":"2019年05月03日","type":140,"typeName":"上班打卡异常","weekStr":"星期五","content":"--","punchPoint":"--","status":"未处理","opration":1},{"id":"8a8a946b6a4d0303016a85bc38b30081","sdate":"2019-05-03 00:00:00","dateStr":"2019年05月03日","type":150,"typeName":"下班打卡异常","weekStr":"星期五","content":"--","punchPoint":"--","status":"未处理","opration":1},{"id":"8a8a946b6a4d0303016a85bc37ee0077","sdate":"2019-05-02 00:00:00","dateStr":"2019年05月02日","type":140,"typeName":"上班打卡异常","weekStr":"星期四","content":"--","punchPoint":"--","status":"未处理","opration":1},{"id":"8a8a946b6a4d0303016a85bc37f10078","sdate":"2019-05-02 00:00:00","dateStr":"2019年05月02日","type":150,"typeName":"下班打卡异常","weekStr":"星期四","content":"--","punchPoint":"--","status":"未处理","opration":1},{"id":"8a8a946b6a4d0303016a85bc372e0072","sdate":"2019-05-01 00:00:00","dateStr":"2019年05月01日","type":140,"typeName":"上班打卡异常","weekStr":"星期三","content":"--","punchPoint":"--","status":"未处理","opration":1},{"id":"8a8a946b6a4d0303016a85bc37360073","sdate":"2019-05-01 00:00:00","dateStr":"2019年05月01日","type":150,"typeName":"下班打卡异常","weekStr":"星期三","content":"--","punchPoint":"--","status":"未处理","opration":1}]
  return request(`/portal/api/attendance/getException.jhtml?${stringify(params)}`);
}

/**
 * 获取培训总览
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTrainingOverview(params) {
  // FIXME
  // return {"currentYear":"2019","trainNum":0,"planClassHours":0.0,"planClassHoursObligatory":0.0,"planClassHoursElective":0.0,"planClassHoursShare":0.0,"realClassHours":0.0,"realClassHoursObligatory":0.0,"realClassHoursElective":0.0,"realClassHoursShare":0.0,"couresScores":0.0,"quarter":0,"delFlag":1}
  return request(`/portal/api/train/getTrainingOverview.jhtml?${stringify(params)}`);
}
/**
 * 获取培训总览
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTrainingDetails(params) {
  //FIXME
  // return {"pagination":{"current":1,"total":0,"pageSize":5},"list":[]}
  return request(`/portal/api/train/queryTrain.jhtml?${stringify(params)}`);
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
  // FIXME
  // return {}
  return request(`/portal/api/attendance/getBusinessTrip.jhtml?${stringify(params)}`);
}
/**
 * 获取常用流程
 */
export async function getQuickProcess(params) {
  return request(`/rest/portal/hrService/getQuickProcess?${stringify(params)}`);
}

/**
 *检查个人是否考勤异常
 */
export async function checkPersonExp(params) {
  return request(`/rest/portal/attendance/checkPersonExp`);
  }
/**
 *检查消息通知数量
 */
export async function getMsgCount(params) {
  return request(`/portal/api/person/getMsgCount.jhtml`);
}

/**
 * 获取个人反馈下拉框的内容
 * @param params
 * @returns {Promise<Object>}
 */
export async function getFeedback (params) {
  return request(`/portal/api/hrService/getDicList.jhtml`);
}

/**
 * 校验是否领导
 */
export async function checkLeader (params) {
  return request(`/rest/portal/hrService/checkLeader`);
}
/**
 * 联系我们
 */
export async function getContactUs (params) {
  return request(`/portal/api/hrService/getContactUs.jhtml`);
}
