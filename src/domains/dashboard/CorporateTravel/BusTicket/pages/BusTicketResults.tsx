import { useMemo, useState } from 'react';

import { Button, Checkbox, DatePicker, Drawer, Flex, Select, Slider, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    BusAmenity, BusResultEntry, BusSlot, BusType, mockBusResults,
} from '@src/mock/data';

import BoardingDropDrawer from '../components/BoardingDropDrawer';
import PoliciesDrawer from '../components/PoliciesDrawer';
import {
    ArrowLeftIcon, BedIcon, ChargingIcon, FilmIcon,
    LocationIcon, PhoneIcon, SearchIcon, ShieldCheckIcon, SwapHorizIcon,
    WaterIcon, WifiIcon,
} from '../components/SolarIcons';

const { Text } = Typography;

const P   = '#FF4F4F';
const TXT = '#171717';
const HLP = '#8C8C8C';
const BDR = '#E8E8E8';

// ─── Static data ──────────────────────────────────────────────────────────────

const CITIES = [
    'Bangalore', 'Mumbai', 'Chennai', 'Surat', 'Delhi',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh',
];
const CITY_OPTS = CITIES.map(c => ({ label: c, value: c }));

const AMENITY_ICONS: Record<BusAmenity, React.ReactNode> = {
    'Blankets':                  <BedIcon      size={12} color={HLP} />,
    'Charging Point':            <ChargingIcon size={12} color={HLP} />,
    'Emergency Contact Number':  <PhoneIcon    size={12} color={HLP} />,
    'Movie':                     <FilmIcon     size={12} color={HLP} />,
    'Wifi':                      <WifiIcon     size={12} color={HLP} />,
    'Water Bottle':              <WaterIcon    size={12} color={HLP} />,
};

const AMENITY_LIST: BusAmenity[] = ['Blankets', 'Charging Point', 'Wifi', 'Movie', 'Water Bottle'];

const MIN_PRICE = Math.min(...mockBusResults.map(b => b.price));
const MAX_PRICE = Math.max(...mockBusResults.map(b => b.price));

// ─── Types ────────────────────────────────────────────────────────────────────

type QuickFilter = BusType | 'LiveTracking' | 'FreeCancellation' | 'HighRated';
type Sort = 'ratings' | 'departure' | 'price' | 'fastest';

// ─── Utilities ────────────────────────────────────────────────────────────────

const parseDuration = (d: string): number => {
    const m = d.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/);
    return m ? parseInt(m[1]) * 60 + parseInt(m[2] ?? '0') : 9999;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Quick pill — Today/Tomorrow in search bar
const QuickPill = ({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        style={{
            padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
            userSelect: 'none', fontSize: 12, whiteSpace: 'nowrap',
            border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
            color: active ? P : HLP,
        }}
    >
        {label}
    </div>
);

// Rectangular filter pill — for quick filter chips
const FilterPill = ({
    label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
            userSelect: 'none', fontSize: 12,
            border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
            color: active ? P : TXT,
            transition: 'all 0.15s',
        }}
    >
        {label}
    </div>
);

// Slot icons for departure time grid
const MoonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);
const SunriseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="4" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 13h2M20 13h2M4.22 21.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        <path d="M5 20h14" />
    </svg>
);
const SunIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);
const NightIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round">
        <path d="M17.5 17.5A9 9 0 116.5 6.5a7 7 0 0011 11z" />
    </svg>
);

const SLOT_ICONS: Record<BusSlot, React.ReactNode> = {
    before6: <MoonIcon />,
    '6to12':   <SunriseIcon />,
    '12to6':   <SunIcon />,
    after6:  <NightIcon />,
};

const DEP_SLOTS: { key: BusSlot; label: string; range: string }[] = [
    { key: 'before6', label: 'Before 6AM', range: '00:00–05:59' },
    { key: '6to12',   label: '6AM–12PM',   range: '06:00–11:59' },
    { key: '12to6',   label: '12PM–6PM',   range: '12:00–17:59' },
    { key: 'after6',  label: 'After 6PM',  range: '18:00–23:59' },
];

