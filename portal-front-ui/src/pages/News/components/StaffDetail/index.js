import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, List, Modal,Comment, message, Input, Carousel,Icon,Button, Form } from 'antd';
import styles from '../../News.less';
import { getConfig } from "../../../../utils/utils";
import imgBlank from '@/assets/public/blank.gif';


@connect(({ newsInfo, loading }) => ({
  newsInfo,
  loading: loading.models.newsInfo,
}))

export default class StaffDetail extends PureComponent {
  state={
    hasThumbsUp: false,
    staffIndex: 0,
    imgIndex: 1,
    submitLoading: false,
    comment: '',
  };
  componentDidMount() {
    const { staffId, currentIndex }=this.props;
    this.viewNewStaff(staffId, currentIndex);
  }

  viewNewStaff = (id, index)=>{
    this.setState({
      staffIndex: index,
      imgIndex: 1,
    });
    this.refs.imgView && this.refs.imgView.goTo(0);
    const { dispatch, newsInfo: {staffList, staffAllData} }=this.props;
    if(!staffAllData[index+1] && index+1<staffList.total){
      dispatch({
        type: 'newsInfo/getListMedia',
        payload:{
          typeSn: 'staff_presence',
          pageIndex: parseInt((index+1)/4),
          pageSize: 4
        }
      })
    }
    dispatch({
      type: 'newsInfo/queryStaffPhotoDetail',
      payload: {
        id: id,
      },
      callback: (res)=>{
        if(res.code === '100' && res.data.hasThumbsUp === 1){
          this.setState({
            hasThumbsUp: true
          })
        }else{
          this.setState({
            hasThumbsUp: false
          })
        }
      }
    });
  };

  phoSwipeToPrev = () =>{
    const { imgIndex } = this.state;
    if(imgIndex <= 1) return false;
    this.refs.imgView.prev();
    this.setState({
      imgIndex: imgIndex-1
    })
  };

  phoSwipeToNext = () =>{
    const { newsInfo: {staffDetail} } = this.props;
    const { imgIndex }= this.state;
    if(imgIndex >= staffDetail.list.length) return false;
    this.refs.imgView.next();
    this.setState({
      imgIndex: imgIndex+1
    })
  };

  goImgByIndex = (index) =>{
    debugger;
    const imgView= this.refs.imgView;
    imgView && imgView.goTo(index);
    this.setState({
      imgIndex: index+1
    })
  };

  handleSubmits = () => {
    const { dispatch,  newsInfo: { staffAllData } }=this.props;
    const { staffIndex, comment } = this.state;
    if (!comment){ message.error('抱歉，不能发表空的评论！');  return;}
    // this.setState({
    //   submitLoading: true,
    // });
    dispatch({
      type: "newsInfo/addNewscomment",
      payload: {
        id: staffAllData[staffIndex].id,
        content: comment
      },
      callback: (res)=>{
        // this.setState({
        //   submitLoading: false,
        // });
        if(res.code === '100'){
          this.setState({
            comment: ''
          })
        }
      }
    });

  };

  dolike = () => {
    const { dispatch, staffId } = this.props;
    const isLike = this.state.hasThumbsUp ? 0 : 1;
    dispatch({
      type: "newsInfo/makeThumbsUp",
      payload:{
        id: staffId,
        opt: isLike
      },
      callback: (res)=>{
        if(res.code === '100'){
          this.setState({
            hasThumbsUp: !!isLike
          })
        }
      }
    });
  };

  onCommentChange = (e) => {
    const { comment }=this.state;
    if(comment && comment.length>154) return false;
    this.setState({
      comment: e.target.value
    });
  };

  onImgError = (tar) => {
    const img = tar.currentTarget;
    img.src = imgBlank;
    img.classList.add("img-error");
    img.onerror = null;
  };

