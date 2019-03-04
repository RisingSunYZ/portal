package com.dragon.portal.service.news;

import com.dragon.portal.model.news.NewsNotice;
import com.dragon.portal.vo.news.NoticeProVo;
import com.dragon.tools.pager.PagerModel;
import com.dragon.tools.pager.Query;

import java.util.List;


/**
 * @Title:公告管理Service接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-21 13:49:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsNoticeService {

	/**
	 * 通过id得到公告管理Notice
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsNotice getNoticeById(String id) throws Exception;
	/**
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年7月11日 下午3:07:07
	 */
	public NewsNotice getFullById(String id, String userNo, String deptId) throws Exception;

	/**
	 *
	 * @author Troy
	 * @date 2017年11月21日 上午10:17:52
	 * @param id
	 * @return
	 * @throws Exception
	 */
	public NewsNotice getFullById(String id) throws Exception;
	/**
	 * 得到所有公告管理Notice
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsNotice> getAll(NewsNotice notice) throws Exception;

	/**
	 * 分页查询公告管理Notice
	 * @param notice
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public PagerModel<NewsNotice> getPagerModelByQuery(NewsNotice notice, Query query) throws Exception;


	/**
	 *
	 * @param notice
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年5月17日 下午1:15:36
	 */
	public PagerModel<NewsNotice> getPagerModelByQueryOfAdmin(NewsNotice notice, Query query) throws Exception;
	/**
	 *
	 * @param notice
	 * @param query
	 * @param userNo
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月12日 下午1:34:00
	 */
	public PagerModel<NewsNotice> getPagerModelByQueryOfRange(NewsNotice notice, Query query, String userNo) throws Exception;

	/**
	 *
	 * @param notice
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月12日 下午1:34:00
	 */
	public PagerModel<NewsNotice> getPagerModelByQueryOfRangeApi(NewsNotice notice, Query query) throws Exception;

	/**
	 *
	 * @param notice
	 * @param query
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年4月7日 下午2:07:19
	 */

	public PagerModel<NewsNotice> getPagerModelByQueryOfImage(NewsNotice notice, Query query) throws Exception;

	/**
	 * 添加公告管理Notice
	 * @param notice
	 * @throws Exception
	 * @Description:
	 */
	public void insertNotice(NewsNotice notice) throws Exception;

	/**
	 * 通过id删除公告管理Notice
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNoticeById(String id) throws Exception;

	/**
	 * 通过id批量删除公告管理Notice
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNoticeByIds(String ids) throws Exception;

	/**
	 * 通过id修改公告管理Notice
	 * @param notice
	 * @throws Exception
	 * @Description:
	 */
	public void updateNotice(NewsNotice notice) throws Exception;

	/**
	 * 通过ids批量修改公告管理Notice
	 * @param ids 如："'1','2','3','4'..."
	 * @param notice
	 * @throws Exception
	 * @Description:
	 */
	public void updateNoticeByIds(String ids, NewsNotice notice) throws Exception;

	/**
	 * 根据公告类型id查询多少公告应用该类型
	 * @param ids
	 * @return
	 * @throws Exception
	 * @author luozongfang 2017-3-24 16:05:21
	 */
	public int getNoticeByTypeId(String ids)throws Exception ;

	/**
	 * 通过公告类型,查询数量查询新闻或公告
	 * @param typeSn
	 * @param count
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author xietongjian 2017 上午10:47:19
	 */
	public List<NewsNotice> getNoticeByType(String typeSn, Integer count) throws Exception;

	/**
	 *
	 * @param notice
	 * @param query
	 * @return
	 * @throws Exception
	 */
	public PagerModel<NewsNotice> getPagerModelByQueryOfRangeSearch(NewsNotice notice, Query query) throws Exception;
	/**
	/**
	 *
	 * @param notice
	 * @return
	 * @throws Exception
	 */
	public List<NewsNotice> getAllByQueryOfRangeSearch(NewsNotice notice) throws Exception;
	/**
	 * 根据关键字获取相关新闻
	 * @param typeId
	 * @param keyword
	 * @param rangeDeftId
	 * @param id
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年7月21日 上午11:31:14
	 */
	public List<NewsNotice> getNewsByKeyword(String typeId, String keyword, List<String> rangeDeftId, String id) throws Exception;
	/**
	 * 减少点赞数
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年8月4日 上午11:27:57
	 */
	public int subNoticeTumbsUp(NewsNotice notice) throws Exception ;
	/**
	 * 增加点赞数
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年8月4日 上午11:28:08
	 */
	public int addNoticeTumbsUp(NewsNotice notice) throws Exception ;

	/**
	 * 增加评论
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年8月4日 下午4:35:50
	 */
	public int incrementNoticeCommentCount(NewsNotice notice) throws Exception;
	/**
	 * 获取公文编号
	 * @return
	 * @throws Exception
	 */
	public String getNoticeNoByOwnId(String ownId)throws Exception;


	/**
	 * 发布流程-添加公告
	 * 流程--如果流程存在则更新，如果不存在则新增
	 * 公告--每次都新增公告相关数据
	 * @param noticeProVo
	 * @throws Exception
	 */
	public void insertProNotice(NoticeProVo noticeProVo) throws Exception;


	/**
	 * 根据流程编码获取公告信息
	 * @param code
	 * @throws Exception
	 */
	public NoticeProVo getProNoticeByCode(String code) throws Exception;


	/**
	 * 流程-修改改公告
	 * @param noticeProVo
	 * @throws Exception
	 */
	public void updateProNotice(NoticeProVo noticeProVo) throws Exception;

	/**
	 * 删除公告附件
	 * @throws Exception
	 */
	public void delNoticeFile(String fileId) throws Exception;

	/**
	 * 修改
	 */
	public void UpdateProStatusByCode(Integer status, String code) throws Exception;

	/**
	 * 获取导出数据
	 * @param notice
	 * @return
	 */
	List<NewsNotice> getExportData(NewsNotice notice);


	/**
	 * 获取统计查询数据
	 * @param notice
	 * @return
	 */
	PagerModel<NewsNotice> getPagerModelByQueryForAll(NewsNotice notice, Query query);

	/**
	 * 获取门户公告工态轮播图数据 (带缓存)
	 * @param notice
	 * @param query
	 * @param userNo
	 * @return
	 * @throws Exception
	 */
	PagerModel<NewsNotice> getPagerModelByQueryOfRangeRedis(NewsNotice notice, Query query, String userNo)  throws Exception;
}
