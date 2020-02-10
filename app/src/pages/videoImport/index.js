import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Checkbox, Menu, Dropdown, Icon, message} from 'antd';
import PageHeader from '@components/PageHeader';
import {routerRedux} from 'dva/router';
import './index.scss';
const { ipcRenderer } = window.require('electron');

function DownpathModal(props) {
    return (
        <div className="downpath-modal">
            <div className="downpath-mark" onClick={() => props.toggleModal(false)}></div>
            <div className="downpath-body">
                <span className="downpath-title">设置视频下载路径</span>
                <div className="folder-select" onClick={props.openFolderDialog}>
                    <div className="folder-name">
                        {props.localPath ? <span>{props.localPath}</span> : <span style={{color: '#bfbfbf'}}>选择本地文件夹</span>}
                    </div>
                    <span><Icon type="folder-open" /></span>
                </div>
                <div className="downpath-btn">
                    <button className="btn1 downpath-cancel" onClick={() => props.toggleModal(false)}>取消</button>
                    <button className="btn1 downpath-sure" onClick={props.downSure}>确认</button>
                </div>
            </div>
        </div>
    );
}

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
    // http://192.168.2.208/media/disk0/REC_Folder/thumbnail/NBox__3.mov_1578473840.jpg
    const {item} = props;
    let size = parseFloat(item['size-bytes'] / Math.pow(1024, 2)).toFixed(1);
    return (
        <div className="video-li">
            <div className="video-li-body">
                <div className="video-li-img" onClick={() => props.toVideoPlay(item)}>
                    <img src={`http://${props.ip}/media/disk0/REC_Folder/thumbnail/${item['thumbnail-name']}.jpg`} alt=""/>
                </div>
                <div className="video-li-info">
                    <span>{item.name}</span>
                    <span>{size}M</span>
                    <div className="check">
                        {
                            !item.needDownload || item.isFail ? 
                            <Checkbox 
                            onChange={(e) => props.changeDownloadVideos(e.target.checked, item.kbps)} 
                            checked={props.downloadVideos.includes(item.kbps)}>
                            </Checkbox> : 
                            <span style={{fontSize: '12px', color: '#666'}}>{item.isSuccess ? '已下载' : '下载中'}</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

@withRouter
@connect(mapStateToProps)
class VideoImportContainer extends PureComponent {
    state = {
        downloadVideos: [],
        ip: '',
        start: 1,
        modalShow: false,
        localPath: '',
        currentDevice: {}
    }

    componentDidMount() {
        let ip = this.props.history.location.query.ip;
        let currentDevice = this.props.downloadDevices.find(n => n.ip === ip);
        console.log(currentDevice, 'currentDevice')
        this.setState({
            ip,
            currentDevice,
            localPath: currentDevice.localPath
        }, () => {
            this.requestVideos();
        });
        ipcRenderer.on('video-localpath', (e, localPath) => {
            this.setState({
                localPath
            });
        });
        ipcRenderer.on('selected-video', (e, localPath) => {
            this.props.dispatch(routerRedux.push({
                pathname: '/device'
            }));
        });
    }

    componentWillUnmount() {
        clearInterval(this.getTimer);
        this.getTimer = null;
    }

    toggleModal = (modalShow) => {
        this.setState({
            modalShow
        });
    }

    openFolderDialog = () => {
        ipcRenderer.send('open-folder-dialog-file');
    }

    downSure = () => {
        ipcRenderer.send('change-device-videos-download', {
            videosKbps: this.state.downloadVideos,
            ip: this.state.ip,
            localPath: this.state.localPath
        });
    }

    requestVideos = () => {
        const self = this;
        let o = {};
        o['disk-type'] = 1;
        o.start = this.state.start;
        o.count = 1000;
        this.props.dispatch({
            type: 'device/getDeviceVideos',
            payload: {
                param: o,
                cb: self.changeStart,
                ip: self.state.ip
            }
        });
    }

    changeStart  = (isNextPage) => {
        let start = isNextPage ? (this.state.start + 1000) : 1;

        this.setState({
            start 
        }, () => {
            this.getTimer = setTimeout(() => {
                this.requestVideos();
            }, isNextPage ? 0 : 20000);
        });
    }

    handleChange () {
        // http://192.168.2.208/media/disk0/REC_Folder/thumbnail/NBox__3.mov_1578473840.jpg
    }

    toVideoPlay = (video) => {
        const videos = JSON.parse(JSON.stringify(this.props.currentDeviceVideos));

        this.props.dispatch({
            type: 'device/saveCurrentVideosPlay',
            payload: videos
        });

        this.props.dispatch(routerRedux.push({
            pathname: '/devicevideoplay',
            query: {
                ip: this.state.ip,
                kbps: video.kbps
            }
        }));
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
            downloadVideos = [...downloadVideos, kbps];
        } else {

            downloadVideos = downloadVideos.filter(m => m !== kbps);
        }
        this.setState({
            downloadVideos
        });
    }

    setDownload = () => {
        if(!this.props.deviceStatus) {
            message.warning('请断开设备，重新搜索');
            return;
        }
        this.toggleModal(true);
        // ipcRenderer.send('change-device-videos-download', {videosKbps: this.state.downloadVideos, ip: this.state.ip});
        // this.toBack();
    }

    leftChildren () {
        return (
            <span onClick={e => e.stopPropagation()}>
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
        // leftChildren={this.leftChildren()} 
        return (
            <Fragment>
                <PageHeader backTitle={`${this.state.currentDevice['name']}设备视频详情`}
                rightText="立即导入" 
                rightClick={this.setDownload}
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
                                    <Col span={6} key={item.kbps + Math.random()}>
                                    <VideoLi
                                    {...this.props} 
                                    ip={this.state.ip}
                                    item={item} 
                                    toVideoPlay={this.toVideoPlay}
                                    changeDownloadVideos={this.changeDownloadVideos} 
                                    downloadVideos={this.state.downloadVideos}>
                                    </VideoLi>
                                </Col>
                                )
                            })}
                        </Row>
                    </div>
                </div>
                {this.state.modalShow ?
                    <DownpathModal 
                    localPath={this.state.localPath}
                    toggleModal={this.toggleModal}
                    openFolderDialog={this.openFolderDialog} 
                    downSure={this.downSure}/>: 
                null}
            </Fragment>
        );
    }
}

export default VideoImportContainer;