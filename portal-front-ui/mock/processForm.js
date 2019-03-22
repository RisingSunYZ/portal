import { parse } from 'url';

export const getFormInfoData = {
  formTitle: '公文发布申请单公文发布申发布申请单-GWFBSQ2018062300010',
  formDesc: '个人费用报销流程适用于员工因工作产生的个人费用报销 建议先按时间顺序贴票，在参考贴好的票据，按贴票顺序提交个人费用报销流程。贴票时，注意票面干净整洁，每张票据需用铅笔在票据右上角标注“票据编号”，每张黏贴单贴票不得超过20张票据。',
  // formUrl: 'http://localhost:8000/form/test-form',
  formUrl: '/test-form.html',
  ownDeptName: '技术开发部',
  processDockingName: '岑伟',
  processDockingNo: '00004907',
  approveType:"ZC",
  revokable:false,
  files: [
    {
      "id":"8a8a948c690e278701690e2787110000",
      "type":3,
      "sourceId":"GFRS00141023",
      "fileName":"logo-3.jpg",
      "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e261939001a.jpg",
      "fileSize":10661,
      "createTime":"2019-02-21 11:44:25",
      "creator":"00010121",
      "delFlag":1
    },
    {
      "id":"8a8a948c690e278701690e2787110001",
      "type":3,
      "sourceId":"GFRS00141023",
      "fileName":"logo-5.jpg",
      "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e26ddcb001b.jpg",
      "fileSize":7063,
      "createTime":"2019-02-21 11:44:25",
      "creator":"00010121",
      "delFlag":1
    },
    {
      "id":"8a8a948c690e278701690e2787110002",
      "type":3,
      "sourceId":"GFRS00141023",
      "fileName":"logo-6.jpg",
      "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e26f1f5001c.jpg",
      "fileSize":8161,
      "createTime":"2019-02-21 11:44:25",
      "creator":"00010121",
      "delFlag":1
    }
  ],
  // flowEnd:{
  //   "userId":"system",
  //   "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
  //   "message":"审批结束",
  //   "time":"2018-12-26 16:40:41",
  //   "type":"SPJS",
  //   "typeName":"审批结束",
  //   "fullMsg":"审批结束"
  // },
  taskType: "1",
  refDocs: [
    {
      "id":"8a8a948c690e278601690e2787240002",
      "processInstanceId":"26d92150a13611e8b01e005056ba81ec",
      "businessKey":"GFRS00141023",
      "refProcessInstanceId":"26d92150a13611e8b01e005056ba81ec",
      "refProcessDefinitionKey":"turn_read",
      "refBusinessKey":"GFTY0018A0006",
      "refName":"组人员待办测试-GFTY0018A0006",
      "createTime":"2019-02-21 11:44:25",
      "updateTime":"2019-02-21 11:44:25",
      "delFlag":1
    },
    {
      "id":"8a8a948c690e278601690e2787240003",
      "processInstanceId":" ",
      "businessKey":"GFRS00141023",
      "refProcessInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "refProcessDefinitionKey":"turn_read",
      "refBusinessKey":"GFGZ00251002",
      "refName":"评审测试-GFGZ00251002",
      "createTime":"2019-02-21 11:44:25",
      "creator":"00009179",
      "updateTime":"2019-02-21 11:44:25",
      "delFlag":1
    }
  ],
  approveRecords: [
    {
      "userId":"00009179",
      "userName":"徐晓珍",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"提交",
      "time":"2018-12-26 16:36:58",
      "type":"TJ",
      "typeName":"提交",
      "fullMsg":"提交"
    },
    {
      "taskId":"6837f2ad08e911e9a149005056ba81ec",
      "userId":"00001808",
      "userName":"张军波",
      "userUrl":"http://10.10.20.204/p-head/2017/12/20/8a8a94aa6059716b016071eb3d7101c1.jpg",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"聚隆科技到家了大事记合适的话技到家了大事记合适的话速度快几十块的哈萨克的哈萨克打算打算聚隆科技到家了大事记",
      "time":"2018-12-26 16:38:36",
      "type":"SP",
      "typeName":"审批",
      "fullMsg":"合适的话速度快几十块的哈萨克的哈萨克了大事记合适的话速度快几十块的哈萨克的哈萨克打算打算聚隆科技到家了十块的哈萨克的哈萨克打算打算聚隆科技到家了大事记合适的话速度快几十块的哈萨克的哈萨克打算打算聚隆科技到家了大事记合适的话速度快几十块的哈萨克的哈萨克打算打算聚隆科技到家了大事记合适的话速度快几十块的哈萨克的哈萨克打算打算聚隆科技到家了大事记"
    },
    {
      "taskId":"a2f04c2908e911e9a149005056ba81ec",
      "userId":"00008686",
      "userName":"高帆",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"紧迫色割破让我去二二二<br>  - 来自移动端",
      "time":"2018-12-26 16:39:11",
      "type":"PS",
      "typeName":"评审",
      "fullMsg":"紧迫色割破让我去二二二<br>  - 来自移动端"
    },
    {
      "taskId":"a2e96e5408e911e9a149005056ba81ec",
      "userId":"00007867",
      "userName":"施源科",
      "userUrl":"http://10.10.20.204/p-head/2017/12/20/8a8a94aa6059716b0160720e458b08f7.jpg",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"会交付或或或或或或或或或或或",
      "time":"2018-12-26 16:40:41",
      "type":"SP",
      "typeName":"审批",
      "fullMsg":"会交付或或或或或或或或或或或"
    }

  ],
  transferRecords: [
    {
      "userId":"00009179",
      "userName":"徐晓珍",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"【徐晓珍转阅给高帆】</br>",
      "time":"2018-12-26 16:37:21",
      "type":"ZY",
      "typeName":"转阅",
      "fullMsg":"【徐晓珍转阅给高帆】</br>"
    },
    {
      "userId":"00008686",
      "userName":"高帆",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"[高帆转阅刘文军]<br><br>  - 来自移动端",
      "time":"2018-12-26 16:43:01",
      "type":"ZY",
      "typeName":"转阅",
      "fullMsg":"[高帆转阅刘文军]<br><br>  - 来自移动端"
    },
    {
      "userId":"00004737",
      "userName":"刘文军",
      "userUrl":"http://10.10.20.204/p-head/2017/12/20/8a8a94aa6059716b016071f45fd60530.jpg",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"【刘文军转阅给刘文军】</br>测试111",
      "time":"2018-12-26 16:56:41",
      "type":"ZY",
      "typeName":"转阅",
      "fullMsg":"【刘文军转阅给刘文军】</br>测试111"
    },
    {
      "userId":"00004737",
      "userName":"刘文军",
      "userUrl":"http://10.10.20.204/p-head/2017/12/20/8a8a94aa6059716b016071f45fd60530.jpg",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"【刘文军转阅给刘文军】</br>cs 2018年12月26日17:08:04",
      "time":"2018-12-26 17:08:10",
      "type":"ZY",
      "typeName":"转阅",
      "fullMsg":"【刘文军转阅给刘文军】</br>cs 2018年12月26日17:08:04"
    },
    {
      "userId":"00004737",
      "userName":"刘文军",
      "userUrl":"http://10.10.20.204/p-head/2017/12/20/8a8a94aa6059716b016071f45fd60530.jpg",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"【刘文军转阅给刘文军,谢桐见,徐龚海,岑伟,龚守辉,张云飞,刘衡,吴昌,彭德意,鲁颂贺】</br>cs 1221312",
      "time":"2018-12-26 17:29:28",
      "type":"ZY",
      "typeName":"转阅",
      "fullMsg":"【刘文军转阅给刘文军,谢桐见,徐龚海,岑伟,龚守辉,张云飞,刘衡,吴昌,彭德意,鲁颂贺】</br>cs 1221312"
    },
    {
      "userId":"00004907",
      "userName":"岑伟",
      "userUrl":"http://10.10.20.204/p-head/2017/12/20/8a8a94aa6059716b016071f473500554.jpg",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"【岑伟转阅给黄洪靖】</br>",
      "time":"2018-12-26 17:34:35",
      "type":"ZY",
      "typeName":"转阅",
      "fullMsg":"【岑伟转阅给黄洪靖】</br>"
    },
    {
      "taskId":"bdacc3b408f011e9b8e4005056ba984d",
      "userId":"00009780",
      "userName":"刘衡",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"",
      "time":"2019-01-30 11:20:55",
      "type":"YY",
      "typeName":"已阅"
    },
    {
      "taskId":"bdafd10308f011e9b8e4005056ba984d",
      "userId":"00010121",
      "userName":"鲁颂贺",
      "processInstanceId":"6837cc7808e911e9a149005056ba81ec",
      "message":"",
      "time":"2019-02-20 15:11:41",
      "type":"YY",
      "typeName":"已阅"
    }
  ],
  postscriptsFiles: [],
  postscripts: [
    {
      "createTime":"2019-02-21 11:27:12",
      "files":[
        {
          "id":"8a8a948c690e17c001690e17c0f10000",
          "type":1,
          "sourceId":"36617fb4b99649928f9971aafdde37ed",
          "fileName":"logo-2.jpg",
          "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e174831000e.jpg",
          "fileSize":9155,
          "createTime":"2019-02-21 11:27:12",
          "creator":"00010121",
          "delFlag":1
        },
        {
          "id":"8a8a948c690e17c001690e17c0f10001",
          "type":1,
          "sourceId":"36617fb4b99649928f9971aafdde37ed",
          "fileName":"logo-3.jpg",
          "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e178350000f.jpg",
          "fileSize":10661,
          "createTime":"2019-02-21 11:27:12",
          "creator":"00010121",
          "delFlag":1
        },
        {
          "id":"8a8a948c690e17c001690e17c0f10002",
          "type":1,
          "sourceId":"36617fb4b99649928f9971aafdde37ed",
          "fileName":"logo-5.jpg",
          "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e17a9060010.jpg",
          "fileSize":7063,
          "createTime":"2019-02-21 11:27:12",
          "creator":"00010121",
          "delFlag":1
        }
      ],
      "id":"36617fb4b99649928f9971aafdde37ed",
      "content":"这是附言2"
    },
    {
      "createTime":"2019-02-21 11:27:36",
      "files":[
        {
          "id":"8a8a948c690e17c001690e181e3a0003",
          "type":1,
          "sourceId":"995f7dec25e1407bbcb440713bbfc718",
          "fileName":"logo-11.jpg",
          "fileUrl":"/form/2019/02/21/8a8a94d6690df4d001690e1823430011.jpg",
          "fileSize":10196,
          "createTime":"2019-02-21 11:27:35",
          "creator":"00010121",
          "delFlag":1
        }
      ],
      "id":"995f7dec25e1407bbcb440713bbfc718",
      "content":"附言数据3"
    }
  ],
};

