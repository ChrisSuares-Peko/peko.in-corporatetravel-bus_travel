import { useState } from 'react';

import { CalendarOutlined, SearchOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Input, Select, Typography, message } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs, { Dayjs } from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';

import { BusOutlineIcon, LocationIcon } from '../BusTicket/components/SolarIcons';
import { links } from '../utils/data';

const { Text, Title } = Typography;

// ─── Design tokens ─────────────────────────────────────────────────────────────
const P   = '#FF4F4F';
const TXT = '#171717';
const HLP = '#8C8C8C';
const BDR = '#E8E8E8';
const D9  = '#D9D9D9';

// ─── Cities (for bus ticket form) ──────────────────────────────────────────────
const CITIES = [
    'Bangalore', 'Mumbai', 'Chennai', 'Surat', 'Delhi',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh',
];

// ─── Countries (for eSIM / Visa) ───────────────────────────────────────────────
const COUNTRIES = [
    'India', 'United Arab Emirates', 'United States', 'United Kingdom', 'Canada',
    'Australia', 'Germany', 'France', 'Singapore', 'Japan', 'China', 'Thailand',
    'Malaysia', 'Indonesia', 'Philippines', 'South Korea', 'Italy', 'Spain',
    'Netherlands', 'Switzerland',
].map(c => ({ label: c, value: c }));

// ─── Tab illustrated icons (colorful, 48×48) ───────────────────────────────────

const AirTabIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#FFF1F0" />
        <path d="M38 24L17 15l4 7H12l2.5 2-2.5 2h9l-4 7 21-9z" fill="#FF4F4F" />
        <rect x="22" y="21" width="9" height="6" rx="1" fill="#FFB3B3" opacity="0.6" />
    </svg>
);

const HotelTabIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#F0F5FF" />
        <rect x="14" y="27" width="20" height="10" rx="2" fill="#4080FF" />
        <path d="M12 27l12-11 12 11" fill="#60A5FA" />
        <rect x="12" y="37" width="24" height="3" rx="1" fill="#1D4ED8" />
        <rect x="17" y="20" width="4" height="7" rx="1" fill="#BAE6FD" />
        <rect x="25" y="20" width="4" height="7" rx="1" fill="#BAE6FD" />
        <rect x="21" y="30" width="6" height="7" fill="white" rx="1" />
    </svg>
);

const EsimTabIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#F6FFED" />
        <ellipse cx="24" cy="24" rx="11" ry="11" stroke="#52C41A" strokeWidth="2" />
        <ellipse cx="24" cy="24" rx="5" ry="11" stroke="#52C41A" strokeWidth="1.5" />
        <line x1="13" y1="24" x2="35" y2="24" stroke="#52C41A" strokeWidth="1.5" />
        <line x1="14.5" y1="18.5" x2="33.5" y2="18.5" stroke="#52C41A" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="14.5" y1="29.5" x2="33.5" y2="29.5" stroke="#52C41A" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
);

const VisaTabIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#FFFBE6" />
        <rect x="13" y="13" width="22" height="16" rx="2.5" fill="#FAAD14" />
        <rect x="16" y="17" width="16" height="2" rx="1" fill="white" opacity="0.9" />
        <rect x="16" y="21" width="11" height="2" rx="1" fill="white" opacity="0.7" />
        <rect x="16" y="25" width="7" height="1.5" rx="0.75" fill="white" opacity="0.5" />
        <circle cx="32" cy="32" r="7" fill="#FF4F4F" />
        <path d="M29.5 32l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BusTabIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="24" fill="#FFF7E6" />
        <rect x="10" y="17" width="28" height="16" rx="3" fill="#FA8C16" />
        <rect x="10" y="17" width="28" height="5" rx="3" fill="#E8920A" />
        <rect x="13" y="19" width="6" height="6" rx="1" fill="white" />
        <rect x="21" y="19" width="6" height="6" rx="1" fill="white" />
        <rect x="29" y="19" width="6" height="6" rx="1" fill="white" />
        <circle cx="16" cy="35" r="3.5" fill="#AD4E00" />
        <circle cx="32" cy="35" r="3.5" fill="#AD4E00" />
        <rect x="8" y="21" width="3" height="8" rx="1.5" fill="#D46B08" />
        <rect x="37" y="21" width="3" height="8" rx="1.5" fill="#D46B08" />
    </svg>
);

