const getProcessModel = (req, res) =>
  res.json([
    {
      "id": "myDraft",
      "name": "我的草稿",
      "pid": "",
      "code": "my_draft"
    },
    {
      "id": "8a948c78589a8f4101589a92c5b10001",
      "name": "通用类型",
      "pid": "",
      "code": "101",
      "children": [
        {
          "id": "8a8a94ab67eddb240167ee13a9b70003",
          "name": "法务管理",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "8321"
        },
        {
          "id": "8a8a94ab68127434016812897b3c0015",
          "name": "管理改进",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "8567"
        },
        {
          "id": "8a948c78589a8f4101589a9322790002",
          "name": "行政审批",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "102"
        },
        {
          "id": "8a948c78589a8f4101589a93659f0003",
          "name": "工作管理",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "103"
        },
        {
          "id": "8a948c78589a8f4101589a93b9b50004",
          "name": "行政管理",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "104"
        },
        {
          "id": "8a948c78589a8f4101589a945d5d0005",
          "name": "人事审批",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "105"
        },
        {
          "id": "8a948c78589a8f4101589a949a130006",
          "name": "财务审批",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "106"
        },
        {
          "id": "8a8a94aa5e145290015e145290220000",
          "name": "IT服务",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "107"
        },
        {
          "id": "8a8a94aa5e9e0894015ea1fce8260008",
          "name": "审计管理",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "130"
        },
        {
          "id": "8a8a94aa6077a97d01607859e3a00002",
          "name": "工管流程",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "113"
        },
        {
          "id": "8a8a94aa60c0561b0160d3e3b9b10028",
          "name": "发文管理",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "115"
        },
        {
          "id": "8a8a94aa60c0561b0160d987c87200a7",
          "name": "工地流程",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "CSHR"
        },
        {
          "id": "8a8a94aa61213a5e0161315ea8340032",
          "name": "MPMS",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "117"
        },
        {
          "id": "8a8a94aa655b5d5b01655b6f80a10004",
          "name": "测试02",
          "pid": "8a948c78589a8f4101589a92c5b10001",
          "code": "19"
        }
      ]
    },
    {
      "id": "e5d6d6cfac204dc184ca6559d46ae649",
      "name": "测试2",
      "pid": "",
      "code": "000018",
      "children": [
        {
          "id": "7558fd5d3e4c4f02af308b6c833d688e",
          "name": "reye",
          "pid": "e5d6d6cfac204dc184ca6559d46ae649",
          "code": "werwe",
          "children": [
            {
              "id": "f114b506338c4b3c9420066497daa13b",
              "name": "35",
              "pid": "7558fd5d3e4c4f02af308b6c833d688e",
              "code": "4364"
            }
          ]
        },
        {
          "id": "8d63706e5118411bb74beed7c80e8c71",
          "name": "345",
          "pid": "e5d6d6cfac204dc184ca6559d46ae649",
          "code": "5235"
        }
      ]
    },
    {
      "id": "8a8a94aa5e3c8deb015e3c8debd80000",
      "name": "人事管理",
      "pid": "",
      "code": "120",
      "children": [
        {
          "id": "8a8a94aa5e3c8deb015e3c8ea4ca0001",
          "name": "123",
          "pid": "8a8a94aa5e3c8deb015e3c8debd80000",
          "code": "132"
        }
      ]
    },
    {
      "id": "8a8a94aa5e145290015e145388b00002",
      "name": "亚厦装饰",
      "pid": "",
      "code": "108",
      "children": [
        {
          "id": "8a8a94aa6097286e0160a17422b30025",
          "name": "工程管理",
          "pid": "8a8a94aa5e145290015e145388b00002",
          "code": "114"
        },
        {
          "id": "8a8a94aa5e145290015e1453f3b10003",
          "name": "行政审批",
          "pid": "8a8a94aa5e145290015e145388b00002",
          "code": "963"
        }
      ]
    },
    {
      "id": "8a8a94aa5e145290015e16dbe15b0044",
      "name": "亚厦幕墙",
      "pid": "",
      "code": "110",
      "children": [
        {
          "id": "8a8a94aa60c0561b0160d8841ee4006c",
          "name": "工程管理",
          "pid": "8a8a94aa5e145290015e16dbe15b0044",
          "code": "116"
        },
        {
          "id": "8a8a94aa5e2da0c3015e2db01b880002",
          "name": "人事管理",
          "pid": "8a8a94aa5e145290015e16dbe15b0044",
          "code": "1121"
        },
        {
          "id": "8a8a94aa5e145290015e16e0607a0045",
          "name": "IT服务",
          "pid": "8a8a94aa5e145290015e16dbe15b0044",
          "code": "1111"
        }
      ]
    },
    {
      "id": "8a8a94aa5e706633015e74a26d9f0035",
      "name": "亚厦机电",
      "pid": "",
      "code": "200",
      "children": [
        {
          "id": "8a8a94aa5e706633015e74a3b06f0036",
          "name": "合同类",
          "pid": "8a8a94aa5e706633015e74a26d9f0035",
          "code": "01"
        }
      ]
    },
    {
      "id": "8a8a94aa5e706633015e7085ab10000e",
      "name": "上海蓝天",
      "pid": "",
      "code": "999",
      "children": [
        {
          "id": "8a8a94aa5e706633015e708607f6000f",
          "name": "人事类",
          "pid": "8a8a94aa5e706633015e7085ab10000e",
          "code": "899"
        }
      ]
    },
    {
      "id": "8a8a94aa5e758e5d015e75927af40005",
      "name": "蘑菇加",
      "pid": "",
      "code": "222",
      "children": [
        {
          "id": "8a8a94aa5e758e5d015e759364b30006",
          "name": "行政管理",
          "pid": "8a8a94aa5e758e5d015e75927af40005",
          "code": "1000"
        },
        {
          "id": "8a8a94aa5e758e5d015e7593c2360007",
          "name": "人事管理",
          "pid": "8a8a94aa5e758e5d015e75927af40005",
          "code": "88"
        },
        {
          "id": "8a8a94aa5e758e5d015e759426310008",
          "name": "合同管理",
          "pid": "8a8a94aa5e758e5d015e75927af40005",
          "code": "66"
        }
      ]
    },
    {
      "id": "8a949efb67e495460167e49611430001",
      "name": "124",
      "pid": "",
      "code": "124"
    }
  ]);


