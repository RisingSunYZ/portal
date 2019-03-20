package com.dragon.portal.constant;

/**
 * @Description: 流程中心的一些常量
 * @Author: Bruce.liu
 * @Since:10:08 2018/9/8
 * 浙江亚厦 2018 ~ 2030 版权所有
 */
public class PortalConstant {
    public static final String ERROR = "0";
    public static final String SUCCESS = "1";
    public static final Integer DEL_FLAG = 0;
    public static final Integer NO_DELETE_FLAG = 1;


    /**
     * 用户Cookie相关的key
     */
    //cookie存活时间一个月
    public static final int COOKIE_TITLE_MONTH = 2592000;
    /** IT服务=1 */
    public static final int IT_SERVICE_FLAG = 1;

    /** HR服务=2 */
    public static final int HR_SERVICE_FLAG = 2;

    /** 启用[上架]状态 */
    public static final int STATUS_ENABLED = 1;
    //用户会话信息对象在redis中的生命周期(单位/小时)
    public static final int SESSION_INFO_TTL = 12;
    /** HTTP返回登录拦截状态 */
    public static final int NO_LOGIN_CODE = 999;
    /**
     * 系统名称
     */
    public static final String SYSTEM_SN = "ys_portal";


    //用户名
    public static final String COOKIE_USERNAME = "userName";

    //登录个人信息相关
    public static final String SESSION_PERSON_INFO = "personInfo";

    //登录个人信息领导部门相关
    public static final String SESSION_PERSON_LEADERDEPT_INFO = "personLeaderDeptInfo";

    /**
     * Redis Session共享中存储的Cookie值
     */
    public static final String SESSION = "SESSION";

    //用户信息
    public static final String COOKIE_PERSONINFO = "personInfo";

    /**
     * 浏览器Cookie
     */
    public static final String COOKIE_JSESSIONID = "JSESSIONID";

    /**
     * windows操作系统
     */
    public static final String OPERATE_SYSTEM_WINDOWS = "windows";
    /**
     * 用户会话ID【随机ID】
     */
    public static final String COOKIE_USER_SESSION_ID = "usid";


    // 用户中心加密的key
    public static final String CRYPT_KEY = "4de5v45wqeQ6e9";
    /**
     * 用户工号加密串键-值为：(USER_REDIS_ID_PREFIX+userNo)加密
     */
    public static final String COOKIE_USER_REDIS_ID = "urid";
    /**
     * 用户工号Redis前缀
     */
    public static final String USER_REDIS_ID_PREFIX = "USER_NO_";



    /**
     * linux操作系统
     */
    public static final String OPERATE_SYSTEM_LINUX = "linux";

    /**
     * 系统标识
     */
    public static final String ORGTREE_ROOT_TEXT = "YASHA";

    /**
     * 系统标识
     */
    public static final String APP_NAME = "app.name";
    public static final String FLOW_SN = "flow";
    /**
     * 工地考勤系统标识
     */
    public static final String GDKQ_SN = "CSHR";

    /**
     * 无内容
     */
    public static final String NULL = "NULL";


    /**
     * 用户头像，Redis存储前缀
     */
    public static final String USER_HEAD_IMG = "USER_HEAD_IMG";

    // 流程图片文件类型
    public static final String WF_IMAGE = "png";
    // 流程的xml文件类型
    public static final String WF_XML = "cstm1.xml";
    // 模式bpmn
    public static final String WF_BPMN = "bpmn";
    // 模式json
    public static final String WF_JSON = "json";

    /**
     * 提交人节点名称
     */
    public static final String FLOW_SUBMITTER = "提交人";
    /**
     * 提交人的变量名称
     */
    public static final String FLOW_SUBMITTER_VAR = "initiator";
    /**
     * juel表达式解析类
     */
    public static final String FLOW_JUEL = "flowJuel";
    /**
     * 自动跳过节点设置属性
     */
    public static final String FLOWABLE_SKIP_EXPRESSION_ENABLED = "_FLOWABLE_SKIP_EXPRESSION_ENABLED";
    /**
     * 公司编码常量
     */
    public static final String ORG_CODE = "orgCode";
    /**
     * 部门id常量
     */
    public static final String ORG_DEPT_ID = "orgDeptId";
    /**
     * 一级部门的部门编码
     */
    public static final String ONE_DEPT_CODE = "oneDeptCode";
    /**
     * form表单的一级部门
     */
    public static final String FORM_ONE_DEPT_CODE = "formOneDeptCode";
    /**
     * 全局的任务创建监听器 beanid
     */
    public static final String GLOBALTASKCREATELISTENER = "globalTaskCreateListener";
    /**
     * 全局的任务完成监听器 beanid
     */
    public static final String GLOBALTASKCOMPLETEDLISTENER = "globalTaskCompletedListener";

    /**
     * 全局的流程实例结束监听器 beanid
     */
    public static final String GLOBALPROCISTENDLISTENER = "globalProcistEndListener";
    /**
     * 已审批加签
     */
    public static final Integer SIGN_STATUS = 1;
    /**
     * 未审批加签
     */
    public static final Integer SIGN_UNSTATUS = 0;
    /********************************* 模型类型 ********************************/
    /**
     * 自定义流程
     */
    public static final int Model_CUSTOM_PROCESS = 0;
    /**
     * 业务流程
     */
    public static final int Model_WORK_PROCESS = 1;
    /********************************* 模型类型 ********************************/

