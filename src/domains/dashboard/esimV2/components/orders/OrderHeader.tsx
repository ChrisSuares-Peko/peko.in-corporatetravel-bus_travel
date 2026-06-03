import { SearchOutlined } from '@ant-design/icons';
import { Row, Col, Typography, Input } from 'antd';

type Props = {
    setSearchText: (text: string) => void;
};

const OrderHeader = ({ setSearchText }: Props) => (
    <Row className="mt-6 w-full" justify="space-between">
        <Col xs={24} sm={12}>
            <Typography.Text className="font-medium text-base text-textBlack">
                Order History
            </Typography.Text>
        </Col>
        <Col xs={24} sm={12} className="xs:mt-4 sm:mt-0 flex justify-end">
            <Input
                allowClear
                suffix={<SearchOutlined />}
                variant="outlined"
                placeholder="Search"
                className="w-56"
                onChange={e => setSearchText(e.target.value)} // Use onChange instead of onSearch
            />
        </Col>
    </Row>
);

export default OrderHeader;
