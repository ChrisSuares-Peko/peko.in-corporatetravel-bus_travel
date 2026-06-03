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
import { FaBed, FaChair, FaFilm, FaSnowflake, FaWifi } from 'react-icons/fa';
import { BsMoonStars, BsSun, BsSunrise, BsSunset } from 'react-icons/bs';
import { MdLocalDrink, MdLocalPhone, MdPower } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import { BusEntry, BusType, mockBuses } from '@src/mock/data';

import BoardingDropDrawer from '../components/BoardingDropDrawer';
import PoliciesDrawer from '../components/PoliciesDrawer';

const { Text, Paragraph } = Typography;

// ─── Constants ────────────────────────────────────────────────────────────────

const CITIES = [
    'Bangalore', 'Mumbai', 'Chennai', 'Surat', 'Delhi',
    'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Chandigarh',
];

const BUS_TYPE_OPTIONS: { key: BusType; label: string; icon: React.ReactNode }[] = [
    { key: 'AC',      label: 'AC',      icon: <FaSnowflake className="text-sky-500 text-base" /> },
    { key: 'NonAC',   label: 'Non AC',  icon: <FaSnowflake className="text-gray-300 text-base" /> },
    { key: 'Sleeper', label: 'Sleeper', icon: <FaBed className="text-purple-500 text-base" /> },
    { key: 'Seater',  label: 'Seater',  icon: <FaChair className="text-indigo-500 text-base" /> },
];

const DEPARTURE_OPTIONS: { key: string; label: string; sub: string; icon: React.ReactNode }[] = [
    { key: '6AM-12PM',  label: '6AM – 12PM',  sub: 'Morning',   icon: <BsSunrise className="text-orange-400 text-xl" /> },
    { key: '12PM-6PM',  label: '12PM – 6PM',  sub: 'Afternoon', icon: <BsSun className="text-yellow-500 text-xl" /> },
    { key: '6PM-12AM',  label: '6PM – 12AM',  sub: 'Evening',   icon: <BsSunset className="text-orange-500 text-xl" /> },
    { key: '12AM-6AM',  label: '12AM – 6AM',  sub: 'Night',     icon: <BsMoonStars className="text-indigo-500 text-xl" /> },
];

const AMENITY_OPTIONS: { key: string; label: string; icon: React.ReactNode }[] = [
    { key: 'Blankets',                label: 'Blankets',          icon: <FaBed className="text-gray-400 text-sm" /> },
    { key: 'Charging Point',          label: 'Charging Point',    icon: <MdPower className="text-gray-400 text-sm" /> },
    { key: 'Emergency Contact Number',label: 'Emergency Contact', icon: <MdLocalPhone className="text-gray-400 text-sm" /> },
    { key: 'Movie',                   label: 'Movie',             icon: <FaFilm className="text-gray-400 text-sm" /> },
    { key: 'Wifi',                    label: 'Wifi',              icon: <FaWifi className="text-gray-400 text-sm" /> },
    { key: 'Water Bottle',            label: 'Water Bottle',      icon: <MdLocalDrink className="text-gray-400 text-sm" /> },
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

// ─── Toggle Button ─────────────────────────────────────────────────────────────

const ToggleBtn = ({
    icon, label, active, onClick,
}: {
    icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) => (
    <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border cursor-pointer transition-all select-none ${
            active ? 'border-amber-400 bg-amber-50' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
    >
        {icon}
        <Text className={`text-xs font-medium leading-none text-center ${active ? 'text-amber-600' : 'text-gray-600'}`}>
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
        <Flex vertical gap={20} className="pb-4">
            <Flex justify="space-between" align="center">
                <Text className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Filters</Text>
                <Text onClick={onClearAll} className="text-xs text-amber-500 cursor-pointer hover:text-amber-600 font-medium">
                    Clear All
                </Text>
            </Flex>

            <Divider className="my-0" />

            <Flex vertical gap={10}>
                <Text className="text-sm font-medium text-gray-700">Bus Type</Text>
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

            <Divider className="my-0" />

            <Flex vertical gap={10}>
                <Text className="text-sm font-medium text-gray-700">Departure Time</Text>
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

            <Divider className="my-0" />

            <Flex vertical gap={8}>
                <Checkbox checked={liveTrackable} onChange={e => setLiveTrackable(e.target.checked)}>
                    <Text className="text-sm text-gray-700">Live Trackable Buses Only</Text>
                </Checkbox>
            </Flex>

            <Divider className="my-0" />

            <Flex vertical gap={10}>
                <Text className="text-sm font-medium text-gray-700">Amenities</Text>
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
                                <Text className="text-sm text-gray-600">{opt.label}</Text>
                            </Flex>
                        </Checkbox>
                    ))}
                </Flex>
            </Flex>
        </Flex>
    );
};

