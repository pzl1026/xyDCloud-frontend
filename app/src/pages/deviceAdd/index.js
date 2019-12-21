import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Icon} from 'antd';
import PageHeader from '@component/PageHeader';
import './index.scss';

function PasswordModal(props) {
    return (
        <div className="password-modal">
            <div className="password-mark" onClick={() => props.toggleModal(false)}></div>
            <div className="password-body">
                <span className="password-title">输入设备密码</span>
                <div className="password-input">
                    <span>密码：</span>
                    <input type="password"/>
                </div>
                <button className="btn1">确认</button>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        ...state.user
    };
}


@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    state = {
        passwordShow: false
    }

    componentDidMount() {
        console.log(this.props)
    }

    toggleModal = (passwordShow) => {
        console.log(2322)
        this.setState({
            passwordShow
        }, (val) => {

            console.log(this.state, 'val')
        });
    }

    handleChange () {

    }

    onChange () {

    }

    render() {
        return (
            <Fragment>
                <PageHeader backTitle="添加设备" rightText="提示：请使用计算机连接WLAN：NBOX-638231或NBOX设备当前已连接的WLAN" isStr={true}></PageHeader>
                <div className="page-container">
                    <ul className="device-list">
                        <li>
                            <span className="device-name">asdasdasda</span>
                            <span className="device-add" onClick={() => this.toggleModal(true)}>
                                <Icon type="arrow-right" />
                            </span>
                        </li>
                    </ul>
                </div>
                {this.state.passwordShow ? <PasswordModal toggleModal={this.toggleModal}></PasswordModal> : null}
            </Fragment>
        );
    }
}

export default CloudCreateContainer;