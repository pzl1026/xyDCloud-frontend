import './index.scss';
import { Row, Col } from 'antd';

export default function(props) {
  return (
    <Row className="dl-header">
        {props.header.map(item => {
            return (
                <Col span={6}>
                    <span>{item}</span>
                </Col>
            );
        })}
    </Row>

  );
}
