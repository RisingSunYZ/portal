package com.dragon.portal.utils;

import org.apache.commons.lang.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateAndWeekUtils {
	/**
	 * 获得下个月
	 * @param date eg：2016-12
	 * @param count eg:1
	 * @return      eg:2017-01
	 * @throws ParseException
	 * @Description:
	 * @author v-wuqiang 2016 上午10:53:56
	 */
	public static String getNextMonthDate(String date,Integer count) throws ParseException{
		if(StringUtils.isBlank(date) || count == null){
			return null;
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(date));
		cal.add(Calendar.MONTH, count);
		return sdf.format(cal.getTime());
	}
	/**
	 * 获取某个月最后一天
	 * @param dateStr eg:2016-11
	 * @return		  eg:2016-11-30
	 * @throws Exception
	 * @Description:
	 * @author v-wuqiang 2016 下午3:49:02
	 */
	public static String getMonthLastDay(String dateStr) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(dateStr));
		return sdf.format(cal.getTime())+"-"+cal.getActualMaximum(Calendar.DAY_OF_MONTH);
	}
	
	/**
	 * 
	 * @param dateStr
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author wangzhaoliao 2016年12月16日 下午4:39:08
	 */
	public static String getMonthFirstDay(String dateStr) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(dateStr));
		return sdf.format(cal.getTime())+"-01";
	}
	/**
	 * 获得星期
	 * @param cal 
	 * @return
	 * @Description:
	 * @author v-wuqiang 2016 上午9:00:14
	 */
	public static Integer getChinaWeek(Calendar cal){
		return cal.get(Calendar.DAY_OF_WEEK) -1 ==0 ? 7:cal.get(Calendar.DAY_OF_WEEK) -1;
	}
	/**
	 * 日期增加几个月
	 * @param dateStr
	 * @param month
	 * @return
	 * @Description:
	 * @author v-wuqiang 2016 下午2:45:51
	 * @throws ParseException 
	 */
	public static String addMonth(String dateStr,Integer month) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(dateStr));
		cal.add(Calendar.MONTH, month);
		return sdf.format(cal.getTime());
	}
	/**
	 * 添加多少天
	 * @param dateStr
	 * @param day
	 * @return
	 * @throws Exception
	 * @Description:
	 * @author v-wuqiang 2016 上午11:15:21
	 */
	public static String addDay(String dateStr,Integer day) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(dateStr));
		cal.add(Calendar.DAY_OF_MONTH, day);
		return sdf.format(cal.getTime());
	}
	/**
	 * 
	 * @param startdate1
	 * @param enddate1
	 * @param startdate2
	 * @param enddate2
	 * @return
	 * @Description:判断两个时间段是否有交集
	 * @author v-wuqiang 2016 下午8:26:24
	 */
	 public static boolean isOverlap(String startdate1, String enddate1,String startdate2, String enddate2) {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date leftStartDate = null;    
        Date leftEndDate = null;    
        Date rightStartDate = null;    
        Date rightEndDate = null;    
        try {    
            leftStartDate = format.parse(startdate1);    
            leftEndDate = format.parse(enddate1);    
            rightStartDate = format.parse(startdate2);    
            rightEndDate = format.parse(enddate2);    
        } catch (ParseException e) {
        	e.printStackTrace();
            return false;    
        }    
            
        return     
            ((leftStartDate.getTime() >= rightStartDate.getTime())     
                    && leftStartDate.getTime() < rightEndDate.getTime())    
            ||    
            ((leftStartDate.getTime() > rightStartDate.getTime())     
                    && leftStartDate.getTime() <= rightEndDate.getTime())    
            ||    
            ((rightStartDate.getTime() >= leftStartDate.getTime())     
                    && rightStartDate.getTime() < leftEndDate.getTime())    
            ||    
            ((rightStartDate.getTime() > leftStartDate.getTime())     
                    && rightStartDate.getTime() <= leftEndDate.getTime());    
    }
	 /**
	  * 
	  * @param date
	  * @param minutes
	  * @return
	  * @throws Exception
	  * @Description:把时间增加多少分钟
	  * @author v-wuqiang 2016 下午3:15:56
	  */
	 public static Date addMinute(Date date,int minutes) throws Exception{
		 Calendar cal = Calendar.getInstance();
		 cal.setTime(date);
		 cal.add(Calendar.MINUTE, minutes);
		 return cal.getTime();
	 }
	 /**
	  * 
	  * @return
	  * @Description: 时间1区间是否被时间2区间包含
	  * @author v-wuqiang 2016 上午10:39:28
	  */
	 public static boolean isContains(Date startdate1, Date enddate1,Date startdate2, Date enddate2){
        return     
            ((startdate1.getTime() >= startdate2.getTime())     
                    && enddate1.getTime() <= enddate2.getTime());
	 }
	 /**
	 * 
	 * @return
	 * @Description:获得当前时间前几天
	 * @author v-wuqiang 2016 下午1:35:02
	 * @throws ParseException 
	 */
	public static String getBeforeDay(String dateStr,int count) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar c = Calendar.getInstance();  
        c.setTime(sdf.parse(dateStr));
        int day = c.get(Calendar.DATE);  
        c.set(Calendar.DATE, day - count);  
        String dayBefore = new SimpleDateFormat("yyyy-MM-dd").format(c  
                .getTime());
        return dayBefore;
	}
	/**
	 * 
	 * @param dateStr
	 * @return
	 * @throws Exception
	 * @Description:获得传入的时间是星期几
	 * @author v-wuqiang 2016 下午8:51:35
	 */
	public static int getWeek(String dateStr) throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(dateStr));
		return getChinaWeek(cal);
	}
	
	/**
	  * 返回大写星期
	  * @param week
	  * @return
	  * @Description:
	  * @author v-wuqiang 2016 下午8:17:42
	  */
	public static String getDXWeek(String dateStr)throws Exception{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal = Calendar.getInstance();
		cal.setTime(sdf.parse(dateStr));
		int week = getChinaWeek(cal);
		switch(week){
			case 1:return "星期一";
			case 2:return "星期二";
			case 3:return "星期三";
			case 4:return "星期四";
			case 5:return "星期五";
			case 6:return "星期六";
			case 7:return "星期天";
		}
		return null;
	} 
	
	/**
	 * 
	 * @param dateStr
	 * @return
	 * @throws ParseException
	 * @Description:获得当前天所在月的起始时间
	 * @author v-wuqiang 2016 下午6:35:20
	 */
	public static String getDayMonthAndYear(String dateStr) throws ParseException{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM");
		String str = sdf1.format(sdf.parse(dateStr));
		return str+"-01 00:00";
	}
	 /**
	  * 
	  * @param startdate1
	  * @param enddate1
	  * @param startdate2
	  * @param enddate2
	  * @return
	  * @Description:判断两个时间段是否有交集
	  * @author v-wuqiang 2016 下午5:30:59
	  */
	 public static boolean isOverlap(Date startdate1, Date enddate1,Date startdate2, Date enddate2) {
        return     
            ((startdate1.getTime() >= startdate2.getTime())     
                    && startdate1.getTime() < enddate2.getTime())    
            ||    
            ((startdate1.getTime() > startdate2.getTime())     
                    && startdate1.getTime() <= enddate2.getTime())    
            ||    
            ((startdate2.getTime() >= startdate1.getTime())     
                    && startdate2.getTime() < enddate1.getTime())    
            ||    
            ((startdate2.getTime() > startdate1.getTime())     
                    && startdate2.getTime() <= enddate1.getTime());    
    }
	public static void main(String[] args) throws Exception {
		String date ="2016-11";
		System.out.println(getMonthLastDay(date));
	}
}

	