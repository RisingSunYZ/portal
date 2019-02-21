package com.dragon.portal.service;

import com.github.pagehelper.Page;
import com.github.pagehelper.PageHelper;
import org.apache.commons.collections.CollectionUtils;

/**
 * @ClassName BaseService
 * @Description 基本service
 * @Author bruce.liu
 * @Date 2019/1/20/020 10:45
 * @Version 1.0
 **/
public abstract class BaseService<T> {

    /**
     * 解决不同数据库分页的问题
     */
    public void selectOneConfig() {
        PageHelper.startPage(1, 1);
    }

//    /**
//     * 查询单个对象
//     *
//     * @return
//     */
//    public T selectOne(Class interfaceName, String method) {
////        Page<T> page = PageHelper.startPage(1, 1).doSelectPage({() ->
////                countryMapper.selectGroupBy()});
////        if (CollectionUtils.isNotEmpty(page)) {
////            return page.get(0);
////        }
//        return null;
//    }
}
