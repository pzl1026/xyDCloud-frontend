import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col} from 'antd';
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
            '文件名称', '项目名称', '下载目录', '下载进度'
        ],
        colSpan: [6, 6, 6, 6]
    }, {
        type: 2,
        typeTitle: '下载成功',
        tableFields: [
            '文件名称', '项目名称', '本地目录', '完成时间'
        ],
        colSpan: [6, 6, 6, 6]
    }, {
        type: 3,
        typeTitle: '下载失败',
        tableFields: [
            '文件名称', '项目名称', '下载目录', '失败原因'
        ],
        colSpan: [6, 6, 6, 6]
    }
];

function DownlistLi(props) {
    console.log(props.videos, 'videosvideos')
    return props.videos.map(item => {
        let lastVal = '';
        switch(props.type) {
            case 1:
                let progress = parseInt(Number(item.downloadProgress) * 100);
                lastVal = progress === 0 ? '等待中' : progress + '%';
                break;
            case 2:
                lastVal = getLocalTime(item.successTime / 1000);
                break;
            case 3:
                lastVal = item.failReason;
                break;
            default:
        }
        return (
            <Row className="dl-li" key={item.id}>
                <Col span={6}>
                    <span>{item.name}</span>
                </Col>
                <Col span={6}>
                    <span>{item.projectName}</span>
                </Col>
                <Col span={6}>
                    <span>{item.localPath}</span>
                </Col>
                <Col span={6}>
                    <span>{lastVal}</span>
                </Col>
            </Row>
        )
    });
}

function TabList(props) {
    const {typeActive} = props;
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
                        <span></span>
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
                <DownloadHeader header={item.tableFields} colSpan={item.colSpan}></DownloadHeader>
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

        ipcRenderer.send('post-all-videos');
        this.getVideoTimer = setInterval(() => {
            ipcRenderer.send('post-all-videos');
        }, 1000);
   
        // 获取所有的曾经下载过的跟即将下载以及失败的视频
        ipcRenderer.on('get-all-videos', (event, allVideos) => {
            this.getAllStatusVideos(allVideos);
        });
    }

    componentWillUnmount() {
        clearInterval(this.getVideoTimer);
    }

    getAllStatusVideos(allVideos) {
        // console.log(allVideos, 'allVideos')
        let videosRecords = this.state.videosRecords;
        videosRecords[0].videos = allVideos.filter(item => !item.isFail && !item.isSuccess);
        videosRecords[1].videos = allVideos.filter(item => item.isSuccess);
        videosRecords[2].videos = allVideos.filter(item => item.isFail);
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
                <TabList {...this.props} typeActive={typeActive} changeTab={this.changeTab}/>
                <TableList {...this.props}  typeActive={typeActive} videosRecords={this.state.videosRecords}/> {/* <div className="download-list">
                    <DownloadHeader header={header}></DownloadHeader>
                    <DownlistLi></DownlistLi>
                </div> */}
            </Fragment>
        );
    }
}

export default CloudRecordContainer;