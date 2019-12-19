import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import styles from './index.scss';

function mapStateToProps(state) {
  return {
    ...state.user
  };
}

@withRouter
@connect(mapStateToProps)
class PhoneLoginContainer extends PureComponent {
	render() {
		return (
			<Fragment>
                <div className="login-input-body">
                    <div className="login-input">
                        <span className="login-input-label">手机号：</span>
                        <input type="text" className="login-input-text"/>
                    </div>
                </div>
                <div className="login-input-body">
                    <div className="login-input" style={{width:'230px'}}>
                        <span className="login-input-label">验证码：</span>
                        <input type="" className="login-input-text"/>
                    </div>
                    <button className="login-send-code" >发送验证码</button>
                </div>
                <button className="login-submit">绑定手机</button>
                
                <div className="login-tip">
                    <span></span>
                    <span className="login-tip-text">我已阅读并同意《新阅用户使用手册》</span>
                </div>
			</Fragment>
		);

	}
}

export default PhoneLoginContainer;