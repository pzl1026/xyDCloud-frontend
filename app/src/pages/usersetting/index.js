import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import { Checkbox } from 'antd';
import './index.scss';

function mapStateToProps(state) {
    return {
        ...state.user
    };
}

@withRouter
@connect(mapStateToProps)
class CloudCreateContainer extends PureComponent {
    componentDidMount() {
        console.log(this.props)
    }

    handleChange () {

    }

    render() {
        return (
            <Fragment>
                <div className="user-page">
                    <div className="user-info">
                        <img src="" alt=""/>
                        <span>dasd</span>
                    </div>
                    <div className="xy-info">
                        <div>
                            <span>软件更新（v1.2.1）</span>
                            <span>暂无</span>
                        </div>
                        <div>
                            <span>开机启动</span>
                            <span><Checkbox defaultChecked disabled /></span>
                        </div>
                    </div>
                    <button className="btn1" style={{width: 370, borderRadius: 28}}>退出登录</button>
                </div>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;