import React, {PureComponent, Fragment} from 'react';
// import styles from './index.css';
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
class BasicLayout extends PureComponent {

    render() {
        const {history} = this.props;

        return (
            <Fragment>
                {history.location.pathname !== '/login'
                    ? <div className="page">
                            <div className="side">
                                <div className="side-title">
                                    XINYUE 新阅
                                </div>
                                <ul class="side-menu">
                                    <li className="active">
                                        <img src="" alt=""/>
                                        <span>云端下载</span>
                                    </li>
                                    <li>
                                        <img src="" alt=""/>
                                        <span>下载记录</span>
                                    </li>
                                    <li>
                                        <img src="" alt=""/>
                                        <span>设备导入</span>
                                    </li>
                                    <li>
                                        <img src="" alt=""/>
                                        <span>导入记录</span>
                                    </li>
                                </ul>
                                <div className="side-footer">
                                    <div className="person-avatar">
                                        <img src="" alt=""/>
                                    </div>

                                    <div className="person-name">
                                        999999
                                    </div>
                                </div>
                            </div>
                            <div className="section">
                                {this.props.children}
                            </div>
                        </div>
                    : <> {
                        this.props.children
                    } < />}
            </Fragment>
        );
    }
}

export default BasicLayout;
