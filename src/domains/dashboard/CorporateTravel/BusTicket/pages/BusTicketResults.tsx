import { useMemo, useState } from 'react';

import {
    CalendarOutlined,
    EnvironmentFilled,
    EnvironmentOutlined,
    FilterOutlined,
    StarFilled,
    SwapOutlined,
} from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Drawer,
    Flex,
    Row,
    Select,
    Tag,
    Typography,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { BusEntry, BusType, mockBuses } from '@src/mock/data';

import BoardingDropDrawer from '../components/BoardingDropDrawer';
import PoliciesDrawer from '../components/PoliciesDrawer';
import {
    BedIcon, ChairIcon, ChargingIcon, FilmIcon, MoonIcon,
    PhoneIcon, SnowflakeIcon, SunIcon, SunriseIcon, SunsetIcon, WaterIcon, WifiIcon,
} from '../components/SolarIcons';

const { Text, Paragraph } = Typography;

// ─── Design tokens ────────────────────────────────────────────────────────────
const P   = '#FF4F4F';   // primary
const TXT = '#171717';   // primary text
const HLP = '#8C8C8C';   // helper text
const BDR = '#E8E8E8';   // card border

// ─── Constants ────────────────────────────────────────────────────────────────

const CITIES = [
    'Bangalore', 'Mumbai', 'Chennai', 'Surat', 'Delhi',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh',
];

const BUS_TYPE_OPTIONS: { key: BusType; label: string; icon: React.ReactNode }[] = [
    { key: 'AC',      label: 'AC',      icon: <SnowflakeIcon color={P}         size={18} /> },
    { key: 'NonAC',   label: 'Non AC',  icon: <SnowflakeIcon color={HLP}       size={18} /> },
    { key: 'Sleeper', label: 'Sleeper', icon: <BedIcon       color="#7C3AED"   size={18} /> },
    { key: 'Seater',  label: 'Seater',  icon: <ChairIcon     color="#4F46E5"   size={18} /> },
];

const DEPARTURE_OPTIONS: { key: string; sub: string; icon: React.ReactNode }[] = [
    { key: '6AM-12PM', sub: 'Morning',   icon: <SunriseIcon color="#EA580C" /> },
    { key: '12PM-6PM', sub: 'Afternoon', icon: <SunIcon     color="#D97706" /> },
    { key: '6PM-12AM', sub: 'Evening',   icon: <SunsetIcon  color="#EA580C" /> },
    { key: '12AM-6AM', sub: 'Night',     icon: <MoonIcon    color="#4F46E5" /> },
];

const AMENITY_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'Blankets',                  label: 'Blankets',          icon: <BedIcon      color={HLP} /> },
    { key: 'Charging Point',            label: 'Charging Point',    icon: <ChargingIcon color={HLP} /> },
    { key: 'Emergency Contact Number',  label: 'Emergency Contact', icon: <PhoneIcon    color={HLP} /> },
    { key: 'Movie',                     label: 'Movie',             icon: <FilmIcon     color={HLP} /> },
    { key: 'Wifi',                      label: 'Wifi',              icon: <WifiIcon     color={HLP} /> },
    { key: 'Water Bottle',              label: 'Water Bottle',      icon: <WaterIcon    color={HLP} /> },
];

