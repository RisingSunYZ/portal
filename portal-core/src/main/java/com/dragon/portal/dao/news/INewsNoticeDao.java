package com.dragon.portal.dao.news;

import com.dragon.portal.model.news.NewsNotice;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Title:公告管理Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-21 13:49:25
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Mapper
@Repository
public interface INewsNoticeDao {

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
	 * @param params
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年7月11日 下午3:06:22
	 */
	public NewsNotice getFullById(Map<String,Object> params) throws Exception;

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
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsNotice> getPagerModelByQuery(NewsNotice notice) throws Exception;

	/**
	 * 根据发布公司查询记录
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年5月17日 下午1:14:07
	 */
	public Page<NewsNotice> getPagerModelByQueryOfAdmin(NewsNotice notice) throws Exception;

	/**
	 * 分页查询公告管理Notice 包含发布人 和发布范围  根据 发布范围查找
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsNotice> getPagerModelByQueryOfRange(NewsNotice notice) throws Exception;

	/**
	 *
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年8月1日 下午4:25:25
	 */
	public Page<NewsNotice> getPagerModelByQueryOfRangeApi(NewsNotice notice) throws Exception;

	/**
	 * 分页查询公告管理Notice
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsNotice> getPagerModelByQueryOfImage(NewsNotice notice) throws Exception;


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
	 *
	 * @param notice
	 * @throws Exception
	 * @Description:
	 * @author v-zhaohaishan 2017年5月26日 上午10:30:33
	 */
	public int incrementNoticeVisitCount(NewsNotice notice) throws Exception;

	public int incrementNoticeCommentCount(NewsNotice notice) throws Exception;

	public int subNoticeTumbsUp(NewsNotice notice) throws Exception ;

	public int addNoticeTumbsUp(NewsNotice notice) throws Exception ;

	/**
	 * 通过ids批量修改公告管理Notice
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateNoticeByIds( Map<String,Object> params ) throws Exception;

	 /**
	 * 根据公告类型id查询多少公告应用该类型
	 * @param ids
	 * @return
	 * @throws Exception
	 * @author luozongfang 2017-3-24 16:14:32
	 */
	public int getNoticeByTypeId(String ids)throws Exception ;

	/**
	 * 通过公告类型,查询数量查询新闻或公告
	 * @param params
	 * @return
	 */
	public List<NewsNotice> getNoticesByTypeSn( Map<String,Object> params );

	/**
	 * 根据条件分页查询公告管理Notice
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsNotice> getPagerModelByQueryOfRangeSearch(NewsNotice notice) throws Exception;
	/**
	 * 根据条件不分页查询公告管理Notice
	 * @param notice
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsNotice> getAllByQueryOfRangeSearch(NewsNotice notice) throws Exception;

	/**
	 * 获取相关新闻
	 * @param params
	 * @return
	 */
	public List<NewsNotice> getNewsByKeyword(Map<String,Object> params);
	/**
	 * 获取公文编号
	 * @return
	 * @throws Exception
	 */
	public String getNoticeNoByOwnId(String ownId)throws Exception;

	/**
	 * 获取导出数据
	 * @param notice
	 * @return
	 */
	List<NewsNotice> getExportData(NewsNotice notice);

	/**
	 * 获取统计查询功能
	 * @param notice
	 * @return
	 */
	Page<NewsNotice> getPagerModelByQueryForAll(NewsNotice notice);
}
