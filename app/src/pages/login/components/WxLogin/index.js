import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import './index.scss';

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
                <div className="login-code">
                    <img src="" alt=""/>
                </div>
                <button className="login-submit" onClick={() => this.props.changeLoginType(1)}>返回</button>
            </Fragment>
        );

    }
}

export default WxLoginContainer;