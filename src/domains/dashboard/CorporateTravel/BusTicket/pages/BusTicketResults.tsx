import { useMemo, useState } from 'react';

import { Button, Checkbox, DatePicker, Drawer, Flex, Select, Tag, Typography } from 'antd';
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

const CITIES = [
    'Bangalore', 'Mumbai', 'Chennai', 'Surat', 'Delhi',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh',
];
const CITY_OPTS = CITIES.map(c => ({ label: c, value: c }));

// ─── Amenity icons ────────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<BusAmenity, React.ReactNode> = {
    'Blankets':                  <BedIcon      size={12} color={HLP} />,
    'Charging Point':            <ChargingIcon size={12} color={HLP} />,
    'Emergency Contact Number':  <PhoneIcon    size={12} color={HLP} />,
    'Movie':                     <FilmIcon     size={12} color={HLP} />,
    'Wifi':                      <WifiIcon     size={12} color={HLP} />,
    'Water Bottle':              <WaterIcon    size={12} color={HLP} />,
};

// ─── Departure slot config ────────────────────────────────────────────────────
const DEP_SLOTS: { key: BusSlot; label: string }[] = [
    { key: 'before6', label: 'Before 6AM' },
    { key: '6to12',   label: '6AM - 12PM' },
    { key: '12to6',   label: '12PM - 6PM' },
    { key: 'after6',  label: 'After 6PM' },
];

// ─── Filter pill type ─────────────────────────────────────────────────────────
type QuickFilter = BusType | 'LiveTracking' | 'FreeCancellation' | 'HighRated';

// ─── Pill button ──────────────────────────────────────────────────────────────
const Pill = ({
    label, active, onClick, icon,
}: {
    label: string; active: boolean; onClick: () => void; icon?: React.ReactNode;
}) => (
    <div
        onClick={onClick}
        style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '5px 12px', borderRadius: 20, cursor: 'pointer',
            userSelect: 'none', fontSize: 13, fontFamily: 'Roboto, sans-serif',
            border: active ? `1px solid ${P}` : `1px solid ${BDR}`,
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
            color: active ? P : TXT,
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap',
        }}
    >
        {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
        {label}
    </div>
);

// ─── Filter Panel ─────────────────────────────────────────────────────────────
interface FilterPanelProps {
    quickFilters: QuickFilter[];
    toggleQuick: (k: QuickFilter) => void;
    depSlots: BusSlot[];
    toggleSlot: (k: BusSlot) => void;
    amenityFilter: BusAmenity[];
    toggleAmenity: (a: BusAmenity) => void;
    onReset: () => void;
    counts: Record<QuickFilter, number>;
}

const QUICK_PILLS: { key: QuickFilter; label: string }[] = [
    { key: 'AC',               label: 'AC' },
    { key: 'NonAC',            label: 'Non AC' },
    { key: 'Sleeper',          label: 'Sleeper' },
    { key: 'Seater',           label: 'Seater' },
    { key: 'LiveTracking',     label: 'Live Tracking' },
    { key: 'FreeCancellation', label: 'Free Cancellation' },
    { key: 'HighRated',        label: 'High Rated' },
];

const AMENITY_LIST: BusAmenity[] = ['Blankets', 'Charging Point', 'Wifi', 'Movie', 'Water Bottle'];

