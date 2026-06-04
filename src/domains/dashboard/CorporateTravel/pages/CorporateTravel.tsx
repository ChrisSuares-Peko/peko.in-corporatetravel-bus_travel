import { useState } from 'react';

import { CalendarOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Input, Row, Select, Typography, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs, { Dayjs } from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

import ServiceTabSelector from '../components/ServiceTabSelector';
import { links } from '../utils/data';

const { Text, Title } = Typography;

// ─── Design tokens ─────────────────────────────────────────────────────────────
const P     = '#FF4F4F';
const TXT   = '#171717';
const HLP   = '#8C8C8C';
const BORDER = '#D9D9D9';

const fieldBox = { borderColor: BORDER, borderRadius: 6 };

// ─── Shared countries list ──────────────────────────────────────────────────────
const COUNTRIES = [
    'India', 'United Arab Emirates', 'United States', 'United Kingdom', 'Canada',
    'Australia', 'Germany', 'France', 'Singapore', 'Japan', 'China', 'Thailand',
    'Malaysia', 'Indonesia', 'Philippines', 'South Korea', 'Italy', 'Spain',
    'Netherlands', 'Switzerland',
].map(c => ({ label: c, value: c }));

// ─── Field label ───────────────────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
    <Text className="block mb-1" style={{ fontSize: 12, fontWeight: 600, color: TXT }}>
        {children}
    </Text>
);

// ─── Primary CTA button ────────────────────────────────────────────────────────
const SearchBtn = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <Button
        block size="large" icon={<SearchOutlined />}
        onClick={onClick}
        className="h-11 font-semibold"
        style={{
            backgroundColor: P, borderColor: P, color: '#fff',
            borderRadius: 6, fontSize: 14, fontWeight: 600,
        }}
    >
        {label}
    </Button>
);

const ComingSoon = () => (
    <Text className="block mt-2" style={{ fontSize: 12, color: HLP }}>
        Search functionality coming soon
    </Text>
);

// ─── 1. Air Tickets ────────────────────────────────────────────────────────────

const TRIP_TYPES = [
    { key: 'oneWay',    label: 'One-Way' },
    { key: 'roundTrip', label: 'Round Trip' },
    { key: 'multiCity', label: 'Multi-City' },
];

const CABIN_OPTIONS = [
    { label: '1 Traveller, Economy Class',  value: '1-eco' },
    { label: '1 Traveller, Business Class', value: '1-biz' },
    { label: '2 Travellers, Economy Class', value: '2-eco' },
    { label: '2 Travellers, Business Class',value: '2-biz' },
];

const AirTicketsForm = () => {
    const [tripType, setTripType] = useState('oneWay');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departure, setDeparture] = useState<Dayjs | null>(null);
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const [cabin, setCabin] = useState('1-eco');

    const handleSwap = () => { const tmp = from; setFrom(to); setTo(tmp); };

    return (
        <Flex vertical gap={16}>
            {/* Trip type pills */}
            <Flex gap={8} className="flex-wrap">
                {TRIP_TYPES.map(t => (
                    <div
                        key={t.key}
                        onClick={() => setTripType(t.key)}
                        className="px-4 py-1.5 cursor-pointer select-none transition-all"
                        style={{
                            borderRadius: 20,
                            border: tripType === t.key ? `1.5px solid ${P}` : `1px solid ${BORDER}`,
                            backgroundColor: '#fff',
                            fontSize: 14,
                            fontWeight: tripType === t.key ? 600 : 400,
                            color: tripType === t.key ? P : TXT,
                        }}
                    >
                        {t.label}
                    </div>
                ))}
            </Flex>

            {/* Fields */}
            <Row gutter={[12, 12]} align="bottom">
                <Col xs={24} sm={24} md={6}>
                    <Label>From</Label>
                    <Input
                        prefix={<SearchOutlined style={{ color: HLP }} />}
                        placeholder="City or airport"
                        value={from} onChange={e => setFrom(e.target.value)}
                        size="large" style={fieldBox}
                    />
                </Col>

                <Col xs={24} sm={2} md={1} className="flex justify-center pb-1">
                    <div
                        onClick={handleSwap}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50"
                        style={{ border: `1px solid ${BORDER}` }}
                    >
                        <SwapOutlined style={{ color: HLP }} />
                    </div>
                </Col>

                <Col xs={24} sm={22} md={5}>
                    <Label>To</Label>
                    <Input
                        prefix={<SearchOutlined style={{ color: HLP }} />}
                        placeholder="City or airport"
                        value={to} onChange={e => setTo(e.target.value)}
                        size="large" style={fieldBox}
                    />
                </Col>

                <Col xs={24} sm={12} md={4}>
                    <Label>Departure Date</Label>
                    <DatePicker
                        value={departure}
                        onChange={setDeparture}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        size="large" className="w-full" style={fieldBox}
                        placeholder="Select date"
                    />
                </Col>

                <Col xs={24} sm={12} md={4}>
                    <Label>Return Date</Label>
                    {tripType === 'roundTrip' ? (
                        <DatePicker
                            value={returnDate}
                            onChange={setReturnDate}
                            disabledDate={c => c && c < (departure ?? dayjs()).startOf('day')}
                            size="large" className="w-full" style={fieldBox}
                            placeholder="Select date"
                        />
                    ) : (
                        <div
                            className="flex items-center px-3 h-11 cursor-pointer"
                            style={{ border: `1px dashed ${BORDER}`, borderRadius: 6, color: P, fontSize: 14 }}
                            onClick={() => setTripType('roundTrip')}
                        >
                            + Add Return
                        </div>
                    )}
                </Col>

                <Col xs={24} sm={24} md={4}>
                    <Label>Travellers &amp; Cabin Class</Label>
                    <Select
                        value={cabin} onChange={setCabin}
                        options={CABIN_OPTIONS}
                        size="large" className="w-full" style={fieldBox}
                    />
                </Col>
            </Row>

            <SearchBtn label="Search Flights" onClick={() => message.info('Search functionality coming soon')} />
        </Flex>
    );
};

