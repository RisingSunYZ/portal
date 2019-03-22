const getDraft = (req, res) =>
  res.json([
    {
      "id": "8a8a8c39653ce27201655bbbc50b01b8",
      "type": 1,
      "name": "数字测试-GFGZ0027A0112",
      "processDefinitionKey": "GFGZ0027",
      "businessKey": "GFGZ0027A0112",
      "status": 1,
      "statusName": "草稿",
      "createTimeStr": "2018年08月21日 17:05:57",
      "createTime": "2018-08-21 17:05:57",
      "creator": "00004737",
      "delFlag": 1
    }, {
      "id": "8a8a948c6585199d016585263ccf0015",
      "type": 1,
      "name": "T1152-GFTY0034A0011",
      "processDefinitionKey": "GFTY0034",
      "businessKey": "GFTY0034A0011",
      "status": 1,
      "statusName": "草稿",
      "createTimeStr": "2018年08月29日 18:06:40",
      "createTime": "2018-08-29 18:06:40",
      "creator": "00004737",
      "delFlag": 1
    }, {
      "id": "8a8a948c65a2882f0165a3773343005d",
      "type": 1,
      "name": "Eva出差回执流程-GFRS0044A0042",
      "processDefinitionKey": "GFRS0044",
      "businessKey": "GFRS0044A0042",
      "status": 1,
      "statusName": "草稿",
      "createTimeStr": "2018年09月04日 15:23:42",
      "createTime": "2018-09-04 15:23:42",
      "creator": "00004737",
      "delFlag": 1
    }, {
      "id": "8a8a948c65efe8020165f0742173003f",
      "type": 1,
      "name": "发文申请流程Eva-XWGG201809190034",
      "processDefinitionKey": "ysportal_news_notice",
      "processInstanceId": "",
      "businessKey": "XWGG201809190034",
      "url": "/portal/form/newsNotice/input.jhtml",
      "status": 1,
      "statusName": "草稿",
      "createTimeStr": "2018年09月19日 14:11:07",
      "createTime": "2018-09-19 14:11:07",
      "creator": "00004737",
      "delFlag": 1
    }, {
      "id": "8a8a94ab683abcb001683be63273000c",
      "type": 1,
      "name": "竞争执行测试-GFGZ00281024",
      "processDefinitionKey": "GFGZ0028",
      "businessKey": "GFGZ00281024",
      "status": 1,
      "statusName": "草稿",
      "createTimeStr": "2019年01月11日 15:52:48",
      "createTime": "2019-01-11 15:52:48",
      "creator": "00004737",
      "delFlag": 1
    }
    ]);
const getDraftsCount = (req, res) =>
  res.json(5);

export default {
  'GET /portal/api/process/ajaxListMyDraft.jhtml': getDraft,
  'POST /portal/api/process/ajaxListMyDraft.jhtml': getDraft,
  'GET /portal/api/process/ajaxListMyDraftCount.jhtml': getDraftsCount,
  'POST /portal/api/process/ajaxListMyDraftCount.jhtml': getDraftsCount,

};
