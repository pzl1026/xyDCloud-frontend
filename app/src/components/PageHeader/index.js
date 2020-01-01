import './index.scss';
import { Row, Col, Icon } from 'antd';

export default function(props) {

    return (
        <Row className="page-header" type="flex" justify="space-between">
            <Col span={4}>
                <div className="page-header-left" onClick={() => props.back()}>
                    <span><Icon type="left" /> &nbsp;&nbsp;{props.backTitle}</span>
                    {props.leftChildren}
                </div>
            </Col>
            <Col span={12}>
               
                <div className="page-header-right">
                    {props.rightChildren}
                    {props.isStr ?
                    <span>{props.rightText}</span> :
                    <button className="btn1">{props.rightText}</button>}  
                </div>
            </Col>
        </Row>
    );
}
