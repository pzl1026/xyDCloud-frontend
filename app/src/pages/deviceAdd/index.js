import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Icon} from 'antd';
import PageHeader from '@components/PageHeader';
// import {groupArr} from '@helper/utils';
import {routerRedux} from 'dva/router';
import './index.scss';
const { ipcRenderer } = window.require('electron');

function PasswordModal(props) {
    return (
        <div className="password-modal">
            <div className="password-mark" onClick={() => props.toggleModal(false)}></div>
            <div className="password-body">
                <span className="password-title">输入设备密码</span>
                <div className="password-input">
                    <span>密码：</span>
                    <input type="password"/>
                </div>
                <button className="btn1">确认</button>
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
        passwordShow: false
    }

    componentDidMount() {
        console.log(this.props);
        this.saveDevicesVideos();   //暂时处理
        ipcRenderer.send('post-ip-address');
    
    }

    searchDevices = () => { 
        const {myHost} = this.props;
        let vlan = myHost.substr(0, myHost.lastIndexOf('.'));
        let ip = myHost.substr(myHost.lastIndexOf('.'));
        console.log(vlan, 'vlan');
        const vlans = new Array(256);
        for (var i = 1; i < 256; i++) {
            if (Number(ip) !== i) {
                vlans[i] = i;
            }
        }

        // vlans.forEach(m => {
        //     this.props.dispatch({
        //         type: 'device/searchDevice',
        //         payload: {
        //             ip: vlan + '.' + m
        //         }
        //     });
        // });

        let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
        const self = this;
        async function action() {
            for(var i in vlans) {
                self.props.dispatch({
                    type: 'device/searchDevice',
                    payload: {
                        ip: vlan + '.' + vlans[i]
                    }
                });
                await sleep(100);
            }
        }

        action();

        // let requestNext = 1;
        // let loopStart = (response) => {
        //     console.log(2222222)
        //     return new Promise((resove, reject) => {
        //         if (response) {
        //             requestNext++;
        //             setTimeout(() => {
        //                 startCheckStatus();
        //             }, 100);
        //         }
        //     }); 
        // };
        // let startCheckStatus = () => {
        //     console.log(requestNext, 'requestNext')
        //     this.props.dispatch({
        //         type: 'device/searchDevice',
        //         payload: {
        //             ip: vlan + '.' + vlans[requestNext],
        //             cb: loopStart
        //         }
        //     });
        // }

        // startCheckStatus ();
    }

    // 登录成功后获取设备视频信息存到本地
    saveDevicesVideos() {
        this.props.dispatch({
                type: 'device/getDevice',
                payload: {
                }
        });
    }

    toggleModal = (passwordShow) => {
        console.log(2322)
        this.setState({
            passwordShow
        }, (val) => {

            console.log(this.state, 'val')
        });
    }

    handleChange () {

    }

    onChange () {

    }

    toBack= () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    render() {
        return (
            <Fragment>
                <PageHeader backTitle="添加设备" 
                back={this.toBack}
                rightText="提示：请使用计算机连接WLAN：NBOX-638231或NBOX设备当前已连接的WLAN" i
                sStr={true}></PageHeader>
                <div className="page-container">
                    <ul className="device-list">
                        <li>
                            <span className="device-name">asdasdasda</span>
                            <span className="device-add" onClick={() => this.toggleModal(true)}>
                                <Icon type="arrow-right" />
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="device-search">
                    <button className="btn">搜索设备</button>
                </div>
                {this.state.passwordShow ? <PasswordModal toggleModal={this.toggleModal}></PasswordModal> : null}
            </Fragment>
        );
    }
}

export default CloudCreateContainer;