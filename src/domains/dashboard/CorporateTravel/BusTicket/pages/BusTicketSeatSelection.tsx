import { useState } from 'react';

import { StarFilled, StarOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Popover, Row, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import {
    BedIcon, ChargingIcon, FilmIcon, PhoneIcon, WaterIcon, WifiIcon,
} from '../components/SolarIcons';

import { BusEntry } from '@src/mock/data';

import BoardingDropDrawer from '../components/BoardingDropDrawer';
import PoliciesDrawer from '../components/PoliciesDrawer';

const { Text, Title } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Mock Seat Data ───────────────────────────────────────────────────────────
// 14 lower + 14 upper berths in a 2+1 sleeper layout.
// At least 15 seats are available across both decks.

const ALL_SEATS: SeatDef[] = [
    // ── LOWER DECK ──
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
    // ── UPPER DECK ──
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

// Distinct price tiers (lower deck = ₹950, upper deck = ₹850)
const PRICE_TIERS = [
    { price: 950, originalPrice: 1200 },
    { price: 850, originalPrice: 1050 },
];

// ─── Amenity Icon Map ─────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, React.ReactNode> = {
    Blankets:                   <BedIcon      size={14} color="#8C8C8C" />,
    'Charging Point':           <ChargingIcon size={14} color="#8C8C8C" />,
    'Emergency Contact Number': <PhoneIcon    size={14} color="#8C8C8C" />,
    Movie:                      <FilmIcon     size={14} color="#8C8C8C" />,
    Wifi:                       <WifiIcon     size={14} color="#8C8C8C" />,
    'Water Bottle':             <WaterIcon    size={14} color="#8C8C8C" />,
};

// ─── Status Style Map ─────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string | 'selected', { bg: string; border: string; borderW: string; text: string }> = {
    available: { bg: '#FFFFFF', border: '#D9D9D9', borderW: '1px',  text: '#171717' },
    booked:    { bg: '#F5F5F5', border: '#D9D9D9', borderW: '1px',  text: '#BFBFBF' },
    female:    { bg: '#FFF0F6', border: '#FFADD2', borderW: '1px',  text: '#EB2F96' },
    male:      { bg: '#F0F5FF', border: '#ADC6FF', borderW: '1px',  text: '#2F54EB' },
    selected:  { bg: '#FFF1F0', border: '#FF4F4F', borderW: '2px',  text: '#FF4F4F' },
};

// ─── Steering Wheel SVG ───────────────────────────────────────────────────────

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

// ─── Seat Berth ───────────────────────────────────────────────────────────────

const BERTH_W = 40;
const BERTH_H = 40;
const STRIP_H = 4;

const SeatBerth = ({
    seat,
    isSelected,
    isFiltered,
    onToggle,
}: {
    seat: SeatDef;
    isSelected: boolean;
    isFiltered: boolean;
    onToggle: (id: string) => void;
}) => {
    const effectiveKey = isSelected ? 'selected' : seat.status;
    const s = STATUS_STYLE[effectiveKey];
    const clickable = seat.status === 'available' || isSelected;

    return (
        <div
            onClick={clickable ? () => onToggle(seat.id) : undefined}
            title={clickable ? `Seat ${seat.label} • ₹${seat.price}` : `Seat ${seat.label} — ${seat.status}`}
            className={`relative select-none rounded-md transition-all ${
                isFiltered ? 'opacity-25' : ''
            } ${clickable ? 'hover:scale-105' : ''}`}
            style={{
                width: BERTH_W,
                height: BERTH_H,
                backgroundColor: s.bg,
                border: `${s.borderW} solid ${s.border}`,
                borderRadius: 6,
                cursor: clickable ? 'pointer' : 'not-allowed',
            }}
        >
            {/* Seat label */}
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ paddingBottom: STRIP_H }}
            >
                <Text
                    className="text-xs font-semibold leading-none"
                    style={{ color: s.text, fontSize: 11 }}
                >
                    {seat.label}
                </Text>
            </div>
            {/* Status strip at bottom */}
            <div
                className="absolute bottom-0 left-0 right-0 rounded-b-md"
                style={{ height: STRIP_H, backgroundColor: s.strip }}
            />
        </div>
    );
};

// ─── Deck Section ─────────────────────────────────────────────────────────────

const groupRows = (seats: SeatDef[]) => {
    const map = new Map<number, { a?: SeatDef; b?: SeatDef; c?: SeatDef }>();
    seats.forEach(s => {
        if (!map.has(s.row)) map.set(s.row, {});
        map.get(s.row)![s.col] = s;
    });
    return [...map.entries()].sort(([a], [b]) => a - b);
};

