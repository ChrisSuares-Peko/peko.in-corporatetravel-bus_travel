import { useState } from 'react';

import { Button, Divider, Flex, Progress, Radio, Table, Tabs, Tag, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { mockBusRating } from '@src/mock/data';

import {
    ArrowLeftIcon, BedIcon, ChargingIcon, FilmIcon, PhoneIcon, WaterIcon, WifiIcon,
} from '../components/SolarIcons';

const { Text } = Typography;

// ─── Design tokens ────────────────────────────────────────────────────────────

const P   = '#FF4F4F';
const TXT = '#171717';
const HLP = '#8C8C8C';
const BDR = '#E8E8E8';

// ─── Seat types ───────────────────────────────────────────────────────────────

type SeatStatus = 'available' | 'booked' | 'female' | 'male';

interface SeatDef {
    id: string;
    label: string;
    deck: 'lower' | 'upper';
    row: number;
    col: 'a' | 'b' | 'c';
    price: number;
    originalPrice: number;
    status: SeatStatus;
}

// ─── Mock seat data ───────────────────────────────────────────────────────────

const ALL_SEATS: SeatDef[] = [
    // LOWER DECK
    { id: 'L1',  label: '1',  deck: 'lower', row: 1, col: 'a', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L2',  label: '2',  deck: 'lower', row: 1, col: 'b', price: 950, originalPrice: 1200, status: 'female'    },
    { id: 'L3',  label: '3',  deck: 'lower', row: 1, col: 'c', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L4',  label: '4',  deck: 'lower', row: 2, col: 'a', price: 950, originalPrice: 1200, status: 'booked'    },
    { id: 'L5',  label: '5',  deck: 'lower', row: 2, col: 'b', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L6',  label: '6',  deck: 'lower', row: 2, col: 'c', price: 950, originalPrice: 1200, status: 'male'      },
    { id: 'L7',  label: '7',  deck: 'lower', row: 3, col: 'a', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L8',  label: '8',  deck: 'lower', row: 3, col: 'b', price: 950, originalPrice: 1200, status: 'booked'    },
    { id: 'L9',  label: '9',  deck: 'lower', row: 3, col: 'c', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L10', label: '10', deck: 'lower', row: 4, col: 'a', price: 950, originalPrice: 1200, status: 'female'    },
    { id: 'L11', label: '11', deck: 'lower', row: 4, col: 'b', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L12', label: '12', deck: 'lower', row: 4, col: 'c', price: 950, originalPrice: 1200, status: 'male'      },
    { id: 'L13', label: '13', deck: 'lower', row: 5, col: 'a', price: 950, originalPrice: 1200, status: 'available' },
    { id: 'L14', label: '14', deck: 'lower', row: 5, col: 'b', price: 950, originalPrice: 1200, status: 'booked'    },
    // UPPER DECK
    { id: 'U1',  label: '1',  deck: 'upper', row: 1, col: 'a', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U2',  label: '2',  deck: 'upper', row: 1, col: 'b', price: 850, originalPrice: 1050, status: 'booked'    },
    { id: 'U3',  label: '3',  deck: 'upper', row: 1, col: 'c', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U4',  label: '4',  deck: 'upper', row: 2, col: 'a', price: 850, originalPrice: 1050, status: 'male'      },
    { id: 'U5',  label: '5',  deck: 'upper', row: 2, col: 'b', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U6',  label: '6',  deck: 'upper', row: 2, col: 'c', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U7',  label: '7',  deck: 'upper', row: 3, col: 'a', price: 850, originalPrice: 1050, status: 'booked'    },
    { id: 'U8',  label: '8',  deck: 'upper', row: 3, col: 'b', price: 850, originalPrice: 1050, status: 'female'    },
    { id: 'U9',  label: '9',  deck: 'upper', row: 3, col: 'c', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U10', label: '10', deck: 'upper', row: 4, col: 'a', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U11', label: '11', deck: 'upper', row: 4, col: 'b', price: 850, originalPrice: 1050, status: 'male'      },
    { id: 'U12', label: '12', deck: 'upper', row: 4, col: 'c', price: 850, originalPrice: 1050, status: 'available' },
    { id: 'U13', label: '13', deck: 'upper', row: 5, col: 'a', price: 850, originalPrice: 1050, status: 'booked'    },
    { id: 'U14', label: '14', deck: 'upper', row: 5, col: 'b', price: 850, originalPrice: 1050, status: 'available' },
];

const PRICE_TIERS = [
    { price: 950, originalPrice: 1200 },
    { price: 850, originalPrice: 1050 },
];

// ─── Amenity icon map ─────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    Blankets:                   <BedIcon      size={20} color={HLP} />,
    'Charging Point':           <ChargingIcon size={20} color={HLP} />,
    'Emergency Contact Number': <PhoneIcon    size={20} color={HLP} />,
    Movie:                      <FilmIcon     size={20} color={HLP} />,
    Wifi:                       <WifiIcon     size={20} color={HLP} />,
    'Water Bottle':             <WaterIcon    size={20} color={HLP} />,
};

const ALL_AMENITY_KEYS = ['Blankets', 'Charging Point', 'Wifi', 'Movie', 'Water Bottle', 'Emergency Contact Number'];

// ─── Status style map ─────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, { bg: string; border: string; borderW: string; text: string }> = {
    available: { bg: '#FFFFFF', border: '#D9D9D9', borderW: '1px',  text: TXT    },
    booked:    { bg: '#F5F5F5', border: '#D9D9D9', borderW: '1px',  text: '#BFBFBF' },
    female:    { bg: '#FFF0F6', border: '#FFADD2', borderW: '1px',  text: '#EB2F96' },
    male:      { bg: '#F0F5FF', border: '#ADC6FF', borderW: '1px',  text: '#2F54EB' },
    selected:  { bg: '#FFF1F0', border: P,         borderW: '2px',  text: P      },
};

// ─── Steering wheel SVG ───────────────────────────────────────────────────────

const SteeringWheel = () => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-label="Driver">
        <circle cx="13" cy="13" r="11" stroke="#9CA3AF" strokeWidth="2" fill="#F3F4F6" />
        <circle cx="13" cy="13" r="4"  stroke="#9CA3AF" strokeWidth="1.5" fill="white" />
        <line x1="13" y1="2"  x2="13" y2="9"  stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="13" y1="17" x2="13" y2="24" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2"  y1="13" x2="9"  y2="13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="13" x2="24" y2="13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// ─── Seat berth ───────────────────────────────────────────────────────────────

const BERTH_W = 44;
const BERTH_H = 44;

const SeatBerth = ({
    seat, isSelected, isFiltered, onToggle,
}: {
    seat: SeatDef; isSelected: boolean; isFiltered: boolean; onToggle: (id: string) => void;
}) => {
    const key = isSelected ? 'selected' : seat.status;
    const s = STATUS_STYLE[key];
    const clickable = seat.status === 'available' || isSelected;

    return (
        <div
            onClick={clickable ? () => onToggle(seat.id) : undefined}
            title={clickable ? `Seat ${seat.label} • ₹${seat.price}` : `Seat ${seat.label} — ${seat.status}`}
            className={`relative select-none transition-all ${isFiltered ? 'opacity-25' : ''} ${clickable ? 'hover:scale-105' : ''}`}
            style={{
                width: BERTH_W, height: BERTH_H,
                backgroundColor: s.bg,
                border: `${s.borderW} solid ${s.border}`,
                borderRadius: 6,
                cursor: clickable ? 'pointer' : 'not-allowed',
            }}
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <Text style={{ fontSize: 11, fontWeight: 600, color: s.text, lineHeight: 1 }}>
                    {seat.label}
                </Text>
            </div>
        </div>
    );
};

// ─── Deck section ─────────────────────────────────────────────────────────────

const groupRows = (seats: SeatDef[]) => {
    const map = new Map<number, { a?: SeatDef; b?: SeatDef; c?: SeatDef }>();
    seats.forEach(s => {
        if (!map.has(s.row)) map.set(s.row, {});
        map.get(s.row)![s.col] = s;
    });
    return [...map.entries()].sort(([a], [b]) => a - b);
};

const DeckSection = ({
    deck, selectedIds, priceFilter, onToggle,
}: {
    deck: 'lower' | 'upper'; selectedIds: Set<string>; priceFilter: number | null; onToggle: (id: string) => void;
}) => {
    const deckSeats = ALL_SEATS.filter(s => s.deck === deck);
    const rows = groupRows(deckSeats);
    const isLower = deck === 'lower';
    const AISLE_W = 28;

    return (
        <Flex vertical gap={8}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: HLP, textTransform: 'uppercase', letterSpacing: 1 }}>
                {isLower ? 'Lower Deck' : 'Upper Deck'}
            </Text>
            <div
                className="bg-white p-4"
                style={{ border: `1px solid ${BDR}`, borderRadius: 8, display: 'inline-block' }}
            >
                {isLower && (
                    <div className="flex justify-end mb-3 pb-3 border-b border-gray-100">
                        <Flex align="center" gap={4}>
                            <Text className="text-xs text-gray-400">Driver</Text>
                            <SteeringWheel />
                        </Flex>
                    </div>
                )}
                <div className="flex items-center mb-2" style={{ gap: 8 }}>
                    <div className="flex" style={{ gap: 8 }}>
                        {['A', 'B'].map(col => (
                            <div key={col} className="flex items-center justify-center" style={{ width: BERTH_W }}>
                                <Text className="text-xs text-gray-400">{col}</Text>
                            </div>
                        ))}
                    </div>
                    <div style={{ width: AISLE_W }} />
                    <div className="flex items-center justify-center" style={{ width: BERTH_W }}>
                        <Text className="text-xs text-gray-400">C</Text>
                    </div>
                </div>
                <Flex vertical gap={8}>
                    {rows.map(([rowNum, rowSeats]) => (
                        <div key={rowNum} className="flex items-center" style={{ gap: 8 }}>
                            <div className="flex" style={{ gap: 8 }}>
                                {(['a', 'b'] as const).map(col => {
                                    const seat = rowSeats[col];
                                    return seat ? (
                                        <SeatBerth
                                            key={col}
                                            seat={seat}
                                            isSelected={selectedIds.has(seat.id)}
                                            isFiltered={priceFilter !== null && seat.price !== priceFilter}
                                            onToggle={onToggle}
                                        />
                                    ) : (
                                        <div key={col} style={{ width: BERTH_W, height: BERTH_H }} />
                                    );
                                })}
                            </div>
                            <div className="flex items-center justify-center flex-shrink-0" style={{ width: AISLE_W, height: BERTH_H }}>
                                <div className="h-full w-px border-l border-dashed border-gray-200" />
                            </div>
                            {rowSeats.c ? (
                                <SeatBerth
                                    seat={rowSeats.c}
                                    isSelected={selectedIds.has(rowSeats.c.id)}
                                    isFiltered={priceFilter !== null && rowSeats.c.price !== priceFilter}
                                    onToggle={onToggle}
                                />
                            ) : (
                                <div style={{ width: BERTH_W, height: BERTH_H }} />
                            )}
                        </div>
                    ))}
                </Flex>
            </div>
        </Flex>
    );
};

// ─── Boarding / drop point data ───────────────────────────────────────────────

interface StopPoint { id: string; name: string; time: string; date: string; landmark: string; }

const BOARDING_POINTS: StopPoint[] = [
    { id: 'B1', name: 'Nayandahalli',        time: '05:00 AM', date: '04 Jun', landmark: 'In Front Of Nayandahalli Metro Station, Opposite To Global Mall' },
    { id: 'B2', name: 'Majestic Bus Station', time: '05:25 AM', date: '04 Jun', landmark: 'Sri Krishna Tours & Travels, 19 Hotel Mayura Cmplx, Tank Bund Rd, Subash Nagar, Opp Majestic Bus Stand' },
    { id: 'B3', name: 'Anand Rao Circle',     time: '05:30 AM', date: '04 Jun', landmark: 'SRE Travels (Kalpana Tourist)' },
    { id: 'B4', name: 'Corporation Circle',   time: '05:40 AM', date: '04 Jun', landmark: 'Infront of City Bus Stop' },
    { id: 'B5', name: 'Shanthi Nagar(C)',     time: '05:50 AM', date: '04 Jun', landmark: 'Infront of SRS Logistics' },
    { id: 'B6', name: 'Koramangala',          time: '06:05 AM', date: '04 Jun', landmark: 'Nexus Mall back gate, next to Christ University' },
    { id: 'B7', name: 'St. Johns Hospital',   time: '06:10 AM', date: '04 Jun', landmark: 'Infront of HP Petroleum Pump' },
    { id: 'B8', name: 'Madiwala',             time: '06:15 AM', date: '04 Jun', landmark: 'Near Happiest Mind Technologies' },
    { id: 'B9', name: 'Silk Board',           time: '06:20 AM', date: '04 Jun', landmark: 'Flyover End, Opp to Metro Station' },
];

const DROP_POINTS: StopPoint[] = [
    { id: 'D1',  name: 'Sri Perumbudur',      time: '12:40 PM', date: '04 Jun', landmark: 'Near Sriperumbudur Toll Plaza (Towards Poonamalle)' },
    { id: 'D2',  name: 'Poonamallee Bypass',  time: '12:55 PM', date: '04 Jun', landmark: 'Near BSNL Telephone Exchange' },
    { id: 'D3',  name: 'Velappanchavadi',      time: '01:00 PM', date: '04 Jun', landmark: 'Infront of Velappanchavadi Bus Stop' },
    { id: 'D4',  name: 'Maduravoyal',          time: '01:10 PM', date: '04 Jun', landmark: 'Maduravoyal Erikarai Bus Stop' },
    { id: 'D5',  name: 'Koyambedu',            time: '01:15 PM', date: '04 Jun', landmark: 'Opp to CMBT' },
    { id: 'D6',  name: 'Vadapalani',           time: '01:35 PM', date: '04 Jun', landmark: 'Opp to Murugan Idli Restaurant' },
    { id: 'D7',  name: 'Ashok Nagar',          time: '01:45 PM', date: '04 Jun', landmark: 'Infront of Sree Mithai Store' },
    { id: 'D8',  name: 'Guindy',               time: '01:50 PM', date: '04 Jun', landmark: 'Opp to Olympia Tech Park' },
    { id: 'D9',  name: 'Anna University',      time: '02:00 PM', date: '04 Jun', landmark: 'Infront of Anna University Bus Stop' },
    { id: 'D10', name: 'Madhya Kailash',       time: '02:05 PM', date: '04 Jun', landmark: '' },
];

// ─── Policy data ──────────────────────────────────────────────────────────────

const TRAVEL_POLICIES = [
    { label: 'Child Passenger Policy', value: 'Children above the age of 3 will need a ticket' },
    { label: 'Luggage Policy', value: '1 piece of luggage will be accepted free of charge per passenger. Excess items will be chargeable' },
    { label: 'Excess Baggage', value: 'Excess baggage over 10 kgs per passenger will be chargeable' },
    { label: 'Pets Policy', value: 'Pets are not allowed' },
    { label: 'Liquor Policy', value: 'Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers' },
    { label: 'Pick Up Time Policy', value: 'Bus operator is not obligated to wait beyond the scheduled departure time. No refund will be entertained for late arriving passengers' },
];

type CancellationRow = { key: string; time: string; percent: string; amount: string };

const CANCELLATION_DATA: CancellationRow[] = [
    { key: '1', time: 'Before 4th Jun 10:30 AM', percent: '15%', amount: '₹184.50' },
    { key: '2', time: 'After 4th Jun 10:30 AM & Before 4th Jun 02:30 PM', percent: '30%', amount: '₹369.00' },
    { key: '3', time: 'After 4th Jun 02:30 PM & Before 4th Jun 06:30 PM', percent: '60%', amount: '₹738.00' },
    { key: '4', time: 'After 4th Jun 06:30 PM & Before 4th Jun 10:30 PM', percent: '95%', amount: '₹1,168.50' },
];

const CANCELLATION_COLUMNS = [
    { title: 'Time',                dataIndex: 'time',    key: 'time',    render: (v: string) => <Text style={{ fontSize: 11, color: '#595959' }}>{v}</Text> },
    { title: 'Cancellation %',      dataIndex: 'percent', key: 'percent', align: 'center' as const, render: (v: string) => <Text style={{ fontSize: 11, fontWeight: 600, color: TXT }}>{v}</Text> },
    { title: 'Cancellation Amount', dataIndex: 'amount',  key: 'amount',  align: 'right'  as const, render: (v: string) => <Text style={{ fontSize: 11, fontWeight: 600, color: P }}>{v}</Text> },
];

const DISCLAIMERS = [
    'Any cancellation of tickets can incur cancellation charges based on the bus operator policy',
    'Cancellation charges shown above are indicative and exact charges will be available after the ticket is booked',
    'Cancellation charges are computed on a per seat basis. Above fare is calculated based on seat fare of ₹1,230.00',
    'Partial cancellation is allowed for this ticket',
    "Customers will receive refunds after deducting cashbacks, offer discounts and non-refundable charges as per the bus operator's policy",
    'Note: Cancellation charges shown above are exclusive of GST',
    'For RTC buses — cancellation amount shown is an estimate and can change at the time of the Final RTC Cancellation Call Time',
];

// ─── Stop point list (used in Boarding & Drop tabs) ───────────────────────────

const StopList = ({
    points, selected, onSelect,
}: {
    points: StopPoint[]; selected: string | null; onSelect: (id: string) => void;
}) => (
    <div style={{ overflowY: 'auto', maxHeight: 380 }}>
        {points.map((pt, idx) => (
            <div key={pt.id}>
                <div
                    onClick={() => onSelect(pt.id)}
                    style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '12px 16px', cursor: 'pointer',
                        backgroundColor: selected === pt.id ? '#FFF1F0' : undefined,
                        transition: 'background-color 0.15s',
                    }}
                >
                    <Radio checked={selected === pt.id} style={{ marginTop: 3, pointerEvents: 'none', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, display: 'block' }}>
                            {pt.name}
                        </Text>
                        <Text style={{ fontSize: 13, color: P, display: 'block', marginTop: 2 }}>
                            {pt.time}, {pt.date}
                        </Text>
                        {pt.landmark && (
                            <Text style={{ fontSize: 12, color: HLP, display: 'block', marginTop: 2, fontWeight: 300, lineHeight: 1.5 }}>
                                {pt.landmark}
                            </Text>
                        )}
                    </div>
                </div>
                {idx < points.length - 1 && <Divider style={{ margin: 0 }} />}
            </div>
        ))}
    </div>
);

// ─── Route state helper ───────────────────────────────────────────────────────

type RouteState = { bus?: any; source?: string; destination?: string; date?: string; };

const busTime = (v: unknown): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === 'object' && 'time' in (v as object)) return (v as { time: string }).time;
    return v as string;
};

// ─── Main component ───────────────────────────────────────────────────────────

const BusTicketSeatSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routeState = (location.state ?? {}) as RouteState;

    const bus         = routeState.bus;
    const source      = routeState.source      ?? 'Bengaluru';
    const destination = routeState.destination ?? 'Chennai';
    const date        = routeState.date        ?? 'Today';

    const [selectedIds,      setSelectedIds]      = useState<Set<string>>(new Set());
    const [priceFilter,      setPriceFilter]      = useState<number | null>(null);
    const [selectedBoarding, setSelectedBoarding] = useState<string | null>(null);
    const [selectedDrop,     setSelectedDrop]     = useState<string | null>(null);

    const handleToggle = (id: string) => {
        const seat = ALL_SEATS.find(s => s.id === id);
        if (!seat || (seat.status !== 'available' && !selectedIds.has(id))) return;
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const selectedSeats  = ALL_SEATS.filter(s => selectedIds.has(s.id));
    const totalAmount    = selectedSeats.reduce((sum, s) => sum + s.price, 0);
    const selectedLabels = selectedSeats
        .sort((a, b) => a.deck === b.deck ? a.row - b.row : a.deck.localeCompare(b.deck))
        .map(s => `${s.deck === 'lower' ? 'L' : 'U'}${s.label}`)
        .join(', ');

    const boardingPt = BOARDING_POINTS.find(p => p.id === selectedBoarding);
    const dropPt     = DROP_POINTS.find(p => p.id === selectedDrop);
    const canProceed = selectedIds.size > 0 && selectedBoarding !== null && selectedDrop !== null;

    const handleProceed = () => {
        if (!canProceed || !boardingPt || !dropPt) return;
        navigate('/corporate-travel/bus-ticket/traveller', {
            state: {
                ...routeState,
                selectedSeats,
                totalAmount,
                boardingPoint:    boardingPt.name,
                boardingTime:     boardingPt.time,
                boardingDate:     boardingPt.date,
                boardingLandmark: boardingPt.landmark,
                dropPoint:        dropPt.name,
                dropTime:         dropPt.time,
                dropDate:         dropPt.date,
                dropLandmark:     dropPt.landmark,
            },
        });
    };

    // ── Details Card tab content ──────────────────────────────────────────────

    const busAmenities: string[] = bus?.amenities ?? ['Blankets', 'Charging Point', 'Wifi'];

    const amenitiesTab = (
        <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {ALL_AMENITY_KEYS.map(a => {
                const available = busAmenities.includes(a);
                return (
                    <div
                        key={a}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 12px', borderRadius: 8,
                            border: `1px solid ${available ? BDR : '#F0F0F0'}`,
                            opacity: available ? 1 : 0.4,
                        }}
                    >
                        <div style={{
                            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                            backgroundColor: available ? '#FFF1F0' : '#F5F5F5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {AMENITY_ICONS[a]}
                        </div>
                        <Text style={{ fontSize: 12, color: available ? TXT : HLP, fontWeight: available ? 500 : 400 }}>
                            {a}
                        </Text>
                    </div>
                );
            })}
        </div>
    );

    const rd = mockBusRating;
    const total = rd.totalRatings;
    const ratingsTab = (
        <div style={{ padding: 16 }}>
            {/* Score row */}
            <Flex align="flex-end" gap={16} style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 48, fontWeight: 800, color: TXT, lineHeight: 1 }}>
                    {rd.rating.toFixed(1)}
                </Text>
                <Flex vertical gap={2} style={{ paddingBottom: 4 }}>
                    <Flex gap={3}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <span key={i} style={{ color: i <= Math.round(rd.rating) ? '#F59E0B' : '#D9D9D9', fontSize: 18 }}>★</span>
                        ))}
                    </Flex>
                    <Text style={{ fontSize: 12, color: HLP }}>{total.toLocaleString()} ratings</Text>
                </Flex>
            </Flex>

            {/* Breakdown bars */}
            <Flex vertical gap={6} style={{ marginBottom: 16 }}>
                {([5, 4, 3, 2, 1] as const).map(star => {
                    const count   = rd.breakdown[star] ?? 0;
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                        <Flex key={star} align="center" gap={8}>
                            <Text style={{ fontSize: 12, color: HLP, width: 12, textAlign: 'right', flexShrink: 0 }}>{star}</Text>
                            <span style={{ color: '#F59E0B', fontSize: 13, flexShrink: 0 }}>★</span>
                            <div style={{ flex: 1 }}>
                                <Progress
                                    percent={percent}
                                    showInfo={false}
                                    strokeColor={star >= 4 ? '#52C41A' : star === 3 ? '#FAAD14' : P}
                                    trailColor="#F0F0F0"
                                    size="small"
                                />
                            </div>
                            <Text style={{ fontSize: 12, color: HLP, width: 28, textAlign: 'right', flexShrink: 0 }}>
                                {percent}%
                            </Text>
                        </Flex>
                    );
                })}
            </Flex>

            {/* Loved by pills */}
            <Text style={{ fontSize: 12, color: HLP, display: 'block', marginBottom: 8 }}>Loved by passengers for</Text>
            <Flex gap={6} wrap="wrap">
                {rd.lovedBy.map(item => (
                    <Tag key={item} color="green" style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>
                        {item}
                    </Tag>
                ))}
            </Flex>
        </div>
    );

    const policyTab = (
        <div style={{ padding: 16, overflowY: 'auto', maxHeight: 420 }}>
            <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, display: 'block', marginBottom: 12 }}>
                Travel Policy
            </Text>
            <Flex vertical gap={10} style={{ marginBottom: 20 }}>
                {TRAVEL_POLICIES.map(p => (
                    <Flex key={p.label} gap={10} align="flex-start">
                        <div style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', backgroundColor: P, flexShrink: 0 }} />
                        <Text style={{ fontSize: 13, color: TXT }}>
                            <strong style={{ fontWeight: 600 }}>{p.label}: </strong>
                            {p.value}
                        </Text>
                    </Flex>
                ))}
            </Flex>

            <Divider style={{ margin: '0 0 16px' }} />

            <Text style={{ fontSize: 14, fontWeight: 600, color: TXT, display: 'block', marginBottom: 12 }}>
                Cancellation Policy
            </Text>
            <Table
                dataSource={CANCELLATION_DATA}
                columns={CANCELLATION_COLUMNS}
                pagination={false}
                size="small"
                bordered
                style={{ marginBottom: 16 }}
            />
            <Flex vertical gap={4}>
                {DISCLAIMERS.map((note, i) => (
                    <Flex key={i} gap={4} align="flex-start">
                        <Text style={{ fontSize: 11, color: HLP, flexShrink: 0, lineHeight: 1.6 }}>*</Text>
                        <Text style={{ fontSize: 11, color: HLP, lineHeight: 1.6, fontWeight: 300 }}>{note}</Text>
                    </Flex>
                ))}
            </Flex>
        </div>
    );

    const detailsTabs = [
        {
            key:      'boarding',
            label:    'Boarding Point',
            children: <StopList points={BOARDING_POINTS} selected={selectedBoarding} onSelect={setSelectedBoarding} />,
        },
        {
            key:      'drop',
            label:    'Drop Point',
            children: <StopList points={DROP_POINTS} selected={selectedDrop} onSelect={setSelectedDrop} />,
        },
        { key: 'amenities', label: 'Amenities', children: amenitiesTab },
        { key: 'ratings',   label: 'Ratings',   children: ratingsTab   },
        { key: 'policy',    label: 'Policy',     children: policyTab    },
    ];

    // ── Validation hint ───────────────────────────────────────────────────────

    const missingItems = [
        ...(selectedIds.size === 0 ? ['seat'] : []),
        ...(selectedBoarding === null ? ['boarding point'] : []),
        ...(selectedDrop     === null ? ['drop point']     : []),
    ];

    return (
        <Flex vertical gap={16}>

            {/* ══ HEADER CARD ══ */}
            <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BDR}`, borderRadius: 12, padding: '12px 20px' }}>
                <Flex align="center" gap={12}>
                    <div
                        onClick={() => navigate(-1)}
                        style={{
                            width: 36, height: 36, borderRadius: '50%',
                            border: `1px solid ${BDR}`, backgroundColor: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        <ArrowLeftIcon size={18} color={TXT} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 16, fontWeight: 700, color: TXT, display: 'block', lineHeight: 1.3 }}>
                            {source} → {destination}
                        </Text>
                        <Text style={{ fontSize: 13, color: HLP }}>
                            {date} · {busTime(bus?.departure) ?? '10:30 PM'} – {busTime(bus?.arrival) ?? '05:20 AM'} · {bus?.operator ?? 'Parveen Travels'}
                        </Text>
                    </div>
                </Flex>
            </div>

            {/* ══ 3-COLUMN LAYOUT ══ */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

                {/* ── Column 1: Seat Map (flex 5 ≈ 50%) ── */}
                <div style={{ flex: 5, minWidth: 0 }}>

                    {/* Price tier filter */}
                    <Flex gap={8} align="center" style={{ marginBottom: 12 }} wrap="wrap">
                        <Text style={{ fontSize: 12, color: HLP, marginRight: 4 }}>Price:</Text>
                        <div
                            onClick={() => setPriceFilter(null)}
                            style={{
                                padding: '5px 12px', borderRadius: 6, cursor: 'pointer',
                                border: priceFilter === null ? `2px solid ${P}` : `1px solid #D9D9D9`,
                                backgroundColor: priceFilter === null ? '#FFF1F0' : '#FFF',
                            }}
                        >
                            <Text style={{ fontSize: 13, fontWeight: 600, color: priceFilter === null ? P : TXT }}>All</Text>
                        </div>
                        {PRICE_TIERS.map(tier => (
                            <div
                                key={tier.price}
                                onClick={() => setPriceFilter(tier.price)}
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    padding: '4px 12px', borderRadius: 6, cursor: 'pointer',
                                    border: priceFilter === tier.price ? `2px solid ${P}` : `1px solid #D9D9D9`,
                                    backgroundColor: priceFilter === tier.price ? '#FFF1F0' : '#FFF',
                                }}
                            >
                                <Text style={{ fontSize: 13, fontWeight: 600, lineHeight: 1, color: priceFilter === tier.price ? P : TXT }}>
                                    ₹{tier.price}
                                </Text>
                                <Text style={{ fontSize: 11, color: HLP, textDecoration: 'line-through', lineHeight: 1, marginTop: 2 }}>
                                    ₹{tier.originalPrice}
                                </Text>
                            </div>
                        ))}
                    </Flex>

                    {/* Seat legend */}
                    <Flex gap={10} wrap="wrap" style={{ marginBottom: 16 }}>
                        {[
                            { label: 'Available', bg: '#FFFFFF', border: '#D9D9D9' },
                            { label: 'Booked',    bg: '#F5F5F5', border: '#D9D9D9' },
                            { label: 'Selected',  bg: '#FFF1F0', border: P          },
                            { label: 'Female',    bg: '#FFF0F6', border: '#FFADD2'  },
                            { label: 'Male',      bg: '#F0F5FF', border: '#ADC6FF'  },
                        ].map(item => (
                            <Flex key={item.label} align="center" gap={5}>
                                <div style={{ width: 18, height: 18, backgroundColor: item.bg, border: `1px solid ${item.border}`, borderRadius: 4 }} />
                                <Text style={{ fontSize: 12, color: HLP }}>{item.label}</Text>
                            </Flex>
                        ))}
                    </Flex>

                    {/* Deck sections */}
                    <div style={{ overflowX: 'auto' }}>
                        <Flex gap={32} align="flex-start" style={{ flexWrap: 'wrap' }}>
                            <DeckSection deck="lower" selectedIds={selectedIds} priceFilter={priceFilter} onToggle={handleToggle} />
                            <DeckSection deck="upper" selectedIds={selectedIds} priceFilter={priceFilter} onToggle={handleToggle} />
                        </Flex>
                    </div>
                </div>

                {/* ── Column 2: Details Card (flex 3 ≈ 30%) ── */}
                <div style={{ flex: 3, minWidth: 0 }}>
                    <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${BDR}`, borderRadius: 12, overflow: 'hidden' }}>
                        <Tabs
                            items={detailsTabs}
                            size="small"
                            style={{ paddingLeft: 4, paddingRight: 4 }}
                            tabBarStyle={{ marginBottom: 0, paddingLeft: 12 }}
                        />
                    </div>
                </div>

                {/* ── Column 3: Booking Summary (flex 2 ≈ 20%) ── */}
                <div style={{ flex: 2, minWidth: 200 }}>
                    <div className="sticky" style={{ top: 16, backgroundColor: '#FFFFFF', border: `1px solid ${BDR}`, borderRadius: 12, padding: 20 }}>

                        {/* Section label */}
                        <Text style={{ fontSize: 11, fontWeight: 600, color: HLP, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 16 }}>
                            Booking Summary
                        </Text>

                        {/* Total amount */}
                        <Flex vertical gap={2} style={{ marginBottom: 4 }}>
                            <Text style={{ fontSize: 12, color: HLP }}>Total Amount</Text>
                            <Text style={{ fontSize: 28, fontWeight: 700, color: totalAmount > 0 ? P : '#D9D9D9', lineHeight: 1.1 }}>
                                {totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : '₹0'}
                            </Text>
                        </Flex>

                        <Divider style={{ margin: '12px 0' }} />

                        {/* Summary rows */}
                        <Flex vertical gap={10} style={{ marginBottom: 16 }}>
                            <Flex vertical gap={2}>
                                <Text style={{ fontSize: 11, color: HLP }}>Seat(s)</Text>
                                <Text style={{ fontSize: 13, fontWeight: 500, color: selectedIds.size > 0 ? TXT : '#BFBFBF' }}>
                                    {selectedLabels || '—'}
                                </Text>
                            </Flex>
                            <Flex vertical gap={2}>
                                <Text style={{ fontSize: 11, color: HLP }}>Boarding Point</Text>
                                <Text style={{ fontSize: 13, fontWeight: 500, color: boardingPt ? TXT : '#BFBFBF' }}>
                                    {boardingPt ? `${boardingPt.name} (${boardingPt.time})` : '—'}
                                </Text>
                            </Flex>
                            <Flex vertical gap={2}>
                                <Text style={{ fontSize: 11, color: HLP }}>Drop Point</Text>
                                <Text style={{ fontSize: 13, fontWeight: 500, color: dropPt ? TXT : '#BFBFBF' }}>
                                    {dropPt ? `${dropPt.name} (${dropPt.time})` : '—'}
                                </Text>
                            </Flex>
                        </Flex>

                        {/* Proceed button */}
                        <Button
                            block
                            size="large"
                            type={canProceed ? 'primary' : 'default'}
                            danger={canProceed}
                            disabled={!canProceed}
                            onClick={handleProceed}
                            style={{ borderRadius: 8, fontWeight: 600, height: 48 }}
                        >
                            Proceed
                        </Button>

                        {/* Validation hint */}
                        {missingItems.length > 0 && (
                            <Text style={{ fontSize: 11, color: HLP, display: 'block', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
                                Select {missingItems.join(', ')} to continue
                            </Text>
                        )}
                    </div>
                </div>
            </div>
        </Flex>
    );
};

export default BusTicketSeatSelection;
