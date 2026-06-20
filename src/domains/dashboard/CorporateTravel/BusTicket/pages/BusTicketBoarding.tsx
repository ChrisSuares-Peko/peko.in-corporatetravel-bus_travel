import { useState } from 'react';

import { Button, Col, Divider, Flex, Radio, Row, Typography, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

interface StopPoint {
    id: string;
    name: string;
    time: string;
    date: string;
    landmark: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BOARDING_POINTS: StopPoint[] = [
    {
        id: 'B1',
        name: 'Nayandahalli',
        time: '05:00 AM',
        date: '04 Jun',
        landmark: 'In Front Of Nayandahalli Metro Station, Opposite To Global Mall',
    },
    {
        id: 'B2',
        name: 'Majestic Bus Station',
        time: '05:25 AM',
        date: '04 Jun',
        landmark:
            'Sri Krishna Tours & Travels, 19 Hotel Mayura Cmplx, Tank Bund Rd, Subash Nagar, Opp Majestic Bus Stand',
    },
    {
        id: 'B3',
        name: 'Anand Rao Circle',
        time: '05:30 AM',
        date: '04 Jun',
        landmark: 'SRE Travels (Kalpana Tourist)',
    },
    {
        id: 'B4',
        name: 'Corporation Circle',
        time: '05:40 AM',
        date: '04 Jun',
        landmark: 'Infront of City Bus Stop',
    },
    {
        id: 'B5',
        name: 'Shanthi Nagar(C)',
        time: '05:50 AM',
        date: '04 Jun',
        landmark: 'Infront of SRS Logistics',
    },
    {
        id: 'B6',
        name: 'Koramangala',
        time: '06:05 AM',
        date: '04 Jun',
        landmark: 'Nexus Mall back gate, next to Christ University',
    },
    {
        id: 'B7',
        name: 'St. Johns Hospital',
        time: '06:10 AM',
        date: '04 Jun',
        landmark: 'Infront of HP Petroleum Pump',
    },
    {
        id: 'B8',
        name: 'Madiwala',
        time: '06:15 AM',
        date: '04 Jun',
        landmark: 'Near Happiest Mind Technologies',
    },
    {
        id: 'B9',
        name: 'Silk Board (Flyover End)',
        time: '06:20 AM',
        date: '04 Jun',
        landmark: 'Flyover End, Opp to Metro Station',
    },
];

const DROP_POINTS: StopPoint[] = [
    {
        id: 'D1',
        name: 'Sri Perumbudur',
        time: '12:40 PM',
        date: '04 Jun',
        landmark: 'Near Sriperumbudur Toll Plaza (Towards Poonamalle)',
    },
    {
        id: 'D2',
        name: 'Poonamallee Bypass',
        time: '12:55 PM',
        date: '04 Jun',
        landmark: 'Near BSNL Telephone Exchange',
    },
    {
        id: 'D3',
        name: 'Velappanchavadi',
        time: '01:00 PM',
        date: '04 Jun',
        landmark: 'Infront of Velappanchavadi Bus Stop',
    },
    {
        id: 'D4',
        name: 'Maduravoyal',
        time: '01:10 PM',
        date: '04 Jun',
        landmark: 'Maduravoyal Erikarai Bus Stop',
    },
    {
        id: 'D5',
        name: 'Koyambedu',
        time: '01:15 PM',
        date: '04 Jun',
        landmark: 'Opp to CMBT',
    },
    {
        id: 'D6',
        name: 'Vadapalani',
        time: '01:35 PM',
        date: '04 Jun',
        landmark: 'Opp to Murugan Idli Restaurant',
    },
    {
        id: 'D7',
        name: 'Ashok Nagar',
        time: '01:45 PM',
        date: '04 Jun',
        landmark: 'Infront of Sree Mithai Store',
    },
    {
        id: 'D8',
        name: 'Guindy',
        time: '01:50 PM',
        date: '04 Jun',
        landmark: 'Opp to Olympia Tech Park',
    },
    {
        id: 'D9',
        name: 'Anna University',
        time: '02:00 PM',
        date: '04 Jun',
        landmark: 'Infront of Anna University Bus Stop',
    },
    {
        id: 'D10',
        name: 'Madhya Kailash',
        time: '02:05 PM',
        date: '04 Jun',
        landmark: '',
    },
];

// ─── Stop Point List ──────────────────────────────────────────────────────────

const StopList = ({
    title,
    points,
    selected,
    onSelect,
}: {
    title: string;
    points: StopPoint[];
    selected: string | null;
    onSelect: (id: string) => void;
}) => (
    <div
        className="bg-white overflow-hidden"
        style={{ border: '1px solid #E8E8E8', borderRadius: 12 }}
    >
        {/* Column header */}
        <div className="px-4 py-3 border-b" style={{ borderColor: '#F0F0F0', backgroundColor: '#FAFAFA' }}>
            <Text style={{ fontSize: 16, fontWeight: 600, color: '#171717' }}>{title}</Text>
        </div>

        {/* Scrollable list */}
        <div className="md:max-h-[520px] md:overflow-y-auto">
            {points.map((point, idx) => (
                <div key={point.id}>
                    <div
                        onClick={() => onSelect(point.id)}
                        className="flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors"
                        style={{ backgroundColor: selected === point.id ? '#FFF1F0' : undefined }}
                    >
                        {/* Radio indicator */}
                        <Radio
                            checked={selected === point.id}
                            className="mt-0.5 flex-shrink-0 pointer-events-none"
                        />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <Text
                                className="block leading-tight"
                                style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}
                            >
                                {point.name}
                            </Text>
                            <Text
                                className="block mt-1"
                                style={{ fontSize: 13, color: '#FF4F4F' }}
                            >
                                {point.time}, {point.date}
                            </Text>
                            {point.landmark && (
                                <Text
                                    className="block mt-0.5 leading-relaxed"
                                    style={{ fontSize: 12, fontWeight: 300, color: '#8C8C8C' }}
                                >
                                    {point.landmark}
                                </Text>
                            )}
                        </div>
                    </div>
                    {idx < points.length - 1 && <Divider className="my-0" />}
                </div>
            ))}
        </div>
    </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const BusTicketBoarding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as Record<string, any>;

    // ── Route state ──
    const source        = rs.source        ?? 'Bengaluru';
    const destination   = rs.destination   ?? 'Chennai';
    const selectedSeats = Array.isArray(rs.selectedSeats) ? rs.selectedSeats : [];
    const totalAmount   = typeof rs.totalAmount === 'number' ? rs.totalAmount : 0;

    // ── Selection state ──
    const [selectedBoarding, setSelectedBoarding] = useState<string | null>(null);
    const [selectedDrop, setSelectedDrop]         = useState<string | null>(null);

    // ── Derived: seat labels for summary ──
    const seatLabels = selectedSeats.length > 0
        ? selectedSeats
              .slice()
              .sort((a: any, b: any) =>
                  a.deck === b.deck ? a.row - b.row : a.deck.localeCompare(b.deck)
              )
              .map((s: any) => `${s.deck === 'lower' ? 'L' : 'U'}${s.label}`)
              .join(', ')
        : '—';

    const proceedEnabled = selectedBoarding !== null && selectedDrop !== null;

    // ── Navigate to traveller selection ──
    const handleProceed = () => {
        if (!proceedEnabled) {
            message.warning('Please select a boarding point and a drop point to continue');
            return;
        }

        const boardingPoint = BOARDING_POINTS.find(p => p.id === selectedBoarding)!;
        const dropPoint     = DROP_POINTS.find(p => p.id === selectedDrop)!;

        navigate('/corporate-travel/bus-ticket/traveller', {
            state: {
                ...rs,
                boardingPoint: boardingPoint.name,
                boardingTime:  boardingPoint.time,
                boardingDate:  boardingPoint.date,
                boardingLandmark: boardingPoint.landmark,
                dropPoint:     dropPoint.name,
                dropTime:      dropPoint.time,
                dropDate:      dropPoint.date,
                dropLandmark:  dropPoint.landmark,
            },
        });
    };

    // ── Booking summary panel ──
    const SummaryPanel = ({ compact = false }: { compact?: boolean }) => (
        <div
            className={`bg-white ${compact ? 'p-4' : 'p-5'}`}
            style={{ border: '1px solid #E8E8E8', borderRadius: 12 }}
        >
            {/* Total */}
            <Flex vertical gap={2} className="mb-4">
                <Text className="text-xs text-gray-400 uppercase tracking-wide">
                    Total Amount
                </Text>
                <Text
                    className="font-black leading-none"
                    style={{
                        fontSize: compact ? 22 : 28,
                        color: totalAmount > 0 ? '#FF4F4F' : '#BFBFBF',
                    }}
                >
                    {totalAmount > 0 ? `₹${totalAmount.toLocaleString()}` : '₹0'}
                </Text>
            </Flex>

            {!compact && (
                <>
                    <Divider className="my-3" />
                    <Flex vertical gap={2} className="mb-5">
                        <Text className="text-xs text-gray-500">Seat No.</Text>
                        <Text className="text-sm font-medium text-gray-700">{seatLabels}</Text>
                    </Flex>
                </>
            )}

            <Button
                block
                size="large"
                disabled={!proceedEnabled}
                onClick={handleProceed}
                className="rounded-md font-semibold"
                style={
                    proceedEnabled
                        ? { backgroundColor: '#FF4F4F', borderColor: '#FF4F4F', color: '#fff', borderRadius: 8, fontWeight: 600, height: 48 }
                        : undefined
                }
            >
                Proceed to Traveller Selection
            </Button>

            {!proceedEnabled && (
                <Text className="text-xs text-gray-400 mt-3 block text-center">
                    {!selectedBoarding && !selectedDrop
                        ? 'Select a boarding point and a drop point'
                        : !selectedBoarding
                        ? 'Select a boarding point to continue'
                        : 'Select a drop point to continue'}
                </Text>
            )}
        </div>
    );

    return (
        <Flex vertical gap={20}>

            {/* ── Page Header ── */}
            <Flex align="center" gap={12}>
                <div
                    onClick={() => navigate(-1)}
                    style={{
                        width: 36, height: 36, borderRadius: '50%',
                        border: '1px solid #E8E8E8', backgroundColor: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', flexShrink: 0,
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                </div>
                <Title level={4} className="m-0">
                    {source} to {destination}
                </Title>
            </Flex>

            {/* ── Three-Column Layout ── */}
            <Row gutter={[16, 16]} align="top">

                {/* Left — Boarding Points */}
                <Col xs={24} md={9}>
                    <StopList
                        title="Boarding Point"
                        points={BOARDING_POINTS}
                        selected={selectedBoarding}
                        onSelect={setSelectedBoarding}
                    />
                </Col>

                {/* Middle — Drop Points */}
                <Col xs={24} md={9}>
                    <StopList
                        title="Drop Point"
                        points={DROP_POINTS}
                        selected={selectedDrop}
                        onSelect={setSelectedDrop}
                    />
                </Col>

                {/* Right — Booking Summary (desktop) */}
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
        </Flex>
    );
};

export default BusTicketBoarding;
