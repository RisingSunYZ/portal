package com.dragon.portal.model.idm.client;

import java.util.List;

public class Users {
	private String success;

	private String message;

	private String resultCode;

	private List<WsUsers> wsUsers ;

	public void setSuccess(String success){
	this.success = success;
	}
	public String getSuccess(){
	return this.success;
	}
	public void setMessage(String message){
	this.message = message;
	}
	public String getMessage(){
	return this.message;
	}
	public void setResultCode(String resultCode){
	this.resultCode = resultCode;
	}
	public String getResultCode(){
	return this.resultCode;
	}
	public void setWsUsers(List<WsUsers> wsUsers){
	this.wsUsers = wsUsers;
	}
	public List<WsUsers> getWsUsers(){
	return this.wsUsers;
	}

}
