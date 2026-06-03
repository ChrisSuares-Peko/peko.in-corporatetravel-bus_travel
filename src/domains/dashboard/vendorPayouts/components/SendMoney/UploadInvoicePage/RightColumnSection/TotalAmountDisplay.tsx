/* eslint-disable react/prop-types */
import { Divider, Typography, Row, Col } from 'antd';

const { Text } = Typography;
const TotalAmountDisplay: React.FC<{
    totalAmount: number;
}> = ({ totalAmount }) => (
    <>
        <Divider />
        <Row justify="space-between" align="middle" className="mt-4">
            <Col>
                <Text className="font-semibold">Total</Text>
            </Col>
            <Col>
                <Text className="font-semibold md:mr-14">AED {totalAmount}</Text>
            </Col>
        </Row>
    </>
);

export default TotalAmountDisplay;
