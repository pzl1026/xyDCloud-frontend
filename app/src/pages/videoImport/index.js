import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Checkbox, Menu, Dropdown, Icon} from 'antd';
import PageHeader from '@components/PageHeader';
import {routerRedux} from 'dva/router';
import './index.scss';
const { ipcRenderer } = window.require('electron');

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
                    <div className="check">
                        {
                            !item.needDownload ? 
                            <Checkbox 
                            onChange={(e) => props.changeDownloadVideos(e.target.checked, item.kbps)} 
                            checked={props.downloadVideos.includes(item.kbps)}>
                            </Checkbox> : 
                            <span style={{fontSize: '12px', color: '#666'}}>下载中</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    state = {
        downloadVideos: [],
        ip: ''
    }
    componentDidMount() {
        console.log(this.props)
        this.setState({
            ip: this.props.history.location.query.ip
        });
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

    changeDownloadVideosAll = (e) => {
        let downloadVideos = [];
        if (e.target.checked) {
            downloadVideos = this.props.currentDeviceVideos.filter(m => !m.needDownload).map(item => item.kbps);
        }
        this.setState({
            downloadVideos
        });
    }

    changeDownloadVideos = (checked, kbps) => {
        let downloadVideos = this.state.downloadVideos;
        if (checked) {
            downloadVideos.push(kbps);
        } else {
            downloadVideos = downloadVideos.filter(m => m.kbps !== kbps);
        }
        this.setState({
            downloadVideos
        });
    }

    setDownload = () => {
        ipcRenderer.send('change-device-videos-download', {videosKbps: this.state.downloadVideos, ip: this.state.ip});
        this.toBack();
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
                <PageHeader backTitle="设备视频详情" 
                rightText="立即导入" 
                rightClick={this.setDownload}
                leftChildren={this.leftChildren()} 
                back={this.toBack}></PageHeader>
                <div className="page-container" style={{marginTop: 20}}>
                    <header className="video-import-header"> 
                        <Checkbox onChange={this.changeDownloadVideosAll}>全选</Checkbox>
                        <span>&nbsp;&nbsp;&nbsp;&nbsp;已选视频：{this.state.downloadVideos.length}</span>
                    </header>
                    <div className="videos-list">
                        <Row type="flex" style={{marginTop: 20}} gutter={[16,16]}>
                            {currentDeviceVideos.map(item => {
                                return (
                                    <Col span={6}>
                                    <VideoLi 
                                    {...this.props} 
                                    item={item} 
                                    changeDownloadVideos={this.changeDownloadVideos} 
                                    downloadVideos={this.state.downloadVideos}>
                                    </VideoLi>
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