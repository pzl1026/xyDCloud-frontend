import React, {PureComponent, Fragment} from 'react';
import {Row, Col, Dropdown, Menu} from 'antd';
import IconBlock from '@components/IconBlock';
const { ipcRenderer } = window.require('electron');


class DownlistLi extends PureComponent{
    state = {
        currentProject: null
    };

    onMenuClick = ({key}) => {
        switch(key) {
            case '0':
                ipcRenderer.send('open-project-dir', this.state.currentProject.id);
                break;
            default:
        }
    }

    setCurrentProject = (currentProject) => {
        this.setState({
            currentProject
        });
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
    
    render () {
        const {projects} = this.props;
        return (
            <Fragment>
                {projects
                    .map(item => {
                        return (
                            <Row className="dl-li" key={item.id}>
                                <Col span={6}>
                                    <span>{item.name}</span>
                                </Col>
                                <Col span={6}>
                                    <span>{item.localPath || '未设置'}</span>
                                </Col>
                                <Col span={6}>
                                    <span>{item.isPause ? '暂停中':'下载中'}</span>
                                </Col>
                                <Col span={6}>
                                    <div className="dl-action">
                                        {/* <img src="" alt=""/> */}
                                        {/* <IconBlock iconName="fm-share.svg" direction="left"></IconBlock> */}
                                        <span className="cloud-li-play" onClick={() => this.props.changePause(item.id)}>
                                            {item.isPause ? 
                                            <IconBlock iconName="play.svg"></IconBlock> : 
                                            <IconBlock iconName="pause.svg"></IconBlock>}
                                        </span>
                                        <Dropdown overlay={this.menu()} trigger={['click']} placement="bottomCenter">
                                            <div className="dl-action-btn" onClick={() => this.setCurrentProject(item)}>
                                                <span>
                                                    <IconBlock iconName="more.svg"></IconBlock>
                                                </span>
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