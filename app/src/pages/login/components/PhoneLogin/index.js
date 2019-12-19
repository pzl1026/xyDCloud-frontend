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
                <div className={styles.logininputbody}>
                    <div className={styles.logininput}>
                        <span className={styles.logininputlabel}>手机号：</span>
                        <input type="text" className={styles.logininputtext}/>
                    </div>
                </div>
                <div className={styles.logininputbody}>
                    <div className={styles.logininput} style={{width:'230px'}}>
                        <span className={styles.logininputlabel}>验证码：</span>
                        <input type="" className={styles.logininputtext}/>
                    </div>
                    <button className={styles.loginsendcode} >发送验证码</button>
                </div>
                <button className={styles.loginsubmit}>绑定手机</button>
                
                <div className={styles.logintip}>
                    <span></span>
                    <span className={styles.logintiptext}>我已阅读并同意《新阅用户使用手册》</span>
                </div>
			</Fragment>
		);

	}
}

export default PhoneLoginContainer;