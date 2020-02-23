import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Icon, message} from 'antd';
import PageHeader from '@components/PageHeader';
// import {groupArr} from '@helper/utils';
import {routerRedux} from 'dva/router';
import md5 from 'js-md5';
import './index.scss';
const {ipcRenderer} = window.require('electron');

// message.config({
//     duration: 2,
//     maxCount: 1,
// });

function PasswordModal(props) {
    return (
        <div className="password-modal">
            <div className="password-mark" onClick={() => props.toggleModal(false)}></div>
            <div className="password-body">
                <span className="password-title">输入设备密码</span>
                {/* <div className="password-input">
                    <span>用户名：</span>
                    <input type="text" onChange={props.changeId}/>
                </div> */}
                <div className="password-input">
                    <span>密码：</span>
                    <input type="password" onChange={props.changePass}/>
                </div>
                <button className="btn1" onClick={props.pingIp}>确认</button>
            </div>
        </div>
    );
}

function DownlistEmpty (props) {
    return (
        <div className="downlist-empty">
            <img src={require('../../assets/empty.png')} alt=""/>
            <span>当前无可用设备</span>
        </div>
    );
}


function mapStateToProps(state) {
    return {
        ...state.user,
        ...state.device
    };
}

@withRouter
@connect(mapStateToProps)
class DeviceAddContainer extends PureComponent {
    state = {
        passwordShow: false,
        searching: false,
        productId: '',
        ip: '',
        id:'Admin',
        pass: '',
        logining: false
    }

    changeId = (e) => {
        this.setState({
            id: e.target.value
        });
    }


    changePass = (e) => {
        this.setState({
            pass: e.target.value
        });
    }

    pingIp = () => {
        ipcRenderer.send('emit-device-connect2', this.state.ip);
    }

    loginDevice = () => {
        const self =this;
        let o = {
            method: 'set-app-passwd'
        };
        let password = md5(this.state.pass);
        o['is-pass'] = 1;
        o['pass'] = password;
        o['new-pass'] = password;

        this.props.dispatch({
            type: 'device/loginDevice',
            payload: {
                param: o,
                cb(){
                    self.props.dispatch(routerRedux.push({
                        pathname: '/videoimport',
                        query: {
                            ip: self.state.ip
                        }
                    }));
                },
                productId: self.state.productId,
                ip: self.state.ip
            }
        });
    }

    componentDidMount() {
        const self = this;
        const {devices} = self.props;
        if (devices.length === 0) {
            this.searchDevices();
        }
        ipcRenderer.send('post-ip-address');
        ipcRenderer.send('post-devices-searching');
        ipcRenderer.on('get-devices-searching', (event, searching) => {
            self.setState({searching});
        });
        ipcRenderer.on('complete-devices-search', (event, devicesIps) => {
            self.setState({searching: false});
            self.saveDevices(devicesIps);
        });
        ipcRenderer.on('ping-pass2', (event, isAlive) => {
            message.destroy();
            if (isAlive) {
                self.loginDevice();
            } else {
                message.warning('设备异常,请重新搜索');
            }
        });
    }

    componentWillUnmount () {
        // ipcRenderer.removeListener('get-devices-searching', () => {});
        // ipcRenderer.removeListener('complete-devices-search', () => {});
        // ipcRenderer.removeListener('ping-pass2', () => {});
    }

    searchDevices = () => {
        this.setState({searching: true});
        ipcRenderer.send('post-can-devices');

        // this.saveDevices(['http://192.168.2.208/']);
        // this.setState({searching: false});
    }

    saveDevices(devicesIps) {
        devicesIps.forEach(item => {
            this
                .props
                .dispatch({
                    type: 'device/getDevice',
                    payload: {
                        ip: item
                    }
                });
        });

    }

    toggleModal = (passwordShow, productId, item) => {
        this.setProductId(productId);
        this.setState({
            passwordShow,
            ip: item && item.ip
        });
    }

    setProductId(productId) {
        this.setState({productId});
    }

    handleChange() {}

    onChange() {}

    toBack = () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    render() {
        const {devices} = this.props;
        const {searching} = this.state;
        return (
            <Fragment>
                <PageHeader
                    backTitle="添加设备"
                    back={this.toBack}
                    rightText="提示：请确保计算机设备设置与nbox设备在同一wifi网络环境下或直连nbox设备热点。"
                    isStr={true}></PageHeader>
                {devices.length > 0 || searching ? 
                <div className="page-container">
                    {searching
                        ? <div className="loading-container device-searching" style={{width: 'auto'}}>
                                <div className="loading-body"></div>
                                <span style={{color: '#fff'}}>正在搜索设备...</span>
                            </div>
                        : <ul className="device-list">
                            {devices.map(item => {
                                return (
                                    <li 
                                    onClick={() => this.toggleModal(true, item.product['product-id'], item)} 
                                    key={item.product['product-id']}>
                                        <span className="device-name">{item['name']}</span>
                                        <span className="device-add">
                                            <Icon type="arrow-right"/>
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>}
                </div> : null}
                {searching
                    ? null
                    : <div className="device-search">
                        <button className="btn" onClick={this.searchDevices}>重新搜索</button>
                    </div>}
                {this.state.passwordShow
                    ? <PasswordModal 
                    toggleModal={this.toggleModal} 
                    changeId={this.changeId} 
                    changePass={this.changePass}
                    pingIp={this.pingIp}></PasswordModal>
                    : null}
                {!searching && devices.length === 0 ? <DownlistEmpty></DownlistEmpty> : null}
            </Fragment>
        );
    }
}

export default DeviceAddContainer;