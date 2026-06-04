import { useEffect, useRef, useState } from 'react';

import { ClockCircleOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Collapse,
    Divider,
    Flex,
    Modal,
    Row,
    Table,
    Tag,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text, Title, Paragraph } = Typography;

// Safely extract a display time string from either the old string format
// (BusEntry) or the new object format (BusResultEntry { time, city, ... }).
const busTime = (v: unknown): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === 'object' && v !== null && 'time' in v) return (v as { time: string }).time;
    return v as string;
};

// ─── Shared Policy Data (mirrors PoliciesDrawer) ──────────────────────────────

const TRAVEL_POLICIES = [
    { label: 'Child Passenger Policy',  value: 'Children above the age of 3 will need a ticket' },
    { label: 'Luggage Policy',          value: '1 piece of luggage will be accepted free of charge per passenger. Excess items will be chargeable' },
    { label: 'Excess Baggage',          value: 'Excess baggage over 10 kgs per passenger will be chargeable' },
    { label: 'Pets Policy',             value: 'Pets are not allowed' },
    { label: 'Liquor Policy',           value: 'Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers' },
    { label: 'Pick Up Time Policy',     value: 'Bus operator is not obligated to wait beyond the scheduled departure time. No refund will be entertained for late arriving passengers' },
];

const CANCELLATION_DATA = [
    { key: '1', time: 'Before 4th Jun 10:30 AM',                                         percent: '15%', amount: '₹184.50'   },
    { key: '2', time: 'After 4th Jun 10:30 AM & Before 4th Jun 02:30 PM',                percent: '30%', amount: '₹369.00'   },
    { key: '3', time: 'After 4th Jun 02:30 PM & Before 4th Jun 06:30 PM',                percent: '60%', amount: '₹738.00'   },
    { key: '4', time: 'After 4th Jun 06:30 PM & Before 4th Jun 10:30 PM',               percent: '95%', amount: '₹1,168.50' },
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

const CANCELLATION_COLUMNS = [
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (v: string) => <Text className="text-xs text-gray-700">{v}</Text>,
    },
    {
        title: 'Cancellation %',
        dataIndex: 'percent',
        key: 'percent',
        align: 'center' as const,
        render: (v: string) => <Text className="text-xs font-semibold text-gray-700">{v}</Text>,
    },
    {
        title: 'Cancellation Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right' as const,
        render: (v: string) => <Text className="text-xs font-semibold text-red-500">{v}</Text>,
    },
];

// ─── Fallback data for direct-navigation during development ───────────────────

const FALLBACK_BUS = {
    operator: 'Parveen Travels',
    busType: 'Bharat Benz A/C Sleeper (2+1)',
    departure: '10:30 PM',
    arrival: '05:20 AM',
    duration: '6h 50m',
};

const FALLBACK_TRAVELLERS = [
    { seatId: 'L1', name: 'John Smith',    age: '34', gender: 'Male'   },
    { seatId: 'U5', name: 'Sarah Johnson', age: '28', gender: 'Female' },
];

const FALLBACK_SEATS = [
    { id: 'L1', label: 'L1', deck: 'lower', price: 950 },
    { id: 'U5', label: 'U5', deck: 'upper', price: 850 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'Today') return dayjs().format('ddd, DD MMM');
    const parsed = dayjs(dateStr, 'DD MMM');
    return parsed.isValid() ? parsed.format('ddd, DD MMM') : dateStr;
};

const nextDayDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'Today') return dayjs().add(1, 'day').format('ddd, DD MMM');
    const parsed = dayjs(dateStr, 'DD MMM');
    return parsed.isValid() ? parsed.add(1, 'day').format('ddd, DD MMM') : dateStr;
};

const getSeatLabel = (seatId: string, seats: any[]): string => {
    const seat = seats.find((s: any) => s.id === seatId);
    if (!seat) return seatId;
    return `${seat.deck === 'lower' ? 'L' : 'U'}${seat.label}`;
};

// ─── Policy Content (shared with PoliciesDrawer) ──────────────────────────────

