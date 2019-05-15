import React, { Component } from 'react';
import styles from './index.less';
import {Card, Timeline, Icon, Button, Input} from 'antd';
import config from "../Exception/typeConfig";
import classNames from "classnames";
import FileList from '../FileList';
import PostscriptFileList from '../PostscriptFileList';

const { TextArea } = Input;

const PostscriptList = ({postscripts}) => {
  return (
    <div className={styles.fuyan_timeline} style={{visibility:postscripts?"visible":"hidden",marginTop:'10px'}}>
      <Timeline className={styles.timeLineBox}>
        {postscripts&&postscripts.map((post, index) =>
          <Timeline.Item key={index}>
            <div style={{ fontSize:'12px',color:'rgba(0, 0, 0, .45)',lineHeight:'1.5em' }}>{post.createTime}</div>
            <div style={{ color:'#1818FF',margin:'8px 0', wordBreak:'break-all' }} dangerouslySetInnerHTML={{__html: post.content}}></div>
            <div><PostscriptFileList postscriptsFiles={post.files} delShow={0}/></div>
          </Timeline.Item>
        )}
      </Timeline>
    </div>
  );
};

export default PostscriptList;
