import './index.scss';
import { Row, Col } from 'antd';

export default function(props) {
  return (
    <Row className="dl-header">
        {props.header.map((item, index) => {
            return (
                <Col span={props.colSpan[index]} key={index}>
                    <span>{item}</span>
                </Col>
            );
        })}
    </Row>
  );
}
