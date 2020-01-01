import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Menu, Dropdown, Icon} from 'antd';
import DownloadHeader from '@components/DownloadHeader';
import './index.scss';

const header = ['设备名称', '本地名称', '状态', '操作'];

const menu = (
    <Menu>
        <Menu.Item key="0">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>打开本地目录</span>
            </div>
        </Menu.Item>
        <Menu.Item key="1">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>编辑导入目录</span>
            </div>
        </Menu.Item>
        <Menu.Item key="2">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>断开设备链接</span>
            </div>
        </Menu.Item>
    </Menu>
);

function mapStateToProps(state) {
    return {
        ...state.user
    };
}

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
                <div className="dl-action">
                    <img src="" alt=""/>
                    <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                        <span><Icon type="ellipsis" /></span>
                    </Dropdown>
                </div>
            </Col>
        </Row>
    );
}

function DownlistEmpty (props) {
    return (
        <div className="downlist-empty">
            <img src="" alt=""/>
            <span>当前无下载任务</span>
        </div>
    );
}

@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    componentDidMount() {
        console.log(this.props)
    }

    handleChange () {

    }

    render() {
        return (
            <Fragment>
                <button className="btn1">添加设备</button>
                <div className="download-list">
                    <DownloadHeader header={header}></DownloadHeader>
                    <DownlistLi></DownlistLi>
                    <DownlistEmpty></DownlistEmpty>
                </div>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;