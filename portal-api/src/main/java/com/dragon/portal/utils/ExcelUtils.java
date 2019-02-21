package com.dragon.portal.utils;

import com.alibaba.fastjson.JSONObject;
import com.dragon.portal.exception.PortalException;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.xssf.usermodel.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

/**
 * Excel poi 导入导出工具类
 *
 * @author wangzhiyong
 * @date 2017/11/22
 */
public class ExcelUtils {

    private static Logger logger = Logger.getLogger(ExcelUtils.class);

    private static Integer startRow = 1;
    private static Integer startCol = 0;

    /**
     * 居中样式
     */
    private static XSSFCellStyle textAlignCenter;
    /**
     * 左对齐样式
     */
    private static XSSFCellStyle textAlignLeft;

    /**
     * @param dataJson     数据List json
     * @param clazz        导出数据类
     * @param exFieldNames 导出头名称
     * @param exFields     导出数据字段
     * @return 07以上 xlsx 格式文件
     */
    public static <T> XSSFWorkbook expExcel(String dataJson, Class<T> clazz, String[] exFieldNames, String[] exFields) {
        XSSFWorkbook workbook = null;
        if (null == exFieldNames || null == exFields || exFieldNames.length == 0 || exFields.length == 0 || exFieldNames.length != exFields.length) {
            throw new PortalException("参数异常");
        }
        try {
            List<T> datas = JSONObject.parseArray(dataJson, clazz);
            workbook = new XSSFWorkbook();
            XSSFSheet sheet = workbook.createSheet();
            createSheetStyle(workbook, sheet);

            XSSFRow row = sheet.createRow(0);
            XSSFCell cell;
            for (int j = 0; j < exFieldNames.length; j++) {
                cell = row.createCell(j);
                cell.setCellValue(exFieldNames[j]);
                cell.setCellStyle(textAlignCenter);
            }
            for (int i = 0; i < datas.size(); i++) {
                T t = datas.get(i);
                row = sheet.createRow(i + 1);
                for (int k = 0; k < exFields.length; k++) {
                    Object o = invokeGet(t, exFields[k]);
                    cell = row.createCell(k);
                    cell.setCellValue(o != null ? o.toString() : "");
                    cell.setCellStyle((k == 0 || k == 1) ? textAlignCenter : textAlignLeft);
                }
            }
        } catch (PortalException e) {
            logger.error("ExcelUtils-expExcel 导出异常");
            e.printStackTrace();
        }
        return workbook;
    }

    /**
     * @param file     文件  xlsx 07以上格式
     * @param clazz    类
     * @param imFields 依次 变量名
     * @param startRow 开始行数
     * @param <T>
     * @return
     * @throws Exception
     */
    public static <T> List<T> importExcel(MultipartFile file, Class<T> clazz, String[] imFields, Integer startRow) throws Exception {
        //判断文件类型
        String filename = file.getOriginalFilename();
        int iIndex = filename.lastIndexOf(".");
        String ext = (iIndex < 0) ? "" : filename.substring(iIndex + 1).toLowerCase();
        if (!"xlsx".equals(ext)) {
            throw new PortalException("文件类型错误");
        }
        XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
        XSSFSheet sheet = workbook.getSheetAt(0);

        List<T> data = new ArrayList<T>();
        //开始读取数据行数
        if (sheet.getLastRowNum() < startRow - 1) {
            return null;
        }
        for (int i = startRow - 1; i <= sheet.getLastRowNum(); i++) {
            try {
                XSSFRow row = sheet.getRow(i);
                //使用第一个字段判断是否添加数据
                if (row == null || row.getCell(0) == null || StringUtils.isBlank(row.getCell(0).toString())) {
                    continue;
                }
                T t = clazz.newInstance();
                for (int j = 0; j < imFields.length; j++) {
                    XSSFCell cell = row.getCell(j);
                    invokeSet(t, imFields[j], cell != null ? cell.toString() : "");
                }
                data.add(t);
            } catch (PortalException e) {
                e.printStackTrace();
                throw new PortalException("第" + ++i + "行发现错误，请修改后重新导入");
            }
        }
        return data;
    }


