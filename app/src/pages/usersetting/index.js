import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import { routerRedux } from 'dva/router';
import { Checkbox } from 'antd';
import {STORE_FIELD} from '@config/user';

import './index.scss';
const { ipcRenderer } = window.require('electron');

function mapStateToProps(state) {
    return {
        ...state.user
    };
}

@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    state = {
        startLogin: false
    }
    componentDidMount() {
        console.log(this.props);
        let startLogin = localStorage.getItem('start_login');
        this.setState({
            startLogin
        });
        ipcRenderer.on('login-out', (event, arg) => {
            this.props.dispatch(routerRedux.push({
                pathname: '/login',
            }));
            console.log('已退出');
        });  
    }

    handleChange () {

    }

    setStart = (e) => {
        ipcRenderer.send('change-start-login', e.target.checked);
        localStorage.setItem('start_login', e.target.checked);
    }

    handleLoginOut () {
        localStorage.removeItem(STORE_FIELD);
        clearInterval(window.loopFetchProjectsTimer);
        window.loopFetchProjectsTimer = null;
        ipcRenderer.send('clear-loop');
    }

    render() {
        const {userInfo} = this.props;
        if (!userInfo) return null;
        
        return (
            <Fragment>
                <div className="user-page">
                    <div className="user-info">
                        <img src={userInfo.avatar} alt=""/>
                        <span>{userInfo.realname}</span>
                    </div>
                    <div className="xy-info">
                        <div>
                            <span>软件更新（v1.2.1）</span>
                            <span>暂无</span>
                        </div>
                        <div>
                            <span>开机启动</span>
                            <span><Checkbox onChange={this.setStart} defaultChecked={this.state.startLogin}/></span>
                        </div>
                    </div>
                    <button className="btn1" style={{width: 370, borderRadius: 28}} onClick={this.handleLoginOut}>退出登录</button>
                </div>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;