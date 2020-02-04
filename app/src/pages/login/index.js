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

    }

    changeLoginType = (loginType) => {
        this.setState({
            loginType 
        });
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
                        ? <PhoneLogin changeLoginType={this.changeLoginType}/>
                        : <WxLogin changeLoginType={this.changeLoginType}/>}
                </div>
            </div>
        );
    }
}

export default UserContainer;