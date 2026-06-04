import { useMemo, useState } from 'react';

import { DownOutlined, FilterOutlined, SwapOutlined, UpOutlined } from '@ant-design/icons';
import {
    Button, Checkbox, Col, Divider, Drawer, Flex, InputNumber, Row, Select, Slider,
    Tag, Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { BusAmenity, BusResultEntry, BusSlot, BusType, mockBusResults } from '@src/mock/data';

import BoardingDropDrawer from '../components/BoardingDropDrawer';
import PoliciesDrawer from '../components/PoliciesDrawer';
import {
    ArrowRightIcon, BedIcon, BusOutlineIcon, ChairIcon, ChargingIcon,
    CloudIcon, FilmIcon, LightningIcon, LocationIcon, MoonIcon, MoneyIcon, PhoneIcon,
    SnowflakeIcon, SunriseIcon, SunIcon, WaterIcon, WifiIcon,
} from '../components/SolarIcons';

const { Text } = Typography;

// ─── Design tokens ────────────────────────────────────────────────────────────
const P   = '#FF4F4F';
const TXT = '#171717';
const HLP = '#8C8C8C';
const BDR = '#E8E8E8';

// ─── City → State lookup ──────────────────────────────────────────────────────
const CITY_STATE: Record<string, string> = {
    Bangalore: 'Karnataka',  Mumbai: 'Maharashtra', Chennai: 'Tamil Nadu',
    Delhi: 'Delhi',          Hyderabad: 'Telangana', Pune: 'Maharashtra',
    Kolkata: 'West Bengal',  Ahmedabad: 'Gujarat',   Jaipur: 'Rajasthan',
    Kochi: 'Kerala',         Chandigarh: 'Punjab',   Surat: 'Gujarat',
};
const cityLabel = (c: string) => `${c}, ${CITY_STATE[c] ?? 'India'}`;

// ─── Duration parser ──────────────────────────────────────────────────────────
const parseDurMin = (d: string) => {
    const h = d.match(/(\d+)h/);
    const m = d.match(/(\d+)m/);
    return (h ? +h[1] : 0) * 60 + (m ? +m[1] : 0);
};

// ─── Amenity config ───────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<BusAmenity, React.ReactNode> = {
    Blankets:                 <BedIcon      size={13} color={HLP} />,
    'Charging Point':         <ChargingIcon size={13} color={HLP} />,
    'Emergency Contact Number': <PhoneIcon  size={13} color={HLP} />,
    Movie:                    <FilmIcon     size={13} color={HLP} />,
    Wifi:                     <WifiIcon     size={13} color={HLP} />,
    'Water Bottle':           <WaterIcon    size={13} color={HLP} />,
};
const ALL_AMENITIES: BusAmenity[] = [
    'Blankets', 'Charging Point', 'Wifi', 'Movie', 'Water Bottle', 'Emergency Contact Number',
];

// ─── Departure Time config ────────────────────────────────────────────────────
const TIME_SLOTS: { key: BusSlot; label: string; range: string; icon: React.ReactNode }[] = [
    { key: 'Morning',   label: 'Morning',   range: '00:00–11:59', icon: <SunriseIcon size={18} /> },
    { key: 'Noon',      label: 'Noon',      range: '12:00–14:59', icon: <SunIcon     size={18} /> },
    { key: 'Afternoon', label: 'Afternoon', range: '15:00–17:59', icon: <CloudIcon   size={18} /> },
    { key: 'Night',     label: 'Night',     range: '18:00–23:59', icon: <MoonIcon    size={18} /> },
];

// ─── Bus Type config ──────────────────────────────────────────────────────────
const BUS_TYPES: { key: BusType; label: string; icon: React.ReactNode }[] = [
    { key: 'AC',      label: 'AC',      icon: <SnowflakeIcon size={16} /> },
    { key: 'NonAC',   label: 'Non AC',  icon: <SnowflakeIcon size={16} color={HLP} /> },
    { key: 'Sleeper', label: 'Sleeper', icon: <BedIcon       size={16} /> },
    { key: 'Seater',  label: 'Seater',  icon: <ChairIcon     size={16} /> },
];

