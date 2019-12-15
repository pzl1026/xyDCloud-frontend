import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';

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
			<Fragment>
                <div>2222</div>
			</Fragment>
		);

	}
}

export default UserContainer;