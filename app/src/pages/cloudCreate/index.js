import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import withRouter from 'umi/withRouter';
import {Row, Col, Select, Icon} from 'antd';
import {routerRedux} from 'dva/router';
import PageHeader from '@component/PageHeader';
import './index.scss';

const { Option } = Select;

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

    handleChange  = () => {

    }

    toBack= () => {
        this
            .props
            .dispatch(routerRedux.goBack());
    }

    render() {
        return (
            <Fragment>
                <PageHeader backTitle="创建下载任务" back={this.toBack}></PageHeader>
                <Row className="page-container project-select" type="flex" justify="space-between" gutter={16}>
                    <Col span={12}>
                        <Select
                            defaultValue="lucy"
                            style={{
                            width: '100%',
                            height: 46
                            }}
                            onChange={this.handleChange}>
                            <Option value="jack">Jack</Option>
                            <Option value="lucy">Lucy</Option>
                            <Option value="Yiminghe">yiminghe</Option>
                        </Select>
                    </Col>
                    <Col span={12}>
                        <div className="folder-select">
                            <span>选择本地文件夹</span>
                            <span><Icon type="folder-open" /></span>
                        </div>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default CloudCreateContainer;