// ─── 2. Hotel Booking ──────────────────────────────────────────────────────────

const ROOMS_OPTIONS = [
    { label: '1 Room, 1 Guest',  value: '1-1' },
    { label: '1 Room, 2 Guests', value: '1-2' },
    { label: '2 Rooms, 2 Guests',value: '2-2' },
    { label: '2 Rooms, 4 Guests',value: '2-4' },
];

const HotelForm = () => {
    const [city, setCity]       = useState('');
    const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
    const [rooms, setRooms]     = useState('1-1');

    return (
        <Flex vertical gap={16}>
            <Row gutter={[12, 12]} align="bottom">
                <Col xs={24} md={7}>
                    <Label>City / Property</Label>
                    <Input
                        prefix={<SearchOutlined style={{ color: HLP }} />}
                        placeholder="Search city or property name"
                        value={city} onChange={e => setCity(e.target.value)}
                        size="large" style={fieldBox}
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Label>Check-in Date</Label>
                    <DatePicker
                        value={checkIn} onChange={setCheckIn}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        size="large" className="w-full" style={fieldBox}
                        placeholder="Select date"
                    />
                </Col>
                <Col xs={24} sm={12} md={5}>
                    <Label>Check-out Date</Label>
                    <DatePicker
                        value={checkOut} onChange={setCheckOut}
                        disabledDate={c => c && c < (checkIn ?? dayjs()).startOf('day')}
                        size="large" className="w-full" style={fieldBox}
                        placeholder="Select date"
                    />
                </Col>
                <Col xs={24} md={7}>
                    <Label>Rooms &amp; Guests</Label>
                    <Select
                        value={rooms} onChange={setRooms}
                        options={ROOMS_OPTIONS}
                        size="large" className="w-full" style={fieldBox}
                    />
                </Col>
            </Row>
            <SearchBtn label="Search Hotels" onClick={() => message.info('Search functionality coming soon')} />
            <ComingSoon />
        </Flex>
    );
};

// ─── 3. Travel eSIM ────────────────────────────────────────────────────────────

const DATA_PLANS = [
    { label: '1 GB',       value: '1gb' },
    { label: '3 GB',       value: '3gb' },
    { label: '5 GB',       value: '5gb' },
    { label: '10 GB',      value: '10gb' },
    { label: 'Unlimited',  value: 'unlimited' },
];

const EsimForm = () => {
    const [destination, setDestination] = useState<string | undefined>(undefined);
    const [travelDate, setTravelDate]   = useState<Dayjs | null>(null);
    const [dataPlan, setDataPlan]       = useState<string | undefined>(undefined);

    return (
        <Flex vertical gap={16}>
            <Row gutter={[12, 12]} align="bottom">
                <Col xs={24} md={8}>
                    <Label>Destination Country</Label>
                    <Select
                        showSearch
                        value={destination} onChange={setDestination}
                        placeholder="Select destination"
                        options={COUNTRIES}
                        size="large" className="w-full" style={fieldBox}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </Col>
                <Col xs={24} md={7}>
                    <Label>Travel Date</Label>
                    <DatePicker
                        value={travelDate} onChange={setTravelDate}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        size="large" className="w-full" style={fieldBox}
                        placeholder="Select date"
                    />
                </Col>
                <Col xs={24} md={9}>
                    <Label>Data Plan</Label>
                    <Select
                        value={dataPlan} onChange={setDataPlan}
                        placeholder="Select data plan"
                        options={DATA_PLANS}
                        size="large" className="w-full" style={fieldBox}
                    />
                </Col>
            </Row>
            <SearchBtn label="Search eSIM Plans" onClick={() => message.info('Search functionality coming soon')} />
            <ComingSoon />
        </Flex>
    );
};