const FilterPanel = ({
    quickFilters, toggleQuick, depSlots, toggleSlot,
    amenityFilter, toggleAmenity, onReset, counts,
}: FilterPanelProps) => (
    <Flex vertical gap={20}>
        <Flex justify="space-between" align="center">
            <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>Filter buses</Text>
            <Text onClick={onReset} style={{ fontSize: 13, color: P, cursor: 'pointer' }}>Reset</Text>
        </Flex>

        {/* Quick filter pills */}
        <Flex gap={8} wrap="wrap">
            {QUICK_PILLS.map(p => (
                <Pill
                    key={p.key}
                    label={`${p.label} (${counts[p.key]})`}
                    active={quickFilters.includes(p.key)}
                    onClick={() => toggleQuick(p.key)}
                />
            ))}
        </Flex>

        {/* Departure time */}
        <div>
            <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, display: 'block', marginBottom: 10 }}>
                Departure time
            </Text>
            <Flex gap={8} wrap="wrap">
                {DEP_SLOTS.map(s => (
                    <Pill
                        key={s.key}
                        label={s.label}
                        active={depSlots.includes(s.key)}
                        onClick={() => toggleSlot(s.key)}
                    />
                ))}
            </Flex>
        </div>

        {/* Amenities */}
        <div>
            <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, display: 'block', marginBottom: 10 }}>
                Amenities
            </Text>
            <Flex vertical gap={8}>
                {AMENITY_LIST.map(a => (
                    <Checkbox
                        key={a}
                        checked={amenityFilter.includes(a)}
                        onChange={e =>
                            toggleAmenity(a)
                        }
                        style={{ fontSize: 13, color: TXT }}
                    >
                        <Flex align="center" gap={6}>
                            {AMENITY_ICONS[a]}
                            <span>{a}</span>
                        </Flex>
                    </Checkbox>
                ))}
            </Flex>
        </div>
    </Flex>
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
                    borderRadius: 12,
                    padding: '20px 24px',
                    marginBottom: 12,
                    position: 'relative',
                    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
            >
                {/* Offer badge — top right */}
                {bus.offerTag && (
                    <div
                        style={{
                            position: 'absolute', top: 0, right: 16,
                            backgroundColor: P, color: '#fff',
                            fontSize: 11, fontWeight: 600,
                            padding: '3px 10px',
                            borderRadius: '0 0 6px 6px',
                        }}
                    >
                        {bus.offerTag}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-4">

                    {/* ── Left: Operator info ── */}
                    <div style={{ flex: '0 0 200px', minWidth: 0 }}>
                        <Flex align="center" gap={6} style={{ marginBottom: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 600, color: TXT, lineHeight: 1.3 }}>
                                {bus.operator}
                            </Text>
                            <ShieldCheckIcon size={14} color={HLP} />
                        </Flex>
                        <Text style={{ fontSize: 12, color: HLP, display: 'block', marginBottom: 8 }}>
                            {bus.busType}
                        </Text>

                        {/* Amenity tags */}
                        <Flex gap={4} wrap="wrap" style={{ marginBottom: 6 }}>
                            {bus.amenities.slice(0, 4).map(a => (
                                <Tag key={a} style={{ fontSize: 11, margin: 0, borderRadius: 4 }}>
                                    {a}
                                </Tag>
                            ))}
                        </Flex>

                        {/* Free Cancellation tag */}
                        {bus.freeCancellation && (
                            <div
                                style={{
                                    display: 'inline-flex', alignItems: 'center',
                                    border: `1px solid ${P}`, backgroundColor: '#FFF1F0',
                                    color: P, fontSize: 11, borderRadius: 4,
                                    padding: '2px 8px', marginTop: 2,
                                }}
                            >
                                Free Cancellation
                            </div>
                        )}

                        {/* Boarding / Policies links */}
                        <Flex gap={12} style={{ marginTop: 8 }}>
                            <Text
                                onClick={() => setBoardingOpen(true)}
                                style={{ fontSize: 11, color: P, cursor: 'pointer' }}
                            >
                                Boarding &amp; Drop
                            </Text>
                            <Text
                                onClick={() => setPoliciesOpen(true)}
                                style={{ fontSize: 11, color: P, cursor: 'pointer' }}
                            >
                                Policies
                            </Text>
                        </Flex>
                    </div>

                    {/* ── Centre: Journey info ── */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>

                        {/* Rating badge */}
                        <Flex vertical align="center" gap={2} style={{ flexShrink: 0 }}>
                            <div
                                style={{
                                    backgroundColor: bus.rating >= 4 ? '#52C41A' : '#FAAD14',
                                    color: '#fff', borderRadius: 4,
                                    padding: '4px 8px', fontSize: 13, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', gap: 4,
                                }}
                            >
                                ★ {bus.rating.toFixed(1)}
                            </div>
                            <Text style={{ fontSize: 11, color: HLP }}>{bus.totalRatings}</Text>
                        </Flex>

                        {/* Departure time */}
                        <Flex vertical gap={2} align="center" style={{ flexShrink: 0 }}>
                            <Text style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1 }}>
                                {bus.departure.time}
                            </Text>
                        </Flex>

                        {/* Duration + seats */}
                        <Flex vertical align="center" gap={4} style={{ flex: 1 }}>
                            <div style={{ width: '100%', height: 1, borderTop: `1.5px dashed ${BDR}` }} />
                            <Text style={{ fontSize: 12, color: HLP }}>
                                {bus.duration}
                                {' · '}
                                {bus.seatsLeft} Seats
                                {bus.singleSeats > 0 && ` (${bus.singleSeats} Single)`}
                            </Text>
                            {bus.isLiveTrackable && (
                                <Flex align="center" gap={4}>
                                    <LocationIcon size={11} color="#52C41A" />
                                    <Text style={{ fontSize: 11, color: '#52C41A' }}>Live Tracking</Text>
                                </Flex>
                            )}
                        </Flex>

                        {/* Arrival time */}
                        <Flex vertical gap={2} align="center" style={{ flexShrink: 0 }}>
                            <Text style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1 }}>
                                {bus.arrival.time}
                            </Text>
                        </Flex>
                    </div>

                    {/* ── Right: Price + CTA ── */}
                    <Flex vertical align="flex-end" justify="center" gap={4} style={{ flexShrink: 0, minWidth: 120 }}>
                        {bus.originalPrice > bus.price && (
                            <Text style={{ fontSize: 13, color: HLP, textDecoration: 'line-through' }}>
                                ₹{bus.originalPrice}
                            </Text>
                        )}
                        <Text style={{ fontSize: 20, fontWeight: 700, color: TXT, lineHeight: 1 }}>
                            ₹{bus.price}
                        </Text>
                        <Text style={{ fontSize: 12, color: HLP }}>Onwards</Text>
                        <Button
                            type="primary"
                            danger
                            onClick={() => onViewSeats(bus)}
                            style={{
                                borderRadius: 8, fontWeight: 600, fontSize: 13,
                                padding: '0 24px', height: 38, marginTop: 4,
                            }}
                        >
                            View Seats
                        </Button>
                    </Flex>
                </div>
            </div>

            <BoardingDropDrawer open={boardingOpen} onClose={() => setBoardingOpen(false)} />
            <PoliciesDrawer     open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
