import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {routerRedux} from 'dva/router';
import {Row, Col, Dropdown, Menu, Icon} from 'antd';
import DownloadHeader from '@component/DownloadHeader';
import './index.scss';

function mapStateToProps(state) {
    return {
        ...state.user,
        ...state.project
    };
}

const header = ['项目名称', '本地目录', '任务状态', '操作'];

const menu = (
    <Menu>
        <Menu.Item key="0">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>打开本地目录</span>
            </div>
        </Menu.Item>
        <Menu.Item key="1">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>打开云端网页</span>
            </div>
        </Menu.Item>
        <Menu.Item key="2">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>编辑下载任务</span>
            </div>
        </Menu.Item>
        <Menu.Item key="3">
            <div className="dl-li-action-menu">
                <img src="" alt=""/>
                <span>删除下载任务</span>
            </div>
        </Menu.Item>
    </Menu>
);

function DownlistLi(props) {
    return (
        <Fragment>
            {props
                .projects
                .map(item => {
                    return (
                        <Row className="dl-li">
                            <Col span={6}>
                                <span>{item.name}</span>
                            </Col>
                            <Col span={6}>
                                <span>{item.local_path}</span>
                            </Col>
                            <Col span={6}>
                                <span>{item.download_status}</span>
                            </Col>
                            <Col span={6}>
                                <div className="dl-action">
                                    <img src="" alt=""/>
                                    <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
                                        <span><Icon type="ellipsis"/></span>
                                    </Dropdown>
                                </div>
                            </Col>
                        </Row>
                    )
                })
}
        </Fragment>
    );
}

function DownlistEmpty(props) {
    return (
        <div className="downlist-empty">
            <img src="" alt=""/>
            <span>当前无下载任务</span>
        </div>
    );
}

@withRouter
@connect(mapStateToProps)
class CloudContainer extends PureComponent {
    componentDidMount() {
        console.log(this.props, ' 9999')
    }

    toCloudCreate = () => {
        this
            .props
            .dispatch(routerRedux.push({pathname: '/cloudcreate', query: {
                    // project_id: '99e04597292138fa'
                }}));
    }

    render() {
        return (
            <Fragment>
                <button className="btn1" onClick={this.toCloudCreate}>创建下载任务</button>
                <div className="download-list">
                    <DownloadHeader header={header}></DownloadHeader>
                    <DownlistLi {...this.props}></DownlistLi>
                    <DownlistEmpty></DownlistEmpty>
                </div>
            </Fragment>
        );
    }
}

export default CloudContainer;