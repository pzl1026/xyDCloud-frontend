import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
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
    componentDidMount () {
        console.log(this.props)
    }

	render() {
		return (
			<div className="login">
                <div className="login-left">
                    XINYUE新阅
                </div> 
                <div className="login-right">
                    <span className="login-title">绑定手机</span>
                    {/* <PhoneLogin /> */}
                    <WxLogin />
                </div>
			</div>
		);

	}
}

export default UserContainer;