type Sort = 'ratings' | 'departure' | 'price';
type RouteState = Record<string, any>;

const BusTicketResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as RouteState;

    // ── Editable search state ──
    const [source, setSource]     = useState<string>(rs.source ?? 'Bangalore');
    const [dest, setDest]         = useState<string>(rs.destination ?? 'Mumbai');
    const [travelDate, setTravelDate] = useState<Dayjs>(
        rs.date ? dayjs(rs.date, 'DD MMM') : dayjs()
    );

    // ── Active search (what results are shown) ──
    const [activeSource, setActiveSource]   = useState(source);
    const [activeDest, setActiveDest]       = useState(dest);

    // ── Filter state ──
    const [quickFilters, setQuickFilters]   = useState<QuickFilter[]>([]);
    const [depSlots, setDepSlots]           = useState<BusSlot[]>([]);
    const [amenityFilter, setAmenityFilter] = useState<BusAmenity[]>([]);
    const [sort, setSort]                   = useState<Sort>('departure');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // ── Pill counts (from full data, not filtered) ──
    const counts: Record<QuickFilter, number> = useMemo(() => ({
        AC:               mockBusResults.filter(b => b.type === 'AC').length,
        NonAC:            mockBusResults.filter(b => b.type === 'NonAC').length,
        Sleeper:          mockBusResults.filter(b => b.type === 'Sleeper').length,
        Seater:           mockBusResults.filter(b => b.type === 'Seater').length,
        LiveTracking:     mockBusResults.filter(b => b.isLiveTrackable).length,
        FreeCancellation: mockBusResults.filter(b => b.freeCancellation).length,
        HighRated:        mockBusResults.filter(b => b.rating >= 4.0).length,
    }), []);

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
        setSort('departure');
    };

    // ── Filtered + sorted ──
    const buses = useMemo(() => {
        let list = mockBusResults.filter(b => {
            if (quickFilters.includes('AC')               && b.type !== 'AC')      return false;
            if (quickFilters.includes('NonAC')            && b.type !== 'NonAC')   return false;
            if (quickFilters.includes('Sleeper')          && b.type !== 'Sleeper') return false;
            if (quickFilters.includes('Seater')           && b.type !== 'Seater')  return false;
            if (quickFilters.includes('LiveTracking')     && !b.isLiveTrackable)   return false;
            if (quickFilters.includes('FreeCancellation') && !b.freeCancellation)  return false;
            if (quickFilters.includes('HighRated')        && b.rating < 4.0)       return false;
            if (depSlots.length > 0 && !depSlots.includes(b.departureSlot))        return false;
            if (amenityFilter.length > 0 && !amenityFilter.every(a => b.amenities.includes(a))) return false;
            return true;
        });

        if (sort === 'ratings')   list = [...list].sort((a, b) => b.rating - a.rating);
        if (sort === 'price')     list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'departure') list = [...list].sort((a, b) => a.departure.time.localeCompare(b.departure.time));
        return list;
    }, [quickFilters, depSlots, amenityFilter, sort]);

    const handleSearch = () => {
        setActiveSource(source);
        setActiveDest(dest);
    };

    const handleViewSeats = (bus: BusResultEntry) => {
        navigate('/corporate-travel/bus-ticket/seats', {
            state: {
                ...rs,
                source,
                destination: dest,
                date: travelDate.format('DD MMM'),
                bus,
                selectedSeats: [],
                totalAmount: bus.price,
            },
        });
    };

    const filterProps = {
        quickFilters, toggleQuick, depSlots, toggleSlot,
        amenityFilter, toggleAmenity, onReset: handleReset, counts,
    };

    const dateDisplay = travelDate.isValid()
        ? travelDate.format('DD MMM YYYY')
        : dayjs().format('DD MMM YYYY');
    const isToday    = travelDate.isSame(dayjs(), 'day');
    const isTomorrow = travelDate.isSame(dayjs().add(1, 'day'), 'day');

    return (
        <Flex vertical gap={16}>
            <style>{`.bus-result-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.12); transform: scale(1.005); }`}</style>

            {/* ══ SEARCH BAR CARD ══ */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${BDR}`,
                    borderRadius: 12,
                    padding: '16px 24px',
                }}
            >
                <Flex align="center" gap={12} wrap="wrap">

                    {/* Back arrow */}
                    <div
                        onClick={() => navigate('/corporate-travel')}
                        style={{
                            width: 36, height: 36, borderRadius: '50%',
                            border: `1px solid ${BDR}`, backgroundColor: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        <ArrowLeftIcon size={18} color={TXT} />
                    </div>

                    {/* From */}
                    <Flex vertical gap={2} style={{ flex: '1 1 140px', minWidth: 120 }}>
                        <Text style={{ fontSize: 11, color: HLP }}>From</Text>
                        <Select
                            showSearch
                            value={source}
                            onChange={setSource}
                            options={CITY_OPTS.filter(o => o.value !== dest)}
                            variant="borderless"
                            style={{ padding: 0, fontWeight: 600, fontSize: 14, color: TXT }}
                            filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                        />
                    </Flex>

                    {/* Swap */}
                    <div
                        onClick={() => { const t = source; setSource(dest); setDest(t); }}
                        style={{
                            width: 32, height: 32, borderRadius: '50%',
                            border: `1px solid ${BDR}`, backgroundColor: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        <SwapHorizIcon size={16} color={HLP} />
                    </div>

                    {/* To */}
                    <Flex vertical gap={2} style={{ flex: '1 1 140px', minWidth: 120 }}>
                        <Text style={{ fontSize: 11, color: HLP }}>To</Text>
                        <Select
                            showSearch
                            value={dest}
                            onChange={setDest}
                            options={CITY_OPTS.filter(o => o.value !== source)}
                            variant="borderless"
                            style={{ padding: 0, fontWeight: 600, fontSize: 14, color: TXT }}
                            filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                        />
                    </Flex>

                    {/* Date of Journey */}
                    <Flex vertical gap={2} style={{ flex: '1 1 180px', minWidth: 160 }}>
                        <Text style={{ fontSize: 11, color: HLP }}>Date of Journey</Text>
                        <Flex align="center" gap={8}>
                            <DatePicker
                                value={travelDate}
                                onChange={d => d && setTravelDate(d)}
                                disabledDate={c => c && c < dayjs().startOf('day')}
                                variant="borderless"
                                format="DD MMM YYYY"
                                allowClear={false}
                                style={{ padding: 0, fontWeight: 600, fontSize: 14, flex: 1 }}
                            />
                            <Pill
                                label="Today"
                                active={isToday}
                                onClick={() => setTravelDate(dayjs())}
                            />
                            <Pill
                                label="Tomorrow"
                                active={isTomorrow}
                                onClick={() => setTravelDate(dayjs().add(1, 'day'))}
                            />
                        </Flex>
                    </Flex>

                    {/* Search button */}
                    <div
                        onClick={handleSearch}
                        style={{
                            width: 40, height: 40, borderRadius: '50%',
                            backgroundColor: P, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        <SearchIcon size={18} color="#fff" />
                    </div>
                </Flex>
            </div>

            {/* Route summary */}
            <Flex align="center" gap={12}>
                <Text style={{ fontSize: 16, fontWeight: 700, color: TXT }}>
                    {activeSource} → {activeDest}
                </Text>
                <Text style={{ fontSize: 13, color: HLP }}>{buses.length} buses found</Text>
            </Flex>

            {/* ══ TWO-COLUMN LAYOUT ══ */}
            <div className="flex gap-5 items-start">

                {/* ── Filter Panel (desktop) ── */}
                <div
                    className="hidden md:block sticky"
                    style={{
                        top: 16, width: 260, flexShrink: 0,
                        backgroundColor: '#FFFFFF',
                        border: `1px solid ${BDR}`,
                        borderRadius: 12, padding: 20,
                    }}
                >
                    <FilterPanel {...filterProps} />
                </div>

                {/* ── Results ── */}
                <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Sort bar */}
                    <Flex
                        justify="space-between" align="center"
                        style={{ marginBottom: 12 }}
                    >
                        <Text style={{ fontSize: 15, fontWeight: 600, color: TXT }}>
                            {buses.length} buses found
                        </Text>
                        <Flex align="center" gap={4}>
                            <Text style={{ fontSize: 13, color: HLP }}>Sort by:</Text>
                            {(['ratings', 'departure', 'price'] as Sort[]).map(s => {
                                const label = s === 'ratings' ? 'Ratings'
                                    : s === 'departure' ? 'Departure time' : 'Price';
                                const active = sort === s;
                                return (
                                    <span
                                        key={s}
                                        onClick={() => setSort(s)}
                                        style={{
                                            fontSize: 13,
                                            fontWeight: active ? 600 : 400,
                                            color: active ? P : TXT,
                                            cursor: 'pointer',
                                            paddingBottom: 2,
                                            borderBottom: active ? `2px solid ${P}` : '2px solid transparent',
                                            marginLeft: 8,
                                        }}
                                    >
                                        {label}
                                    </span>
                                );
                            })}
                        </Flex>
                    </Flex>

                    {/* Mobile filter button */}
                    <div className="md:hidden mb-3">
                        <Button
                            onClick={() => setMobileFiltersOpen(true)}
                            style={{ borderColor: BDR, borderRadius: 6 }}
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
                                borderRadius: 12, padding: '64px 24px',
                            }}
                        >
                            <Text style={{ color: HLP }}>
                                No buses match your filters. Try adjusting the filters.
                            </Text>
                        </Flex>
                    ) : (
                        buses.map(bus => (
                            <BusCard key={bus.id} bus={bus} onViewSeats={handleViewSeats} />
                        ))
                    )}
                </div>
            </div>

            {/* ══ MOBILE FILTER DRAWER ══ */}
            <Drawer
                title={
                    <Flex justify="space-between" align="center">
                        <span style={{ fontSize: 16, fontWeight: 600, color: TXT }}>Filter buses</span>
                        <Text onClick={handleReset} style={{ fontSize: 13, color: P, cursor: 'pointer' }}>
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
                        style={{
                            backgroundColor: P, borderColor: P, color: '#fff',
                            borderRadius: 6, fontWeight: 600,
                        }}
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
