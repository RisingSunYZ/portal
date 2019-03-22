import { stringify } from 'qs';
import request from '../utils/request';

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

// /**
//  * 获取培训课程Table数据（团队）
//  * @param params
//  * @returns {Promise<Object>}
//  */
// export async function getTrainingCourse(params) {
//   return request(`/portal/api/train/getTrainingCourse.jhtml?${stringify(params)}`);
// }
//
// /**
//  * 获取课程开发Table数据（团队）
//  * @param params
//  * @returns {Promise<Object>}
//  */
// export async function getCourseDevelop(params) {
//   return request(`/portal/api/train/getCourseDevelop.jhtml?${stringify(params)}`);
// }
//
// /**
//  * 获取人均完成Table数据（团队）
//  * @param params
//  * @returns {Promise<void>}
//  */
// export async function getComplete(params) {
//   return request(`/portal/api/train/getComplete.jhtml?${stringify(params)}`);
// }
//
// /**
//  * 获取培训详情（团队）
//  * @param params
//  * @returns {Promise<void>}
//  */
// export async function getTrainingDetail(params) {
//   return request(`/portal/api/train/getTrainingDetail.jhtml?${stringify(params)}`);
// }

/**
 * 获取打卡异常信息
 */
export async function getException(params) {
  return request(`/portal/api/attendance/getException.jhtml?${stringify(params)}`);
}

/**
 * 获取考勤记录数据
 * @param params
 * @returns {Promise<Object>}
 */
export async function getAttendanceRecord(params) {
  return request(`/portal/api/attendance/getAttendanceRecord.jhtml?${stringify(params)}`);
}

/**
 * 考勤数据可视化（团队平均时长）
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTeamAttendChart(params) {
  return request(`/portal/api/attendance/getTeamAttendChart.jhtml?${stringify(params)}`);
}

/**
 * 考勤数据可视化（团队考勤率）
 * @param params
 * @returns {Promise<Object>}
 */
export async function getTeamAttendRateChart(params) {
  return request(`/portal/api/attendance/getTeamAttendRateChart.jhtml?${stringify(params)}`);
}

/**
 * 获取兄弟部门
 * @param params
 * @returns {Promise<Object>}
 */
export async function getSiblingDepts(params) {
  return request(`/portal/api/attendance/getSiblingDepts.jhtml?${stringify(params)}`);
}

/**
 * 查询子部门
 */
export async function getDeptList(params) {
  return request(`/portal/api/hrService/getDeptList.jhtml?${stringify(params)}`);
}
/**
 * 查询管辖部门树
 */
export async function getDeptTree(params) {
  return request(`/portal/api/hrService/getDeptTree.jhtml?${stringify(params)}`);
}

/**
 * 查询顶级部门
 */
export async function getTopDept(params) {
  return request(`/portal/api/hrService/getTopDept.jhtml?${stringify(params)}`);
}

/**
 * 获取管理部门id列表
 */
export async function getDeptIds(params) {
  return request(`/portal/api/hrService/getAllDeptIds.jhtml?${stringify(params)}`);
}
