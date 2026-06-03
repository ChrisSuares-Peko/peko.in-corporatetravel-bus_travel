import { SearchOutlined } from '@ant-design/icons';
import { Col, Flex, Input, Row, Slider, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';

interface FilterhotelProps {
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    searchQuery?: string;
    setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
    range: any;
    setRange: any;
}
const Filterhotel = ({
    setPriceRange,
    searchQuery,
    setSearchQuery,
    range,
    setRange,
}: FilterhotelProps) => {
    // const [range, setRange] = useState<[number, number]>([100, 10000]);
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const handleSliderChange = (value: [number, number]) => {
        setPriceRange(value);
        setRange(value);
    };
    const handleChangeSearchQuery = (value: string) => {
        if (setSearchQuery) {
            setSearchQuery(value);
        }
    };

    return (
        <Content>
            <Typography.Text className="font-medium ml-4">Price</Typography.Text>
            <Content style={{ padding: '0 16px' }}>
                <Slider
                    className=""
                    range
                    value={range}
                    onChange={handleSliderChange as any}
                    min={100}
                    max={10000}
                />
            </Content>
            <Row gutter={16} className="p-4">
                <Col className="gutter-row" span={12}>
                    <Content className="py-2 border border-solid border-gray-200 rounded-md">
                        <Flex vertical>
                            <Typography.Text
                                data-testid="min"
                                className="text-xs text-gray-500 ml-4"
                            >
                                Min price
                            </Typography.Text>
                            <Typography.Text className="font-medium ml-4">{`AED ${range[0]}`}</Typography.Text>
                        </Flex>
                    </Content>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Content className="py-2 border border-solid border-gray-200 rounded-md">
                        <Flex vertical>
                            <Typography.Text
                                data-testid="max"
                                className="text-xs text-gray-500 ml-4"
                            >
                                Max price
                            </Typography.Text>
                            <Typography.Text className="font-medium ml-4">{`AED ${range[1]}`}</Typography.Text>
                        </Flex>
                    </Content>
                </Col>
            </Row>
            <Flex vertical className="mt-2 mb-7">
                <Typography.Text className=" ml-4">Search by property name</Typography.Text>

                <Flex className="px-4 py-3">
                    <Input
                        placeholder="Search by property name"
                        suffix={<SearchOutlined />}
                        allowClear
                        type="text"
                        maxLength={90}
                        value={searchQuery}
                        onChange={e => handleChangeSearchQuery(e.target.value)}
                        className="input-container rounded-sm"
                    />
                </Flex>
            </Flex>
        </Content>
    );
};

export default Filterhotel;
