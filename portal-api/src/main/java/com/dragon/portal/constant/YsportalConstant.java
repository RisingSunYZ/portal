package com.dragon.portal.constant;

/**
 * 常量
 * @Title:
 * @Description:
 * @Author:wangzhaoliao
 * @Since:2016年12月7日 上午10:59:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 */
public class YsportalConstant {

	/**
	 * 用户Cookie相关的key
	 */
	//cookie存活时间一个月
	public static final int COOKIE_TITLE_MONTH = 2592000;
	//用户登录帐号
	public static final String COOKIE_ACCOUNT = "ua";
	//用户中心加密的key
	public static final String CRYPT_KEY = "4de5v45wqeQ6e9";
	//用户名
	public static final String COOKIE_USERNAME = "userName";
	//用户信息
	public static final String COOKIE_PERSONINFO = "personInfo";
	/**
	 * 用户会话ID【随机ID】
	 */
	public static final String COOKIE_USER_SESSION_ID = "usid";
	/**
	 * 浏览器Cookie
	 */
	public static final String COOKIE_JSESSIONID = "JSESSIONID";
	/**
	 * Redis Session共享中存储的Cookie值
	 */
	public static final String SESSION = "SESSION";
	/**
	 * 用户工号加密串键-值为：(USER_REDIS_ID_PREFIX+userNo)加密
	 */
	public static final String COOKIE_USER_REDIS_ID = "urid";
	/**
	 * 用户工号Redis前缀
	 */
	public static final String USER_REDIS_ID_PREFIX = "USER_NO_";
	
	//顺丰下单返回状态成功
	public static final String FORM_EXPRESS_SF_OK = "OK";
	//顺丰下单返回状态失败
	public static final String FORM_EXPRESS_SF_ERR = "ERR";
	
	
	//检查异常操作
	public static final String COOKIE_ABNORMAL_NUM = "abnormal_";
	//用户会话信息对象在redis中的生命周期(单位/小时)
	public static final int SESSION_INFO_TTL = 12;
	//登录个人信息相关
	public static final String SESSION_PERSON_INFO = "personInfo";
	//登录个人信息领导部门相关
	public static final String SESSION_PERSON_LEADERDEPT_INFO = "personLeaderDeptInfo";
	//登录的地址
	public static final String LOGIN_INDEX_URL = "/portal/ulogin/index.jhtml";
	
	//生日活动 ----------------------
	public static final String BIRTHDAY_KEY = "birthday_"; 
	/**
	 * 系统名称
	 */
	public static final String SYSTEM_SN = "ys_portal";
	
	/**
	 * 登录用户Session信息
	 */
	public static final String USER_SESSION_IN = "userSessionIn";
	
	/** 是 */
	public static final Integer YES = 1;

	/** 否 */
	public static final Integer NO = 0;
	
	/**
	 * 项目管理url
	 */
	public static final String ROCENTER_URL="/"; 
	
	/** 启用[上架]状态 */
	public static final int STATUS_ENABLED = 1;

	/** 不可用[下架]状态 */
	public static final int STATUS_DISABLED = 0;

	/** 删除状态=0 */
	public static final int HAS_DELETE_FLAG = 0;

	/** 未删除状态=1 */
	public static final int NO_DELETE_FLAG = 1;

	/** 成功 */
	public static final int SUCCESS = 1;

	/** 失败 */
	public static final int ERROR = 0;

	/** 普通分割符 */
	public static final String SEPARATOR = ",";
	/** 普通分割符 中划线 */
	public static final String SEPARATOR_MIDDLE_LINE = "-";
	
	/** 序列基数 */
	public static final Integer BASE_INDEX = 100;
	
	/** 最大分页显示的数据 */
	public static final Integer MAX_PAGE_SIZE = 10000;
	
	/** 女=0*/
	public static final Integer WOMAN = 0;
	/** 男=1*/
	public static final Integer MAN = 1;
	/** 女=0*/
	public static final String SWOMAN = "女";
	/** 男=1*/
	public static final String SMAN = "男";
	//超级管理员标示
	public static final String ADMINROLESN = "admin";

	//访问量初始值
	public static final Integer INITIAL = 0;
	
	/** IT服务=1 */
	public static final int IT_SERVICE_FLAG = 1;

	/** HR服务=2 */
	public static final int HR_SERVICE_FLAG = 2;
	
	//致远服务端地址
	//public static final String SEEYONDOMAIN=props.getProperty("seeyon.domain");
	public static final String SEEYON_SPIDER_DOMAIN= "seeyon.spider.domain" ;//props.getProperty("seeyon.spider.domain");
	//爬虫用用户名
	public static final String SEEYON_SPIDER_USERNAME= "seeyon.spider.username" ;// props.getProperty("seeyon.spider.username");
	//爬虫用用户密码
	public static final String SEEYON_SPIDER_PWD= "seeyon.spider.pwd" ;// props.getProperty("seeyon.spider.pwd");
	
	
	//public static final String OA_URL=props.getProperty("oa.url");
	//public static final String OA_USERNAME=props.getProperty("oa.userName");
	//public static final String OA_PASSWORD=props.getProperty("oa.password");
	
