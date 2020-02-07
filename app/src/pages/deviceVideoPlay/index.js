import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col} from 'antd';
import PageHeader from '@components/PageHeader';
import {routerRedux} from 'dva/router';
import { Player } from 'video-react';
import "video-react/dist/video-react.css";
import './index.scss';

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
        initialSlide: 1
    }
    componentDidMount() {
        let initialSlide = this.props.currentVideosPlay.findIndex(m => m.kbps === this.props.history.location.query.kbps);
        let playVideo = this.props.currentVideosPlay.find(m => m.kbps === this.props.history.location.query.kbps);
        let playPath = this.props.devices.find(m => m.ip === this.props.history.location.query.ip);

        this.setState({
            ip: this.props.history.location.query.ip,
            playVideo,
            playPath,
            initialSlide
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
        })
    }

    changeVideoPlay (playVideo) {
        this.setState({
            playVideo
        });
    }

    toBack= () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    render() {
        const {currentVideosPlay} = this.props;
        const {playVideo,ip, initialSlide} = this.state;
        return (
            <Fragment>
                <PageHeader 
                backTitle="视频播放" 
                isStr={1} 
                back={this.toBack}></PageHeader>
                <div className="video-play-list">
                    <Row className="page-container" type="flex" justify="center" gutter={16}>
                        <Col span={24}>
                            <div class="video-play-body">
                                <div class="video-title">{playVideo.name}</div>
                                <Player
                                fluid={false}
                                width={834}
                                playsInline
                                poster={`${ip}media/disk0/REC_Folder/thumbnail/${playVideo['thumbnail-name']}.jpg`}
                                src={playVideo.playpath}
                                />
                            </div>
                        </Col>
                        <Col span={24} style={{marginTop: 30}}>
                            <div class="video-play-list-body">
                                <div class="swiper-container" id="swiper-container">
                                    <div class="swiper-wrapper">
                                        {currentVideosPlay.map((item, index) => {
                                            return (
                                                <div class="swiper-slide">
                                                    <div 
                                                    className="video-play-li" 
                                                    style={{border: index === initialSlide ? '2px solid #4051f9' : ''}}
                                                    onClick={() => this.changeVideoPlay(item)}>
                                                    <img src={`http://${this.state.ip}/media/disk0/REC_Folder/thumbnail/${item['thumbnail-name']}.jpg`} alt=""/>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div class="swiper-button-prev"></div>
                                    <div class="swiper-button-next"></div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Fragment>
        );
    }
}

export default DeviceVideoPlay;