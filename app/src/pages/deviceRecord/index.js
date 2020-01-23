import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Icon} from 'antd';
import DownloadHeader from '@components/DownloadHeader';
import {getLocalTime} from '@helper/utils';
import './index.scss';
const { ipcRenderer } = window.require('electron');

function mapStateToProps(state) {
    return {
        ...state.user,
    };
}

const headerFields = [
    {
        type: 1,
        typeTitle: '正在下载',
        tableFields: [
            '设备名称', '导入视频数量', '导入目录', '导入进度'
        ],
        colSpan: [7, 3, 7, 7]
    }, {
        type: 2,
        typeTitle: '下载成功',
        tableFields: [
            '设备名称', '导入视频数量', '导入目录', '完成时间'
        ],
        colSpan: [7, 3, 7, 7]
    }, {
        type: 3,
        typeTitle: '下载失败',
        tableFields: [
            '设备名称', '导入视频数量', '导入目录', '失败原因'
        ],
        colSpan: [7, 3, 7, 7]
    }
];

function DownlistLi(props) {
    console.log(props.videos, 'videosvideos')
    return props.videos.map(item => {
        let lastVal = '';
        let count = 0;
        switch(props.type) {
            case 1:
                lastVal = item.process;
                count = item.downCount;
                break;
            case 2:
                lastVal = getLocalTime(item.successTime / 1000);
                count = item.successCount;
                break;
            case 3:
                lastVal = item.failReason;
                count = item.failCount;
                break;
            default:
        }
        return (
            <Row className="dl-li" key={item.id}>
                <Col span={7}>
                    <span>{item.product.sn}</span>
                </Col>
                <Col span={3}>
                    <span>{count}</span>
                </Col>
                <Col span={7}>
                    <span>{item.localPath}</span>
                </Col>
                <Col span={7}>
                    <span>{lastVal}</span>
                </Col>
            </Row>
        )
    });
}

function TabList(props) {
    const {typeActive} = props;
    let videosRecords = props.videosRecords;
    let isFail = videosRecords[2].videos.find(m => m.failCount > 0);
    return (
        <ul className="record-tabs">
            {headerFields.map(item => {
                return (
                    <li key={item.type}
                        className={item.type === typeActive
                        ? 'active'
                        : ''}
                        onClick={() => props.changeTab(item.type)}>
                        <span>{item.typeTitle}</span>
                        <sup style={{color: '#f00'}}>{item.type === 3 && isFail ? <Icon type="exclamation-circle" /> : null}</sup>
                    </li>
                );
            })}
        </ul>
    )
}

function TableList(props) {
    const {typeActive} = props;
    // console.log(props.videosRecords, 'props.videosRecords')
    return headerFields.map(item => {
        let currentVideo = props.videosRecords.find(m => m.type === item.type);
        if (!currentVideo) return null;
        // console.log(currentVideo.videos, 'videosss')
     
        return (
            <div
                key={item.type}
                className="download-list"
                style={{
                display: item.type !== typeActive
                    ? 'none'
                    : ''
            }}>
                <DownloadHeader header={item.tableFields} colSpan={item.colSpan} videosRecords={props.videosRecords}></DownloadHeader>
                <div className="table-list">
                    <DownlistLi videos={currentVideo.videos || []} type={item.type}/>
                </div>
            </div>
        )
    })
}

@withRouter
@connect(mapStateToProps)
class CloudRecordContainer extends Component {
    state = {
        typeActive: 1,
        videosRecords: [
            {
                type: 1,
                videos: []
            }, {
                type: 2,
                videos: []
            }, {
                type: 3,
                videos: []
            }
        ]
    }

    constructor(props) {
        super(props);
        this.getVideoTimer = null;
    }

    componentDidMount() {
        console.log(this.props);

        ipcRenderer.send('post-devices-videos');
        this.getVideoTimer = setInterval(() => {
            ipcRenderer.send('post-all-videos');
        }, 1000);
   
        // 获取所有的曾经下载过的跟即将下载以及失败的视频
        ipcRenderer.on('get-devices-videos', (event, allVideos) => {
            console.log(allVideos, 'allvides')
            this.getAllStatusVideos(allVideos);
        });
    }

    componentWillUnmount() {
        clearInterval(this.getVideoTimer);
    }

    getAllStatusVideos(allVideos) {
        // console.log(allVideos, 'allVideos')
        let videosRecords = this.state.videosRecords;
        videosRecords[0].videos = allVideos.map(item => {
            let successCount = item['media-files'].filter(m => m.isSuccess).length;
            item.downCount = item['media-files'].filter(m => m.needDownload && !m.isSuccess).length;
            let count = item['media-files'].filter(m => m.needDownload).length;
            item.process = count === 0 ? '100%' : (parseFloat(successCount / count).toFixed(2) * 100) + '%';
            return item;
        });
        videosRecords[1].videos = allVideos.map(item => {
            item.successCount = item['media-files'].filter(m => m.isSuccess).length;
            return item;
        });
        videosRecords[2].videos = allVideos.map(item => {
            item.failCount = item['media-files'].filter(m => m.isFail).length;
            return item;
        });
        this.setState({
            videosRecords
        });
        console.log(videosRecords, 'videosRecords')
    }

    callback() {}

    changeTab = (type) => {
        this.setState({typeActive: type});
        ipcRenderer.send('post-all-videos');
    }

    render() {
        const {typeActive} = this.state;

        return (
            <Fragment>
                <TabList {...this.props} typeActive={typeActive} changeTab={this.changeTab} videosRecords={this.state.videosRecords}/>
                <TableList {...this.props}  typeActive={typeActive} videosRecords={this.state.videosRecords}/> {/* <div className="download-list">
                    <DownloadHeader header={header}></DownloadHeader>
                    <DownlistLi></DownlistLi>
                </div> */}
            </Fragment>
        );
    }
}

export default CloudRecordContainer;