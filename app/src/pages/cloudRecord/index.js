import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import { Row, Col } from 'antd';
import DownloadHeader from '@component/DownloadHeader';
import './index.scss';

function mapStateToProps (state) {
    return {
        ...state.user
    };
}

const header = ['文件名称', '项目名称', '下载目录', '失败原因'];

function DownlistLi (props) {
    return (
        <Row className="dl-li">
            <Col span={6}>
                <span>项目名称</span>
            </Col>
            <Col span={6}>
                <span>本地目录</span>
            </Col>
            <Col span={6}>
                <span>任务状态</span>
            </Col>
            <Col span={6}>
                <span>任务状态</span>
            </Col>
        </Row>
    );
}

@withRouter
@connect(mapStateToProps)
class CloudRecordContainer extends PureComponent {
  componentDidMount() {
    console.log(this.props)
  }

  callback () {

  }

  render() {
    return (
      <Fragment>
        <ul className="record-tabs">
            <li className="active">
                <span>正在下载</span>
            </li>
            <li>
                <span>下载成功</span>
            </li>
            <li>
                <span>下载失败</span>
                <span></span>
            </li>
        </ul>
        <div className="download-list">
            <DownloadHeader header={header}></DownloadHeader>
            <DownlistLi></DownlistLi>
        </div>
      </Fragment>
    );
  }
}

export default CloudRecordContainer;