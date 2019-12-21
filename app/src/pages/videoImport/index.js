import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Checkbox, Menu, Dropdown, Icon} from 'antd';
import PageHeader from '@component/PageHeader';
import './index.scss';

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

function VideoLi () {
    return (
        <div className="video-li">
            <div className="video-li-body">
                <div className="video-li-img">
                    <img src="" alt=""/>
                </div>
                <div className="video-li-info">
                    <span>videoassads</span>
                    <span>16.9M</span>
                    <div className="check"><Checkbox></Checkbox></div>
                </div>
            </div>
        </div>
    )
}

@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    componentDidMount() {
        console.log(this.props)
    }

    handleChange () {

    }

    onChange () {

    }

    leftChildren () {
        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ellipsis" /></span>
            </Dropdown>
        )
    }

    render() {
        return (
            <Fragment>
                <PageHeader backTitle="设备视频详情" rightText="立即导入" leftChildren={this.leftChildren()}></PageHeader>
                <div className="page-container" style={{marginTop: 20}}>
                    <header className="video-import-header"> 
                        <Checkbox onChange={this.onChange}>全选</Checkbox>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;已选视频：18</span>
                    </header>
                    <Row type="flex" justify="space-between" style={{marginTop: 20}}>
                        <Col span={6}>
                            <VideoLi></VideoLi>
                        </Col>
                        <Col span={6}>
                            <VideoLi></VideoLi>
                        </Col>
                        <Col span={6}>
                            <VideoLi></VideoLi>
                        </Col>
                        <Col span={6}>
                            <VideoLi></VideoLi>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;