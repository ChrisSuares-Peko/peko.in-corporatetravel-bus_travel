import { Button, DatePicker, Flex, Form, Select, Typography, message } from 'antd';

const { Title, Text } = Typography;

const COUNTRIES = [
    'India', 'United Arab Emirates', 'United States', 'United Kingdom', 'Canada',
    'Australia', 'Germany', 'France', 'Singapore', 'Japan', 'China', 'Thailand',
    'Malaysia', 'Indonesia', 'Philippines', 'South Korea', 'Italy', 'Spain',
    'Netherlands', 'Switzerland',
];

const countryOptions = COUNTRIES.map(c => ({ label: c, value: c }));

const VisaSearch = () => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        message.info('Search functionality coming soon');
    };

    return (
        <Flex vertical gap={24} className="p-4 sm:p-6">
            <Flex vertical gap={4}>
                <Title level={5} className="m-0">
                    Visa Search
                </Title>
                <Text className="text-gray-500 text-sm">
                    Find visa requirements for your destination
                </Text>
            </Flex>

            <Form form={form} layout="vertical" onFinish={handleSubmit} className="max-w-xl">
                <Form.Item
                    name="originCountry"
                    label="Origin Country"
                    rules={[{ required: true, message: 'Please select your origin country' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select origin country"
                        options={countryOptions}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        size="large"
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    name="destinationCountry"
                    label="Destination Country"
                    rules={[{ required: true, message: 'Please select your destination country' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select destination country"
                        options={countryOptions}
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                        size="large"
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    name="travelDate"
                    label="Travel Date"
                    rules={[{ required: true, message: 'Please select your travel date' }]}
                >
                    <DatePicker size="large" className="w-full" format="DD MMM YYYY" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        danger
                        className="w-full sm:w-auto"
                    >
                        Search Visa Requirements
                    </Button>
                </Form.Item>
            </Form>
        </Flex>
    );
};

export default VisaSearch;
