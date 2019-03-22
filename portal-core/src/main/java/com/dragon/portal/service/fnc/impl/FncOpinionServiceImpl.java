package com.dragon.portal.service.fnc.impl;

import com.dragon.portal.dao.fnc.IFncOpinionDao;
import com.dragon.portal.model.fnc.Opinion;
import com.dragon.portal.properties.CommonProperties;
import com.dragon.portal.service.fnc.IFncOpinionService;
import com.mhome.se.api.ISendEmailApi;
import com.mhome.se.model.email.EmailInfo;
import com.mhome.tools.common.UUIDGenerator;
import com.mhome.tools.pager.PagerModel;
import com.mhome.tools.pager.Query;
import com.ys.tools.vo.ReturnVo;
import com.ys.ucenter.api.IPersonnelApi;
import com.ys.ucenter.constant.UcenterConstant;
import com.ys.ucenter.model.vo.PersonnelApiVo;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Title:财务服务-意见管理Service实现
 * @Description:
 * @Author:XTJ
 * @Since:2017-08-22 14:13:54
 * @Version:1.1.0
 * @Copyright:Copyright (c) 浙江蘑菇加电子商务有限公司 2015 ~ 2016 版权所有  
 */
@Service
public class FncOpinionServiceImpl implements IFncOpinionService {
	
	private static Logger logger = Logger.getLogger(FncOpinionServiceImpl.class);
	
	@Autowired
	private IFncOpinionDao opinionDao;
	@Autowired
	private ISendEmailApi sendEmailApi;
	@Autowired
	private CommonProperties commonProperties;
	@Autowired
	private IPersonnelApi personnelApi;

	@Override
	public Opinion getOpinionById(String id) throws Exception {
		return StringUtils.isNotBlank(id) ? this.opinionDao.getOpinionById(id.trim()) : null;
	}

	@Override
	public List<Opinion> getAll(Opinion opinion) throws Exception {
		return null != opinion ? this.opinionDao.getAll(opinion) : null;
	}

	@Override
	public PagerModel<Opinion> getPagerModelByQuery(Opinion opinion, Query query)
			throws Exception {
		return (null != opinion && null != query) ? this.opinionDao.getPagerModelByQuery(opinion, query) : null;
	}

	@Override
	public void insertOpinion(Opinion opinion) throws Exception {
		if (null != opinion) {
			opinion.setId(UUIDGenerator.generate());
			opinion.setCreateTime(new Date());
			opinion.setUpdateTime(new Date());
			this.opinionDao.insertOpinion(opinion);
		}
	}
	
	@Override
	public void insertOpinionAndSendEmail(Opinion opinion) throws Exception {
		if (null != opinion) {
			opinion.setId(UUIDGenerator.generate());
			opinion.setCreateTime(new Date());
			opinion.setUpdateTime(new Date());
			opinion.setStatus(0);
			this.opinionDao.insertOpinion(opinion);
			// 发邮件
			try{
				if(StringUtils.isNotBlank(opinion.getResponsibleNo())){
					ReturnVo<PersonnelApiVo> personnelApiVoByNo = personnelApi.getPersonnelApiVoByNo(opinion.getResponsibleNo());
					if(UcenterConstant.SUCCESS==personnelApiVoByNo.getCode()){
						Map<String, Object> datas = new HashMap<String, Object>();
						String [] arr = {personnelApiVoByNo.getData().getEmail()};
						datas.put("userName", opinion.getResponsiblePerson());
						datas.put("feedback", opinion.getCreator());
						datas.put("type", opinion.getTypeName());
						datas.put("content", opinion.getContent());
						datas.put("url",commonProperties.getYsportalManagerURL());
						EmailInfo emailInfo = new EmailInfo();
						emailInfo.setType(Integer.parseInt(commonProperties.getFinanceEmailType()));
						emailInfo.setSubject(commonProperties.getFinanceEmailSubject());
						emailInfo.setFromEmail(commonProperties.getFinanceEmailFromEmail());
						emailInfo.setConsignees(arr);
						sendEmailApi.sendEmail(commonProperties.getFinanceEmailSn(), datas, emailInfo);
					}else{
						logger.info("发邮件失败 ：工号NO"+opinion.getResponsibleNo());
					}
				}
			}catch(Exception e){
				logger.info("发邮件失败 ：工号NO"+opinion.getResponsibleNo());
				e.printStackTrace();
			}
		}
	}
	
	
	@Override
	public void delOpinionById(String id) throws Exception {
		if (StringUtils.isNotBlank(id)) {
			this.opinionDao.delOpinionById(id.trim());
		}
	}
	
	@Override
	public void delOpinionByIds(String ids) throws Exception {
		ids = this.converString(ids);
		if(StringUtils.isNotBlank(ids)){
			this.opinionDao.delOpinionByIds(ids);
		}
	}
	
	@Override
	public void updateOpinion(Opinion opinion) throws Exception {
		if (null != opinion) {
			this.opinionDao.updateOpinion(opinion);
		}
	}

	@Override
	public void updateOpinionByIds(String ids,Opinion opinion) throws Exception {
		ids = this.converString(ids);
		if (StringUtils.isNotBlank(ids) && null != opinion) {
			opinion.setUpdateTime(new Date());
			this.opinionDao.updateOpinionByIds(ids, opinion);
		}
	}
	
	/**
	 * 将"1,2,3,4,5..."这种形式的字符串转成"'1','2','3','4'..."这种形式
	 * @param strs
	 * @return
	 */
	private String converString(String strs) {
		if (StringUtils.isNotBlank(strs)) {
			String[] idStrs = strs.trim().split(",");
			if (null != idStrs && idStrs.length > 0) {
				StringBuffer sbf = new StringBuffer("");
				for (String str : idStrs) {
					if (StringUtils.isNotBlank(str)) {
						sbf.append("'").append(str.trim()).append("'").append(",");
					}
				}
				if (sbf.length() > 0) {
					sbf = sbf.deleteCharAt(sbf.length() - 1);
					return sbf.toString();
				}
			}
		}
		return "";
	}
}

