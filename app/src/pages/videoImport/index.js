import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Checkbox, Menu, Dropdown, Icon} from 'antd';
import PageHeader from '@components/PageHeader';
import {routerRedux} from 'dva/router';
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
        ...state.user,
        ...state.device
    };
}

function VideoLi (props) {
    const {item} = props;
    let size = parseFloat(item['size-bytes'] / Math.pow(1024, 2)).toFixed(1);
    return (
        <div className="video-li">
            <div className="video-li-body">
                <div className="video-li-img">
                    <img src="" alt=""/>
                </div>
                <div className="video-li-info">
                    <span>{item.name}</span>
                    <span>{size}M</span>
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
        this.requestVideos();
    }

    requestVideos = () => {
        this.props.dispatch({
            type: 'device/getDeviceVideos',
            payload: {
                // ip: ''
            }
        });
    }

    handleChange () {

    }

    onChange () {

    }

    leftChildren () {
        return (
            <span onClick={e => this.stopPropagation()}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <span>&nbsp;&nbsp;&nbsp;&nbsp;<Icon type="ellipsis" /></span>
                </Dropdown>
            </span>
        )
    }

    toBack= () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    render() {
        const {currentDeviceVideos} = this.props;
        return (
            <Fragment>
                <PageHeader backTitle="设备视频详情" rightText="立即导入" leftChildren={this.leftChildren()} back={this.toBack}></PageHeader>
                <div className="page-container" style={{marginTop: 20}}>
                    <header className="video-import-header"> 
                        <Checkbox onChange={this.onChange}>全选</Checkbox>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;已选视频：18</span>
                    </header>
                    <div className="videos-list">
                        <Row type="flex" style={{marginTop: 20}} gutter={[16,16]}>
                            {currentDeviceVideos.map(item => {
                                return (
                                    <Col span={6}>
                                    <VideoLi {...this.props} item={item}></VideoLi>
                                </Col>
                                )
                            })}
                        </Row>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;