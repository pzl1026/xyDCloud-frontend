import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, message} from 'antd';
import PageHeader from '@components/PageHeader';
import {routerRedux} from 'dva/router';
import { Player , ControlBar, BigPlayButton  } from 'video-react';
import "video-react/dist/video-react.css";
import './index.scss';
const { ipcRenderer } = window.require('electron');
function mapStateToProps(state) {
    return {
        ...state.user,
        ...state.device
    };
}

@withRouter
@connect(mapStateToProps)
class DeviceVideoPlay extends PureComponent {
    state = {
        downloadVideos: [],
        ip: '',
        start: 1, 
        playVideo: {},
        playPath: '',
        activeSlide: 1
    }
    componentDidMount() {
        let initialSlide = this.props.currentVideosPlay.findIndex(m => m.kbps === this.props.history.location.query.kbps);
        let playVideo = this.props.currentVideosPlay.find(m => m.kbps === this.props.history.location.query.kbps);
        let playPath = this.props.devices.find(m => m.ip === this.props.history.location.query.ip);

        this.setState({
            ip: this.props.history.location.query.ip,
            playVideo,
            playPath,
            activeSlide: initialSlide
        });
        new window.Swiper('#swiper-container', {
            autoplay: false,//可选选项，自动滑动
            slidesPerView: 5,
            spaceBetween: 10,
            initialSlide,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    changeVideoPlay (playVideo, index) {
        ipcRenderer.send('emit-device-connect', this.state.ip);
        ipcRenderer.on('ping-pass', (event, isAlive) => {
            if (isAlive) {
                this.setState({
                    playVideo,
                    activeSlide: index
                });
            } else {
                message.warning('设备异常,请重新搜索');
            }
        });
    }

    toBack= () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    render() {
        const {currentVideosPlay} = this.props;
        const {playVideo,ip, activeSlide} = this.state;

        return (
            <Fragment>
                <PageHeader 
                backTitle="视频播放" 
                isStr={1} 
                back={this.toBack}></PageHeader>
                <div className="video-play-list">
                    <Row className="page-container" type="flex" justify="center" gutter={16}>
                        <Col span={24}>
                            <div className="video-play-body">
                                <div className="video-title">{playVideo.name}</div>
                                <Player
                                fluid={false}
                                width={834}
                                playsInline
                                poster={`http://${ip}/media/disk0/REC_Folder/thumbnail/${playVideo['thumbnail-name']}.jpg`}
                                src={playVideo.playpath}
                                >
                                <BigPlayButton position="center" />
                                <ControlBar autoHide={false} disableDefaultControls={false}>
                                </ControlBar>
                                </Player>
                            </div>
                        </Col>
                        <Col span={24} style={{marginTop: 30}}>
                            <div className="video-play-list-body">
                                <div className="swiper-button-prev" style={{outline: 'none'}}></div>
                                <div className="swiper-container" id="swiper-container">
                                    <div className="swiper-wrapper">
                                        {currentVideosPlay.map((item, index) => {
                                            return (
                                                <div className="swiper-slide">
                                                    <div 
                                                    className="video-play-li" 
                                                    style={{border: index === activeSlide ? '2px solid #4051f9' : ''}}
                                                    onClick={() => this.changeVideoPlay(item, index)}>
                                                    <img src={`http://${this.state.ip}/media/disk0/REC_Folder/thumbnail/${item['thumbnail-name']}.jpg`} alt=""/>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="swiper-button-next" style={{outline: 'none'}}></div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default DeviceVideoPlay;