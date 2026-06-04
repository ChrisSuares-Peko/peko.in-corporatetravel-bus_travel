import { useState } from 'react';

import { SwapOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Row, Select, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

// ─── Design tokens ────────────────────────────────────────────────────────────
const PRIMARY     = '#FF4F4F';
const PRIMARY_HOV = '#E63E3E';
const TEXT_MAIN   = '#171717';
const TEXT_HELP   = '#8C8C8C';
const BORDER      = '#D9D9D9';

const CITIES = [
    'Bangalore', 'Mumbai', 'Chennai', 'Surat', 'Delhi',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh',
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
        setErrors(prev => ({ ...prev, destination: '' }));
    };

    const handleSubmit = () => {
        const newErrors: Errors = { source: '', destination: '', date: '' };
        let hasError = false;

        if (!source) {
            newErrors.source = 'Please select a valid source city';
            hasError = true;
        }
        if (!destination) {
            newErrors.destination = 'Please select a valid destination city';
            hasError = true;
        } else if (source && source === destination) {
            newErrors.destination = 'Source and destination cannot be the same city';
            hasError = true;
        }
        if (!date) {
            newErrors.date = 'Please select a travel date';
            hasError = true;
        }

        setErrors(newErrors);

        if (!hasError) {
            navigate('/corporate-travel/bus-ticket/searching', {
                state: { source, destination, date: date?.format('DD MMM') },
            });
        }
    };

    const sourceOptions = CITIES.filter(c => c !== destination).map(c => ({ label: c, value: c }));
    const destOptions   = CITIES.filter(c => c !== source).map(c => ({ label: c, value: c }));

    // Shared field container style
    const fieldCls = 'border rounded-md bg-white px-3 py-2 flex items-center gap-2';
    const fieldStyle = { borderColor: BORDER, borderRadius: 6 };

    return (
        <Flex vertical gap={20} className="xs:p-0 md:p-2">
            <Row className="w-full m-0" gutter={[12, 12]} align="top">

                {/* ── Source City ── */}
                <Col xs={24} md={6}>
                    <Text
                        className="block mb-1 text-xs font-semibold"
                        style={{ color: TEXT_MAIN, letterSpacing: 0.2 }}
                    >
                        From
                    </Text>
                    <div className={fieldCls} style={fieldStyle}>
                        <EnvironmentOutlined style={{ color: TEXT_HELP, fontSize: 14, flexShrink: 0 }} />
                        <Select
                            showSearch
                            value={source}
                            onChange={val => { setSource(val); clearError('source'); }}
                            placeholder={<span style={{ color: TEXT_HELP }}>Enter source city</span>}
                            options={sourceOptions}
                            variant="borderless"
                            className="w-full"
                            size="large"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </div>
                    {errors.source && (
                        <Text className="text-xs mt-1 block" style={{ color: '#FF4F4F' }}>
                            {errors.source}
                        </Text>
                    )}
                </Col>

                {/* ── Swap Icon ── */}
                <Col xs={24} md={1} className="flex xs:justify-center md:items-end md:pb-1">
                    <div
                        onClick={handleSwap}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
                        style={{ border: `1px solid ${BORDER}` }}
                    >
                        <SwapOutlined style={{ color: TEXT_HELP, fontSize: 14 }} />
                    </div>
                </Col>

                {/* ── Destination City ── */}
                <Col xs={24} md={6}>
                    <Text
                        className="block mb-1 text-xs font-semibold"
                        style={{ color: TEXT_MAIN }}
                    >
                        To
                    </Text>
                    <div className={fieldCls} style={fieldStyle}>
                        <EnvironmentOutlined style={{ color: TEXT_HELP, fontSize: 14, flexShrink: 0 }} />
                        <Select
                            showSearch
                            value={destination}
                            onChange={val => { setDestination(val); clearError('destination'); }}
                            placeholder={<span style={{ color: TEXT_HELP }}>Enter destination city</span>}
                            options={destOptions}
                            variant="borderless"
                            className="w-full"
                            size="large"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </div>
                    {errors.destination && (
                        <Text className="text-xs mt-1 block" style={{ color: '#FF4F4F' }}>
                            {errors.destination}
                        </Text>
                    )}
                </Col>

                {/* ── Travel Date ── */}
                <Col xs={24} md={5} lg={5}>
                    <Text
                        className="block mb-1 text-xs font-semibold"
                        style={{ color: TEXT_MAIN }}
                    >
                        Date
                    </Text>
                    <div className={fieldCls} style={fieldStyle}>
                        <CalendarOutlined style={{ color: TEXT_HELP, fontSize: 14, flexShrink: 0 }} />
                        <DatePicker
                            value={date}
                            onChange={val => { setDate(val); clearError('date'); }}
                            format={(value: Dayjs) => {
                                if (value.isSame(dayjs(), 'day')) return 'Today';
                                return value.format('DD MMM');
                            }}
                            disabledDate={current => current && current < dayjs().startOf('day')}
                            variant="borderless"
                            className="w-full"
                            size="large"
                            inputReadOnly
                            allowClear={false}
                            suffixIcon={null}
                        />
                    </div>
                    {errors.date && (
                        <Text className="text-xs mt-1 block" style={{ color: '#FF4F4F' }}>
                            {errors.date}
                        </Text>
                    )}
                </Col>

                {/* ── Find Buses Button ── */}
                <Col xs={24} md={5} lg={6} className="flex items-end">
                    <Button
                        block
                        size="large"
                        onClick={handleSubmit}
                        className="h-11 font-semibold"
                        style={{
                            backgroundColor: PRIMARY,
                            borderColor: PRIMARY,
                            color: '#fff',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = PRIMARY_HOV;
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = PRIMARY;
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