const PolicyContent = () => (
    <Flex vertical gap={20}>
        <div>
            <Text className="font-semibold text-gray-700 text-sm block mb-3">Travel Policy</Text>
            <Flex vertical gap={10}>
                {TRAVEL_POLICIES.map(p => (
                    <Flex key={p.label} gap={8} align="flex-start">
                        <div
                            className="mt-1.5 flex-shrink-0 rounded-full"
                            style={{ width: 5, height: 5, minWidth: 5, backgroundColor: '#FF4F4F' }}
                        />
                        <Paragraph className="text-sm text-gray-600 mb-0">
                            <Text className="font-semibold text-gray-700 text-sm">
                                {p.label}:{' '}
                            </Text>
                            {p.value}
                        </Paragraph>
                    </Flex>
                ))}
            </Flex>
        </div>

        <Divider className="my-0" />

        <div>
            <Text className="font-semibold text-gray-700 text-sm block mb-3">
                Cancellation Policy
            </Text>
            <div className="overflow-x-auto">
                <Table
                    dataSource={CANCELLATION_DATA}
                    columns={CANCELLATION_COLUMNS}
                    pagination={false}
                    size="small"
                    bordered
                    className="mb-4"
                />
            </div>
            <Flex vertical gap={5}>
                {DISCLAIMERS.map((note, i) => (
                    <Flex key={i} gap={5} align="flex-start">
                        <Text className="text-gray-400 text-xs flex-shrink-0">*</Text>
                        <Text className="text-gray-400 text-xs leading-relaxed">{note}</Text>
                    </Flex>
                ))}
            </Flex>
        </div>
    </Flex>
);

// ─── Countdown Timer ──────────────────────────────────────────────────────────

const INITIAL_SECONDS = 10 * 60;

// ─── Main Component ───────────────────────────────────────────────────────────

const BusTicketReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as Record<string, any>;

    // ── Extract route state with fallbacks ──
    const bus           = rs.bus ?? FALLBACK_BUS;
    const source        = rs.source        ?? 'Bangalore';
    const destination   = rs.destination   ?? 'Mumbai';
    const date          = rs.date          ?? 'Today';
    const selectedSeats = Array.isArray(rs.selectedSeats) && rs.selectedSeats.length > 0
        ? rs.selectedSeats
        : FALLBACK_SEATS;
    const travellerDetails = Array.isArray(rs.travellerDetails) && rs.travellerDetails.length > 0
        ? rs.travellerDetails
        : FALLBACK_TRAVELLERS;
    const totalAmount   = (typeof rs.totalAmount === 'number' && rs.totalAmount > 0)
        ? rs.totalAmount
        : selectedSeats.reduce((s: number, seat: any) => s + (seat.price ?? 0), 0);
    const boardingPoint = rs.boardingPoint ?? 'Silk Board';
    const dropPoint     = rs.dropPoint     ?? 'Koyambedu';

    // ── Fare calculations ──
    const baseFare   = totalAmount;
    const gst        = Math.round(baseFare * 0.05);
    const grandTotal = baseFare + gst;

    // ── Journey dates ──
    const boardingDate = formatDate(date);
    const dropDate     = nextDayDate(date);

    // ── Countdown timer ──
    const [timeLeft, setTimeLeft]         = useState(INITIAL_SECONDS);
    const [sessionExpired, setSessionExpired] = useState(false);
    const expiredFiredRef                  = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (!expiredFiredRef.current) {
                        expiredFiredRef.current = true;
                        setSessionExpired(true);
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const timerMM      = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const timerSS      = String(timeLeft % 60).padStart(2, '0');
    const timerWarning = timeLeft < 120;

    // ── Proceed to Payment ──
    const handleProceed = () => {
        navigate('/corporate-travel/bus-ticket/payment', {
            state: { ...rs, grandTotal },
        });
    };

    return (
        <Flex vertical gap={20}>

            {/* ══ PAGE HEADER ══ */}
            <Flex justify="space-between" align="flex-start" className="flex-wrap gap-3">
                <Flex vertical gap={4}>
                    <Title level={4} className="m-0">
                        Review Booking
                    </Title>
                    <Text className="font-semibold text-gray-700 text-base">
                        {source} → {destination}
                    </Text>
                </Flex>

                {/* Countdown Timer */}
                <Flex
                    align="center"
                    gap={6}
                    className="border border-gray-200 rounded-xl px-4 py-2 bg-white"
                    style={{ border: '1px solid #E8E8E8', borderRadius: 6 }}
                >
                    <ClockCircleOutlined
                        style={{ color: timerWarning ? '#EF4444' : '#9CA3AF', fontSize: 14 }}
                    />
                    <Text
                        className="font-mono font-semibold tabular-nums"
                        style={{
                            color: timerWarning ? '#EF4444' : '#6B7280',
                            fontSize: 15,
                        }}
                    >
                        {timerMM}:{timerSS}
                    </Text>
                    <Text className="text-gray-400 text-xs">remaining</Text>
                </Flex>
            </Flex>

            {/* ══ MAIN TWO-COLUMN LAYOUT ══ */}
            <Row gutter={[20, 20]} align="top">

                {/* ══════════════════════════════════
                    LEFT COLUMN — Cards
                ══════════════════════════════════ */}
                <Col xs={24} md={17}>
                    <Flex vertical gap={16}>

                        {/* ── Card 1: Bus & Journey Details ── */}
                        <div
                            className="bg-white p-5"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
                        >
                            {/* Operator Header */}
                            <Flex vertical gap={2} className="mb-5">
                                <Text className="font-bold text-base">{bus.operator}</Text>
                                <Text className="text-gray-400 text-sm">{bus.busType}</Text>
                            </Flex>

                            <Divider className="my-4" />

                            {/* Journey Timeline */}
                            <Flex align="flex-start" justify="space-between" className="flex-wrap sm:flex-nowrap gap-4">
                                {/* Boarding */}
                                <Flex vertical gap={3} style={{ minWidth: 110 }}>
                                    <Text
                                        className="font-black leading-none tabular-nums"
                                        style={{ fontSize: 22 }}
                                    >
                                        {busTime(bus.departure) ?? bus.departure}
                                    </Text>
                                    <Text className="text-gray-400 text-xs">
                                        • {boardingDate}
                                    </Text>
                                    <Text className="font-bold text-sm mt-1">{boardingPoint}</Text>
                                    <Text className="text-gray-400 text-xs">Boarding point</Text>
                                </Flex>

                                {/* Duration pill */}
                                <Flex
                                    align="center"
                                    flex={1}
                                    className="mx-4 min-w-[80px]"
                                    style={{ paddingTop: 6 }}
                                >
                                    <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                                    <div
                                        className="mx-2 px-3 py-1 rounded-full border border-gray-200 bg-gray-50 flex-shrink-0"
                                    >
                                        <Text className="text-xs text-gray-500 whitespace-nowrap">
                                            {bus.duration}
                                        </Text>
                                    </div>
                                    <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                                </Flex>

                                {/* Drop */}
                                <Flex
                                    vertical
                                    gap={3}
                                    align="flex-end"
                                    style={{ minWidth: 110 }}
                                    className="text-right"
                                >
                                    <Text
                                        className="font-black leading-none tabular-nums"
                                        style={{ fontSize: 22 }}
                                    >
                                        {busTime(bus.arrival) ?? bus.arrival}
                                    </Text>
                                    <Text className="text-gray-400 text-xs">
                                        • {dropDate}
                                    </Text>
                                    <Text className="font-bold text-sm mt-1">{dropPoint}</Text>
                                    <Text className="text-gray-400 text-xs">Drop point</Text>
                                </Flex>
                            </Flex>
                        </div>

                        {/* ── Card 2: Traveller Details ── */}
                        <div
                            className="bg-white overflow-hidden"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
                        >
                            {/* Header row */}
                            <Flex
                                justify="space-between"
                                align="center"
                                className="px-5 py-4 border-b border-gray-100"
                            >
                                <Text className="font-bold text-sm text-gray-700">
                                    Traveller ({travellerDetails.length})
                                </Text>
                                <Text className="font-bold text-sm text-gray-700">
                                    Seat number
                                </Text>
                            </Flex>

                            {/* Traveller rows */}
                            {travellerDetails.map((td: any, idx: number) => (
                                <div key={td.seatId ?? idx}>
                                    <Flex
                                        justify="space-between"
                                        align="center"
                                        className="px-5 py-4 flex-wrap gap-2"
                                    >
                                        {/* Left — traveller info */}
                                        <Flex align="center" gap={8} className="flex-wrap">
                                            <Text className="text-sm font-medium text-gray-800">
                                                {td.name}
                                            </Text>
                                            <Text className="text-gray-400 text-xs">
                                                {td.gender}, {td.age} yrs
                                            </Text>
                                            {idx === 0 && (
                                                <Tag color="blue" className="text-xs">
                                                    Primary Traveller
                                                </Tag>
                                            )}
                                        </Flex>

                                        {/* Right — seat number */}
                                        <Text
                                            className="text-sm font-semibold"
                                            style={{ color: '#FF4F4F' }}
                                        >
                                            {getSeatLabel(td.seatId, selectedSeats)}
                                        </Text>
                                    </Flex>
                                    {idx < travellerDetails.length - 1 && (
                                        <Divider className="my-0 mx-5" style={{ width: 'auto' }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* ── Card 3: Cancellation and Travel Policies ── */}
                        <div
                            className="bg-white overflow-hidden"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
                        >
                            <Collapse
                                ghost
                                expandIconPosition="start"
                                items={[
                                    {
                                        key: '1',
                                        label: (
                                            <Text className="font-medium text-gray-700 text-sm">
                                                Cancellation and travel policies
                                            </Text>
                                        ),
                                        children: (
                                            <div className="pb-2">
                                                <PolicyContent />
                                            </div>
                                        ),
                                    },
                                ]}
                                className="px-1"
                            />
                        </div>
                    </Flex>
                </Col>

                {/* ══════════════════════════════════
                    RIGHT COLUMN — Booking Summary
                ══════════════════════════════════ */}
                <Col xs={24} md={7}>
                    <div className="sticky top-4">
                        <div
                            className="bg-white p-5"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 8 }}
                        >
                            {/* Total */}
                            <Flex vertical gap={3} className="mb-5">
                                <Text className="text-xs text-gray-500 uppercase tracking-wide">
                                    Total Amount
                                </Text>
                                <Text
                                    className="font-black leading-none"
                                    style={{ fontSize: 28, color: '#FF4F4F' }}
                                >
                                    ₹{grandTotal.toLocaleString()}
                                </Text>
                                <Text className="text-gray-400 text-xs">
                                    Incl. taxes &amp; fees
                                </Text>
                            </Flex>

                            <Button
                                block
                                size="large"
                                onClick={handleProceed}
                                className="rounded-md font-semibold mb-4"
                                style={{
                                    backgroundColor: '#FF4F4F',
                                    borderColor: '#FF4F4F',
                                    color: '#fff',
                                    borderRadius: 6,
                                    fontWeight: 600,
                                }}
                            >
                                Proceed to Payment
                            </Button>

                            {/* Fare break-up */}
                            <Collapse
                                ghost
                                expandIconPosition="start"
                                items={[
                                    {
                                        key: 'fare',
                                        label: (
                                            <Text className="text-sm" style={{ color: '#FF4F4F' }}>
                                                View fare break-up
                                            </Text>
                                        ),
                                        children: (
                                            <Flex vertical gap={8} className="pb-1">
                                                {[
                                                    { label: 'Base fare',  value: `₹${baseFare.toLocaleString()}` },
                                                    { label: 'GST (5%)',   value: `₹${gst.toLocaleString()}` },
                                                ].map(row => (
                                                    <Flex
                                                        key={row.label}
                                                        justify="space-between"
                                                        align="center"
                                                    >
                                                        <Text className="text-gray-500 text-sm">
                                                            {row.label}
                                                        </Text>
                                                        <Text className="text-sm text-gray-700">
                                                            {row.value}
                                                        </Text>
                                                    </Flex>
                                                ))}
                                                <Divider className="my-1" />
                                                <Flex justify="space-between" align="center">
                                                    <Text className="font-semibold text-sm text-gray-700">
                                                        Total
                                                    </Text>
                                                    <Text
                                                        className="font-bold text-sm"
                                                        style={{ color: '#FF4F4F' }}
                                                    >
                                                        ₹{grandTotal.toLocaleString()}
                                                    </Text>
                                                </Flex>
                                            </Flex>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </Col>
            </Row>

            {/* ══ SESSION EXPIRED MODAL ══ */}
            <Modal
                open={sessionExpired}
                title="Session Expired"
                closable={false}
                maskClosable={false}
                footer={
                    <Button
                        onClick={() => {
                            setSessionExpired(false);
                            navigate('/corporate-travel/bus-ticket');
                        }}
                        style={{ backgroundColor: '#FF4F4F', borderColor: '#FF4F4F', color: '#fff' }}
                    >
                        Search Again
                    </Button>
                }
            >
                <Text className="text-gray-600">
                    Your session has expired. Please search again.
                </Text>
            </Modal>
        </Flex>
    );
};

export default BusTicketReview;
