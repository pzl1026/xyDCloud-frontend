import './index.scss';
import { Row, Col, Icon } from 'antd';

export default function(props) {
    return (
        <Row className="page-header" type="flex" justify="space-between">
            <Col span={4}>
                <div className="page-header-left">
                    <span><Icon type="left" /> &nbsp;&nbsp;{props.backTitle}</span>
                </div>
            </Col>
            <Col span={12}>
                <div className="page-header-right">
                    <button className="btn1">立即创建</button>
                </div>
            </Col>
        </Row>
    );
}
