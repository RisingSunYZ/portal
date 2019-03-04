package com.dragon.portal.dao.news;

import com.dragon.portal.model.news.NewsType;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


/**
 * @Title:新闻类型Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-03-23 13:53:29
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有
 *
 * **代码重构：
 *     * 重构人：PDY  时间：2019-02-26   内容：重构适用于Spring Boot框架结构
 */
@Mapper
@Repository
public interface INewsTypeDao {

	/**
	 * 通过id得到新闻类型NewsType
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsType getNewsTypeById(String id) throws Exception;

	/**
	 * 通过ids批量得到人员新闻公告查看权限设置NewsType
	 * @param ids 如："'1','2','3','4'..."
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsType> getNewsTypeByIds(String ids) throws Exception;
	
	/**
	 * 得到所有新闻类型NewsType
	 * @param newsType
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsType> getAll(NewsType newsType) throws Exception;

	/**
	 * 分页查询新闻类型NewsType
	 * @param newsType
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsType> getPagerModelByQuery(NewsType newsType) throws Exception;

	/**
	 * 添加新闻类型NewsType
	 * @param newsType
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsType(NewsType newsType) throws Exception;
	
	/**
	 * 通过id删除新闻类型NewsType
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsTypeById(String id) throws Exception;
	
	/**
	 * 通过id批量删除新闻类型NewsType
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsTypeByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改新闻类型NewsType
	 * @param newsType
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsType(NewsType newsType) throws Exception;

	/**
	 * 通过ids批量修改新闻类型NewsType
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsTypeByIds(Map<String,Object> params) throws Exception;
	
	/**
	 * 根据类型标识sn得到新闻类型管理NewsType
	 * @param sn
	 * @throws Exception
	 * @auth luozongfang 2017-3-23 15:15:27
	 */
	public NewsType queryNewsTypeBySn(String sn) throws Exception;
	/**
	 * 通过sn修改新闻类型NewsType
	 * @param newsType
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsTypeBySn(NewsType newsType) throws Exception;


	/**
	 * 获取所有通知公告类型
	 * @throws Exception
	 */
	public  List<NewsType> getAllNoticeType() throws Exception;
}