  render() {
    const {
      visible,
      newsInfo: { staffDetail, staffAllData },
      onCancel,
    } = this.props;
    const { imgIndex, staffIndex, hasThumbsUp, submitLoading, comment } = this.state;
    return <Modal
      visible={visible}
      mask={false}
      footer={null}
      centered
      onCancel={()=>onCancel && onCancel()}
      // onCancel={onCancel}
      width={1024}
      className={styles.modalContent}
    >
      <Row>
        <Col span={17} style={{background:'#000'}}>
          <div id="phoBox" className="photo-banner" style={{margin: '0 35px'}}>
            <div className="photo-times">{imgIndex}/{staffDetail.list.length}</div>
            <Icon type="left" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.phoSwipeToPrev} />
            <div className="photo-view">
              <Carousel className="photo-list" ref="imgView" dots={false}>
                {staffDetail.list && staffDetail.list.map((item, index)=>(
                  <img key={index} src={`${getConfig().ftpHost}${item.filePath}`} onError={this.onImgError} alt=""/>
                ))}
              </Carousel>
            </div>
            <Icon type="right" style={{color: '#CFCFCF', fontSize: 24}} onClick={this.phoSwipeToNext} />
          </div>
          <Row className={styles.thumbPics} gutter={8}>
            <Col span={4}>
              {staffIndex >0 && staffAllData[staffIndex-1] ? (
                <div onClick={()=>this.viewNewStaff(staffAllData[staffIndex-1].id, staffIndex-1)}>
                  <img src={`${getConfig().ftpHost}${staffAllData[staffIndex-1].photo}`} onError={this.onImgError} alt=""/>
                  上一图集
                </div>
              ) : ""}
            </Col>
            <Col span={16} className="sm-pics">
              {staffDetail && staffDetail.list ? (
                <div style={{ width: staffDetail.list.length *108}}>
                  {
                    staffDetail.list.map((itm, index)=>(
                      <img className={imgIndex===index+1 ? 'selImg' : ''} key={index} src={`${getConfig().ftpHost}${itm.filePath}`} onClick={()=>this.goImgByIndex(index)} onError={this.onImgError} alt=""/>
                    ))
                  }
                </div>
              ) : ''}
            </Col>
            <Col span={4}>
              {staffAllData[staffIndex+1] ? (
                <div onClick={()=>this.viewNewStaff(staffAllData[staffIndex+1].id, staffIndex+1)}>
                  <img src={`${getConfig().ftpHost}${staffAllData[staffIndex+1].photo}`} onError={this.onImgError} alt=""/>
                  下一图集
                </div>
              ) : ""}
            </Col>
          </Row>
        </Col>
        <Col span={7}>
          <div className={styles.topArea}>
            <h4 className={styles.topTitle}>{staffDetail.title}</h4>
            <span className={styles.publickPer}>发布人：{staffDetail.publisher}</span>
            <span className={styles.spanText}>发布时间：{staffDetail.publishTime ? staffDetail.publishTime.split(" ")[0] : ''}</span>
            <div className={styles.spanCount}>阅读：{staffDetail.visitCount}</div>
            <div className={styles.botTitle}>{staffDetail.title}</div>
            {hasThumbsUp ? (
              <Icon
                type="like"
                className={styles.hasThumbsUp}
                theme={'filled'}
                onClick={this.dolike}
              />
            ) : (
              <Icon
                type="like"
                theme={'outlined'}
                onClick={this.dolike}
              />
            )}
            <span style={{ paddingLeft: 8, cursor: 'auto' }}>{staffDetail.thumbsUp}</span>
          </div>
          <div className={styles.commentsBox}>
            <ul className="comment-list">
              {staffDetail && staffDetail.comments.length ? staffDetail.comments.map((comment)=>(
                <li key={comment.id} style={{padding: '8px 0'}}>
                  <div className="msg">{comment.content}</div>
                  <div className="person">{comment.creator}<span style={{paddingLeft: 5}}>{comment.updateTime.split(" ")[0]}</span> </div>
                </li>
              )) : ''}
            </ul>
            <div className={styles.commentArea}>
              <Input.TextArea rows={4} value={comment} onChange={this.onCommentChange} placeholder={'请输入最多155字的评论'}/>
              <p style={{padding: '12px 0', margin: 0, textAlign: 'right'}}>
                <Button type="primary" onClick={this.handleSubmits}>提交</Button>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </Modal>
  }
}