// ─── Airplane icon for air ticket fields ────────────────────────────────────────
const AirplaneFieldIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={HLP}>
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
);

// ─── Landing Tab Bar ────────────────────────────────────────────────────────────

interface TabDef { key: string; label: string; icon: React.ReactNode }

const LANDING_TABS: TabDef[] = [
    { key: '1', label: 'Air Tickets',   icon: <AirTabIcon /> },
    { key: '2', label: 'Hotel Booking', icon: <HotelTabIcon /> },
    { key: '3', label: 'Travel eSIM',   icon: <EsimTabIcon /> },
    { key: '4', label: 'Visa',          icon: <VisaTabIcon /> },
    { key: '5', label: 'Bus Ticket',    icon: <BusTabIcon /> },
];

const LandingTabBar = ({
    activeTab,
    onChange,
}: {
    activeTab: string;
    onChange: (key: string) => void;
}) => (
    <div
        style={{
            backgroundColor: '#FDF5F5',
            borderRadius: 16,
            padding: '8px 16px',
            display: 'flex',
            gap: 8,
            overflow: 'visible',
            position: 'relative',
        }}
    >
        {LANDING_TABS.map(tab => {
            const active = tab.key === activeTab;
            return (
                <div
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    style={{
                        flex: 1,
                        minWidth: 120,
                        height: 80,
                        borderRadius: 12,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                        userSelect: 'none',
                        position: 'relative',
                        top: active ? 8 : 0,
                        zIndex: active ? 2 : 1,
                        transition: 'all 0.2s ease',
                        transform: active ? 'translateY(-4px)' : 'none',
                        backgroundColor: active ? '#FFFFFF' : 'transparent',
                        border: active ? `1.5px solid ${P}` : 'none',
                        boxShadow: active ? '0 4px 12px rgba(255, 79, 79, 0.15)' : 'none',
                    }}
                >
                    {tab.icon}
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: active ? 600 : 500,
                            color: active ? P : TXT,
                            lineHeight: 1,
                            textAlign: 'center',
                        }}
                    >
                        {tab.label}
                    </Text>
                </div>
            );
        })}
    </div>
);

// ─── Shared field label ─────────────────────────────────────────────────────────
const FL = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ fontSize: 11, color: HLP, display: 'block', marginBottom: 4 }}>
        {children}
    </Text>
);

// ─── Shared underline field wrapper ────────────────────────────────────────────
const UF = ({
    label,
    children,
    flex = '1',
}: {
    label: string;
    children: React.ReactNode;
    flex?: string | number;
}) => (
    <div style={{ flex, borderBottom: `1px solid ${BDR}`, paddingBottom: 8 }}>
        <FL>{label}</FL>
        <Flex align="center" gap={8}>{children}</Flex>
    </div>
);

// ─── Swap button (32×32, #FF4F4F icon) ─────────────────────────────────────────
const SwapBtn = ({ onClick }: { onClick: () => void }) => (
    <div
        onClick={onClick}
        style={{
            width: 32, height: 32, borderRadius: 16,
            border: `1px solid ${BDR}`,
            backgroundColor: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            alignSelf: 'flex-end',
            marginBottom: 2,
        }}
    >
        <SwapOutlined style={{ color: P, fontSize: 14 }} />
    </div>
);

// ─── Search CTA button (bottom right, 200px) ───────────────────────────────────
const SearchCTA = ({
    label,
    icon,
    onClick,
}: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
}) => (
    <Flex justify="flex-end" style={{ marginTop: 24 }}>
        <Button
            onClick={onClick}
            icon={icon ?? <SearchOutlined />}
            style={{
                backgroundColor: P, borderColor: P, color: '#fff',
                borderRadius: 8, fontWeight: 600, fontSize: 14,
                height: 48, width: 220,
            }}
        >
            {label}
        </Button>
    </Flex>
);

