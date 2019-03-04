package com.dragon.portal.dao.news;

import com.dragon.portal.model.news.NewsSignRecord;
import com.dragon.tools.pager.PagerModel;
import com.github.pagehelper.Page;

import java.util.List;
import java.util.Map;


/**
 * @Title:报名记录Dao接口
 * @Description:
 * @Author:XTJ
 * @Since:2017-07-13 13:27:39
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
public interface INewsSignRecordDao {

	/**
	 * 通过id得到报名记录NewsSignRecord
	 * @param id
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public NewsSignRecord getNewsSignRecordById(String id) throws Exception;

	/**
	 * 得到所有报名记录NewsSignRecord
	 * @param newsSignRecord
	 * @return 
	 * @throws Exception
	 * @Description:
	 */
	public List<NewsSignRecord> getAll(NewsSignRecord newsSignRecord) throws Exception;

	/**
	 * 分页查询报名记录NewsSignRecord
	 * @param newsSignRecord
	 * @return
	 * @throws Exception
	 * @Description:
	 */
	public Page<NewsSignRecord> getPagerModelByQuery(NewsSignRecord newsSignRecord) throws Exception;

	/**
	 * 添加报名记录NewsSignRecord
	 * @param newsSignRecord
	 * @throws Exception
	 * @Description:
	 */
	public void insertNewsSignRecord(NewsSignRecord newsSignRecord) throws Exception;
	
	/**
	 * 通过id删除报名记录NewsSignRecord
	 * @param id
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsSignRecordById(String id) throws Exception;
	
	/**
	 * 通过id批量删除报名记录NewsSignRecord
	 * @param ids 如："'1','2','3','4'..."
	 * @throws Exception
	 * @Description:
	 */
	public void delNewsSignRecordByIds(String ids) throws Exception;
	
	/**
	 * 通过id修改报名记录NewsSignRecord
	 * @param newsSignRecord
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsSignRecord(NewsSignRecord newsSignRecord) throws Exception;

	/**
	 * 通过ids批量修改报名记录NewsSignRecord
	 * @param params
	 * @throws Exception
	 * @Description:
	 */
	public void updateNewsSignRecordByIds(Map<String,Object> params) throws Exception;
	
	
}