    /********************************* rabbitmq ********************************/
    /**
     * 流程消息的exchange
     */
    public static final String FLOWABLE_EXCHANGE = "flowable-exchange";
    /**
     * 同步流程的队列名称
     */
    public static final String FLOWABLE_HISTORY_DATAS = "flowable-history-datas";
   //public static final String FLOWABLE_HISTORY_DATAS = "flowable-history-test";
    /**
     * 同步人员主数据的队列名称
     */
    public static final String FLOWABLE_MDM_DATA_QUEUE = "ys.flow.userdepartcompany.queue";
//    public static final String FLOWABLE_MDM_DATA_QUEUE = "ys.flow.userdepartcompany.queue2";
    public static final String FLOWABLE_MDM_DATA_EXCHANGE = "amq.fanout";
    /********************************* rabbitmq ********************************/
    //系统管理员
    public static final String SYSTEM_ADMIN = "系统管理员";

    /**
     * 延时队列
     * 放入的队列为com.ys.mqds.workflow.process.notify.complete
     */
    public static final String GDKQ_QUEUE = "com.ys.mqds.workflow.process.delayed.queue";

    /**********************form(自定义表单)*****************************/
    /**
     * 自定义表单前缀
     */
    public static final String FORM_PREFIX = "oa_wf_formrow_";
    /**
     * 自定义表单字段名前缀
     */
    public static final String FILED_PREFIX = "filed";
    /**
     * 自定义表单过滤type（分割线,子表单）
     */
    public static final String[] FILED_EXCLUDE_TYPE = {"separator"};
    /**
     * 能够编辑的公司 多个时逗号隔开（亚厦股份）
     */
    public static final String COMPANYS_ABLED_EDIT = "GF";
    /**
     * flowLevelFlag (是否走流程底表的数据字典) 请求数据字典code
     */
    public static final String OA_DIC_FLOWLEVELFLAG_CODE = "oa.dic.flowLevelFlag.code";
    /**
     * 自定义表单默认字段长度
     */
    public static final String FIELD_DEFULT_LENGTH = "1024";
    /**
     * 自定义表单文件默认字段长度
     */
    public static final String FIELD_FILE_DEFULT_LENGTH = "2048";
    /**
     * 自定义表单人员多选默认字段长度
     */
    public static final String FIELD_PERSON_GROUP_DEFULT_LENGTH = "256";

    /**
     * 自定义表单序列type
     */
    public static final String SEQ_TYPE_CUS = "form_code";
    /**********************form(自定义表单)*****************************/

    /**
     * 流程模型创建默认类别
     */
    public static final Integer DEFAULT_MODEL_TYPE = 0;

    /**
     * 转阅的流程定义key
     */
    public static final String TURN_READ = "turn_read";

    /**
     * 转阅人
     */
    public static final String TRUN_READ_USERS = "trunReadUsers";

    /**
     * 知会流程的流程定义key
     */
    public static final String LET_PERSON = "let-person";

    /**
     * 业务url
     */
    public static final String BUESSINES_URL = "buessinesUrl";

    /**
     * 老的流程实例id
     */
    public static final String OLD_PROCESS_INSTANCE_ID = "oldProcessInstanceId";

    /**
     * 默认人员职级（数据字典）10级
     */
    public static final String OA_DIC_PERSONPOST_POSTCODE = "a1n10";


    /**
     * 装饰公司ID（数据字典）
     */
    public static  final String OA_DIC_ZSCOMPANY_CODE = "0001K310000000000ABV";

    /**
     * 幕墙公司ID（数据字典）
     */
    public static  final String OA_DIC_MQCOMPANY_CODE = "0001K310000000000F91";


    /**
     * excel表头
     */

    //流程底表-导出字段
    public static final String[] WF_FLOW_LEVEL_FIELDS = {"statusStr", "flowlevelCode", "startDeptName", "oneDeptName", "twoDeptName", "threeDeptName", "deptHeaderName", "areaOneName", "areaDeputyName", "areaHeaderName", "centerdeputyHeaderName", "centerHeaderName", "companyHeaderName", "groupLeaderName", "startTime", "endTime"};
    public static final String[] WF_FLOW_LEVEL_FIELDNAMES = {"状态", "序号", "单位名称", "一级部门", "上级部门", "提交部门", "部门负责人", "区域公司一级部门负责人", "区域副总", "区域总经理", "中心副总", "中心总经理", "单位总经理", "集团分管领导", "创建时间", "更新时间"};

    /**用户账号*/
    public static final String SESSION_USER_UID = "uid";
    /**用户*/
    public static final String SESSION_SYS_USER = "sys_user";
    /**临时用户账号*/
    public static final String SESSION_TEMPORARY_USER_UID = "temporaryUserUid";
    /**用户验证码*/
    public static final String SESSION_VERIFICATION_CODE = "verificationCode";
    /**用户验证结果*/
    public static final String SESSION_CHECK_CODE_FLAG = "checkCodeFlag";
    //**********************************

    /** 普通分割符 */
    public static final String SEPARATOR = ",";
    /** 序列基数 */
    public static final Integer BASE_INDEX = 100;

    /** 最大分页显示的数据 */
    public static final Integer MAX_PAGE_SIZE = 10000;
}