export const getProcessFormStateData = {};

export const responseBody = {
  code: '1',
  msg: '操作成功',
  data: {},
};
export const getBaseInfo = {
  "processDockingName":"潘丽华",
  "userInfo":{
    "postname":" ",
    "deptName":"技术开发部",
    "mobilePhone":"15858240570",
    "companyName":"亚厦集团",
    "name":"王影杰",
    "startTime":"2018-05-23 13:10:07"
  },
  "ownDeptName":"财务中心",
  "processDockingNo":"00003992",
  "bizId":"EBXD201805230010",
  "formTitle":"费用报销单-EBXD201805230010",
  "proInstId":"8f34ef555e4711e88b64005056ba95d4",
  "taskId":"8f3a94d75e4711e88b64005056ba95d4"
};

export const getBackNodes = {
  "pagination":{
    "current":0,
      "total":1,
      "pageSize":20
  },
  "list":[
    {
      "nodeId":"sid-B24D7D15-6ED4-4B5E-8FE2-1FCF2A692744",
      "nodeName":"提交人",
      "userCode":"00004441",
      "userName":"王影杰",
      "endTime":"2018-05-23 13:10:07"
    }
  ]
};
// export const getFormUrl = {"formUrl":"/portal/form/custom/index.jhtml?modelKey\u003dGFRS0014\u0026bizFormSn\u003dGFRS0014"};
export const getFormUrl = {"formUrl":"/test-form.html"};

export default {
  'GET /portal/api/process/getFormInfo': getFormInfoData,
  'POST /portal/api/process/getFormInfo': getFormInfoData,
  'GET /portal/api/process/saveSp': responseBody,
  'POST /portal/api/process/saveSp': responseBody,
  'GET /portal/api/process/getFormUrl': getFormUrl,
  'POST /portal/api/process/getFormUrl': getFormUrl,
  'GET /portal/api/process/getBaseInfo': getBaseInfo,
  'POST /portal/api/process/getBaseInfo': getBaseInfo,
  'GET /portal/api/process/getBackNodes': getBackNodes,
  'POST /portal/api/process/getBackNodes': getBackNodes,

};
