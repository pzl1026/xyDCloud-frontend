import React, { PureComponent } from 'react';
import styles from './index.css';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';

function mapStateToProps(state) {
  return {
    ...state.user
  };
}

@withRouter
@connect(mapStateToProps)
class BasicLayout extends PureComponent {
  componentDidMount () {
      console.log(this.props)
  }

  render () {
    return (
      <div className={styles.normal}>
        <h1 className={styles.title}>Yay! Welcome to umi!222</h1>
        {this.props.children}
      </div>
    );
  }
 
}

export default BasicLayout;