const DeckSection = ({
    deck,
    selectedIds,
    priceFilter,
    onToggle,
}: {
    deck: 'lower' | 'upper';
    selectedIds: Set<string>;
    priceFilter: number | null;
    onToggle: (id: string) => void;
}) => {
    const deckSeats = ALL_SEATS.filter(s => s.deck === deck);
    const rows = groupRows(deckSeats);
    const isLower = deck === 'lower';
    const AISLE_W = 28;

    return (
        <Flex vertical gap={8}>
            <Text style={{ fontSize: 11, fontWeight: 600, color: '#8C8C8C', textTransform: 'uppercase', letterSpacing: 1 }}>
                {isLower ? 'Lower Deck' : 'Upper Deck'}
            </Text>

            <div
                className="bg-white p-4"
                style={{ border: '1px solid #E8E8E8', borderRadius: 8, display: 'inline-block' }}
            >
                {/* Driver position — lower deck only */}
                {isLower && (
                    <div className="flex justify-end mb-3 pb-3 border-b border-gray-100">
                        <Flex align="center" gap={4}>
                            <Text className="text-xs text-gray-400">Driver</Text>
                            <SteeringWheel />
                        </Flex>
                    </div>
                )}

                {/* Column headers */}
                <div
                    className="flex items-center mb-2"
                    style={{ gap: 4 }}
                >
                    <div className="flex" style={{ gap: 4 }}>
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

                {/* Seat rows */}
                <Flex vertical gap={6}>
                    {rows.map(([rowNum, rowSeats]) => (
                        <div key={rowNum} className="flex items-center" style={{ gap: 4 }}>
                            {/* Left side: columns A + B */}
                            <div className="flex" style={{ gap: 4 }}>
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

                            {/* Aisle */}
                            <div
                                className="flex items-center justify-center flex-shrink-0"
                                style={{ width: AISLE_W, height: BERTH_H }}
                            >
                                <div className="h-full w-px border-l border-dashed border-gray-200" />
                            </div>

                            {/* Right side: column C */}
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

// ─── Main Component ───────────────────────────────────────────────────────────

type RouteState = {
    // bus can be the old BusEntry (departure/arrival as strings) or the new
    // BusResultEntry (departure/arrival as objects with a .time property).
    bus?: any;
    source?: string;
    destination?: string;
    date?: string;
};

// Safely extract a display time string from either format.
const busTime = (v: unknown): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === 'object' && 'time' in (v as object)) return (v as { time: string }).time;
    return v as string;
};

const BusTicketSeatSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routeState = (location.state ?? {}) as RouteState;

    const bus = routeState.bus;
    const source      = routeState.source      ?? 'Bengaluru';
    const destination = routeState.destination ?? 'Chennai';
    const date        = routeState.date        ?? 'Today';

    // ── Seat selection state ──
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // ── Price tier filter (null = All) ──
    const [priceFilter, setPriceFilter] = useState<number | null>(null);

    // ── Drawer / popover state ──
    const [boardingOpen, setBoardingOpen] = useState(false);
    const [policiesOpen, setPoliciesOpen] = useState(false);

    // ── Seat toggle ──
    const handleToggle = (id: string) => {
        const seat = ALL_SEATS.find(s => s.id === id);
        if (!seat) return;
        if (seat.status !== 'available' && !selectedIds.has(id)) return;

        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    // ── Derived values ──
    const selectedSeats = ALL_SEATS.filter(s => selectedIds.has(s.id));

    const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

    const selectedLabels = selectedSeats
        .sort((a, b) => (a.deck === b.deck ? a.row - b.row : a.deck.localeCompare(b.deck)))
        .map(s => `${s.deck === 'lower' ? 'L' : 'U'}${s.label}`)
        .join(', ');

    // ── Navigate to boarding point selection ──
    const handleProceed = () => {
        if (selectedIds.size === 0) return;
        navigate('/corporate-travel/bus-ticket/boarding', {
            state: { bus, source, destination, date, selectedSeats, totalAmount },
        });
    };

    // ── Amenities popover content ──
    const amenitiesContent = (
        <Flex vertical gap={10} className="min-w-[160px]">
            {(bus?.amenities ?? ['Blankets', 'Charging Point', 'Wifi']).map(a => (
                <Flex key={a} align="center" gap={8}>
                    {AMENITY_ICONS[a] ?? <span className="w-3 h-3 rounded-full bg-gray-300 flex-shrink-0" />}
                    <Text className="text-sm text-gray-700">{a}</Text>
                </Flex>
            ))}
        </Flex>
    );

    // ── Ratings popover content ──
    const rating = bus?.rating ?? 4.2;
    const ratingFilled = Math.round(rating);
    const ratingsContent = (
        <Flex vertical gap={8} className="min-w-[160px] px-1">
            <Flex align="center" gap={8}>
                <Text className="text-3xl font-black text-gray-800">{rating.toFixed(1)}</Text>
                <Flex vertical gap={2}>
                    <Flex gap={2}>
                        {Array.from({ length: 5 }).map((_, i) =>
                            i < ratingFilled
                                ? <StarFilled key={i} style={{ color: '#F59E0B', fontSize: 14 }} />
                                : <StarOutlined key={i} style={{ color: '#D1D5DB', fontSize: 14 }} />
                        )}
                    </Flex>
                    <Text className="text-xs text-gray-400">
                        {(bus?.totalRatings ?? 1240).toLocaleString()} ratings
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );

    // ── Booking summary panel (reused on desktop sidebar and mobile footer) ──
    const SummaryPanel = ({ compact = false }: { compact?: boolean }) => (
        <div
            className={`bg-white ${compact ? 'p-3' : 'p-5'}`}
            style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
        >
            {!compact && (
                <Text className="text-xs text-gray-400 uppercase tracking-wide block mb-1">
                    Booking Summary
                </Text>
            )}

            <Flex justify="space-between" align="center" className={compact ? '' : 'mb-4'}>
                <Flex vertical gap={2}>
                    <Text className="text-xs text-gray-500">Total Amount</Text>
                    <Text
                        className="font-black leading-none"
                        style={{
                            fontSize: compact ? 20 : 28,
                            color: totalAmount > 0 ? '#FF4F4F' : '#BFBFBF',
                        }}
                    >
                        {totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : '₹0'}
                    </Text>
                </Flex>

                {compact && (
                    <Button
                        size="large"
                        disabled={selectedIds.size === 0}
                        onClick={handleProceed}
                        className="rounded-md font-semibold"
                        style={
                            selectedIds.size > 0
                                ? { backgroundColor: '#FF4F4F', borderColor: '#FF4F4F', color: '#fff', borderRadius: 6, fontWeight: 600 }
                                : undefined
                        }
                    >
                        Proceed
                    </Button>
                )}
            </Flex>

            {!compact && (
                <>
                    <Divider className="my-3" />

                    <Flex vertical gap={2} className="mb-5">
                        <Text className="text-xs text-gray-500">Seat No.</Text>
                        <Text className="text-sm font-medium text-gray-700 min-h-[20px]">
                            {selectedLabels || '—'}
                        </Text>
                    </Flex>

                    <Button
                        block
                        size="large"
                        disabled={selectedIds.size === 0}
                        onClick={handleProceed}
                        className="rounded-md font-semibold"
                        style={
                            selectedIds.size > 0
                                ? { backgroundColor: '#FF4F4F', borderColor: '#FF4F4F', color: '#fff', borderRadius: 6, fontWeight: 600 }
                                : undefined
                        }
                    >
                        Proceed to Boarding Points
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <Flex vertical gap={16}>

            {/* ══ HEADER CARD ══ */}
            <div
                className="bg-white p-4"
                style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
            >
                <Row gutter={[16, 8]} align="middle">
                    <Col xs={24} md={14}>
                        <Flex vertical gap={4}>
                            <Text className="font-bold text-lg leading-tight">
                                {source} → {destination}
                            </Text>
                            <Text className="text-gray-400 text-sm">
                                {date} • {busTime(bus?.departure) ?? '10:30 PM'} – {busTime(bus?.arrival) ?? '05:20 AM'}
                            </Text>
                        </Flex>
                    </Col>
                    <Col xs={24} md={10}>
                        <Flex vertical gap={3} className="md:items-end">
                            <Text className="font-bold text-base">{bus?.operator ?? 'Parveen Travels'}</Text>
                            <Text className="text-gray-400 text-sm">{bus?.busType ?? 'Bharat Benz A/C Sleeper (2+1)'}</Text>
                        </Flex>
                    </Col>
                </Row>
            </div>

            {/* ══ INFO BAR ══ */}
            <Flex
                gap={0}
                align="center"
                className="border-b border-gray-100 pb-3 flex-wrap gap-y-2"
            >
                {[
                    {
                        label: 'Boarding & Drop Points',
                        action: () => setBoardingOpen(true),
                        popover: false,
                        content: null,
                    },
                    {
                        label: 'Amenities',
                        action: null,
                        popover: true,
                        content: amenitiesContent,
                    },
                    {
                        label: 'Ratings',
                        action: null,
                        popover: true,
                        content: ratingsContent,
                    },
                    {
                        label: 'Policies',
                        action: () => setPoliciesOpen(true),
                        popover: false,
                        content: null,
                    },
                ].map((item, i) => (
                    <Flex key={item.label} align="center">
                        {i > 0 && <Divider type="vertical" className="mx-2" />}
                        {item.popover ? (
                            <Popover
                                content={item.content}
                                trigger="click"
                                placement="bottomLeft"
                                overlayInnerStyle={{ padding: 12 }}
                                arrow={false}
                            >
                                <Text className="text-sm cursor-pointer select-none" style={{ color: '#FF4F4F', fontWeight: 500 }}>
                                    {item.label}
                                </Text>
                            </Popover>
                        ) : (
                            <Text
                                onClick={item.action ?? undefined}
                                className="text-amber-500 text-sm cursor-pointer hover:text-amber-600 hover:underline select-none"
                            >
                                {item.label}
                            </Text>
                        )}
                    </Flex>
                ))}
            </Flex>

            {/* ══ PRICE TIER FILTER ══ */}
            <Flex gap={8} align="center" className="flex-wrap">
                <Text className="text-xs text-gray-500 me-1">Price:</Text>

                {/* All button */}
                <div
                    onClick={() => setPriceFilter(null)}
                    className="px-3 py-1.5 cursor-pointer select-none transition-all"
                    style={{
                        borderRadius: 6,
                        border: priceFilter === null ? '2px solid #FF4F4F' : '1px solid #D9D9D9',
                        backgroundColor: priceFilter === null ? '#FFF1F0' : '#FFFFFF',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14, fontWeight: 600,
                            color: priceFilter === null ? '#FF4F4F' : '#171717',
                        }}
                    >
                        All
                    </Text>
                </div>

                {PRICE_TIERS.map(tier => (
                    <div
                        key={tier.price}
                        onClick={() => setPriceFilter(tier.price)}
                        className="flex flex-col items-center px-3 py-1.5 cursor-pointer select-none transition-all"
                        style={{
                            borderRadius: 6,
                            border: priceFilter === tier.price ? '2px solid #FF4F4F' : '1px solid #D9D9D9',
                            backgroundColor: priceFilter === tier.price ? '#FFF1F0' : '#FFFFFF',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 14, fontWeight: 600, lineHeight: 1,
                                color: priceFilter === tier.price ? '#FF4F4F' : '#171717',
                            }}
                        >
                            ₹{tier.price}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#8C8C8C', textDecoration: 'line-through', lineHeight: 1, marginTop: 2 }}>
                            ₹{tier.originalPrice}
                        </Text>
                    </div>
                ))}
            </Flex>

            {/* ══ SEAT LEGEND ══ */}
            <Flex gap={12} align="center" className="flex-wrap">
                {[
                    { label: 'Available', bg: '#FFFFFF', border: '#D9D9D9' },
                    { label: 'Booked',    bg: '#F5F5F5', border: '#D9D9D9' },
                    { label: 'Selected',  bg: '#FFF1F0', border: '#FF4F4F' },
                    { label: 'Female',    bg: '#FFF0F6', border: '#FFADD2' },
                    { label: 'Male',      bg: '#F0F5FF', border: '#ADC6FF' },
                ].map(item => (
                    <Flex key={item.label} align="center" gap={5}>
                        <div
                            style={{
                                width: 22,
                                height: 22,
                                backgroundColor: item.bg,
                                border: `1px solid ${item.border}`,
                                borderRadius: 4,
                            }}
                        />
                        <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{item.label}</Text>
                    </Flex>
                ))}
            </Flex>

            {/* ══ MAIN TWO-COLUMN LAYOUT ══ */}
            <Row gutter={[20, 20]} align="top">

                {/* Left: Seat Maps */}
                <Col xs={24} md={18}>
                    <div className="overflow-x-auto">
                        <Flex gap={24} align="flex-start" className="flex-col sm:flex-row">
                            <DeckSection
                                deck="lower"
                                selectedIds={selectedIds}
                                priceFilter={priceFilter}
                                onToggle={handleToggle}
                            />
                            <DeckSection
                                deck="upper"
                                selectedIds={selectedIds}
                                priceFilter={priceFilter}
                                onToggle={handleToggle}
                            />
                        </Flex>
                    </div>
                </Col>

                {/* Right: Booking Summary (desktop) */}
                <Col xs={0} md={6}>
                    <div className="sticky top-4">
                        <SummaryPanel />
                    </div>
                </Col>
            </Row>

            {/* Mobile Booking Summary */}
            <div className="md:hidden">
                <SummaryPanel compact />
            </div>

            {/* ══ DRAWERS ══ */}
            <BoardingDropDrawer open={boardingOpen} onClose={() => setBoardingOpen(false)} />
            <PoliciesDrawer     open={policiesOpen} onClose={() => setPoliciesOpen(false)} />
        </Flex>
    );
};

export default BusTicketSeatSelection;
