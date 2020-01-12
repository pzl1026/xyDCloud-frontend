import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {routerRedux} from 'dva/router';
import DownloadHeader from '@components/DownloadHeader';
import DownlistLi from './components/DownlistLi';
import './index.scss';
import { List } from 'antd';
const { ipcRenderer } = window.require('electron');


function mapStateToProps(state) {
    return {
        ...state.user,
        ...state.project
    };
}

const header = ['项目名称', '本地目录', '任务状态', '操作'];


function DownlistEmpty(props) {
    return (
        <div className="downlist-empty">
            <img src={require('../../assets/empty.png')} alt=""/>
            <span>当前无下载任务</span>
        </div>
    );
}

@withRouter
@connect(mapStateToProps)
class CloudContainer extends PureComponent {
    componentDidMount() {
        ipcRenderer.on('changed-pause-status', (event, projects) => {
            this.props.dispatch({
                type: 'project/saveProjects',
                payload: projects
            });
        });
    }

    changePause = (projectId) => {
        ipcRenderer.send('change-pause-status', projectId);
    }

    toCloudCreate = () => {
        this
            .props
            .dispatch(routerRedux.push({pathname: '/cloudcreate', query: {
                    // project_id: '99e04597292138fa'
                }}));
    }

    render() {
        const {projects} = this.props;
        return (
            <Fragment>
                <button className="btn1" onClick={this.toCloudCreate}>创建下载任务</button>
                <div className="download-list">
                    <DownloadHeader header={header} colSpan={[6, 10, 4, 4]}></DownloadHeader>
                    {projects.length > 0 ? 
                    <div className="table-list">
                        <DownlistLi {...this.props} changePause={this.changePause}></DownlistLi>
                    </div>:
                    <DownlistEmpty></DownlistEmpty>}
                </div>
            </Fragment>
        );
    }
}

export default CloudContainer;