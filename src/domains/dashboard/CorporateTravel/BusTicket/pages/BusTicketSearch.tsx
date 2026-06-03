import { useState } from 'react';

import { SwapOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Row, Select, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

const CITIES = [
    'Bangalore',
    'Mumbai',
    'Chennai',
    'Surat',
    'Delhi',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Kochi',
    'Chandigarh',
];

type Errors = { source: string; destination: string; date: string };

const BusTicketSearch = () => {
    const navigate = useNavigate();

    const [source, setSource] = useState<string | undefined>(undefined);
    const [destination, setDestination] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [errors, setErrors] = useState<Errors>({ source: '', destination: '', date: '' });

    const clearError = (field: keyof Errors) =>
        setErrors(prev => ({ ...prev, [field]: '' }));

    const handleSwap = () => {
        setSource(destination);
        setDestination(source);
        // Clear same-city validation when swapping
        setErrors(prev => ({ ...prev, destination: '' }));
    };

    const handleSubmit = () => {
        const newErrors: Errors = { source: '', destination: '', date: '' };
        let hasError = false;

        if (!source) {
            newErrors.source = 'Please select source city';
            hasError = true;
        }
        if (!destination) {
            newErrors.destination = 'Please select destination city';
            hasError = true;
        } else if (source && source === destination) {
            newErrors.destination = 'Source and destination cannot be the same';
            hasError = true;
        }
        if (!date) {
            newErrors.date = 'Please select travel date';
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            navigate('/corporate-travel/bus-ticket/searching', {
                state: {
                    source,
                    destination,
                    date: date?.format('DD MMM'),
                },
            });
        }
    };

    const sourceOptions = CITIES.filter(c => c !== destination).map(c => ({
        label: c,
        value: c,
    }));
    const destOptions = CITIES.filter(c => c !== source).map(c => ({
        label: c,
        value: c,
    }));

    return (
        <Flex vertical gap={25} className="xs:p-0 md:p-2">
            {/* Search bar card — mirrors the SearchCardDesktop pattern */}
            <Row className="w-full p-0 m-0" gutter={[10, 10]} align="bottom">

                {/* ── Source City ── */}
                <Col xs={24} md={6} lg={6} className="w-full pt-4">
                    <Paragraph className="flex-none text-sm text-gray-500 ms-3 mb-1">
                        From
                    </Paragraph>
                    <Flex align="center" className="ms-2 gap-1">
                        <EnvironmentOutlined className="text-gray-400 text-base" />
                        <Select
                            showSearch
                            value={source}
                            onChange={val => {
                                setSource(val);
                                clearError('source');
                            }}
                            placeholder="Enter source city"
                            options={sourceOptions}
                            variant="borderless"
                            className="w-full"
                            size="large"
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        />
                    </Flex>
                    {errors.source && (
                        <Text className="text-red-500 text-xs ms-3">{errors.source}</Text>
                    )}
                    <Col
                        className={`border-b-2 ms-3 mt-2 ${errors.source ? 'border-red-400' : ''}`}
                    />
                </Col>

                {/* ── Swap Icon ── */}
                <Col
                    xs={24}
                    md={1}
                    className="w-full flex xs:justify-center md:justify-center items-center xs:py-2 md:pb-4"
                >
                    <div
                        onClick={handleSwap}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                    >
                        <SwapOutlined className="text-gray-500 text-sm" />
                    </div>
                </Col>

                {/* ── Destination City ── */}
                <Col xs={24} md={6} lg={6} className="w-full pt-4">
                    <Paragraph className="flex-none text-sm text-gray-500 ms-3 mb-1">
                        To
                    </Paragraph>
                    <Flex align="center" className="ms-2 gap-1">
                        <EnvironmentOutlined className="text-gray-400 text-base" />
                        <Select
                            showSearch
                            value={destination}
                            onChange={val => {
                                setDestination(val);
                                clearError('destination');
                            }}
                            placeholder="Enter destination city"
                            options={destOptions}
                            variant="borderless"
                            className="w-full"
                            size="large"
                            filterOption={(input, option) =>
                                (option?.label ?? '')
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                        />
                    </Flex>
                    {errors.destination && (
                        <Text className="text-red-500 text-xs ms-3">{errors.destination}</Text>
                    )}
                    <Col
                        className={`border-b-2 ms-3 mt-2 ${
                            errors.destination ? 'border-red-400' : ''
                        }`}
                    />
                </Col>

                {/* ── Travel Date ── */}
                <Col xs={24} md={6} lg={5} className="w-full pt-4">
                    <Paragraph className="flex-none text-sm text-gray-500 ms-3 mb-1">
                        Date
                    </Paragraph>
                    <Flex align="center" className="ms-2 gap-1">
                        <CalendarOutlined className="text-gray-400 text-base" />
                        <DatePicker
                            value={date}
                            onChange={val => {
                                setDate(val);
                                clearError('date');
                            }}
                            format={(value: Dayjs) => {
                                if (value.isSame(dayjs(), 'day')) return 'Today';
                                return value.format('DD MMM');
                            }}
                            disabledDate={current =>
                                current && current < dayjs().startOf('day')
                            }
                            variant="borderless"
                            className="w-full"
                            size="large"
                            inputReadOnly
                            allowClear={false}
                            suffixIcon={null}
                        />
                    </Flex>
                    {errors.date && (
                        <Text className="text-red-500 text-xs ms-3">{errors.date}</Text>
                    )}
                    <Col
                        className={`border-b-2 ms-3 mt-2 ${errors.date ? 'border-red-400' : ''}`}
                    />
                </Col>

                {/* ── Find Buses Button ── */}
                <Col xs={24} md={5} lg={6} className="w-full xs:pt-4 md:pt-0 xs:pb-0 md:pb-2">
                    <Button
                        size="large"
                        onClick={handleSubmit}
                        className="xs:w-full md:w-48 h-12 flex justify-center items-center rounded-md font-semibold"
                        style={{
                            backgroundColor: '#FFA827',
                            borderColor: '#FFA827',
                            color: '#fff',
                        }}
                    >
                        Find Buses
                    </Button>
                </Col>
            </Row>
        </Flex>
    );
};

export default BusTicketSearch;