// Quick select card (Cheapest / Earliest / Fastest)
const QuickSelectCard = ({
    icon, label, sub, active, onClick,
}: { icon: React.ReactNode; label: string; sub: string; active: boolean; onClick: () => void }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 6, cursor: 'pointer',
            border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
            transition: 'all 0.15s',
        }}
    >
        <div style={{ flexShrink: 0, opacity: active ? 1 : 0.5 }}>{icon}</div>
        <Flex vertical gap={1}>
            <Text style={{ fontSize: 13, fontWeight: 600, color: active ? P : TXT, lineHeight: 1.2 }}>{label}</Text>
            <Text style={{ fontSize: 12, color: HLP, lineHeight: 1.2 }}>{sub}</Text>
        </Flex>
    </div>
);

// Quick select icons
const PriceDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="19" /><polyline points="5 12 12 19 19 12" />
    </svg>
);
const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const LightningIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HLP} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

// Bus icon for operator column
const BusCardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="13" rx="2.5" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="7" y1="5" x2="7" y2="10" />
        <line x1="17" y1="5" x2="17" y2="10" />
        <circle cx="7.5" cy="19" r="1.5" />
        <circle cx="16.5" cy="19" r="1.5" />
    </svg>
);

// ─── Bus Result Card ──────────────────────────────────────────────────────────

