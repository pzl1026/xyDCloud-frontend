import React, { PureComponent } from 'react';
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
class UserContainer extends PureComponent {
    componentDidMount () {
        console.log(this.props)
    }

	render() {
		return (
			<div className={styles.login}>
            999
			</div>
		);

	}
}

export default UserContainer;