// ─── Bus Card ─────────────────────────────────────────────────────────────────
// Each card owns its own drawer open/close state — no lifting needed.

const BusCard = ({
    bus,
    source,
    destination,
    onSelectSeats,
}: {
    bus: BusEntry;
    source: string;
    destination: string;
    onSelectSeats: (bus: BusEntry) => void;
}) => {
    const [boardingOpen, setBoardingOpen] = useState(false);
    const [policiesOpen, setPoliciesOpen] = useState(false);

    return (
        <>
            <div className="border border-gray-100 rounded-2xl p-4 sm:p-5 bg-white shadow-sm hover:shadow-md transition-shadow">
                <Row gutter={[12, 16]} align="middle">

                    {/* ── Left: Operator + Rating ── */}
                    <Col xs={24} sm={24} md={7}>
                        <Flex vertical gap={6}>
                            <Text className="font-bold text-base leading-tight">{bus.operator}</Text>
                            <Text className="text-gray-400 text-xs leading-tight">{bus.busType}</Text>
                            <Flex align="center" gap={6} className="mt-1">
                                <span
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-white text-xs font-semibold"
                                    style={{
                                        backgroundColor:
                                            bus.rating >= 4 ? '#22C55E' : bus.rating >= 3 ? '#F59E0B' : '#EF4444',
                                    }}
                                >
                                    <StarFilled className="text-[10px]" />
                                    {bus.rating.toFixed(1)}
                                </span>
                                <Text className="text-gray-400 text-xs">
                                    ({bus.totalRatings.toLocaleString()} ratings)
                                </Text>
                            </Flex>
                            {bus.isLiveTrackable && (
                                <Tag icon={<EnvironmentFilled />} color="green" className="w-fit mt-1 text-xs">
                                    Live Tracking
                                </Tag>
                            )}
                        </Flex>
                    </Col>

                    {/* ── Centre: Times ── */}
                    <Col xs={24} sm={24} md={10}>
                        <Flex align="center" justify="space-between" gap={8}>
                            <Flex vertical align="flex-start" gap={2}>
                                <Text className="text-2xl font-black leading-none">{bus.departure}</Text>
                                <Text className="text-gray-400 text-xs">{source}</Text>
                            </Flex>
                            <Flex vertical align="center" gap={2} className="flex-1">
                                <Text className="text-gray-400 text-xs font-medium">{bus.duration}</Text>
                                <div className="w-full flex items-center gap-1">
                                    <div className="flex-1 border-t border-dashed border-gray-300" />
                                    <Text className="text-gray-300 text-xs">→</Text>
                                </div>
                            </Flex>
                            <Flex vertical align="flex-end" gap={2}>
                                <Text className="text-2xl font-black leading-none">{bus.arrival}</Text>
                                <Text className="text-gray-400 text-xs">{destination}</Text>
                            </Flex>
                        </Flex>
                    </Col>

                    {/* ── Right: Price + Button ── */}
                    <Col xs={24} sm={24} md={7}>
                        <Flex vertical align="flex-end" gap={4} className="xs:items-start sm:items-start md:items-end">
                            <Text className="text-gray-400 text-xs line-through">
                                ₹{bus.originalPrice.toLocaleString()}
                            </Text>
                            <Text className="text-red-500 text-2xl font-black leading-none">
                                ₹{bus.price.toLocaleString()}
                            </Text>
                            <Text className="text-gray-400 text-xs">{bus.seatsLeft} seats left</Text>
                            <Button
                                size="middle"
                                onClick={() => onSelectSeats(bus)}
                                className="mt-2 font-semibold"
                                style={{ backgroundColor: '#FFA827', borderColor: '#FFA827', color: '#fff' }}
                            >
                                Select Seats
                            </Button>
                        </Flex>
                    </Col>
                </Row>

                {/* ── Bottom row: links ── */}
                <Divider className="my-3" />
                <Flex justify="flex-end" gap={16}>
                    <Text
                        onClick={() => setBoardingOpen(true)}
                        className="text-xs text-amber-500 cursor-pointer hover:text-amber-600 hover:underline"
                    >
                        Boarding &amp; Drop Points
                    </Text>
                    <Text
                        onClick={() => setPoliciesOpen(true)}
                        className="text-xs text-amber-500 cursor-pointer hover:text-amber-600 hover:underline"
                    >
                        Policies
                    </Text>
                </Flex>
            </div>

            {/* Drawers are co-located with the card that owns them */}
            <BoardingDropDrawer open={boardingOpen} onClose={() => setBoardingOpen(false)} />
            <PoliciesDrawer open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
        </>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

type SearchState = { source?: string; destination?: string; date?: string };
type Errors = { source: string; destination: string; date: string };

const BusTicketResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routeState = location.state as SearchState | null;

    // ── Search bar state (pre-filled from route state) ──
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

    // ── Filter state ──
    const [busTypeFilter, setBusTypeFilter] = useState<string[]>([]);
    const [departureFilter, setDepartureFilter] = useState<string[]>([]);
    const [liveTrackable, setLiveTrackable] = useState(false);
    const [amenityFilter, setAmenityFilter] = useState<string[]>([]);

    // ── Sort + mobile filter drawer ──
    const [sortKey, setSortKey] = useState<SortKey>('rating');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // ── Helpers ──
    const handleClearAll = () => {
        setBusTypeFilter([]);
        setDepartureFilter([]);
        setLiveTrackable(false);
        setAmenityFilter([]);
    };

    const handleSwap = () => {
        setSource(destination);
        setDestination(source);
        setSearchErrors(prev => ({ ...prev, destination: '' }));
    };

    const handleSearch = () => {
        const errs: Errors = { source: '', destination: '', date: '' };
        let bad = false;
        if (!source) { errs.source = 'Required'; bad = true; }
        if (!destination) { errs.destination = 'Required'; bad = true; }
        else if (source === destination) { errs.destination = 'Same as source'; bad = true; }
        if (!date) { errs.date = 'Required'; bad = true; }
        setSearchErrors(errs);
        if (!bad) {
            navigate('/corporate-travel/bus-ticket/searching', {
                state: { source, destination, date: date.format('DD MMM') },
            });
        }
    };

    const handleSelectSeats = (bus: BusEntry) => {
        navigate('/corporate-travel/bus-ticket/seats', {
            state: { bus, source, destination, date: date.format('DD MMM') },
        });
    };

    // ── Filtered + sorted buses ──
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
        busTypeFilter, setBusTypeFilter,
        departureFilter, setDepartureFilter,
        liveTrackable, setLiveTrackable,
        amenityFilter, setAmenityFilter,
        onClearAll: handleClearAll,
    };

    const activeFilterCount =
        busTypeFilter.length + departureFilter.length + amenityFilter.length + (liveTrackable ? 1 : 0);

    return (
        <Flex vertical gap={16}>

            {/* ══ SEARCH BAR ══ */}
            <Row className="w-full m-0" gutter={[10, 10]} align="bottom">

                <Col xs={24} md={6} className="pt-3">
                    <Paragraph className="text-sm text-gray-500 ms-3 mb-1">From</Paragraph>
                    <Flex align="center" className="ms-2 gap-1">
                        <EnvironmentOutlined className="text-gray-400" />
                        <Select
                            showSearch value={source}
                            onChange={v => { setSource(v); setSearchErrors(p => ({ ...p, source: '' })); }}
                            options={sourceOptions} variant="borderless" size="large" className="w-full"
                            filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                        />
                    </Flex>
                    {searchErrors.source && <Text className="text-red-500 text-xs ms-3">{searchErrors.source}</Text>}
                    <Col className="border-b-2 ms-3 mt-2" />
                </Col>

                <Col xs={24} md={1} className="flex justify-center items-center xs:py-2 md:pb-4">
                    <div
                        onClick={handleSwap}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        <SwapOutlined className="text-gray-500 text-sm" />
                    </div>
                </Col>

                <Col xs={24} md={6} className="pt-3">
                    <Paragraph className="text-sm text-gray-500 ms-3 mb-1">To</Paragraph>
                    <Flex align="center" className="ms-2 gap-1">
                        <EnvironmentOutlined className="text-gray-400" />
                        <Select
                            showSearch value={destination}
                            onChange={v => { setDestination(v); setSearchErrors(p => ({ ...p, destination: '' })); }}
                            options={destOptions} variant="borderless" size="large" className="w-full"
                            filterOption={(i, o) => (o?.label ?? '').toLowerCase().includes(i.toLowerCase())}
                        />
                    </Flex>
                    {searchErrors.destination && <Text className="text-red-500 text-xs ms-3">{searchErrors.destination}</Text>}
                    <Col className="border-b-2 ms-3 mt-2" />
                </Col>

                <Col xs={24} md={6} lg={5} className="pt-3">
                    <Paragraph className="text-sm text-gray-500 ms-3 mb-1">Date</Paragraph>
                    <Flex align="center" className="ms-2 gap-1">
                        <CalendarOutlined className="text-gray-400" />
                        <DatePicker
                            value={date}
                            onChange={v => { if (v) { setDate(v); setSearchErrors(p => ({ ...p, date: '' })); } }}
                            format={(v: Dayjs) => v.isSame(dayjs(), 'day') ? 'Today' : v.format('DD MMM')}
                            disabledDate={c => c && c < dayjs().startOf('day')}
                            variant="borderless" size="large" className="w-full"
                            inputReadOnly allowClear={false} suffixIcon={null}
                        />
                    </Flex>
                    {searchErrors.date && <Text className="text-red-500 text-xs ms-3">{searchErrors.date}</Text>}
                    <Col className="border-b-2 ms-3 mt-2" />
                </Col>

                <Col xs={24} md={5} lg={6} className="xs:pt-4 md:pt-0 md:pb-2">
                    <Button
                        size="large" onClick={handleSearch}
                        className="xs:w-full md:w-44 h-12 flex justify-center items-center rounded-md font-semibold"
                        style={{ backgroundColor: '#FFA827', borderColor: '#FFA827', color: '#fff' }}
                    >
                        Find Buses
                    </Button>
                </Col>
            </Row>

            {/* ══ SUMMARY ROW ══ */}
            <Flex justify="space-between" align="center" className="py-1 px-1 flex-wrap gap-2">
                <Text className="font-medium text-gray-700">
                    {source} – {destination},{' '}
                    <span className="text-gray-500">{date.format('DD MMM')}</span>
                </Text>
                <Text className="text-gray-500 text-sm">
                    <span className="font-semibold text-gray-700">{filteredBuses.length}</span>{' '}
                    {filteredBuses.length === 1 ? 'bus' : 'buses'} found
                </Text>
            </Flex>

            {/* Mobile: Filters trigger */}
            <div className="md:hidden">
                <Button
                    icon={<FilterOutlined />}
                    onClick={() => setMobileFiltersOpen(true)}
                    className="border border-gray-200"
                >
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1 bg-amber-400 text-white text-xs rounded-full w-4 h-4 inline-flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </div>

            {/* ══ MAIN LAYOUT ══ */}
            <Row gutter={[20, 16]} align="top">

                {/* Desktop filter sidebar */}
                <Col md={6} className="hidden md:block">
                    <div
                        className="rounded-2xl border border-gray-100 p-4 bg-white sticky top-4"
                        style={{ boxShadow: '0px 2px 12px rgba(0,0,0,0.06)' }}
                    >
                        <FilterContent {...filterProps} />
                    </div>
                </Col>

                {/* Results panel */}
                <Col xs={24} md={18}>
                    {/* Sort Bar */}
                    <Flex
                        align="center" gap={4}
                        className="py-3 px-4 bg-gray-50 rounded-t-2xl border border-b-0 border-gray-100 flex-wrap"
                    >
                        <Text className="text-gray-500 text-xs me-2">Sort by:</Text>
                        {SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.key}
                                onClick={() => setSortKey(opt.key)}
                                className={`px-3 py-1 rounded text-sm font-medium transition-colors cursor-pointer border-0 bg-transparent ${
                                    sortKey === opt.key ? 'underline' : 'text-gray-500 hover:text-gray-800'
                                }`}
                                style={sortKey === opt.key ? { color: '#FFA827' } : undefined}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </Flex>

                    {/* Bus Cards */}
                    <Flex
                        vertical gap={12}
                        className="rounded-b-2xl border border-t-0 border-gray-100 p-3 bg-gray-50"
                    >
                        {filteredBuses.length === 0 ? (
                            <Flex align="center" justify="center" className="py-16">
                                <Text className="text-gray-400 text-base">
                                    No buses match your filters. Try adjusting the filters.
                                </Text>
                            </Flex>
                        ) : (
                            filteredBuses.map(bus => (
                                <BusCard
                                    key={bus.id}
                                    bus={bus}
                                    source={source}
                                    destination={destination}
                                    onSelectSeats={handleSelectSeats}
                                />
                            ))
                        )}
                    </Flex>
                </Col>
            </Row>

            {/* ══ MOBILE FILTER DRAWER ══ */}
            <Drawer
                title={
                    <Flex justify="space-between" align="center">
                        <span>Filters</span>
                        <Text
                            onClick={handleClearAll}
                            className="text-xs text-amber-500 cursor-pointer font-medium"
                        >
                            Clear All
                        </Text>
                    </Flex>
                }
                placement="left"
                onClose={() => setMobileFiltersOpen(false)}
                open={mobileFiltersOpen}
                width={300}
                footer={
                    <Button
                        type="primary" block
                        onClick={() => setMobileFiltersOpen(false)}
                        style={{ backgroundColor: '#FFA827', borderColor: '#FFA827' }}
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