    /**
     * 设置样式 07 以上
     *
     * @param workbook
     * @param sheet
     */
    private static void createSheetStyle(XSSFWorkbook workbook, XSSFSheet sheet) {
        textAlignCenter = workbook.createCellStyle();
        textAlignLeft = workbook.createCellStyle();
        // 设置表字体
        XSSFFont font10 = workbook.createFont();
        font10.setFontHeightInPoints((short) 12);
        font10.setFontName("黑体");
        // 设置表样
        textAlignCenter.setAlignment(XSSFCellStyle.ALIGN_CENTER);
        textAlignLeft.setAlignment(XSSFCellStyle.ALIGN_LEFT);
        textAlignCenter.setFont(font10);
        textAlignLeft.setFont(font10);
        // 设置列宽
        sheet.setColumnWidth(0, 10000);
        sheet.setColumnWidth(1, 4000);
        sheet.setColumnWidth(2, 4000);
        sheet.setColumnWidth(3, 5000);
        sheet.setColumnWidth(4, 10000);
        sheet.setColumnWidth(5, 10000);
    }


    /**
     * 映射查找get方法
     *
     * @param o
     * @param fieldName
     * @return
     */
    public static Object invokeGet(Object o, String fieldName) {
        Method method = getGetMethod(o.getClass(), fieldName);
        try {
            return method.invoke(o, new Object[0]);
        } catch (Exception e) {
            logger.error("ExcelUtils-invokeGet-查找get方法错误");
            e.printStackTrace();
        }
        return null;
    }

    public static Method getGetMethod(Class objectClass, String fieldName) {
        StringBuilder sb = new StringBuilder();
        sb.append("get");
        sb.append(fieldName.substring(0, 1).toUpperCase());
        sb.append(fieldName.substring(1));
        try {
            return objectClass.getMethod(sb.toString());
        } catch (Exception e) {
            logger.error("ExcelUtils-invokeGet-查找get方法错误");
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 映射查找set方法
     *
     * @param o
     * @param fieldName
     * @param value
     */
    private static void invokeSet(Object o, String fieldName, Object value) {
        Method method = getSetMethod(o.getClass(), fieldName);
        try {
            method.invoke(o, new Object[]{value});
        } catch (Exception e) {
            logger.error("ExcelUtils-invokeGet-查找set方法错误");
            e.printStackTrace();
        }
    }

    private static Method getSetMethod(Class objectClass, String fieldName) {
        try {
            Class[] parameterTypes = new Class[1];
            Field field = objectClass.getDeclaredField(fieldName);
            parameterTypes[0] = field.getType();
            StringBuffer sb = new StringBuffer();
            sb.append("set");
            sb.append(fieldName.substring(0, 1).toUpperCase());
            sb.append(fieldName.substring(1));
            Method method = objectClass.getMethod(sb.toString(), parameterTypes);
            return method;
        } catch (Exception e) {
            logger.error("ExcelUtils-invokeGet-查找set方法错误");
            e.printStackTrace();
        }
        return null;
    }

    public static Integer getStartRow() {
        return startRow;
    }

    public static void setStartRow(Integer startRow) {
        ExcelUtils.startRow = startRow;
    }

    public static Integer getStartCol() {
        return startCol;
    }

    public static void setStartCol(Integer startCol) {
        ExcelUtils.startCol = startCol;
    }

    public static XSSFCellStyle getTextAlignCenter() {
        return textAlignCenter;
    }

    public static void setTextAlignCenter(XSSFCellStyle textAlignCenter) {
        ExcelUtils.textAlignCenter = textAlignCenter;
    }

    public static XSSFCellStyle getTextAlignLeft() {
        return textAlignLeft;
    }

    public static void setTextAlignLeft(XSSFCellStyle textAlignLeft) {
        ExcelUtils.textAlignLeft = textAlignLeft;
    }
}
