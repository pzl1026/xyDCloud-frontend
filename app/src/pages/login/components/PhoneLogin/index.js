import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import { EXP_PHONE } from '@config/user';
import {message, Checkbox} from 'antd';
import {queryData2Md5} from '@helper/utils';
import './index.scss';

function mapStateToProps(state) {
    return {
        ...state.user
    };
}

const SEC = 60;

@withRouter
@connect(mapStateToProps)
class PhoneLoginContainer extends PureComponent {
    state = {
        phone: '',
        sms_code: '',
        sendDisable: false,
        sendSec: SEC,
        isAgree: false
    }

    constructor(props) {
        super(props);
        this.loginForm = React.createRef();
    }

    componentDidMount() {
    }

    setSendBtn () {
        this.setState({
            sendDisable: true
        });
        
        let t = setInterval(() => {
            if (this.state.sendSec <= 0) {
                clearInterval(t);
                this.setState({
                    sendDisable: false,
                    sendSec: SEC
                });
            }
            let sendSec = this.state.sendSec - 1;
            this.setState({
                sendSec
            });
        }, 1000);
    }

    sendCode = () => {
        if (this.sendDisable) return;
        new Promise ((resolve, reject) => {
            if (EXP_PHONE.test(this.state.phone)) {
                resolve();
            } else {
                reject();
            }
        }).then(() => {
            this.setSendBtn();
            this.props
                .dispatch({
                    type: 'user/sendCode',
                    payload: queryData2Md5({
                        phone: this.state.phone
                    })
                });
        }, () => {
            message.warning('手机号码格式不正确');
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (!EXP_PHONE.test(this.state.phone)) {
            message.warning('手机号码格式不正确');
            return;
        }
        let params = {
            phone: this.state.phone,
            sms_code: this.state.sms_code
        };
        this.props
        .dispatch({
            type: 'user/login',
            payload: queryData2Md5(params)
        });
    }

    handleChange = (field, value) => {
        let o = {};
        o[field] = value;
        this.setState(o);
    }

    changeHandbook = (e) => {
        this.setState({
            isAgree: e.target.checked
        });
    }

    render() {
        const {phone, sms_code, sendDisable, sendSec, isAgree} = this.state;
        return (
            <Fragment>
                <form onSubmit={this.handleSubmit}>
                    <div className="login-input-body">
                        <div className="login-input">
                            <span className="login-input-label">手机号：</span>
                            <input 
                            type="text" 
                            className="login-input-text" 
                            name="phone" 
                            value={phone}  
                            onChange={(e) => this.handleChange('phone', e.target.value)}/>
                        </div>
                    </div>
                    <div className="login-input-body">
                        <div
                            className="login-input"
                            style={{
                            width: '230px'
                        }}>
                            <span className="login-input-label">验证码：</span>
                            <input 
                            style={{width: 134}}
                            type="" 
                            className="login-input-text" 
                            name="sms_code" 
                            value={sms_code}  
                            onChange={(e) => this.handleChange('sms_code', e.target.value)}/>
                        </div>
                        <button 
                        className="login-send-code" 
                        onClick={this.sendCode} 
                        style={{
                            color: sendDisable ? '#D8BFD8' : '',
                            cursor: sendDisable ? 'not-allowed' : '',
                        }} 
                        disabled={sendDisable}>
                            {sendDisable ? `重新发送${sendSec}` : '发送验证码'}
                        </button>
                    </div>
                    <button 
                    className="login-submit" 
                    type="submit"
                    disabled={!isAgree} 
                    style={{
                        backgroundColor: !isAgree ?	'#D4F2E7' : '',
                        cursor: !isAgree ? 'not-allowed' : '',
                    }}>绑定手机</button>
                </form>

                <div className="login-tip">
                    <Checkbox onChange={this.changeHandbook}>我已阅读并同意《新阅用户使用手册》</Checkbox>
                </div>
            </Fragment>
        );

    }
}

export default PhoneLoginContainer;