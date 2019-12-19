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
class WxLoginContainer extends PureComponent {
	render() {
		return (
			<Fragment>
                <div className={styles.logincode}>
                    <img src="" alt=""/>
                </div>
                <button className={styles.loginsubmit}>返回</button>
            
			</Fragment>
		);

	}
}

export default WxLoginContainer;