type SortKey = 'rating' | 'departure' | 'duration' | 'arrival' | 'price' | 'seats';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'rating',    label: 'Rating' },
    { key: 'departure', label: 'Departure' },
    { key: 'duration',  label: 'Duration' },
    { key: 'arrival',   label: 'Arrival' },
    { key: 'price',     label: 'Price' },
    { key: 'seats',     label: 'Seats Left' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseTimeToMinutes = (time: string): number => {
    const parts = time.trim().split(' ');
    const period = parts[1];
    const [h, m] = parts[0].split(':').map(Number);
    let hours = h % 12;
    if (period === 'PM') hours += 12;
    return hours * 60 + m;
};

const parseDurationToMinutes = (duration: string): number => {
    const hMatch = duration.match(/(\d+)h/);
    const mMatch = duration.match(/(\d+)m/);
    return (hMatch ? parseInt(hMatch[1]) : 0) * 60 + (mMatch ? parseInt(mMatch[1]) : 0);
};

// ─── Filter Toggle Button ─────────────────────────────────────────────────────

const ToggleBtn = ({
    icon, label, active, onClick,
}: {
    icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className="flex flex-col items-center justify-center gap-1.5 p-3 cursor-pointer transition-all select-none"
        style={{
            borderRadius: 6,
            border: active ? `1px solid ${P}` : '1px solid #D9D9D9',
            backgroundColor: active ? '#FFF1F0' : '#FFFFFF',
        }}
    >
        {icon}
        <Text
            className="text-xs leading-none text-center"
            style={{
                color: active ? P : TXT,
                fontWeight: active ? 600 : 400,
            }}
        >
            {label}
        </Text>
    </div>
);

// ─── Filter Panel ─────────────────────────────────────────────────────────────

interface FilterProps {
    busTypeFilter: string[];
    setBusTypeFilter: React.Dispatch<React.SetStateAction<string[]>>;
    departureFilter: string[];
    setDepartureFilter: React.Dispatch<React.SetStateAction<string[]>>;
    liveTrackable: boolean;
    setLiveTrackable: React.Dispatch<React.SetStateAction<boolean>>;
    amenityFilter: string[];
    setAmenityFilter: React.Dispatch<React.SetStateAction<string[]>>;
    onClearAll: () => void;
}

const FilterContent = ({
    busTypeFilter, setBusTypeFilter,
    departureFilter, setDepartureFilter,
    liveTrackable, setLiveTrackable,
    amenityFilter, setAmenityFilter,
    onClearAll,
}: FilterProps) => {
    const toggle = <T extends string>(list: T[], item: T, setter: (v: T[]) => void) =>
        setter(list.includes(item) ? list.filter(x => x !== item) : [...list, item]);

    return (
        <Flex vertical gap={16} className="pb-4">
            {/* Panel header */}
            <Flex justify="space-between" align="center">
                <Text
                    style={{
                        fontSize: 12, fontWeight: 600, color: HLP,
                        textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}
                >
                    FILTERS
                </Text>
                <Text
                    onClick={onClearAll}
                    style={{ fontSize: 14, color: P, cursor: 'pointer', fontWeight: 400 }}
                >
                    Clear All
                </Text>
            </Flex>

            <Divider className="my-0" style={{ borderColor: '#F0F0F0' }} />

            {/* Bus Type */}
            <Flex vertical gap={10}>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>Bus Type</Text>
                <div className="grid grid-cols-2 gap-2">
                    {BUS_TYPE_OPTIONS.map(opt => (
                        <ToggleBtn
                            key={opt.key} icon={opt.icon} label={opt.label}
                            active={busTypeFilter.includes(opt.key)}
                            onClick={() => toggle(busTypeFilter, opt.key, setBusTypeFilter)}
                        />
                    ))}
                </div>
            </Flex>

            <Divider className="my-0" style={{ borderColor: '#F0F0F0' }} />

            {/* Departure Time */}
            <Flex vertical gap={10}>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>Departure Time</Text>
                <div className="grid grid-cols-2 gap-2">
                    {DEPARTURE_OPTIONS.map(opt => (
                        <ToggleBtn
                            key={opt.key} icon={opt.icon} label={opt.sub}
                            active={departureFilter.includes(opt.key)}
                            onClick={() => toggle(departureFilter, opt.key, setDepartureFilter)}
                        />
                    ))}
                </div>
            </Flex>

            <Divider className="my-0" style={{ borderColor: '#F0F0F0' }} />

            <Checkbox
                checked={liveTrackable}
                onChange={e => setLiveTrackable(e.target.checked)}
            >
                <Text style={{ fontSize: 14, color: TXT }}>Live Trackable Buses Only</Text>
            </Checkbox>

            <Divider className="my-0" style={{ borderColor: '#F0F0F0' }} />

            {/* Amenities */}
            <Flex vertical gap={10}>
                <Text style={{ fontSize: 14, fontWeight: 600, color: TXT }}>Amenities</Text>
                <Flex vertical gap={8}>
                    {AMENITY_OPTIONS.map(opt => (
                        <Checkbox
                            key={opt.key}
                            checked={amenityFilter.includes(opt.key)}
                            onChange={e => {
                                if (e.target.checked) setAmenityFilter(prev => [...prev, opt.key]);
                                else setAmenityFilter(prev => prev.filter(a => a !== opt.key));
                            }}
                        >
                            <Flex align="center" gap={6}>
                                {opt.icon}
                                <Text style={{ fontSize: 14, color: TXT }}>{opt.label}</Text>
                            </Flex>
                        </Checkbox>
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
};

// ─── Bus Card ─────────────────────────────────────────────────────────────────

const BusCard = ({
    bus, source, destination, onSelectSeats,
}: {
    bus: BusEntry; source: string; destination: string; onSelectSeats: (bus: BusEntry) => void;
}) => {
    const [boardingOpen, setBoardingOpen] = useState(false);
    const [policiesOpen, setPoliciesOpen] = useState(false);

    return (
        <>
            <div
                className="bg-white p-5 transition-shadow hover:shadow-md"
                style={{ border: `1px solid ${BDR}`, borderRadius: 8 }}
            >
                <Row gutter={[12, 16]} align="middle">

                    {/* Left: Operator + Rating */}
                    <Col xs={24} md={7}>
                        <Flex vertical gap={6}>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>
                                {bus.operator}
                            </Text>
                            <Text style={{ fontSize: 13, color: HLP }}>
                                {bus.busType}
                            </Text>
                            <Flex align="center" gap={6} className="mt-1">
                                <Tag
                                    color={bus.rating >= 4 ? 'success' : bus.rating >= 3 ? 'warning' : 'error'}
                                    style={{ fontWeight: 600 }}
                                >
                                    ★ {bus.rating.toFixed(1)}
                                </Tag>
                                <Text style={{ fontSize: 12, color: HLP }}>
                                    ({bus.totalRatings.toLocaleString()} ratings)
                                </Text>
                            </Flex>
                            {bus.isLiveTrackable && (
                                <Tag
                                    icon={<EnvironmentFilled />}
                                    color="success"
                                    className="w-fit mt-1"
                                    style={{ fontSize: 12 }}
                                >
                                    Live Tracking
                                </Tag>
                            )}
                        </Flex>
                    </Col>

                    {/* Centre: Times */}
                    <Col xs={24} md={10}>
                        <Flex align="center" justify="space-between" gap={8}>
                            <Flex vertical align="flex-start" gap={2}>
                                <Text style={{ fontSize: 22, fontWeight: 600, color: TXT, lineHeight: 1 }}>
                                    {bus.departure}
                                </Text>
                                <Text style={{ fontSize: 12, color: HLP }}>{source}</Text>
                            </Flex>
                            <Flex vertical align="center" gap={2} className="flex-1">
                                <Text style={{ fontSize: 13, color: HLP }}>{bus.duration}</Text>
                                <div className="w-full flex items-center gap-1">
                                    <div className="flex-1 border-t border-dashed border-gray-200" />
                                    <Text style={{ color: '#D9D9D9', fontSize: 12 }}>→</Text>
                                </div>
                            </Flex>
                            <Flex vertical align="flex-end" gap={2}>
                                <Text style={{ fontSize: 22, fontWeight: 600, color: TXT, lineHeight: 1 }}>
                                    {bus.arrival}
                                </Text>
                                <Text style={{ fontSize: 12, color: HLP }}>{destination}</Text>
                            </Flex>
                        </Flex>
                    </Col>

                    {/* Right: Price + Button */}
                    <Col xs={24} md={7}>
                        <Flex vertical align="flex-end" gap={4} className="xs:items-start sm:items-start md:items-end">
                            <Text style={{ fontSize: 13, color: HLP, textDecoration: 'line-through' }}>
                                ₹{bus.originalPrice.toLocaleString()}
                            </Text>
                            <Text style={{ fontSize: 18, fontWeight: 600, color: P, lineHeight: 1 }}>
                                ₹{bus.price.toLocaleString()}
                            </Text>
                            <Text style={{ fontSize: 12, color: HLP }}>{bus.seatsLeft} seats left</Text>
                            <Button
                                size="middle"
                                onClick={() => onSelectSeats(bus)}
                                className="mt-2"
                                style={{
                                    backgroundColor: P,
                                    borderColor: P,
                                    color: '#fff',
                                    borderRadius: 6,
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                Select Seats
                            </Button>
                        </Flex>
                    </Col>
                </Row>

                {/* Bottom row */}
                <Divider className="my-3" style={{ borderColor: '#F0F0F0' }} />
                <Flex justify="flex-end" gap={16}>
                    <Text
                        onClick={() => setBoardingOpen(true)}
                        style={{ fontSize: 13, color: P, cursor: 'pointer' }}
                    >
                        Boarding &amp; Drop Points
                    </Text>
                    <Text
                        onClick={() => setPoliciesOpen(true)}
                        style={{ fontSize: 13, color: P, cursor: 'pointer' }}
                    >
                        Policies
                    </Text>
                </Flex>
            </div>

            <BoardingDropDrawer open={boardingOpen} onClose={() => setBoardingOpen(false)} />
            <PoliciesDrawer     open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

type SearchState = { source?: string; destination?: string; date?: string };
type Errors = { source: string; destination: string; date: string };

const BusTicketResults = () => {
    const location  = useLocation();
    const navigate  = useNavigate();
    const routeState = location.state as SearchState | null;

    const [source, setSource] = useState(routeState?.source ?? 'Bangalore');
    const [destination, setDestination] = useState(routeState?.destination ?? 'Mumbai');
    const [date, setDate] = useState<Dayjs>(() => {
        if (routeState?.date) {
            const parsed = dayjs(routeState.date, 'DD MMM');
            return parsed.isValid() ? parsed : dayjs();
        }
        return dayjs();
    });
    const [searchErrors, setSearchErrors] = useState<Errors>({ source: '', destination: '', date: '' });

    const [busTypeFilter, setBusTypeFilter]     = useState<string[]>([]);
    const [departureFilter, setDepartureFilter] = useState<string[]>([]);
    const [liveTrackable, setLiveTrackable]     = useState(false);
    const [amenityFilter, setAmenityFilter]     = useState<string[]>([]);
    const [sortKey, setSortKey]                 = useState<SortKey>('rating');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const handleClearAll = () => {
        setBusTypeFilter([]); setDepartureFilter([]); setLiveTrackable(false); setAmenityFilter([]);
    };

    const handleSwap = () => {
        setSource(destination); setDestination(source);
        setSearchErrors(prev => ({ ...prev, destination: '' }));
    };

    const handleSearch = () => {
        const errs: Errors = { source: '', destination: '', date: '' };
        let bad = false;
        if (!source) { errs.source = 'Please select a valid source city'; bad = true; }
        if (!destination) { errs.destination = 'Please select a valid destination city'; bad = true; }
        else if (source === destination) { errs.destination = 'Source and destination cannot be the same'; bad = true; }
        if (!date) { errs.date = 'Please select a travel date'; bad = true; }
        setSearchErrors(errs);
        if (!bad) navigate('/corporate-travel/bus-ticket/searching', { state: { source, destination, date: date.format('DD MMM') } });
    };

    const handleSelectSeats = (bus: BusEntry) =>
        navigate('/corporate-travel/bus-ticket/seats', { state: { bus, source, destination, date: date.format('DD MMM') } });

    const filteredBuses = useMemo(() => {
        let result = mockBuses.filter(bus => {
            if (busTypeFilter.length > 0 && !busTypeFilter.includes(bus.type)) return false;
            if (departureFilter.length > 0 && !departureFilter.includes(bus.departureSlot)) return false;
            if (liveTrackable && !bus.isLiveTrackable) return false;
            if (amenityFilter.length > 0 && !amenityFilter.every(a => bus.amenities.includes(a))) return false;
            return true;
        });
        result = [...result].sort((a, b) => {
            switch (sortKey) {
                case 'rating':    return b.rating - a.rating;
                case 'departure': return parseTimeToMinutes(a.departure) - parseTimeToMinutes(b.departure);
                case 'duration':  return parseDurationToMinutes(a.duration) - parseDurationToMinutes(b.duration);
                case 'arrival':   return parseTimeToMinutes(a.arrival) - parseTimeToMinutes(b.arrival);
                case 'price':     return a.price - b.price;
                case 'seats':     return b.seatsLeft - a.seatsLeft;
                default:          return 0;
            }
        });
        return result;
    }, [busTypeFilter, departureFilter, liveTrackable, amenityFilter, sortKey]);

    const sourceOptions = CITIES.filter(c => c !== destination).map(c => ({ label: c, value: c }));
    const destOptions   = CITIES.filter(c => c !== source).map(c => ({ label: c, value: c }));
    const filterProps: FilterProps = {
        busTypeFilter, setBusTypeFilter, departureFilter, setDepartureFilter,
        liveTrackable, setLiveTrackable, amenityFilter, setAmenityFilter, onClearAll: handleClearAll,
    };
    const activeFilterCount = busTypeFilter.length + departureFilter.length + amenityFilter.length + (liveTrackable ? 1 : 0);
    const fieldBorder = { borderColor: '#D9D9D9', borderRadius: 6 };

    return (
        <Flex vertical gap={16}>

            {/* ══ SEARCH BAR ══ */}
            <Row className="w-full m-0" gutter={[12, 12]} align="top">
                <Col xs={24} md={6} className="pt-1">
                    <Text className="block mb-1 text-xs font-semibold" style={{ color: TXT }}>From</Text>
                    <div className="border bg-white px-3 py-1 flex items-center gap-2 rounded-md">
                        <EnvironmentOutlined style={{ color: HLP }} />
                        <Select showSearch value={source}
                            onChange={v => { setSource(v); setSearchErrors(p => ({ ...p, source: '' })); }}
                            options={sourceOptions} variant="borderless" size="large" className="w-full"
                            filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                            style={fieldBorder}
                        />
                    </div>
                    {searchErrors.source && <Text style={{ fontSize: 12, color: P }} className="mt-1 block">{searchErrors.source}</Text>}
                </Col>

                <Col xs={24} md={1} className="flex xs:justify-center items-end pb-1">
                    <div onClick={handleSwap}
                        className="w-9 h-9 rounded-full bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50"
                        style={{ border: '1px solid #D9D9D9' }}
                    >
                        <SwapOutlined style={{ color: HLP, fontSize: 14 }} />
                    </div>
                </Col>

                <Col xs={24} md={6} className="pt-1">
                    <Text className="block mb-1 text-xs font-semibold" style={{ color: TXT }}>To</Text>
                    <div className="border bg-white px-3 py-1 flex items-center gap-2 rounded-md">
                        <EnvironmentOutlined style={{ color: HLP }} />
                        <Select showSearch value={destination}
                            onChange={v => { setDestination(v); setSearchErrors(p => ({ ...p, destination: '' })); }}
                            options={destOptions} variant="borderless" size="large" className="w-full"
                            filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                            style={fieldBorder}
                        />
                    </div>
                    {searchErrors.destination && <Text style={{ fontSize: 12, color: P }} className="mt-1 block">{searchErrors.destination}</Text>}
                </Col>

                <Col xs={24} md={5} lg={5} className="pt-1">
                    <Text className="block mb-1 text-xs font-semibold" style={{ color: TXT }}>Date</Text>
                    <div className="border bg-white px-3 py-1 flex items-center gap-2 rounded-md">
                        <CalendarOutlined style={{ color: HLP }} />
                        <DatePicker value={date}
                            onChange={v => { if (v) { setDate(v); setSearchErrors(p => ({ ...p, date: '' })); } }}
                            format={(v: Dayjs) => v.isSame(dayjs(), 'day') ? 'Today' : v.format('DD MMM')}
                            disabledDate={c => c && c < dayjs().startOf('day')}
                            variant="borderless" size="large" className="w-full"
                            inputReadOnly allowClear={false} suffixIcon={null}
                        />
                    </div>
                    {searchErrors.date && <Text style={{ fontSize: 12, color: P }} className="mt-1 block">{searchErrors.date}</Text>}
                </Col>

                <Col xs={24} md={5} lg={6} className="flex items-end pt-1">
                    <Button block size="large" onClick={handleSearch}
                        className="h-11 font-semibold"
                        style={{ backgroundColor: P, borderColor: P, color: '#fff', borderRadius: 6, fontSize: 14, fontWeight: 600 }}
                    >
                        Find Buses
                    </Button>
                </Col>
            </Row>

            {/* ══ SUMMARY ROW ══ */}
            <Flex justify="space-between" align="center" className="flex-wrap gap-2">
                <Text style={{ fontWeight: 600, color: TXT }}>
                    {source} – {destination},{' '}
                    <span style={{ color: HLP }}>{date.format('DD MMM')}</span>
                </Text>
                <Text style={{ fontSize: 14, color: HLP }}>
                    <span style={{ fontWeight: 600, color: TXT }}>{filteredBuses.length}</span>{' '}
                    {filteredBuses.length === 1 ? 'bus' : 'buses'} found
                </Text>
            </Flex>

            {/* Mobile: Filters trigger */}
            <div className="md:hidden">
                <Button icon={<FilterOutlined />}
                    onClick={() => setMobileFiltersOpen(true)}
                    style={{ borderColor: '#D9D9D9', borderRadius: 6 }}
                >
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center"
                            style={{ backgroundColor: P }}
                        >
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* ══ MAIN LAYOUT ══ */}
            <Row gutter={[20, 16]} align="top">

                {/* Desktop filter sidebar */}
                <Col md={6} className="hidden md:block">
                    <div className="bg-white p-5 sticky top-4"
                        style={{ border: `1px solid ${BDR}`, borderRadius: 8, padding: '20px 24px' }}
                    >
                        <FilterContent {...filterProps} />
                    </div>
                </Col>

                {/* Results panel */}
                <Col xs={24} md={18}>
                    {/* Sort Bar */}
                    <div className="flex items-center flex-wrap gap-1 px-4 py-3 bg-white border-b"
                        style={{ border: `1px solid ${BDR}`, borderBottom: 'none', borderRadius: '8px 8px 0 0' }}
                    >
                        <Text style={{ fontSize: 13, color: HLP }} className="me-2">Sort by:</Text>
                        {SORT_OPTIONS.map(opt => (
                            <button key={opt.key} onClick={() => setSortKey(opt.key)}
                                className="px-3 py-1 cursor-pointer border-0 bg-transparent"
                                style={{
                                    fontSize: 14,
                                    color: sortKey === opt.key ? P : TXT,
                                    fontWeight: sortKey === opt.key ? 600 : 400,
                                    borderBottom: sortKey === opt.key ? `2px solid ${P}` : '2px solid transparent',
                                }}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>

                    {/* Bus Cards */}
                    <Flex vertical gap={0}
                        className="p-3"
                        style={{ border: `1px solid ${BDR}`, borderTop: 'none', borderRadius: '0 0 8px 8px', backgroundColor: '#F5F5F5' }}
                    >
                        {filteredBuses.length === 0 ? (
                            <Flex align="center" justify="center" className="py-16">
                                <Text style={{ color: HLP }}>No buses match your filters. Try adjusting the filters.</Text>
                            </Flex>
                        ) : (
                            <Flex vertical gap={12}>
                                {filteredBuses.map(bus => (
                                    <BusCard key={bus.id} bus={bus} source={source} destination={destination} onSelectSeats={handleSelectSeats} />
                                ))}
                            </Flex>
                        )}
                    </Flex>
                </Col>
            </Row>

            {/* Mobile Filter Drawer */}
            <Drawer
                title={
                    <Flex justify="space-between" align="center">
                        <span style={{ fontSize: 16, fontWeight: 600, color: TXT }}>Filters</span>
                        <Text onClick={handleClearAll} style={{ fontSize: 14, color: P, cursor: 'pointer' }}>
                            Clear All
                        </Text>
                    </Flex>
                }
                placement="left"
                onClose={() => setMobileFiltersOpen(false)}
                open={mobileFiltersOpen}
                width={300}
                footer={
                    <Button block size="large"
                        onClick={() => setMobileFiltersOpen(false)}
                        style={{ backgroundColor: P, borderColor: P, color: '#fff', borderRadius: 6, fontWeight: 600 }}
                    >
                        Show {filteredBuses.length} Buses
                    </Button>
                }
            >
                <FilterContent {...filterProps} />
            </Drawer>
        </Flex>
    );
};

export default BusTicketResults;
