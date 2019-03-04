package com.dragon.portal.vo.news;

import java.io.Serializable;
import java.util.List;

public class NoticeComboTreeVo implements Serializable {

    private String id;		
    private String text;	
    private String signName; //签发人
    private String signNo;//签发人工号
    private int relation;	//是否关联发文说明 1:关联，2：没有关联
    private List<NoticeComboTreeVo> children;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<NoticeComboTreeVo> getChildren() {
        return children;
    }

    public void setChildren(List<NoticeComboTreeVo> children) {
        this.children = children;
    }

	public String getSignName() {
		return signName;
	}

	public void setSignName(String signName) {
		this.signName = signName;
	}

	public int getRelation() {
		return relation;
	}

	public void setRelation(int relation) {
		this.relation = relation;
	}

    public String getSignNo() {
        return signNo;
    }

    public void setSignNo(String signNo) {
        this.signNo = signNo;
    }
}