// ─── Price range derived from mock data ───────────────────────────────────────
const MIN_PRICE = Math.min(...mockBusResults.map(b => b.price));
const MAX_PRICE = Math.max(...mockBusResults.map(b => b.price));

// ─── Grid toggle button ───────────────────────────────────────────────────────
const GridToggle = ({
    icon, label, sub, active, onClick,
}: {
    icon: React.ReactNode; label: string; sub: string; active: boolean; onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-1 p-3 cursor-pointer select-none transition-all"
        style={{
            border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
            borderRadius: 8,
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
        }}
    >
        <span style={{ color: active ? P : HLP }}>{icon}</span>
        <Text style={{ fontSize: 12, fontWeight: 600, color: active ? P : TXT, lineHeight: 1 }}>
            {label}
        </Text>
        <Text style={{ fontSize: 11, color: active ? P : HLP, lineHeight: 1 }}>{sub}</Text>
    </div>
);

// ─── Quick Select Card ────────────────────────────────────────────────────────
const QuickCard = ({
    icon, label, sub, active, onClick,
}: {
    icon: React.ReactNode; label: string; sub: string; active: boolean; onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className="flex items-center gap-3 cursor-pointer select-none transition-all"
        style={{
            border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
            borderRadius: 8,
            padding: '10px 12px',
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
        }}
    >
        <span style={{ color: active ? P : HLP, flexShrink: 0 }}>{icon}</span>
        <div>
            <Text style={{ fontSize: 14, fontWeight: 600, color: active ? P : TXT, display: 'block', lineHeight: 1.2 }}>
                {label}
            </Text>
            <Text style={{ fontSize: 12, color: HLP }}>{sub}</Text>
        </div>
    </div>
);

// ─── Filter Panel ─────────────────────────────────────────────────────────────
interface FilterPanelProps {
    priceRange: [number, number];
    setPriceRange: (v: [number, number]) => void;
    quickSelect: string | null;
    setQuickSelect: (v: string | null) => void;
    depTimes: BusSlot[];
    setDepTimes: React.Dispatch<React.SetStateAction<BusSlot[]>>;
    busTypeFilter: BusType[];
    setBusTypeFilter: React.Dispatch<React.SetStateAction<BusType[]>>;
    amenityFilter: BusAmenity[];
    setAmenityFilter: React.Dispatch<React.SetStateAction<BusAmenity[]>>;
    onReset: () => void;
    cheapest: BusResultEntry | undefined;
    fastest: BusResultEntry | undefined;
    nonStop: BusResultEntry | undefined;
}

const FilterPanel = ({
    priceRange, setPriceRange, quickSelect, setQuickSelect,
    depTimes, setDepTimes, busTypeFilter, setBusTypeFilter,
    amenityFilter, setAmenityFilter, onReset,
    cheapest, fastest, nonStop,
}: FilterPanelProps) => {
    const toggleSlot = (key: BusSlot) =>
        setDepTimes(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    const toggleType = (key: BusType) =>
        setBusTypeFilter(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

    return (
        <Flex vertical gap={20}>
            {/* Header */}
            <Flex justify="space-between" align="center">
                <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>Filter</Text>
                <Text
                    onClick={onReset}
                    style={{ fontSize: 14, color: P, cursor: 'pointer' }}
                >
                    Reset
                </Text>
            </Flex>

            <Divider className="my-0" style={{ borderColor: BDR }} />

            {/* Price Range */}
            <div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }} className="block mb-3">
                    Price
                </Text>
                <Slider
                    range
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    value={priceRange}
                    onChange={val => setPriceRange(val as [number, number])}
                    styles={{
                        track: { backgroundColor: P },
                        handle: { borderColor: P },
                    }}
                />
                <Flex gap={8} className="mt-2">
                    <InputNumber
                        prefix="₹"
                        value={priceRange[0]}
                        min={MIN_PRICE}
                        max={priceRange[1]}
                        onChange={v => v !== null && setPriceRange([v, priceRange[1]])}
                        style={{ flex: 1, borderRadius: 6 }}
                        placeholder="Min price"
                    />
                    <InputNumber
                        prefix="₹"
                        value={priceRange[1]}
                        min={priceRange[0]}
                        max={MAX_PRICE}
                        onChange={v => v !== null && setPriceRange([priceRange[0], v])}
                        style={{ flex: 1, borderRadius: 6 }}
                        placeholder="Max price"
                    />
                </Flex>
            </div>

            <Divider className="my-0" style={{ borderColor: BDR }} />

            {/* Quick Select */}
            <Flex vertical gap={8}>
                {cheapest && (
                    <QuickCard
                        icon={<MoneyIcon size={18} />}
                        label="Cheapest"
                        sub={`₹${cheapest.price.toLocaleString()} · ${cheapest.duration}`}
                        active={quickSelect === 'cheapest'}
                        onClick={() => setQuickSelect(quickSelect === 'cheapest' ? null : 'cheapest')}
                    />
                )}
                {nonStop && (
                    <QuickCard
                        icon={<ArrowRightIcon size={18} />}
                        label="Non Stop First"
                        sub={`₹${nonStop.price.toLocaleString()} · ${nonStop.duration}`}
                        active={quickSelect === 'nonstop'}
                        onClick={() => setQuickSelect(quickSelect === 'nonstop' ? null : 'nonstop')}
                    />
                )}
                {fastest && (
                    <QuickCard
                        icon={<LightningIcon size={18} />}
                        label="Fastest"
                        sub={`₹${fastest.price.toLocaleString()} · ${fastest.duration}`}
                        active={quickSelect === 'fastest'}
                        onClick={() => setQuickSelect(quickSelect === 'fastest' ? null : 'fastest')}
                    />
                )}
            </Flex>

            <Divider className="my-0" style={{ borderColor: BDR }} />

            {/* Departure Time */}
            <div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }} className="block mb-3">
                    Departure Time
                </Text>
                <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map(s => (
                        <GridToggle
                            key={s.key}
                            icon={s.icon}
                            label={s.label}
                            sub={s.range}
                            active={depTimes.includes(s.key)}
                            onClick={() => toggleSlot(s.key)}
                        />
                    ))}
                </div>
            </div>

            <Divider className="my-0" style={{ borderColor: BDR }} />

            {/* Bus Type */}
            <div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }} className="block mb-3">
                    Bus Type
                </Text>
                <div className="grid grid-cols-2 gap-2">
                    {BUS_TYPES.map(t => (
                        <GridToggle
                            key={t.key}
                            icon={t.icon}
                            label={t.label}
                            sub=""
                            active={busTypeFilter.includes(t.key)}
                            onClick={() => toggleType(t.key)}
                        />
                    ))}
                </div>
            </div>

            <Divider className="my-0" style={{ borderColor: BDR }} />

            {/* Amenities */}
            <div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }} className="block mb-3">
                    Amenities
                </Text>
                <Flex vertical gap={8}>
                    {ALL_AMENITIES.map(a => (
                        <Checkbox
                            key={a}
                            checked={amenityFilter.includes(a)}
                            onChange={e =>
                                setAmenityFilter(prev =>
                                    e.target.checked ? [...prev, a] : prev.filter(x => x !== a)
                                )
                            }
                        >
                            <Flex align="center" gap={6}>
                                {AMENITY_ICONS[a]}
                                <Text style={{ fontSize: 14, color: TXT }}>{a}</Text>
                            </Flex>
                        </Checkbox>
                    ))}
                </Flex>
            </div>
        </Flex>
    );
};

