import React from 'react';
import { Input } from 'antd';
import { Link } from 'react-router-dom';
import MyBox from './MyBox'
export default ({src, value  }) => (
  <div>
    <img src={src} />
    <Input placeholder="请输入关键字" defaultValue={value} />
    <Link to=':/roster'>Roster</Link>
    <MyBox />
  </div>
);
