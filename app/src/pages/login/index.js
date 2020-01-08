import React, {PureComponent} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
// import { routerRedux } from 'dva/router';
// import {ipcRenderer} from 'electron';
import PhoneLogin from './components/PhoneLogin';
import WxLogin from './components/WxLogin';
import './index.scss';



function mapStateToProps(state) {
    return {
        ...state.user
    };
}

@withRouter
@connect(mapStateToProps)
class UserContainer extends PureComponent {
    state = {
        loginType: 1
    }

    componentDidMount() {
        console.log(23222222)
        // this.props.dispatch(routerRedux.push({     pathname: '/file',     query:
        // window.urlQuery }));
        // const { ipcRenderer } = window.require('electron')
        // // console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

        // ipcRenderer.on('asynchronous-reply', (event, arg) => {
        //     console.log(arg) // prints "pong"
        // })
        // ipcRenderer.send('asynchronous-message', 'ping')
    }

    render() {
        const {loginType} = this.state;
        return (
            <div className="login">
                <div className="login-left">
                    XINYUE新阅
                </div>
                <div className="login-right">
                    <span className="login-title">绑定手机</span>
                    {loginType === 1
                        ? <PhoneLogin/>
                        : <WxLogin/>}
                </div>
            </div>
        );
    }
}

export default UserContainer;