// ─── 4. Visa ───────────────────────────────────────────────────────────────────

const VisaForm = () => {
    const [nationality, setNationality]   = useState<string | undefined>(undefined);
    const [destination, setDestination]   = useState<string | undefined>(undefined);
    const [travelDate, setTravelDate]     = useState<Dayjs | null>(null);

    return (
        <Flex vertical gap={16}>
            <Row gutter={[12, 12]} align="bottom">
                <Col xs={24} md={8}>
                    <Label>Nationality</Label>
                    <Select
                        showSearch
                        value={nationality} onChange={setNationality}
                        placeholder="Select nationality"
                        options={COUNTRIES}
                        size="large" className="w-full" style={fieldBox}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Label>Destination Country</Label>
                    <Select
                        showSearch
                        value={destination} onChange={setDestination}
                        placeholder="Select destination"
                        options={COUNTRIES}
                        size="large" className="w-full" style={fieldBox}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </Col>
                <Col xs={24} md={8}>
                    <Label>Travel Date</Label>
                    <DatePicker
                        value={travelDate} onChange={setTravelDate}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        size="large" className="w-full" style={fieldBox}
                        placeholder="Select date"
                    />
                </Col>
            </Row>
            <SearchBtn label="Search Visa Options" onClick={() => message.info('Search functionality coming soon')} />
            <ComingSoon />
        </Flex>
    );
};

// ─── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => (
    <div
        className="mt-12 pt-4 flex flex-wrap justify-between items-center gap-4"
        style={{ borderTop: '1px solid #E8E8E8' }}
    >
        <Text style={{ fontSize: 12, color: HLP }}>
            © 2026 Peko Platforms Private Limited. All Rights Reserved
        </Text>
        <Flex gap={16} className="flex-wrap">
            {['Peko Platform Agreement', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'].map(link => (
                <Text key={link} style={{ fontSize: 12, color: HLP, cursor: 'pointer' }}>
                    {link}
                </Text>
            ))}
        </Flex>
    </div>
);

// ─── Manage Booking link map ────────────────────────────────────────────────────
const MANAGE_LINKS: Record<string, string> = {
    '1': links[1] ?? '#',
    '2': links[2] ?? '#',
    '3': links[3] ?? '#',
};

// ─── Main Component ────────────────────────────────────────────────────────────

const CorporateTravel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (key: string) => {
        if (key === '5') {
            navigate('/corporate-travel/bus-ticket');
            return;
        }
        setActiveTab(key);
    };

    const renderForm = () => {
        switch (activeTab) {
            case '1': return <AirTicketsForm />;
            case '2': return <HotelForm />;
            case '3': return <EsimForm />;
            case '4': return <VisaForm />;
            default:  return null;
        }
    };

    const manageLink  = MANAGE_LINKS[activeTab];
    const manageLabel = activeTab === '3' ? 'Order History' : 'Manage Booking';

    return (
        <Content className="pb-8">

            {/* ── Hero ── */}
            <div className="text-center mb-8 mt-2">
                <Title
                    level={3}
                    style={{ fontSize: 24, fontWeight: 600, color: TXT, marginBottom: 0 }}
                >
                    The modern way to manage corporate travel — all in one place
                </Title>
            </div>

            {/* ── Service Tab Selector ── */}
            <ServiceTabSelector activeTab={activeTab} onChange={handleTabChange} />

            {/* ── Search Card ── */}
            <div
                className="bg-white mt-6 p-8"
                style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
            >
                {/* Card header: manage booking */}
                <Flex justify="flex-end" className="mb-6">
                    {manageLink ? (
                        <Link to={manageLink}>
                            <Button
                                style={{
                                    borderColor: P, color: P,
                                    borderRadius: 6, fontWeight: 500,
                                }}
                            >
                                {manageLabel}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            style={{
                                borderColor: '#D9D9D9', color: HLP,
                                borderRadius: 6, fontWeight: 400,
                            }}
                            disabled
                        >
                            {manageLabel}
                        </Button>
                    )}
                </Flex>

                {/* Search form for active tab */}
                {renderForm()}
            </div>

            {/* ── Footer ── */}
            <Footer />
        </Content>
    );
};

export default CorporateTravel;
