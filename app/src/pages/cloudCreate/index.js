import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Select, Icon, TreeSelect} from 'antd';
import {routerRedux} from 'dva/router';
import PageHeader from '@components/PageHeader';
import {getProjectsVideos} from '@helper/projects';
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
        localPath: '',
        isEdit: false,
    }

    componentDidMount() {
        this.setEdit();
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
            getProjectsVideos([this.state.projectSelectedId]);
            this.toBack();
        });
    }

    setEdit = () => {
        let query = this.props.location.query;
        if (query.type === 'edit') {
            let currentProject = this.props.projects.find(m => m.id === query.project_id);
            if (currentProject) {
                this.setState({
                    isEdit: true,
                    projectSelectedId: query.project_id,
                    localPath: currentProject.localPath
                });
            }
        }
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
        const { projectsSelect } = this.props;
        const { localPath, projectSelectedId, isEdit } = this.state;

        let projectsSelectTreeData = [{
            title: '我的项目',
            value: '0',
            key: '0',
            disabled: true,
            children: [],
        }, {
            title: '参与项目',
            value: '1',
            key: '1',
            disabled: true,
            children: [],
        }];
        projectsSelectTreeData[0].children = projectsSelect.filter(m => m.type === 'admin')
                                                .map(m => {
                                                    return {
                                                        ...m,
                                                        title: m.name,
                                                        key: m.id,
                                                        value: m.id
                                                    }
                                                });
        projectsSelectTreeData[1].children = projectsSelect.filter(m => m.type !== 'admin')
                                                .map(m => {
                                                    return {
                                                        ...m,
                                                        title: m.name,
                                                        key: m.id,
                                                        value: m.id
                                                    }
                                                });

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
                        {/* <Select
                            placeholder="请选择需要下载的项目"
                            value={projectSelectedId}
                            disabled={isEdit}
                            style={{
                                width: '100%',
                                height: 46
                            }}
                            onChange={this.selectProject}>
                            {projectsSelect.map(item => {
                                return (
                                    <Option value={item.id} key={item.id}>{item.name}</Option>
                                )
                            })}
                        </Select> */}
                        <TreeSelect
                             style={{
                                width: '100%',
                                height: 46
                            }}
                            disabled={isEdit}
                            value={projectSelectedId}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            treeData={projectsSelectTreeData}
                            placeholder="请选择需要下载的项目"
                            treeDefaultExpandAll
                            onChange={this.selectProject}
                        />
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