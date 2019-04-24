import React, {createElement} from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';
import {Button} from "antd";
import { getConfig } from "../../utils/utils";

class Exception401 extends React.PureComponent {
  static defaultProps = {
    backText: 'back to home',
    redirect: '/',
  };

  componentDidMount() {
    console.log('组件加载。。。。');

  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const logoutUrl = getConfig().idmLogoutUrl;
    const redrectUrl = getConfig().domain;
    return (
      <div>
        <img src={logoutUrl} style={{width:'0', height:'0', border:'0', overflow:'hidden'}} />
        <Exception
          type="401"
          desc={formatMessage({ id: 'app.exception.description.401' })}
          linkElement={Link}
          backText={formatMessage({ id: 'app.exception.back' })}
          redirect={redrectUrl}
          actions={createElement(
              "a",
              {
                to: redrectUrl,
                href: redrectUrl,
              },
            <Button type="primary">重新登录</Button>
            )}
        />
      </div>
    );
  }
}

export default Exception401;