// ─── Bus Result Card ──────────────────────────────────────────────────────────
const BusCard = ({
    bus, onBookNow,
}: {
    bus: BusResultEntry;
    onBookNow: (bus: BusResultEntry) => void;
}) => {
    const [expanded, setExpanded]         = useState(false);
    const [boardingOpen, setBoardingOpen] = useState(false);
    const [policiesOpen, setPoliciesOpen] = useState(false);

    return (
        <>
            <div
                className="bg-white"
                style={{ border: `1px solid ${BDR}`, borderRadius: 8, padding: '20px 24px', marginBottom: 12 }}
            >
                {/* ── Main row ── */}
                <Row gutter={[0, 16]} align="middle">

                    {/* Bus Info */}
                    <Col xs={24} md={5}>
                        <Flex vertical align="flex-start" gap={4}>
                            <div
                                className="flex items-center justify-center"
                                style={{
                                    width: 48, height: 48, borderRadius: 8,
                                    backgroundColor: '#F5F5F5', flexShrink: 0,
                                }}
                            >
                                <BusOutlineIcon size={24} color={P} />
                            </div>
                            <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, lineHeight: 1.2 }}>
                                {bus.operator}
                            </Text>
                            <Text style={{ fontSize: 12, color: HLP }}>
                                {bus.busType}
                            </Text>
                        </Flex>
                    </Col>

                    {/* Departure */}
                    <Col xs={12} md={5}>
                        <Flex vertical gap={2}>
                            <Text style={{ fontSize: 12, color: HLP }}>{bus.departure.city}</Text>
                            <Text style={{ fontSize: 22, fontWeight: 600, color: TXT, lineHeight: 1 }}>
                                {bus.departure.time}
                            </Text>
                            <Text style={{ fontSize: 12, color: HLP }}>{bus.departure.date}</Text>
                        </Flex>
                    </Col>

                    {/* Duration */}
                    <Col xs={0} md={5}>
                        <Flex vertical align="center" gap={4}>
                            <Flex align="center" className="w-full">
                                <div
                                    className="flex-1"
                                    style={{
                                        height: 1,
                                        borderTop: `1.5px dashed ${P}`,
                                    }}
                                />
                                <div
                                    className="px-3 py-0.5 mx-1"
                                    style={{
                                        border: `1px solid ${BDR}`,
                                        borderRadius: 12,
                                        backgroundColor: '#FAFAFA',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Text style={{ fontSize: 13, color: HLP }}>{bus.duration}</Text>
                                </div>
                                <div
                                    className="flex-1"
                                    style={{ height: 1, borderTop: `1.5px dashed ${P}` }}
                                />
                            </Flex>
                            <Text style={{ fontSize: 12, color: HLP }}>{bus.stops}</Text>
                        </Flex>
                    </Col>

                    {/* Arrival */}
                    <Col xs={12} md={5}>
                        <Flex vertical gap={2} align="flex-end" className="md:items-start">
                            <Text style={{ fontSize: 12, color: HLP }}>{bus.arrival.city}</Text>
                            <Text style={{ fontSize: 22, fontWeight: 600, color: TXT, lineHeight: 1 }}>
                                {bus.arrival.time}
                            </Text>
                            <Text style={{ fontSize: 12, color: HLP }}>{bus.arrival.date}</Text>
                        </Flex>
                    </Col>

                    {/* Price + CTA */}
                    <Col xs={24} md={4}>
                        <Flex vertical gap={4} className="md:items-end">
                            <Text style={{ fontSize: 12, color: HLP }}>Price</Text>
                            <Text style={{ fontSize: 20, fontWeight: 600, color: TXT, lineHeight: 1 }}>
                                ₹ {bus.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </Text>
                            <Button
                                block
                                size="middle"
                                onClick={() => onBookNow(bus)}
                                style={{
                                    backgroundColor: P, borderColor: P, color: '#fff',
                                    borderRadius: 6, fontWeight: 600, fontSize: 13,
                                }}
                            >
                                Book Now
                            </Button>
                            <Flex
                                align="center"
                                gap={4}
                                onClick={() => setExpanded(e => !e)}
                                className="cursor-pointer"
                            >
                                <Text style={{ fontSize: 12, color: P }}>Bus Details</Text>
                                {expanded
                                    ? <UpOutlined style={{ fontSize: 10, color: P }} />
                                    : <DownOutlined style={{ fontSize: 10, color: P }} />
                                }
                            </Flex>
                        </Flex>
                    </Col>
                </Row>

                {/* Mobile duration row */}
                <div className="md:hidden mt-3">
                    <Flex align="center">
                        <div className="flex-1" style={{ height: 1, borderTop: `1.5px dashed ${P}` }} />
                        <div className="px-3 py-0.5 mx-2" style={{ border: `1px solid ${BDR}`, borderRadius: 12 }}>
                            <Text style={{ fontSize: 13, color: HLP }}>{bus.duration} · {bus.stops}</Text>
                        </div>
                        <div className="flex-1" style={{ height: 1, borderTop: `1.5px dashed ${P}` }} />
                    </Flex>
                </div>

                {/* ── Expanded Details ── */}
                {expanded && (
                    <div
                        className="mt-4 pt-4"
                        style={{ borderTop: `1px solid ${BDR}` }}
                    >
                        <Flex align="center" gap={12} className="flex-wrap mb-3">
                            <Tag color={bus.rating >= 4 ? 'success' : 'warning'}>
                                ★ {bus.rating.toFixed(1)} ({bus.totalRatings.toLocaleString()})
                            </Tag>
                            <Text style={{ fontSize: 12, color: HLP }}>
                                {bus.seatsLeft} seats left
                            </Text>
                            {bus.isLiveTrackable && (
                                <Tag color="success" icon={<LocationIcon size={12} color="#52C41A" />}>
                                    &nbsp;Live Tracking
                                </Tag>
                            )}
                            <Text
                                onClick={() => setBoardingOpen(true)}
                                style={{ fontSize: 12, color: P, cursor: 'pointer' }}
                            >
                                Boarding &amp; Drop Points
                            </Text>
                            <Text
                                onClick={() => setPoliciesOpen(true)}
                                style={{ fontSize: 12, color: P, cursor: 'pointer' }}
                            >
                                Policies
                            </Text>
                        </Flex>
                        <Flex gap={6} className="flex-wrap">
                            {bus.amenities.map(a => (
                                <Flex key={a} align="center" gap={4}
                                    className="px-2 py-1"
                                    style={{ border: `1px solid ${BDR}`, borderRadius: 4 }}
                                >
                                    {AMENITY_ICONS[a]}
                                    <Text style={{ fontSize: 12, color: HLP }}>{a}</Text>
                                </Flex>
                            ))}
                        </Flex>
                    </div>
                )}
            </div>

            <BoardingDropDrawer open={boardingOpen} onClose={() => setBoardingOpen(false)} />
            <PoliciesDrawer     open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
        </>
    );
};

// ─── Column Headers ───────────────────────────────────────────────────────────
const ColHeaders = ({
    sortDir,
    onToggleSort,
}: {
    sortDir: 'asc' | 'desc';
    onToggleSort: () => void;
}) => (
    <Row
        gutter={[0, 0]}
        className="hidden md:flex"
        style={{
            padding: '10px 24px',
            backgroundColor: '#FAFAFA',
            borderBottom: `1px solid ${BDR}`,
            borderRadius: '8px 8px 0 0',
            border: `1px solid ${BDR}`,
            marginBottom: -1,
        }}
    >
        {[
            { label: 'OPERATOR', span: 5 },
            { label: 'DEPARTURE', span: 5 },
            { label: 'DURATION', span: 5, center: true },
            { label: 'ARRIVAL', span: 5 },
        ].map(col => (
            <Col key={col.label} span={col.span}>
                <Text
                    className={col.center ? 'block text-center' : ''}
                    style={{ fontSize: 12, fontWeight: 600, color: HLP, letterSpacing: '0.5px' }}
                >
                    {col.label}
                </Text>
            </Col>
        ))}
        <Col span={4}>
            <Flex
                align="center"
                gap={4}
                justify="flex-end"
                onClick={onToggleSort}
                className="cursor-pointer"
            >
                <Text style={{ fontSize: 12, fontWeight: 600, color: P, letterSpacing: '0.5px' }}>
                    PRICE
                </Text>
                {sortDir === 'asc'
                    ? <UpOutlined style={{ fontSize: 10, color: P }} />
                    : <DownOutlined style={{ fontSize: 10, color: P }} />
                }
            </Flex>
        </Col>
    </Row>
);

// ─── Main Component ───────────────────────────────────────────────────────────
type RouteState = Record<string, any>;

const BusTicketResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as RouteState;

    const source      = rs.source      ?? 'Bangalore';
    const destination = rs.destination ?? 'Mumbai';
    const dateStr     = rs.date        ?? dayjs().format('DD MMM');
    const parsedDate  = dayjs(dateStr, 'DD MMM');
    const fullDate    = parsedDate.isValid()
        ? parsedDate.format('DD MMM YYYY, dddd')
        : dateStr;

    // ── Filter state ──
    const [priceRange, setPriceRange]     = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
    const [quickSelect, setQuickSelect]   = useState<string | null>(null);
    const [depTimes, setDepTimes]         = useState<BusSlot[]>([]);
    const [busTypeFilter, setBusTypeFilter] = useState<BusType[]>([]);
    const [amenityFilter, setAmenityFilter] = useState<BusAmenity[]>([]);
    const [sortDir, setSortDir]           = useState<'asc' | 'desc'>('asc');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const handleReset = () => {
        setPriceRange([MIN_PRICE, MAX_PRICE]);
        setQuickSelect(null);
        setDepTimes([]);
        setBusTypeFilter([]);
        setAmenityFilter([]);
        setSortDir('asc');
    };

    // ── Quick-select derived values ──
    const cheapest = [...mockBusResults].sort((a, b) => a.price - b.price)[0];
    const fastest  = [...mockBusResults].sort((a, b) => parseDurMin(a.duration) - parseDurMin(b.duration))[0];
    const nonStop  = mockBusResults.find(b => b.stops === 'Non Stop');

    // ── Filtered + sorted ──
    const buses = useMemo(() => {
        let list = mockBusResults.filter(b => {
            if (b.price < priceRange[0] || b.price > priceRange[1]) return false;
            if (depTimes.length > 0 && !depTimes.includes(b.departureSlot)) return false;
            if (busTypeFilter.length > 0 && !busTypeFilter.includes(b.type)) return false;
            if (amenityFilter.length > 0 && !amenityFilter.every(a => b.amenities.includes(a))) return false;
            if (quickSelect === 'nonstop' && b.stops !== 'Non Stop') return false;
            return true;
        });

        if (quickSelect === 'cheapest') {
            list = [...list].sort((a, b) => a.price - b.price);
        } else if (quickSelect === 'fastest') {
            list = [...list].sort((a, b) => parseDurMin(a.duration) - parseDurMin(b.duration));
        } else {
            list = [...list].sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);
        }
        return list;
    }, [priceRange, depTimes, busTypeFilter, amenityFilter, quickSelect, sortDir]);

    const handleBookNow = (bus: BusResultEntry) => {
        navigate('/corporate-travel/bus-ticket/seats', {
            state: { ...rs, bus, selectedSeats: [], totalAmount: bus.price },
        });
    };

    const filterProps: FilterPanelProps = {
        priceRange, setPriceRange, quickSelect, setQuickSelect,
        depTimes, setDepTimes, busTypeFilter, setBusTypeFilter,
        amenityFilter, setAmenityFilter, onReset: handleReset,
        cheapest, fastest, nonStop,
    };

    return (
        <Flex vertical gap={0}>

            {/* ══ STICKY COMPACT SEARCH BAR ══ */}
            <div
                className="sticky top-0 z-10 bg-white"
                style={{ borderBottom: `1px solid ${BDR}`, padding: '16px 24px', marginBottom: 16 }}
            >
                <Flex align="center" gap={12} className="flex-wrap">
                    {/* Trip type */}
                    <Select
                        value="oneWay"
                        options={[{ label: 'One Way', value: 'oneWay' }]}
                        size="small"
                        style={{ borderRadius: 6, minWidth: 90 }}
                    />

                    <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

                    {/* From */}
                    <Flex vertical gap={0}>
                        <Text style={{ fontSize: 11, color: HLP }}>From</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>
                            {cityLabel(source)}
                        </Text>
                    </Flex>

                    {/* Swap */}
                    <SwapOutlined style={{ color: P, fontSize: 16, cursor: 'pointer' }} />

                    {/* To */}
                    <Flex vertical gap={0}>
                        <Text style={{ fontSize: 11, color: HLP }}>To</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>
                            {cityLabel(destination)}
                        </Text>
                    </Flex>

                    <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

                    {/* Date */}
                    <Flex vertical gap={0}>
                        <Text style={{ fontSize: 11, color: HLP }}>Date</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>{fullDate}</Text>
                    </Flex>

                    <Divider type="vertical" style={{ height: 24, margin: '0 4px' }} />

                    {/* Passengers */}
                    <Flex vertical gap={0}>
                        <Text style={{ fontSize: 11, color: HLP }}>Passengers</Text>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>1 Passenger</Text>
                    </Flex>

                    <div className="flex-1" />

                    {/* Search button */}
                    <Button
                        size="middle"
                        style={{
                            borderColor: P, color: P,
                            borderRadius: 6, fontWeight: 600, fontSize: 14,
                        }}
                    >
                        Search
                    </Button>
                </Flex>
            </div>

            {/* Mobile filter button */}
            <div className="md:hidden px-4 mb-3">
                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setMobileFiltersOpen(true)}
                    style={{ borderColor: BDR, borderRadius: 6 }}
                >
                    Filters
                </Button>
                <Text style={{ fontSize: 13, color: HLP, marginLeft: 12 }}>
                    <span style={{ fontWeight: 600, color: TXT }}>{buses.length}</span>{' '}
                    {buses.length === 1 ? 'bus' : 'buses'} found
                </Text>
            </div>

            {/* ══ MAIN TWO-COLUMN LAYOUT ══ */}
            <Row gutter={[20, 16]} align="top">

                {/* ── Filter Sidebar (desktop) ── */}
                <Col md={6} className="hidden md:block">
                    <div
                        className="bg-white sticky"
                        style={{ top: 80, border: `1px solid ${BDR}`, borderRadius: 8, padding: 20 }}
                    >
                        <FilterPanel {...filterProps} />
                    </div>
                </Col>

                {/* ── Results ── */}
                <Col xs={24} md={18}>
                    {/* Result count */}
                    <Flex justify="space-between" align="center" className="hidden md:flex mb-2 px-1">
                        <Text style={{ fontSize: 14, color: HLP }}>
                            <span style={{ fontWeight: 600, color: TXT }}>{buses.length}</span>{' '}
                            {buses.length === 1 ? 'bus' : 'buses'} found
                        </Text>
                    </Flex>

                    {/* Column headers */}
                    <ColHeaders sortDir={sortDir} onToggleSort={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} />

                    {/* Bus cards */}
                    <div style={buses.length > 0 ? { borderTop: 'none' } : {}}>
                        {buses.length === 0 ? (
                            <Flex
                                align="center" justify="center"
                                className="bg-white py-16"
                                style={{ border: `1px solid ${BDR}`, borderRadius: '0 0 8px 8px' }}
                            >
                                <Text style={{ color: HLP }}>
                                    No buses match your filters. Try adjusting the filters.
                                </Text>
                            </Flex>
                        ) : (
                            buses.map(bus => (
                                <BusCard key={bus.id} bus={bus} onBookNow={handleBookNow} />
                            ))
                        )}
                    </div>
                </Col>
            </Row>

            {/* ══ MOBILE FILTER DRAWER ══ */}
            <Drawer
                title={
                    <Flex justify="space-between" align="center">
                        <span style={{ fontSize: 16, fontWeight: 600, color: TXT }}>Filters</span>
                        <Text onClick={handleReset} style={{ fontSize: 14, color: P, cursor: 'pointer' }}>
                            Reset
                        </Text>
                    </Flex>
                }
                placement="left"
                onClose={() => setMobileFiltersOpen(false)}
                open={mobileFiltersOpen}
                width={300}
                footer={
                    <Button
                        block size="large"
                        onClick={() => setMobileFiltersOpen(false)}
                        style={{ backgroundColor: P, borderColor: P, color: '#fff', borderRadius: 6, fontWeight: 600 }}
                    >
                        Show {buses.length} Buses
                    </Button>
                }
            >
                <FilterPanel {...filterProps} />
            </Drawer>
        </Flex>
    );
};

export default BusTicketResults;