const getProcessModelData = (req, res, url) =>{
  console.log(req, res,url)

  res.json([
    {
      "modelName": "加班申请流程",
      "modelKey": "GFRS0014",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "薪资卡福利申请流程",
      "modelKey": "GFRS0017",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "超市卡福利申请流程",
      "modelKey": "GFRS0018",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "人事资料需求申请流程",
      "modelKey": "GFRS0019",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "请假/调休申请流程",
      "modelKey": "GFRS0022",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "离职交接申请流程",
      "modelKey": "GFRS0023",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "人事证明申请流程",
      "modelKey": "GFRS0024",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "离职证明申请流程",
      "modelKey": "GFRS0025",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "员工离职申请流程",
      "modelKey": "GFRS0028",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "公司内部调岗申请流程",
      "modelKey": "GFRS0030",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "跨公司调岗申请流程",
      "modelKey": "GFRS0031",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "人员信息控件测试",
      "modelKey": "GFRS0047",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "亚厦股份加入黑名单申请流程",
      "modelKey": "GFRS0036",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "Eva出差回执流程",
      "modelKey": "GFRS0044",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "补贴申请流程",
      "modelKey": "GFRS0026",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    },
    {
      "modelName": "新进员工录用申请流程",
      "modelKey": "GFRS0037",
      "appliedRange": 1,
      "belongCategoryStr": "(通用类型-人事审批)",
      "pid": "8a948c78589a8f4101589a92c5b10001",
      "delFlag": 1
    }
  ]);

}
export default {
  'GET /portal/api/process/ajaxListWfCategory': getProcessModel,
  'POST /portal/api/process/ajaxListWfCategory': getProcessModel,
  'GET /rest/process/list/ajaxListModel': getProcessModelData,
  'POST /rest/process/list/ajaxListModel': getProcessModelData,
};





