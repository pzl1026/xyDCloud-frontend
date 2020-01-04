import React, {PureComponent, Fragment} from 'react';
import {Row, Col, Dropdown, Menu, Tooltip} from 'antd';
import IconBlock from '@components/IconBlock';
import {routerRedux} from 'dva/router';
const {ipcRenderer} = window.require('electron');


class DownlistLi extends PureComponent {
    state = {
        currentProject: null
    };

    componentDidMount() {
        ipcRenderer.on('save-project-after-delete', (event, projects) => {
            this
                .props
                .dispatch({type: 'project/saveProjects', payload: projects});
        });
    }

    onMenuClick = ({key}) => {
        switch (key) {
            case '0':
                ipcRenderer.send('open-project-dir', this.state.currentProject.id);
                break;
            case '1':
                ipcRenderer.send('open-project-web-link', this.state.currentProject.id);
                break;
            case '2':
                this
                    .props
                    .dispatch(routerRedux.push({
                        pathname: '/cloudcreate',
                        query: {
                            type: 'edit',
                            project_id: this.state.currentProject.id
                        }
                    }));
                break;
            case '3':
                ipcRenderer.send('delete-project', this.state.currentProject.id);
                break;
            default:
        }
    }

    setCurrentProject = (currentProject) => {
        this.setState({currentProject});
    }

    menu = () => {
        return (
            <Menu onClick={this.onMenuClick}>
                <Menu.Item key="0">
                    <div className="dl-li-action-menu">
                        <img src="" alt=""/>
                        <span>打开本地目录</span>
                    </div>
                </Menu.Item>
                <Menu.Item key="1">
                    <div className="dl-li-action-menu">
                        <img src="" alt=""/>
                        <span>打开云端网页</span>
                    </div>
                </Menu.Item>
                <Menu.Item key="2">
                    <div className="dl-li-action-menu">
                        <img src="" alt=""/>
                        <span>编辑下载任务</span>
                    </div>
                </Menu.Item>
                <Menu.Item key="3">
                    <div className="dl-li-action-menu">
                        <img src="" alt=""/>
                        <span>删除下载任务</span>
                    </div>
                </Menu.Item>
            </Menu>
        );
    };

    render() {
        const {projects} = this.props;
        return (
            <Fragment>
                {projects.map(item => {
                    return (
                        <Row className="dl-li" key={item.id}>
                            <Col span={6}>
                                <div className="dl-li-span">
                                    <Tooltip title={item.name}>
                                        <span>{item.name}</span>
                                    </Tooltip>
                                </div>
                            </Col>
                            <Col span={10}>
                                <div className="dl-li-span">
                                    <Tooltip title={item.localPath || '未设置'}>
                                        <span>{item.localPath || '未设置'}</span>
                                    </Tooltip>
                                </div>
                            </Col>
                            <Col span={4}>
                                <span>{item.isPause
                                        ? '暂停中'
                                        : '下载中'}</span>
                            </Col>
                            <Col span={4}>
                                <div className="dl-action">
                                    {/* <img src="" alt=""/> */}
                                    {/* <IconBlock iconName="fm-share.svg" direction="left"></IconBlock> */}
                                    <span className="cloud-li-play" onClick={() => this.props.changePause(item.id)}>
                                        {item.isPause
                                            ? <IconBlock iconName="play.svg"></IconBlock>
                                            : <IconBlock iconName="pause.svg"></IconBlock>}
                                    </span>
                                    <Dropdown overlay={this.menu()} trigger={['click']} placement="bottomCenter">
                                        <div className="dl-li-span">
                                            <div className="dl-action-btn" onClick={() => this.setCurrentProject(item)}>
                                                <span>
                                                    <IconBlock iconName="more.svg"></IconBlock>
                                                </span>
                                            </div>
                                        </div>
                                    </Dropdown>
                                </div>
                            </Col>
                        </Row>
                    )
                })
}
            </Fragment>
        );
    }

}

export default DownlistLi;