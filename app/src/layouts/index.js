import React, { PureComponent, Fragment } from 'react';
// import styles from './index.css';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import './index.scss';

function mapStateToProps(state) {
  return {
    ...state.user
  };
}

@withRouter
@connect(mapStateToProps)
class BasicLayout extends PureComponent {

    render () {
        const {history} = this.props;

        return (
            <Fragment>
                {history.location.pathname !== '/login' ? 
                <div className="side">
                    {this.props.children}
                </div>: 
                <>{this.props.children}</>}
            </Fragment>
        );
    }
}

export default BasicLayout;
