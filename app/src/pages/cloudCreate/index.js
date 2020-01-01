import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Select, Icon} from 'antd';
import {routerRedux} from 'dva/router';
import PageHeader from '@components/PageHeader';
import './index.scss';
const { ipcRenderer } = window.require('electron');

const { Option } = Select;

function mapStateToProps(state) {
    return {
        ...state.user,
        ...state.project
    };
}

@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    state = {
        projectSelectedId: undefined,
        localPath: ''
    }

    componentDidMount() {
        // ipcRenderer.removeListener('fetch-folder-dialog', () => {});
        // ipcRenderer.removeListener('create-project-path', () => {});
        ipcRenderer.on('fetch-folder-dialog', (event, localPath) => {
            this.setState({
                localPath
            });
        });
        ipcRenderer.on('create-project-path', (event, projects) => {
            this.props.dispatch({
                type: 'project/saveProjects',
                payload: projects
            });
            this.toBack();
        });
    }

    // componentWillUnmount() {
    
    // }

    selectProject = (value) => {
        this.setState({
            projectSelectedId: value
        });
    }

    openFolderDialog = () => {
        ipcRenderer.send('open-folder-dialog');
    }

    toBack= () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    createPath = () => {
        if (!this.state.projectSelectedId || !this.state.localPath) return;
        ipcRenderer.send('save-project-path', {
            projectId: this.state.projectSelectedId,
            localPath: this.state.localPath
        });
    }

    render() {
        const { projects } = this.props;
        const { localPath, projectSelectedId } = this.state;

        return (
            <Fragment>
                <PageHeader 
                backTitle="创建下载任务" 
                back={this.toBack} 
                rightText="立即创建" 
                rightClick={this.createPath}>
                </PageHeader>
                <Row className="page-container project-select" type="flex" justify="space-between" gutter={16}>
                    <Col span={12}>
                        <Select
                            placeholder="请选择需要下载的项目"
                            defaultValue={projectSelectedId}
                            style={{
                                width: '100%',
                                height: 46
                            }}
                            onChange={this.selectProject}>
                            {projects.map(item => {
                                return (
                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                )
                            })}
                        </Select>
                    </Col>
                    <Col span={12}>
                        <div className="folder-select" onClick={this.openFolderDialog}>
                            <div className="folder-name">
                                {localPath ? <span>{localPath}</span> : <span style={{color: '#bfbfbf'}}>选择本地文件夹</span>}
                            </div>
                            <span><Icon type="folder-open" /></span>
                        </div>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;