import React, { PureComponent } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import PhoneLogin from './components/PhoneLogin';
import WxLogin from './components/WxLogin';
import styles from './index.scss';

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
			<div className={styles.login}>
                <div className={styles.loginleft}>
                    XINYUE新阅
                </div> 
                <div className={styles.loginright}>
                    <span className={styles.logintitle}>绑定手机</span>
                    {/* <PhoneLogin /> */}
                    <WxLogin />
                </div>
			</div>
		);

	}
}

export default UserContainer;