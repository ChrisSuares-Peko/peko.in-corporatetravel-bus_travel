import { Button, Col, Flex, Row } from 'antd';

import HeadDetails from '../components/CancelDetails/HeadDetails';
import ChangeDateTime from '../components/ModifyBooking/ChangeDateTime';

const CancelDetails = () => (
    <Row>
        <Col span={24}>
            <Flex vertical gap={40}>
                <HeadDetails title="Modify Booking" />

                <ChangeDateTime />

                <Flex gap={6}>
                    <Button
                        type="default"
                        style={{ borderColor: '#FF4D4F', color: '#FF4D4F' }}
                        onClick={() => console.log('Go back clicked')}
                    >
                        Go back
                    </Button>
                    <Button
                        type="primary"
                        danger
                        style={{
                            backgroundColor: '#FF4D4F',
                            borderColor: '#FF4D4F',
                        }}
                    >
                        Submit
                    </Button>
                </Flex>
            </Flex>
        </Col>
    </Row>
);

export default CancelDetails;
