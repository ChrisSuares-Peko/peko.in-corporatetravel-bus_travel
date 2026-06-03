import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { Row, Typography, Collapse } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import Passenger from './Passenger';
import { PassengerType } from '../../types/passenger';

const { Panel } = Collapse;

interface PassengerDetailsProps {}
const PassengerDetails: React.FC<PassengerDetailsProps> = () => {
    const { orderResponse } = useAppSelector(state => state.reducer.airline.orderDetails);
    const { passengers } = orderResponse.data[0];

    const customExpandIcon = (panelProps: { isActive?: boolean }) =>
        panelProps.isActive ? <DownOutlined /> : <RightOutlined />;

    return (
        <div>
            <Collapse
                defaultActiveKey={['1']}
                expandIconPosition="end"
                style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: '8px',
                    border: 'none',
                }}
                expandIcon={customExpandIcon}
            >
                <Panel
                    header={
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Passenger Details
                        </Typography.Title>
                    }
                    key="1"
                >
                    <Row gutter={[16, 16]}>
                        {passengers.map((passenger: PassengerType, index: number) => (
                            <Passenger key={index} index={index} passenger={passenger} />
                        ))}
                    </Row>
                </Panel>
            </Collapse>
        </div>
    );
};

export default PassengerDetails;
