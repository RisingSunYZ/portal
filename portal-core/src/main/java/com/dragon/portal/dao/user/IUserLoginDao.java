package com.dragon.portal.dao.user;

import com.dragon.portal.model.user.UserLogin;
import com.github.pagehelper.Page;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * @author : ruanzg
 * @date : 2019-2-25 14:22:34
 * description : 字段项管理Dao接口
 */
@Mapper
@Repository
public interface IUserLoginDao {

    /**
     */
    public UserLogin getUserLoginById(String id) throws Exception;

    /**
     */
    public List<UserLogin> getAll(UserLogin userLogin) throws Exception;

    /**
     */
    public Page<UserLogin> getPagerModelByQuery(UserLogin userLogin) throws Exception;

    /**
     */
    public void insertUserLogin(UserLogin userLogin) throws Exception;

    /**
     */
    public void delUserLoginById(String id) throws Exception;

    /**
     */
    public void updateUserLogin(UserLogin userLogin) throws Exception;

    /**
     * 根据账号获取用户信息
     * @param no
     * @throws Exception
     */
    public List<UserLogin>getUserLoginByUserName(String no) throws Exception;

    /**
     * 根据账号密码获取用户信息
     * @param userLogin
     * @throws Exception
     */
    public List<UserLogin>getUserByNameAndPwd(UserLogin userLogin) throws Exception;

    //------------api------------
}
