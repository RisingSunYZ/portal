import { parse } from 'url';

const getMsgCount = (req,res)=>{
  res.json({"code":1,"msg":"查询数据成功！","data":{"xtxx":0,"lczx":6}});
}


export default {
  'GET /portal/api/person/getMsgCount.jhtml': getMsgCount,
  'POST /portal/api/person/getMsgCount.jhtml': getMsgCount,
};
