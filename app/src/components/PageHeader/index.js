import './index.scss';
import { Row, Col, Icon } from 'antd';

export default function(props) {
    console.log(props, 'props')
    return (
        <Row className="page-header" type="flex" justify="space-between">
            <Col span={12}>
                <div className="page-header-left">
                    <span onClick={() => props.back()}><Icon type="left" /> &nbsp;&nbsp;{props.backTitle}</span> 
                    {props.leftChildren}
                </div>
            </Col>
            <Col span={12}>
               
                <div className="page-header-right">
                    {props.rightChildren}
                    {props.isStr ?
                    <span>{props.rightText}</span> :
                    <button className="btn1" onClick={() => props.rightClick()}>{props.rightText}</button>}  
                </div>
            </Col>
        </Row>
    );
}
