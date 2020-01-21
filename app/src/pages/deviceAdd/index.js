import React, {PureComponent, Fragment, Component} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Icon} from 'antd';
import PageHeader from '@components/PageHeader';
// import {groupArr} from '@helper/utils';
import {routerRedux} from 'dva/router';
import md5 from 'js-md5';
import './index.scss';
const {ipcRenderer} = window.require('electron');

function PasswordModal(props) {
    return (
        <div className="password-modal">
            <div className="password-mark" onClick={() => props.toggleModal(false)}></div>
            <div className="password-body">
                <span className="password-title">输入设备密码</span>
                <div className="password-input">
                    <span>用户名：</span>
                    <input type="text" onChange={props.changeId}/>
                </div>
                <div className="password-input">
                    <span>密码：</span>
                    <input type="password" onChange={props.changePass}/>
                </div>
                <button className="btn1" onClick={props.loginDevice}>确认</button>
            </div>
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
class CloudCreateContainer extends PureComponent {
    state = {
        passwordShow: false,
        searching: false,
        productId: '',
        id:'',
        pass: ''
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

    loginDevice = () => {
        const self =this;
        this.props.dispatch({
            type: 'device/loginDevice',
            payload: {
                param: {
                    id: this.state.id,
                    pass:md5(this.state.pass),
                    method: 'login',
                    productId: this.state.productId
                },
                cb(){
                    self.props.dispatch(routerRedux.goBack());
                }
            }
        });
    }

    componentDidMount() {
        const self = this;
        console.log(this.props);
        const {devices} = self.props;
        if (devices.length === 0) {
            this.searchDevices();
        }

        ipcRenderer.send('post-ip-address');
        ipcRenderer.on('complete-devices-search', (event, devicesIps) => {
            self.setState({searching: false});
            self.saveDevices(devicesIps);
        });
    }

    searchDevices = () => {
        this.setState({searching: true});
        // ipcRenderer.send('post-can-devices');

        this.saveDevices(['http://192.168.2.208/']);
        this.setState({searching: false});
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

    toggleModal = (passwordShow, productId) => {
        console.log(2322)
        this.setProductId(productId);
        this.setState({
            passwordShow
        }, (val) => {

            console.log(this.state, 'val')
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
        console.log(devices, 'devicesrender')
        return (
            <Fragment>
                <PageHeader
                    backTitle="添加设备"
                    back={this.toBack}
                    rightText="提示：请使用计算机连接WLAN：NBOX-638231或NBOX设备当前已连接的WLAN"
                    isStr={true}></PageHeader>
                <div className="page-container">
                    {searching
                        ? <div className="loading-container" style={{width: 'auto', height: 'auto'}}>
                                <div className="loading-body"></div>
                            </div>
                        : <ul className="device-list">
                            {devices.map(item => {
                                return (
                                    <li>
                                        <span className="device-name">{item.product.sn}</span>
                                        <span
                                            className="device-add"
                                            onClick={() => this.toggleModal(true, item.product['product-id'])}>
                                            <Icon type="arrow-right"/>
                                        </span>
                                    </li>
                                )
                            })}
                        </ul>}
                </div>
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
                    loginDevice={this.loginDevice}></PasswordModal>
                    : null}
            </Fragment>
        );
    }
}

export default CloudCreateContainer;