const BusCard = ({
    bus, onViewSeats,
}: {
    bus: BusResultEntry;
    onViewSeats: (bus: BusResultEntry) => void;
}) => {
    const [boardingOpen, setBoardingOpen] = useState(false);
    const [policiesOpen, setPoliciesOpen] = useState(false);

    return (
        <>
            <div
                className="bus-result-card"
                style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${BDR}`,
                    borderRadius: 6,
                    padding: '16px 20px',
                    marginBottom: 8,
                    position: 'relative',
                    transition: 'box-shadow 0.2s ease',
                }}
            >
                {/* Offer badge */}
                {bus.offerTag && (
                    <div style={{
                        position: 'absolute', top: 0, right: 16,
                        backgroundColor: P, color: '#fff',
                        fontSize: 11, fontWeight: 600,
                        padding: '2px 10px',
                        borderRadius: '0 0 6px 6px',
                    }}>
                        {bus.offerTag}
                    </div>
                )}

                {/* 5-column grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.6fr 2fr 1.6fr 2fr', gap: 8, alignItems: 'center' }}>

                    {/* ── Operator ── */}
                    <div style={{ minWidth: 0 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 8,
                            backgroundColor: '#FFF1F0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 8,
                        }}>
                            <BusCardIcon />
                        </div>
                        <Flex align="center" gap={4} style={{ marginBottom: 2 }}>
                            <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, lineHeight: 1.2 }}>
                                {bus.operator}
                            </Text>
                            <ShieldCheckIcon size={12} color={HLP} />
                        </Flex>
                        <Text style={{ fontSize: 12, color: HLP, display: 'block', marginBottom: 6 }}>
                            {bus.busType}
                        </Text>
                        <Flex gap={4} wrap="wrap" style={{ marginBottom: 4 }}>
                            {bus.amenities.slice(0, 3).map(a => (
                                <Tag key={a} style={{ fontSize: 11, margin: 0, borderRadius: 4, padding: '0 6px' }}>
                                    {a}
                                </Tag>
                            ))}
                        </Flex>
                        {bus.freeCancellation && (
                            <div style={{
                                display: 'inline-flex',
                                border: `1px solid ${P}`, backgroundColor: '#FFF1F0',
                                color: P, fontSize: 11, borderRadius: 4,
                                padding: '1px 6px', marginTop: 2,
                            }}>
                                Free Cancellation
                            </div>
                        )}
                    </div>

                    {/* ── Departure ── */}
                    <Flex vertical align="center" gap={2}>
                        <Text style={{ fontSize: 12, color: HLP }}>{bus.departure.city}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1.1 }}>
                            {bus.departure.time}
                        </Text>
                        <Text style={{ fontSize: 12, color: HLP }}>{bus.departure.date}</Text>
                    </Flex>

                    {/* ── Duration / centre ── */}
                    <Flex vertical align="center" gap={4}>
                        <div style={{
                            backgroundColor: bus.rating >= 4 ? '#52C41A' : '#FAAD14',
                            color: '#fff', borderRadius: 4,
                            padding: '3px 8px', fontSize: 12, fontWeight: 700,
                            display: 'flex', alignItems: 'center', gap: 3,
                        }}>
                            ★ {bus.rating.toFixed(1)}
                        </div>
                        <Text style={{ fontSize: 11, color: HLP }}>{bus.totalRatings} ratings</Text>
                        <div style={{ width: '70%', borderTop: '1.5px dashed #E8E8E8' }} />
                        <Text style={{ fontSize: 13, color: HLP }}>{bus.duration}</Text>
                        <Text style={{ fontSize: 12, color: HLP }}>
                            {bus.seatsLeft} seats{bus.singleSeats > 0 ? ` · ${bus.singleSeats} single` : ''}
                        </Text>
                        {bus.isLiveTrackable && (
                            <Flex align="center" gap={3}>
                                <LocationIcon size={11} color="#52C41A" />
                                <Text style={{ fontSize: 11, color: '#52C41A' }}>Live Tracking</Text>
                            </Flex>
                        )}
                    </Flex>

                    {/* ── Arrival ── */}
                    <Flex vertical align="center" gap={2}>
                        <Text style={{ fontSize: 12, color: HLP }}>{bus.arrival.city}</Text>
                        <Text style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1.1 }}>
                            {bus.arrival.time}
                        </Text>
                        <Text style={{ fontSize: 12, color: HLP }}>{bus.arrival.date}</Text>
                    </Flex>

                    {/* ── Price ── */}
                    <Flex vertical align="flex-end" gap={2}>
                        <Text style={{ fontSize: 11, color: HLP }}>Price</Text>
                        {bus.originalPrice > bus.price && (
                            <Text style={{ fontSize: 12, color: HLP, textDecoration: 'line-through', lineHeight: 1 }}>
                                ₹{bus.originalPrice.toLocaleString()}
                            </Text>
                        )}
                        <Text style={{ fontSize: 18, fontWeight: 700, color: TXT, lineHeight: 1.1 }}>
                            ₹{bus.price.toLocaleString()}
                        </Text>
                        <Text style={{ fontSize: 11, color: HLP, marginBottom: 8 }}>Onwards</Text>
                        <Button
                            type="primary"
                            danger
                            onClick={() => onViewSeats(bus)}
                            style={{ borderRadius: 6, fontWeight: 600, fontSize: 12, padding: '0 20px', height: 36 }}
                        >
                            View Seats
                        </Button>
                    </Flex>
                </div>

                {/* Bottom row */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginTop: 12, paddingTop: 10,
                    borderTop: '1px solid #F5F5F5',
                }}>
                    <Flex gap={0} align="center">
                        <Text
                            onClick={() => setBoardingOpen(true)}
                            style={{ fontSize: 12, color: P, cursor: 'pointer' }}
                        >
                            Boarding &amp; Drop
                        </Text>
                        <Text style={{ fontSize: 12, color: BDR, margin: '0 8px' }}>|</Text>
                        <Text
                            onClick={() => setPoliciesOpen(true)}
                            style={{ fontSize: 12, color: P, cursor: 'pointer' }}
                        >
                            Policies
                        </Text>
                    </Flex>
                    <Text
                        onClick={() => setPoliciesOpen(true)}
                        style={{ fontSize: 12, color: P, cursor: 'pointer' }}
                    >
                        Bus Details &rsaquo;
                    </Text>
                </div>
            </div>

            <BoardingDropDrawer open={boardingOpen} onClose={() => setBoardingOpen(false)} />
            <PoliciesDrawer     open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const QUICK_PILLS: { key: QuickFilter; label: string }[] = [
    { key: 'AC',               label: 'AC'               },
    { key: 'NonAC',            label: 'Non AC'            },
    { key: 'Sleeper',          label: 'Sleeper'           },
    { key: 'Seater',           label: 'Seater'            },
    { key: 'LiveTracking',     label: 'Live Tracking'     },
    { key: 'FreeCancellation', label: 'Free Cancellation' },
    { key: 'HighRated',        label: 'High Rated'        },
];

type RouteState = Record<string, any>;

const BusTicketResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as RouteState;

    // ── Search state ──
    const [source, setSource]         = useState<string>(rs.source ?? 'Bangalore');
    const [dest, setDest]             = useState<string>(rs.destination ?? 'Mumbai');
    const [travelDate, setTravelDate] = useState<Dayjs>(
        rs.date ? dayjs(rs.date, 'DD MMM') : dayjs()
    );
    const [activeSource, setActiveSource] = useState(rs.source ?? 'Bangalore');
    const [activeDest, setActiveDest]     = useState(rs.destination ?? 'Mumbai');

    // ── Filter state ──
    const [quickFilters,    setQuickFilters]    = useState<QuickFilter[]>([]);
    const [depSlots,        setDepSlots]        = useState<BusSlot[]>([]);
    const [amenityFilter,   setAmenityFilter]   = useState<BusAmenity[]>([]);
    const [priceRange,      setPriceRange]      = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
    const [sort,            setSort]            = useState<Sort>('departure');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // ── Pill counts ──
    const counts: Record<QuickFilter, number> = useMemo(() => ({
        AC:               mockBusResults.filter(b => b.type === 'AC').length,
        NonAC:            mockBusResults.filter(b => b.type === 'NonAC').length,
        Sleeper:          mockBusResults.filter(b => b.type === 'Sleeper').length,
        Seater:           mockBusResults.filter(b => b.type === 'Seater').length,
        LiveTracking:     mockBusResults.filter(b => b.isLiveTrackable).length,
        FreeCancellation: mockBusResults.filter(b => b.freeCancellation).length,
        HighRated:        mockBusResults.filter(b => b.rating >= 4.0).length,
    }), []);

    // ── Quick select presets ──
    const cheapestBus = useMemo(() =>
        [...mockBusResults].sort((a, b) => a.price - b.price)[0], []);
    const earliestBus = useMemo(() =>
        [...mockBusResults].sort((a, b) => a.departure.time.localeCompare(b.departure.time))[0], []);
    const fastestBus  = useMemo(() =>
        [...mockBusResults].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration))[0], []);

    // ── Toggles ──
    const toggleQuick   = (k: QuickFilter) =>
        setQuickFilters(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
    const toggleSlot    = (k: BusSlot) =>
        setDepSlots(prev => prev.includes(k) ? prev.filter(x => x !== k) : [...prev, k]);
    const toggleAmenity = (a: BusAmenity) =>
        setAmenityFilter(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

    const handleReset = () => {
        setQuickFilters([]);
        setDepSlots([]);
        setAmenityFilter([]);
        setPriceRange([MIN_PRICE, MAX_PRICE]);
        setSort('departure');
    };

    // ── Filtered + sorted ──
    const buses = useMemo(() => {
        let list = mockBusResults.filter(b => {
            if (quickFilters.includes('AC')               && b.type !== 'AC')       return false;
            if (quickFilters.includes('NonAC')            && b.type !== 'NonAC')    return false;
            if (quickFilters.includes('Sleeper')          && b.type !== 'Sleeper')  return false;
            if (quickFilters.includes('Seater')           && b.type !== 'Seater')   return false;
            if (quickFilters.includes('LiveTracking')     && !b.isLiveTrackable)    return false;
            if (quickFilters.includes('FreeCancellation') && !b.freeCancellation)   return false;
            if (quickFilters.includes('HighRated')        && b.rating < 4.0)        return false;
            if (depSlots.length > 0 && !depSlots.includes(b.departureSlot))        return false;
            if (amenityFilter.length > 0 && !amenityFilter.every(a => b.amenities.includes(a))) return false;
            if (b.price < priceRange[0] || b.price > priceRange[1])                return false;
            return true;
        });
        if (sort === 'ratings')   list = [...list].sort((a, b) => b.rating - a.rating);
        if (sort === 'price')     list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'fastest')   list = [...list].sort((a, b) => parseDuration(a.duration) - parseDuration(b.duration));
        if (sort === 'departure') list = [...list].sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        return list;
    }, [quickFilters, depSlots, amenityFilter, priceRange, sort]);

    const handleSearch = () => {
        setActiveSource(source);
        setActiveDest(dest);
    };

    const handleViewSeats = (bus: BusResultEntry) => {
        navigate('/corporate-travel/bus-ticket/seats', {
            state: {
                ...rs, source, destination: dest,
                date: travelDate.format('DD MMM'),
                bus, selectedSeats: [], totalAmount: bus.price,
            },
        });
    };

    const isToday    = travelDate.isSame(dayjs(), 'day');
    const isTomorrow = travelDate.isSame(dayjs().add(1, 'day'), 'day');

    // ── Filter panel JSX (shared by sidebar + mobile drawer) ──
    const filterPanelContent = (
        <Flex vertical gap={20}>
            <Flex justify="space-between" align="center">
                <Text style={{ fontSize: 15, fontWeight: 600, color: TXT }}>Filter</Text>
                <Text onClick={handleReset} style={{ fontSize: 13, color: P, cursor: 'pointer' }}>Reset</Text>
            </Flex>

            {/* Quick filter pills */}
            <Flex gap={6} wrap="wrap">
                {QUICK_PILLS.map(p => (
                    <FilterPill
                        key={p.key}
                        label={`${p.label} (${counts[p.key]})`}
                        active={quickFilters.includes(p.key)}
                        onClick={() => toggleQuick(p.key)}
                    />
                ))}
            </Flex>

            {/* Price slider */}
            <div>
                <Text style={{ fontSize: 13, fontWeight: 600, color: TXT, display: 'block', marginBottom: 8 }}>Price</Text>
                <Slider
                    range
                    value={priceRange}
                    min={MIN_PRICE}
                    max={MAX_PRICE}
                    onChange={(v) => setPriceRange(v as [number, number])}
                    styles={{ track: { backgroundColor: P }, handle: { borderColor: P } }}
                    tooltip={{ formatter: v => `₹${v}` }}
                />
                <Flex gap={8} style={{ marginTop: 4 }}>
                    <div style={{ flex: 1, padding: '6px 8px', border: '1px solid #F0F0F0', borderRadius: 6 }}>
                        <Text style={{ fontSize: 11, color: HLP, display: 'block', lineHeight: 1.3 }}>Min price</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: TXT }}>₹{priceRange[0].toLocaleString()}</Text>
                    </div>
                    <div style={{ flex: 1, padding: '6px 8px', border: '1px solid #F0F0F0', borderRadius: 6 }}>
                        <Text style={{ fontSize: 11, color: HLP, display: 'block', lineHeight: 1.3 }}>Max price</Text>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: TXT }}>₹{priceRange[1].toLocaleString()}</Text>
                    </div>
                </Flex>
            </div>

            {/* Quick select cards */}
            <div>
                <Text style={{ fontSize: 13, fontWeight: 600, color: TXT, display: 'block', marginBottom: 8 }}>Best option</Text>
                <Flex vertical gap={6}>
                    <QuickSelectCard
                        icon={<PriceDownIcon />}
                        label="Cheapest"
                        sub={`₹${cheapestBus?.price.toLocaleString()} · ${cheapestBus?.duration}`}
                        active={sort === 'price'}
                        onClick={() => setSort('price')}
                    />
                    <QuickSelectCard
                        icon={<ClockIcon />}
                        label="Earliest"
                        sub={`${earliestBus?.departure.time} · ₹${earliestBus?.price.toLocaleString()}`}
                        active={sort === 'departure'}
                        onClick={() => setSort('departure')}
                    />
                    <QuickSelectCard
                        icon={<LightningIcon />}
                        label="Fastest"
                        sub={`${fastestBus?.duration} · ₹${fastestBus?.price.toLocaleString()}`}
                        active={sort === 'fastest'}
                        onClick={() => setSort('fastest')}
                    />
                </Flex>
            </div>

            {/* Departure time 2×2 grid */}
            <div>
                <Text style={{ fontSize: 13, fontWeight: 600, color: TXT, display: 'block', marginBottom: 8 }}>Departure time</Text>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {DEP_SLOTS.map(s => {
                        const active = depSlots.includes(s.key);
                        return (
                            <div
                                key={s.key}
                                onClick={() => toggleSlot(s.key)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '10px 6px', borderRadius: 6, cursor: 'pointer',
                                    border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
                                    backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
                                    transition: 'all 0.15s',
                                }}
                            >
                                {SLOT_ICONS[s.key]}
                                <Text style={{ fontSize: 12, fontWeight: 500, color: active ? P : TXT, marginTop: 4, lineHeight: 1.2, textAlign: 'center' }}>
                                    {s.label}
                                </Text>
                                <Text style={{ fontSize: 10, color: HLP, lineHeight: 1.3, textAlign: 'center' }}>
                                    {s.range}
                                </Text>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <Text style={{ fontSize: 13, fontWeight: 600, color: TXT, display: 'block', marginBottom: 8 }}>Amenities</Text>
                <Flex vertical gap={8}>
                    {AMENITY_LIST.map(a => (
                        <Checkbox
                            key={a}
                            checked={amenityFilter.includes(a)}
                            onChange={() => toggleAmenity(a)}
                            style={{ fontSize: 13, color: TXT }}
                        >
                            <Flex align="center" gap={6}>
                                {AMENITY_ICONS[a]}
                                <span style={{ fontSize: 13, color: TXT }}>{a}</span>
                            </Flex>
                        </Checkbox>
                    ))}
                </Flex>
            </div>
        </Flex>
    );

    return (
        <Flex vertical gap={12}>
            <style>{`.bus-result-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.10); }`}</style>

            {/* ══ COMPACT SEARCH BAR ══ */}
            <Flex
                align="center"
                style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${BDR}`,
                    borderRadius: 8,
                    padding: '8px 20px',
                    gap: 0,
                    minHeight: 64,
                }}
            >
                {/* Back */}
                <div
                    onClick={() => navigate('/corporate-travel')}
                    style={{
                        width: 32, height: 32, borderRadius: '50%',
                        border: `1px solid ${BDR}`, backgroundColor: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0, marginRight: 12,
                    }}
                >
                    <ArrowLeftIcon size={16} color={TXT} />
                </div>

                {/* One Way label */}
                <div style={{ paddingRight: 16, borderRight: `1px solid ${BDR}`, flexShrink: 0 }}>
                    <Text style={{ fontSize: 13, fontWeight: 600, color: TXT, whiteSpace: 'nowrap' }}>One Way</Text>
                </div>

                {/* From */}
                <Flex vertical gap={0} style={{ flex: '1 1 100px', padding: '0 14px', borderRight: `1px solid ${BDR}`, minWidth: 90 }}>
                    <Text style={{ fontSize: 11, color: HLP, lineHeight: '18px' }}>From</Text>
                    <Select
                        showSearch
                        value={source}
                        onChange={setSource}
                        options={CITY_OPTS.filter(o => o.value !== dest)}
                        variant="borderless"
                        style={{ padding: 0, fontWeight: 600, fontSize: 14, marginLeft: -11, width: 'calc(100% + 11px)' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                        popupMatchSelectWidth={false}
                    />
                </Flex>

                {/* Swap */}
                <div
                    onClick={() => { const t = source; setSource(dest); setDest(t); }}
                    style={{ padding: '0 10px', cursor: 'pointer', flexShrink: 0 }}
                >
                    <SwapHorizIcon size={20} color={P} />
                </div>

                {/* To */}
                <Flex vertical gap={0} style={{ flex: '1 1 100px', padding: '0 14px', borderLeft: `1px solid ${BDR}`, borderRight: `1px solid ${BDR}`, minWidth: 90 }}>
                    <Text style={{ fontSize: 11, color: HLP, lineHeight: '18px' }}>To</Text>
                    <Select
                        showSearch
                        value={dest}
                        onChange={setDest}
                        options={CITY_OPTS.filter(o => o.value !== source)}
                        variant="borderless"
                        style={{ padding: 0, fontWeight: 600, fontSize: 14, marginLeft: -11, width: 'calc(100% + 11px)' }}
                        filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                        popupMatchSelectWidth={false}
                    />
                </Flex>

                {/* Date */}
                <Flex vertical gap={0} style={{ flex: '0 0 160px', padding: '0 14px', borderRight: `1px solid ${BDR}` }}>
                    <Text style={{ fontSize: 11, color: HLP, lineHeight: '18px' }}>Date of Journey</Text>
                    <DatePicker
                        value={travelDate}
                        onChange={d => d && setTravelDate(d)}
                        disabledDate={c => c && c < dayjs().startOf('day')}
                        variant="borderless"
                        format="DD MMM YYYY"
                        allowClear={false}
                        style={{ padding: 0, fontWeight: 600, fontSize: 14, marginLeft: -11 }}
                    />
                </Flex>

                {/* Today / Tomorrow pills */}
                <Flex gap={6} style={{ padding: '0 12px', flexShrink: 0 }}>
                    <QuickPill label="Today"    active={isToday}    onClick={() => setTravelDate(dayjs())} />
                    <QuickPill label="Tomorrow" active={isTomorrow} onClick={() => setTravelDate(dayjs().add(1, 'day'))} />
                </Flex>

                {/* Search button */}
                <div
                    onClick={handleSearch}
                    style={{
                        width: 40, height: 40, borderRadius: '50%',
                        backgroundColor: P,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                    }}
                >
                    <SearchIcon size={18} color="#fff" />
                </div>
            </Flex>

            {/* Route summary */}
            <Flex align="center" gap={10}>
                <Text style={{ fontSize: 15, fontWeight: 600, color: TXT }}>
                    {activeSource} → {activeDest}
                </Text>
                <Text style={{ fontSize: 13, color: HLP }}>{buses.length} buses found</Text>
            </Flex>

            {/* ══ TWO-COLUMN LAYOUT ══ */}
            <div className="flex gap-6 items-start">

                {/* ── Filter Panel (desktop) ── */}
                <div
                    className="hidden md:block sticky"
                    style={{
                        top: 16, width: 260, flexShrink: 0,
                        paddingRight: 20,
                        borderRight: `1px solid #F0F0F0`,
                    }}
                >
                    {filterPanelContent}
                </div>

                {/* ── Results column ── */}
                <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Column headers */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1.6fr 2fr 1.6fr 2fr',
                        gap: 8,
                        backgroundColor: '#F4F6FA',
                        borderRadius: 4,
                        padding: '0 20px',
                        height: 40,
                        alignItems: 'center',
                        marginBottom: 8,
                    }}>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: HLP, textTransform: 'uppercase', letterSpacing: 0.3 }}>
                            Operator
                        </Text>
                        <Text
                            onClick={() => setSort('departure')}
                            style={{ fontSize: 12, fontWeight: 600, color: sort === 'departure' ? P : HLP, textTransform: 'uppercase', letterSpacing: 0.3, cursor: 'pointer', textAlign: 'center' }}
                        >
                            Departure {sort === 'departure' && '↑'}
                        </Text>
                        <Text
                            onClick={() => setSort('fastest')}
                            style={{ fontSize: 12, fontWeight: 600, color: sort === 'fastest' ? P : HLP, textTransform: 'uppercase', letterSpacing: 0.3, cursor: 'pointer', textAlign: 'center' }}
                        >
                            Duration {sort === 'fastest' && '↑'}
                        </Text>
                        <Text style={{ fontSize: 12, fontWeight: 600, color: HLP, textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center' }}>
                            Arrival
                        </Text>
                        <Text
                            onClick={() => setSort('price')}
                            style={{ fontSize: 12, fontWeight: 600, color: sort === 'price' ? P : HLP, textTransform: 'uppercase', letterSpacing: 0.3, cursor: 'pointer', textAlign: 'right' }}
                        >
                            Price {sort === 'price' && '↓'}
                        </Text>
                    </div>

                    {/* Mobile filter button */}
                    <div className="md:hidden mb-3">
                        <Button
                            onClick={() => setMobileFiltersOpen(true)}
                            style={{ borderColor: BDR, borderRadius: 6, fontSize: 13 }}
                        >
                            Filters
                        </Button>
                    </div>

                    {/* Bus cards */}
                    {buses.length === 0 ? (
                        <Flex
                            align="center" justify="center"
                            style={{
                                backgroundColor: '#FFFFFF', border: `1px solid ${BDR}`,
                                borderRadius: 6, padding: '64px 24px',
                            }}
                        >
                            <Text style={{ color: HLP }}>No buses match your filters. Try adjusting the filters.</Text>
                        </Flex>
                    ) : (
                        buses.map(bus => (
                            <BusCard
                                key={bus.id}
                                bus={bus}
                                onViewSeats={handleViewSeats}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ══ MOBILE FILTER DRAWER ══ */}
            <Drawer
                title={
                    <Flex justify="space-between" align="center">
                        <span style={{ fontSize: 15, fontWeight: 600, color: TXT }}>Filter buses</span>
                        <Text onClick={handleReset} style={{ fontSize: 13, color: P, cursor: 'pointer' }}>Reset</Text>
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
                {filterPanelContent}
            </Drawer>
        </Flex>
    );
};

export default BusTicketResults;
