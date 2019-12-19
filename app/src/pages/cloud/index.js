import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import './index.scss';

function mapStateToProps(state) {
  return {
    ...state.user
  };
}

@withRouter
@connect(mapStateToProps)
class UserContainer extends PureComponent {
    componentDidMount () {
      console.log(this.props)
    }

    render() {
      return (
        <Fragment>
          <button className="btn1">创建下载任务</button>
          <div className="download-list">
              <ul className="dl-header">
                <li>项目名称</li>
                <li>本地目录</li>
                <li>任务状态</li>
                <li>操作</li>
              </ul>
              <ul className="dl-body">
        
              </ul>
          </div>
        </Fragment>
      );
    }
}

export default UserContainer;