package com.dragon.portal.model.idm.client;

import java.io.Serializable;

public class WsAttribute implements Serializable {

	private static final long serialVersionUID = 4041667008762130486L;

	private String name;

	private String value;

	private String[] values;

	public WsAttribute() {
	}

	public WsAttribute(String name, String value) {
		this.name = name;
		this.value = value;
	}

	public WsAttribute(String name, String[] values) {
		this.name = name;
		this.values = values;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String[] getValues() {
		return values;
	}

	public void setValues(String[] values) {
		this.values = values;
	}
	
	public String toString(){
		StringBuffer sbf = new StringBuffer();
		if(this.values != null && this.values.length > 0){
			for(String str : this.values){
				sbf.append(str);
			}
		}
		return this.name + this.value + sbf.toString();
	}

}
