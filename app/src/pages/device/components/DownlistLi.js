import React, {PureComponent, Fragment} from 'react';
import {Row, Col, Dropdown, Menu, Tooltip, message} from 'antd';
import IconBlock from '@components/IconBlock';
import {routerRedux} from 'dva/router';
const {ipcRenderer} = window.require('electron');

class DownlistLi extends PureComponent {
    state = {
        currentdevice: null
    };

    componentDidMount() {
        ipcRenderer.on('save-device-after-delete', (event, projects) => {
            this
                .props
                .dispatch({type: 'device/saveDownloadDevices', payload: projects});
        });
    }

    onMenuClick = ({key}) => {
        switch (key) {
            case '0':
                ipcRenderer.send('open-device-dir', this.state.currentdevice.localPath);
                break;
            case '1':
                //设置设备文件夹路径
                ipcRenderer.send('open-folder-dialog-device', this.state.currentdevice);
                break;
            case '2':
                ipcRenderer.send('delete-device', this.state.currentdevice);
                break;
            default:
        }
    }

    setCurrentDevice = (currentdevice) => {
        this.setState({currentdevice});
    }

    toVideos = (device) => {
        if (!device.localPath) {
            message.warning('请先设置设备文件需要下载到的本地文件夹');
            return;
        }
        
        this
        .props
        .dispatch(routerRedux.push({pathname: '/videoimport', query: {
                ip: device.ip
            }}));
    }

    setPath = (e) => {
        e.stopPropagation();
        ipcRenderer.send('open-folder-dialog-device', this.state.currentdevice);
    }

    menu = () => {
        return (
            <Menu onClick={this.onMenuClick}>
                <Menu.Item key="0">
                    <div className="dl-li-action-menu">
                        <img src={require('../../../assets/folder-active.png')} alt=""/>
                        <span>打开本地目录</span>
                    </div>
                </Menu.Item>
                <Menu.Item key="1">
                    <div className="dl-li-action-menu">
                        <img src={require('../../../assets/edit-active.png')}  alt=""/>
                        <span>编辑导入目录</span>
                    </div>
                </Menu.Item>
                <Menu.Item key="2">
                    <div className="dl-li-action-menu">
                        <img src={require('../../../assets/dellink-active.png')}  alt=""/>
                        <span>断开设备链接</span>
                    </div>
                </Menu.Item>
            </Menu>
        );
    };

    render() {
        const {downloadDevices} = this.props;
        return (
            <Fragment>
                {downloadDevices.map((item, index) => {
                    return (
                        <Row className="dl-li" key={index} onClick={() => this.toVideos(item)}>
                            <Col span={6}>
                                <div className="dl-li-span">
                                    <Tooltip title={item.product['product-name']}>
                                        <span>{item.product['product-name']}</span>
                                    </Tooltip>
                                </div>
                            </Col>
                            <Col span={10}>
                                <div className="dl-li-span" onClick={this.setPath}>
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
                                <div className="dl-action" onClick={e => e.stopPropagation()}>
                                    {/* <img src="" alt=""/> */}
                                    {/* <IconBlock iconName="fm-share.svg" direction="left"></IconBlock> */}
                                    <span className="cloud-li-play" onClick={() => this.props.changePause(item.ip)}>
                                        {item.isPause
                                            ? <IconBlock iconName="play.svg"></IconBlock>
                                            : <IconBlock iconName="pause.svg"></IconBlock>}
                                    </span>
                                    <Dropdown overlay={this.menu()} trigger={['click']} placement="bottomCenter">
                                        <div className="dl-li-span">
                                            <div className="dl-action-btn" onClick={() => this.setCurrentDevice(item)}>
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