const ComingSoon = () => (
    <Flex justify="flex-end" style={{ marginTop: 6 }}>
        <Text style={{ fontSize: 12, color: HLP }}>Search functionality coming soon</Text>
    </Flex>
);

// ─── Trip type pills ────────────────────────────────────────────────────────────
const TRIP_TYPES = [
    { key: 'oneWay',    label: 'One-Way' },
    { key: 'roundTrip', label: 'Round Trip' },
    { key: 'multiCity', label: 'Multi-City' },
];

// ─── 1. Air Tickets ────────────────────────────────────────────────────────────

const CABIN_OPTIONS = [
    { label: '1 Traveller, Economy Class',  value: '1-eco' },
    { label: '1 Traveller, Business Class', value: '1-biz' },
    { label: '2 Travellers, Economy Class', value: '2-eco' },
    { label: '2 Travellers, Business Class',value: '2-biz' },
];

const AirTicketsForm = () => {
    const [tripType, setTripType]     = useState('oneWay');
    const [from, setFrom]             = useState('');
    const [to, setTo]                 = useState('');
    const [departure, setDeparture]   = useState<Dayjs | null>(dayjs());
    const [returnDate, setReturnDate] = useState<Dayjs | null>(null);
    const [cabin, setCabin]           = useState('1-eco');

    const handleSwap = () => { const t = from; setFrom(to); setTo(t); };
    const cabinParts = CABIN_OPTIONS.find(o => o.value === cabin)?.label.split(', ') ?? ['1 Traveller', 'Economy Class'];

    return (
        <Flex vertical gap={20}>
            {/* Trip type pills */}
            <Flex gap={8} style={{ flexWrap: 'wrap' }}>
                {TRIP_TYPES.map(t => (
                    <div
                        key={t.key}
                        onClick={() => setTripType(t.key)}
                        style={{
                            borderRadius: 20,
                            border: tripType === t.key ? `1.5px solid ${P}` : `1px solid ${D9}`,
                            backgroundColor: '#fff',
                            padding: '5px 16px',
                            fontSize: 13,
                            fontWeight: tripType === t.key ? 600 : 500,
                            color: tripType === t.key ? P : TXT,
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                    >
                        {t.label}
                    </div>
                ))}
            </Flex>

            {/* Fields row */}
            <Flex gap={16} align="flex-end" style={{ flexWrap: 'wrap' }}>
                <UF label="From" flex="1 1 140px">
                    <AirplaneFieldIcon />
                    <Input
                        variant="borderless"
                        placeholder="Enter location"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        style={{ padding: 0, fontSize: 14, color: TXT }}
                    />
                </UF>

                <SwapBtn onClick={handleSwap} />

                <UF label="To" flex="1 1 140px">
                    <AirplaneFieldIcon />
                    <Input
                        variant="borderless"
                        placeholder="Enter location"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        style={{ padding: 0, fontSize: 14, color: TXT }}
                    />
                </UF>

                <UF label="Departure Date" flex="1 1 120px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <DatePicker
                        value={departure}
                        onChange={setDeparture}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        variant="borderless"
                        format="DD MMM YYYY, ddd"
                        placeholder="Select date"
                        style={{ padding: 0, flex: 1, fontSize: 14 }}
                    />
                </UF>

                <UF label="Return Date" flex="1 1 120px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    {tripType === 'roundTrip' ? (
                        <DatePicker
                            value={returnDate}
                            onChange={setReturnDate}
                            disabledDate={c => c && c < (departure ?? dayjs()).startOf('day')}
                            variant="borderless"
                            placeholder="Select date"
                            style={{ padding: 0, flex: 1, fontSize: 14 }}
                        />
                    ) : (
                        <Text
                            onClick={() => setTripType('roundTrip')}
                            style={{ fontSize: 14, color: P, cursor: 'pointer' }}
                        >
                            + Add Return
                        </Text>
                    )}
                </UF>

                {/* Travellers & Cabin Class — two-line display */}
                <div style={{ flex: '1 1 140px', borderBottom: `1px solid ${BDR}`, paddingBottom: 8 }}>
                    <FL>Travellers &amp; Cabin Class</FL>
                    <Select
                        value={cabin}
                        onChange={v => setCabin(v)}
                        options={CABIN_OPTIONS}
                        variant="borderless"
                        labelRender={({ label }) => {
                            const parts = String(label).split(', ');
                            return (
                                <Flex vertical gap={0} style={{ lineHeight: 1.2 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>{parts[0]}</Text>
                                    <Text style={{ fontSize: 12, color: HLP }}>{parts[1]}</Text>
                                </Flex>
                            );
                        }}
                        style={{ width: '100%', padding: 0 }}
                    />
                </div>
            </Flex>

            <SearchCTA label="Search Flights" onClick={() => message.info('Search functionality coming soon')} />
        </Flex>
    );
};

// ─── 2. Hotel Booking ──────────────────────────────────────────────────────────

const ROOMS_OPTIONS = [
    { label: '1 Room, 1 Guest',   value: '1-1' },
    { label: '1 Room, 2 Guests',  value: '1-2' },
    { label: '2 Rooms, 2 Guests', value: '2-2' },
    { label: '2 Rooms, 4 Guests', value: '2-4' },
];

const HotelForm = () => {
    const [city, setCity]             = useState('');
    const [checkIn, setCheckIn]       = useState<Dayjs | null>(null);
    const [checkOut, setCheckOut]     = useState<Dayjs | null>(null);
    const [rooms, setRooms]           = useState('1-1');

    return (
        <Flex vertical gap={20}>
            <Flex gap={16} align="flex-end" style={{ flexWrap: 'wrap' }}>
                <UF label="City / Property" flex="2 1 200px">
                    <SearchOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <Input
                        variant="borderless"
                        placeholder="Search city or property name"
                        value={city} onChange={e => setCity(e.target.value)}
                        style={{ padding: 0, fontSize: 14 }}
                    />
                </UF>
                <UF label="Check-in Date" flex="1 1 130px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <DatePicker
                        value={checkIn} onChange={setCheckIn}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        variant="borderless" placeholder="Select date"
                        style={{ padding: 0, flex: 1 }}
                    />
                </UF>
                <UF label="Check-out Date" flex="1 1 130px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <DatePicker
                        value={checkOut} onChange={setCheckOut}
                        disabledDate={c => c && c < (checkIn ?? dayjs()).startOf('day')}
                        variant="borderless" placeholder="Select date"
                        style={{ padding: 0, flex: 1 }}
                    />
                </UF>
                <UF label="Rooms &amp; Guests" flex="1 1 130px">
                    <Select
                        value={rooms} onChange={setRooms}
                        options={ROOMS_OPTIONS}
                        variant="borderless"
                        style={{ width: '100%', padding: 0 }}
                    />
                </UF>
            </Flex>
            <SearchCTA label="Search Hotels" onClick={() => message.info('Search functionality coming soon')} />
            <ComingSoon />
        </Flex>
    );
};

// ─── 3. Travel eSIM ────────────────────────────────────────────────────────────

const DATA_PLANS = [
    { label: '1 GB', value: '1gb' }, { label: '3 GB', value: '3gb' },
    { label: '5 GB', value: '5gb' }, { label: '10 GB', value: '10gb' },
    { label: 'Unlimited', value: 'unlimited' },
];

const EsimForm = () => {
    const [dest, setDest]         = useState<string | undefined>(undefined);
    const [date, setDate]         = useState<Dayjs | null>(null);
    const [plan, setPlan]         = useState<string | undefined>(undefined);

    return (
        <Flex vertical gap={20}>
            <Flex gap={16} align="flex-end" style={{ flexWrap: 'wrap' }}>
                <UF label="Destination Country" flex="2 1 180px">
                    <Select
                        showSearch value={dest} onChange={setDest}
                        placeholder="Select destination" options={COUNTRIES}
                        variant="borderless" style={{ width: '100%' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </UF>
                <UF label="Travel Date" flex="1 1 130px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <DatePicker
                        value={date} onChange={setDate}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        variant="borderless" placeholder="Select date"
                        style={{ padding: 0, flex: 1 }}
                    />
                </UF>
                <UF label="Data Plan" flex="1 1 130px">
                    <Select
                        value={plan} onChange={setPlan}
                        placeholder="Select data plan" options={DATA_PLANS}
                        variant="borderless" style={{ width: '100%' }}
                    />
                </UF>
            </Flex>
            <SearchCTA label="Search eSIM Plans" onClick={() => message.info('Search functionality coming soon')} />
            <ComingSoon />
        </Flex>
    );
};

// ─── 4. Visa ───────────────────────────────────────────────────────────────────

const VisaForm = () => {
    const [nat,  setNat]  = useState<string | undefined>(undefined);
    const [dest, setDest] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Dayjs | null>(null);

    return (
        <Flex vertical gap={20}>
            <Flex gap={16} align="flex-end" style={{ flexWrap: 'wrap' }}>
                <UF label="Nationality" flex="1 1 160px">
                    <Select
                        showSearch value={nat} onChange={setNat}
                        placeholder="Select nationality" options={COUNTRIES}
                        variant="borderless" style={{ width: '100%' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </UF>
                <UF label="Destination Country" flex="1 1 160px">
                    <Select
                        showSearch value={dest} onChange={setDest}
                        placeholder="Select destination" options={COUNTRIES}
                        variant="borderless" style={{ width: '100%' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </UF>
                <UF label="Travel Date" flex="1 1 130px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <DatePicker
                        value={date} onChange={setDate}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        variant="borderless" placeholder="Select date"
                        style={{ padding: 0, flex: 1 }}
                    />
                </UF>
            </Flex>
            <SearchCTA label="Search Visa Options" onClick={() => message.info('Search functionality coming soon')} />
            <ComingSoon />
        </Flex>
    );
};

// ─── 5. Bus Ticket (inline form) ────────────────────────────────────────────────

const BusTicketForm = () => {
    const navigate = useNavigate();
    const [source, setSource] = useState<string | undefined>(undefined);
    const [dest, setDest]     = useState<string | undefined>(undefined);
    const [date, setDate]     = useState<Dayjs | null>(dayjs());
    const [srcErr, setSrcErr] = useState('');
    const [dstErr, setDstErr] = useState('');

    const handleSwap = () => {
        const t = source; setSource(dest); setDest(t);
        setDstErr('');
    };

    const cityOpts = (exclude?: string) =>
        CITIES.filter(c => c !== exclude).map(c => ({ label: c, value: c }));

    const handleSubmit = () => {
        let err = false;
        if (!source) { setSrcErr('Please select a valid source city'); err = true; }
        else setSrcErr('');
        if (!dest)   { setDstErr('Please select a valid destination city'); err = true; }
        else if (source === dest) { setDstErr('Source and destination cannot be the same'); err = true; }
        else setDstErr('');
        if (err) return;
        navigate('/corporate-travel/bus-ticket/searching', {
            state: { source, destination: dest, date: date?.format('DD MMM') },
        });
    };

    return (
        <Flex vertical gap={20}>
            <Flex gap={16} align="flex-end" style={{ flexWrap: 'wrap' }}>
                <UF label="From" flex="1 1 160px">
                    <LocationIcon size={14} color={HLP} />
                    <Select
                        showSearch value={source} onChange={v => { setSource(v); setSrcErr(''); }}
                        placeholder="Enter source city" options={cityOpts(dest)}
                        variant="borderless" style={{ width: '100%' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </UF>

                <SwapBtn onClick={handleSwap} />

                <UF label="To" flex="1 1 160px">
                    <LocationIcon size={14} color={HLP} />
                    <Select
                        showSearch value={dest} onChange={v => { setDest(v); setDstErr(''); }}
                        placeholder="Enter destination city" options={cityOpts(source)}
                        variant="borderless" style={{ width: '100%' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                    />
                </UF>

                <UF label="Date" flex="1 1 140px">
                    <CalendarOutlined style={{ color: HLP, flexShrink: 0 }} />
                    <DatePicker
                        value={date}
                        onChange={setDate}
                        format={(v: Dayjs) => v.isSame(dayjs(), 'day') ? 'Today' : v.format('DD MMM')}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        variant="borderless" inputReadOnly allowClear={false} suffixIcon={null}
                        style={{ padding: 0, flex: 1 }}
                    />
                </UF>
            </Flex>

            {/* Inline validation */}
            {(srcErr || dstErr) && (
                <Flex gap={16}>
                    {srcErr && <Text style={{ fontSize: 12, color: P }}>{srcErr}</Text>}
                    {dstErr && <Text style={{ fontSize: 12, color: P }}>{dstErr}</Text>}
                </Flex>
            )}

            <SearchCTA
                label="Find Buses"
                icon={<BusOutlineIcon size={16} color="#fff" />}
                onClick={handleSubmit}
            />
        </Flex>
    );
};

// ─── Manage Booking links ───────────────────────────────────────────────────────
const MANAGE_LINKS: Record<string, string> = {
    '1': links[1] ?? '#',
    '2': links[2] ?? '#',
    '3': links[3] ?? '#',
};

// ─── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
    <div
        className="mt-12 pt-4 flex flex-wrap justify-between items-center gap-4"
        style={{ borderTop: '1px solid #F0F0F0' }}
    >
        <Text style={{ fontSize: 12, color: HLP }}>
            © 2026 Peko Platforms Private Limited. All Rights Reserved
        </Text>
        <Flex gap={0} align="center" className="flex-wrap">
            {['Peko Platform Agreement', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'].flatMap((lnk, i) =>
                i === 0
                    ? [<Text key={lnk} style={{ fontSize: 12, color: HLP, cursor: 'pointer' }}>{lnk}</Text>]
                    : [
                        <Text key={`sep-${i}`} style={{ fontSize: 12, color: HLP, margin: '0 8px' }}>|</Text>,
                        <Text key={lnk} style={{ fontSize: 12, color: HLP, cursor: 'pointer' }}>{lnk}</Text>,
                      ]
            )}
        </Flex>
    </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const CorporateTravel = () => {
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (key: string) => setActiveTab(key);

    const renderForm = () => {
        switch (activeTab) {
            case '1': return <AirTicketsForm />;
            case '2': return <HotelForm />;
            case '3': return <EsimForm />;
            case '4': return <VisaForm />;
            case '5': return <BusTicketForm />;
            default:  return null;
        }
    };

    const manageLink  = MANAGE_LINKS[activeTab];
    const manageLabel = activeTab === '3' ? 'Order History' : 'Manage Booking';

    return (
        <Content className="pb-8">

            {/* ── Hero ── */}
            <div style={{ textAlign: 'center', marginBottom: 24, marginTop: 8 }}>
                <Title
                    level={2}
                    style={{ fontSize: 28, fontWeight: 700, color: TXT, marginBottom: 0, lineHeight: 1.3 }}
                >
                    The modern way to manage corporate travel - all in one place
                </Title>
            </div>

            {/* ── Tab Bar ── */}
            <LandingTabBar activeTab={activeTab} onChange={handleTabChange} />

            {/* ── Search Card (paddingTop:32 accommodates active-tab overlap) ── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${BDR}`,
                    borderRadius: 12,
                    padding: '40px 32px 32px 32px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                    position: 'relative',
                }}
            >
                {/* Manage Booking button — top-right corner */}
                <div style={{ position: 'absolute', top: 16, right: 32 }}>
                    {manageLink ? (
                        <Link to={manageLink}>
                            <Button
                                style={{
                                    border: `1.5px solid ${P}`,
                                    color: P,
                                    borderRadius: 6,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    backgroundColor: '#fff',
                                }}
                            >
                                {manageLabel}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            style={{
                                border: `1.5px solid ${P}`,
                                color: P,
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 500,
                                backgroundColor: '#fff',
                            }}
                        >
                            {manageLabel}
                        </Button>
                    )}
                </div>

                {renderForm()}
            </div>

            {/* ── Footer ── */}
            <Footer />
        </Content>
    );
};

export default CorporateTravel;