	//public static final String APPUSER = props.getProperty("appuser");// "wsuser";
	//public static final String APPSECRET = props.getProperty("appuser"); //"232ed9n196h69u5f1a24afc26b51c61e";
	//public static final String APIURL = props.getProperty("appuser"); //"http://10.10.20.34:8080/sim";
	
	//所属业务
	public static final String BUSINESS = "business";// dicts.getProperty("business");
	//职位级别
	public static final String POSITIONLEVEL = "positionlevel"; //dicts.getProperty("positionlevel");
	//模板详情前缀
	public static final String TEMPLATE_INFO_PRE = "template_info_pre"; //props.getProperty("template_info_pre");
	
	//爬虫新闻网页入口地址
	public static final String SPIDER_NEWS_PORTAL_URL = "spider_news_portal" ;// dicts.getProperty("spider_news_portal");
	//爬虫股票AURL
	public static final String SPIDER_STOCKA_URL = "spider_stockA_url" ;// dicts.getProperty("spider_stockA_url");
	//A股票代码
	public static final String SPIDER_STOCKA_CODE = "spider_stockA_code" ;// dicts.getProperty("spider_stockA_code");
	//爬虫股票BURL
	public static final String SPIDER_STOCKB_URL = "spider_stockB_url" ;// dicts.getProperty("spider_stockB_url");
	//B股票代码
	public static final String SPIDER_STOCKB_CODE = "spider_stockB_code" ;// dicts.getProperty("spider_stockB_code");
	//爬虫股票VURL
	public static final String SPIDER_STOCKC_URL = "spider_stockC_url" ;// dicts.getProperty("spider_stockC_url");
	//C股票代码
	public static final String SPIDER_STOCKC_CODE = "spider_stockC_code" ;// dicts.getProperty("spider_stockC_code");
	//hr服务分类
	public static final String HR = "hr";//CommUtils.defaultIfEmpty(dicts.getProperty("hr"), "") ;
	public static final String HRCO = "hrco";//CommUtils.defaultIfEmpty(dicts.getProperty("hr"), "") ;
	//it服务分类
	public static final String IT =  "it";//CommUtils.defaultIfEmpty(dicts.getProperty("it"),"");
	//快捷流程模板
	public static final String KJ = "kj"; //CommUtils.defaultIfEmpty(dicts.getProperty("kj"),"");
	
	//EHRwebsicket
	public static final String EHRWEBSOCKETURL = "ehrwebsocketurl";
	
	/**
	 * 用户头像，Redis存储前缀 
	 */
	public static final String USER_HEAD_IMG = "USER_HEAD_IMG";
	
	
	/**
	 * 无内容
	 */
	public static final String NULL = "NULL";
	/**
	 * 问题分类-通用类型
	 */
	public static final String QA_TYPE_COMMON = "qa.type.common";
	
	//反馈编号
	public static final String QUES_NO_PREFIX = "FK";
	
	//添加或者修改标识
	public static final String ADD_OR_EDIT = "2";
	public static final int NOTICE_OWNER_STATUS = 1;
	
	/**
	 * ems ： key
	 */
	public static final String THEME_KEY = "theme_key";
	/**
	 * ems:静态资源版本号
	 */
	public static final String STATIC_VERSION = "staticVersion";
	/**
	 * ems:默认静态资源版本号
	 */
	public static final String DEFAULT_STATIC_VERSION = "1.1.1";
	
	/**
	 * 人员盘点 ： 盘点等级
	 */
	public static final String CHECK_INFO = "check_info";
	
	/** 默认处理等待时间 （单位：秒） */
	public static final Integer DEFAULT_WAIT_TIME = 5;
	/** 默认处理等待时间 （单位：秒） */
	public static final Integer DEFAULT_WAIT_TIME_2 = 2;

	/** 个人绩效: 默认pageSize*/
	public static final Integer DEFAULT_PERFORMANCE_PAGESIZE = 100;
	/** 流程发起方式 */
	public enum LAUNCH_TYPE{
		DEFAULT(1, "默认普通模式")
		,BIZ(2, "宽屏模式")
		,BIZ_CUST(3, "宽屏模式-自定义形式")
		;
		
		private Integer code;
		private String name;
		private LAUNCH_TYPE(Integer code, String name){
			this.code = code;
			this.name = name;
		}
		public String getName() {
			return name;
		}
		public Integer getCode() {
			return code;
		}
	}
}

	