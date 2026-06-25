import { useState } from 'react';

import { Button, Divider, Flex, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import PekoLogo from '@assets/Logo.png';

import { BusOutlineIcon } from '../components/SolarIcons';

const { Text } = Typography;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const busTime = (v: unknown): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === 'object' && v !== null && 'time' in v) return (v as { time: string }).time;
    return v as string;
};

const getSeatLabel = (seatId: string, seats: any[]): string => {
    const seat = seats.find((s: any) => s.id === seatId);
    if (!seat) return seatId;
    return `${seat.deck === 'lower' ? 'L' : 'U'}${seat.label}`;
};

const fmtDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'Today') return dayjs().format('ddd, DD MMM');
    const parsed = dayjs(dateStr, 'DD MMM');
    return parsed.isValid() ? parsed.format('ddd, DD MMM') : dateStr;
};

// ─── Inline SVG icon ─────────────────────────────────────────────────────────

const DownloadIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

// ─── Important Information ────────────────────────────────────────────────────

const IMPORTANT_INFO = [
    'Please arrive at the boarding point at least 15 minutes before departure.',
    'Carry a valid government-issued photo ID for verification at the time of boarding.',
    'The bus operator is not obligated to wait beyond the scheduled departure time.',
    'Excess baggage over 10 kgs per passenger will be chargeable.',
    'Cancellation charges apply as per the bus operator\'s policy.',
    'Use your Confirmation Number for all communication with Peko about this booking.',
    'Peko Helpline: +971 4 540 1266 | Peko Support Email: reach@peko.one | www.peko.one',
];

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_BUS = {
    operator: 'Parveen Travels',
    busType:  'Bharat Benz A/C Sleeper (2+1)',
    departure: '10:30 PM',
    arrival:   '05:20 AM',
    duration:  '6h 50m',
};

const FALLBACK_SEATS = [
    { id: 'L1', label: 'L1', deck: 'lower', price: 950 },
    { id: 'U5', label: 'U5', deck: 'upper', price: 850 },
];

const FALLBACK_TRAVELLERS = [
    { seatId: 'L1', name: 'John Smith',    age: '34', gender: 'Male'   },
    { seatId: 'U5', name: 'Sarah Johnson', age: '28', gender: 'Female' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const BusTicketConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as Record<string, any>;

    // ── Extract route state with fallbacks ──
    const bus              = rs.bus ?? FALLBACK_BUS;
    const source           = rs.source        ?? 'Bengaluru';
    const destination      = rs.destination   ?? 'Chennai';
    const date             = rs.date          ?? 'Today';
    const selectedSeats    = Array.isArray(rs.selectedSeats)    && rs.selectedSeats.length    > 0 ? rs.selectedSeats    : FALLBACK_SEATS;
    const travellerDetails = Array.isArray(rs.travellerDetails) && rs.travellerDetails.length > 0 ? rs.travellerDetails : FALLBACK_TRAVELLERS;
    const totalAmount      = typeof rs.totalAmount === 'number' && rs.totalAmount > 0
        ? rs.totalAmount
        : selectedSeats.reduce((s: number, seat: any) => s + (seat.price ?? 0), 0);
    const grandTotal       = typeof rs.grandTotal === 'number' ? rs.grandTotal : totalAmount;
    const boardingPoint    = rs.boardingPoint ?? 'Silk Board';
    const dropPoint        = rs.dropPoint     ?? 'Koyambedu';

    // ── Fare breakdown display ──
    const fareBaseFare = Math.round(totalAmount * 0.85 * 100) / 100;

    // ── Stable mock values generated once per mount ──
    const [confirmationNumber] = useState<string>(() =>
        String(Math.floor(Math.random() * 90000000) + 10000000)
    );
    const [pnr] = useState<string>(() =>
        Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    // ── Formatted dates ──
    const bookedOn    = dayjs().format('ddd MMM DD YYYY');
    const travelDate  = fmtDate(date);
    const arrivalDate = date === 'Today'
        ? dayjs().add(1, 'day').format('ddd, DD MMM')
        : (() => {
              const p = dayjs(date, 'DD MMM');
              return p.isValid() ? p.add(1, 'day').format('ddd, DD MMM') : date;
          })();

    // ── Seat summary string ──
    const seatNumbers = selectedSeats
        .map((s: any) => `${s.deck === 'lower' ? 'L' : 'U'}${s.label}`)
        .join(', ');

    return (
        <>
            {/* ── Print styles ── */}
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    nav, aside, header,
                    [class*="sidebar"], [class*="Sidebar"],
                    [class*="breadcrumb"], [class*="Breadcrumb"],
                    [class*="layout-header"], [class*="LayoutHeader"] {
                        display: none !important;
                    }
                    body { background: #fff !important; }
                    #ticket-content { width: 100% !important; max-width: 100% !important; }
                }
            `}</style>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <div style={{ width: '70%', maxWidth: '70%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* ── Breadcrumb-style title (hidden on print) ── */}
                <div className="no-print">
                    <Text style={{ fontSize: 20, fontWeight: 700, color: '#171717' }}>
                        Booking Confirmed
                    </Text>
                </div>

                <div id="ticket-content">

                    {/* ══ HEADER SECTION ══ */}
                    <div style={{
                        backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                        borderRadius: 8, padding: 24, marginBottom: 16,
                    }}>
                        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
                            <Text style={{
                                fontSize: 28, fontWeight: 700, color: '#171717',
                                fontFamily: 'Roboto, sans-serif',
                            }}>
                                Ticket Confirmation
                            </Text>
                            <img src={PekoLogo} alt="Peko" style={{ height: 36, objectFit: 'contain' }} />
                        </Flex>

                        <Divider style={{ margin: '0 0 16px', borderColor: '#E8E8E8' }} />

                        <Text style={{ fontSize: 14, fontWeight: 700, color: '#171717', display: 'block', marginBottom: 6 }}>
                            Confirmation Number: {confirmationNumber}
                        </Text>
                        <Flex justify="space-between" align="center">
                            <Text style={{ fontSize: 13, color: '#171717' }}>
                                Booking Status: <strong style={{ fontWeight: 600 }}>Confirmed</strong>
                            </Text>
                            <Text style={{ fontSize: 13, color: '#8C8C8C' }}>
                                Booked on: {bookedOn}
                            </Text>
                        </Flex>

                        <Divider style={{ margin: '16px 0', borderColor: '#E8E8E8' }} />

                        <Flex justify="space-between" align="center">
                            <Text style={{ fontSize: 18, fontWeight: 600, color: '#171717' }}>
                                {source} – {destination} • {travelDate}
                            </Text>
                            <Text style={{ fontSize: 16, fontWeight: 700, color: '#171717' }}>
                                PNR: <span style={{ letterSpacing: 2 }}>{pnr}</span>
                            </Text>
                        </Flex>
                    </div>

                    {/* ══ JOURNEY CARD ══ */}
                    <div style={{
                        backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                        borderRadius: 8, padding: '20px 24px', marginBottom: 16,
                    }}>
                        {/* Operator row */}
                        <Flex align="center" gap={12} style={{ marginBottom: 20 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 8,
                                backgroundColor: '#FFF1F0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <BusOutlineIcon size={24} color="#FF4F4F" />
                            </div>
                            <Flex vertical gap={2}>
                                <Text style={{ fontSize: 15, fontWeight: 600, color: '#171717' }}>
                                    {bus.operator ?? 'Parveen Travels'}
                                </Text>
                                <Text style={{ fontSize: 13, color: '#FF4F4F' }}>
                                    {bus.busType ?? 'A/C Sleeper (2+1)'}
                                </Text>
                            </Flex>
                        </Flex>

                        {/* Journey timeline */}
                        <Flex align="flex-start" justify="space-between" style={{ marginBottom: 20 }}>

                            {/* Departure */}
                            <Flex vertical gap={4} style={{ minWidth: 130 }}>
                                <Text style={{ fontSize: 13, color: '#8C8C8C' }}>{travelDate}</Text>
                                <Text style={{ fontSize: 28, fontWeight: 700, color: '#171717', lineHeight: 1 }}>
                                    {busTime(bus.departure) ?? '10:30 PM'}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#171717' }}>{source}</Text>
                                <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{boardingPoint}</Text>
                            </Flex>

                            {/* Duration pill */}
                            <Flex align="center" style={{ flex: 1, paddingTop: 22, paddingLeft: 12, paddingRight: 12 }}>
                                <div style={{ flex: 1, borderTop: '2px dashed #E8E8E8' }} />
                                <div style={{
                                    margin: '0 10px', padding: '4px 14px',
                                    borderRadius: 20, border: '1px solid #E8E8E8',
                                    backgroundColor: '#FAFAFA', flexShrink: 0,
                                }}>
                                    <Text style={{ fontSize: 13, color: '#8C8C8C', whiteSpace: 'nowrap' }}>
                                        {bus.duration ?? '6h 50m'}
                                    </Text>
                                </div>
                                <div style={{ flex: 1, borderTop: '2px dashed #E8E8E8' }} />
                            </Flex>

                            {/* Arrival */}
                            <Flex vertical gap={4} align="flex-end" style={{ minWidth: 130 }}>
                                <Text style={{ fontSize: 13, color: '#8C8C8C' }}>{arrivalDate}</Text>
                                <Text style={{ fontSize: 28, fontWeight: 700, color: '#171717', lineHeight: 1 }}>
                                    {busTime(bus.arrival) ?? '05:20 AM'}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#171717' }}>{destination}</Text>
                                <Text style={{ fontSize: 12, color: '#8C8C8C' }}>{dropPoint}</Text>
                            </Flex>
                        </Flex>

                        <Divider style={{ margin: '0 0 16px', borderColor: '#E8E8E8' }} />

                        {/* Seat + Bus type bottom row */}
                        <Flex justify="space-between">
                            <Text style={{ fontSize: 13, color: '#171717' }}>
                                Seat No: <strong style={{ fontWeight: 600 }}>{seatNumbers}</strong>
                            </Text>
                            <Text style={{ fontSize: 13, color: '#171717' }}>
                                Bus Type: <strong style={{ fontWeight: 600 }}>{bus.busType ?? 'A/C Sleeper (2+1)'}</strong>
                            </Text>
                        </Flex>
                    </div>

                    {/* ══ TRAVELLERS SECTION ══ */}
                    <div style={{
                        backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                        borderRadius: 8, padding: '20px 24px', marginBottom: 16,
                    }}>
                        <Flex justify="space-between" align="center">
                            <Text style={{
                                fontSize: 12, fontWeight: 600, color: '#8C8C8C',
                                textTransform: 'uppercase', letterSpacing: 0.5,
                            }}>
                                Travellers
                            </Text>
                            <Text style={{
                                fontSize: 12, fontWeight: 600, color: '#8C8C8C',
                                textTransform: 'uppercase', letterSpacing: 0.5,
                            }}>
                                Seat No.
                            </Text>
                        </Flex>

                        <Divider style={{ margin: '12px 0', borderColor: '#E8E8E8' }} />

                        {travellerDetails.map((td: any, i: number) => (
                            <div key={td.seatId ?? i}>
                                <Flex justify="space-between" align="center" style={{ padding: '10px 0' }}>
                                    <Flex align="center" gap={8} style={{ flexWrap: 'wrap' as const }}>
                                        <Text style={{ fontSize: 14, fontWeight: 500, color: '#171717' }}>
                                            {td.name}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                                            {td.gender}, {td.age} yrs
                                        </Text>
                                        {i === 0 && (
                                            <Tag color="blue" style={{ fontSize: 11, margin: 0 }}>
                                                Primary Traveller
                                            </Tag>
                                        )}
                                    </Flex>
                                    <Text style={{ fontSize: 13, fontWeight: 600, color: '#FF4F4F' }}>
                                        {getSeatLabel(td.seatId, selectedSeats)}
                                    </Text>
                                </Flex>
                                {i < travellerDetails.length - 1 && (
                                    <Divider style={{ margin: 0, borderColor: '#F0F0F0' }} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ══ FARE BREAKUP ══ */}
                    <div style={{
                        backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                        borderRadius: 8, padding: '20px 24px', marginBottom: 16,
                    }}>
                        <Text style={{
                            fontSize: 14, fontWeight: 700, color: '#171717',
                            display: 'block', marginBottom: 12,
                        }}>
                            FARE BREAKUP
                        </Text>
                        <Divider style={{ margin: '0 0 16px', borderColor: '#E8E8E8' }} />

                        {/* Three items side by side */}
                        <Flex justify="space-between" style={{ marginBottom: 16 }}>
                            <Flex vertical gap={4}>
                                <Text style={{ fontSize: 12, color: '#8C8C8C' }}>Base Fare:</Text>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>
                                    ₹{fareBaseFare.toLocaleString()}
                                </Text>
                            </Flex>
                            <Flex vertical gap={4}>
                                <Text style={{ fontSize: 12, color: '#8C8C8C' }}>Platform Fee:</Text>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>₹49.00</Text>
                            </Flex>
                            <Flex vertical gap={4}>
                                <Text style={{ fontSize: 12, color: '#8C8C8C' }}>GST (18%):</Text>
                                <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>₹8.82</Text>
                            </Flex>
                        </Flex>

                        <Divider style={{ margin: '0 0 16px', borderColor: '#F0F0F0' }} />

                        <Flex justify="space-between" align="center">
                            <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>Total Fare:</Text>
                            <Text style={{ fontSize: 16, fontWeight: 700, color: '#FF4F4F' }}>
                                ₹{grandTotal.toLocaleString()}
                            </Text>
                        </Flex>
                    </div>

                    {/* ══ IMPORTANT INFORMATION ══ */}
                    <div style={{
                        backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                        borderRadius: 8, padding: '20px 24px',
                    }}>
                        <Text style={{
                            fontSize: 13, fontWeight: 600, color: '#171717',
                            textTransform: 'uppercase', letterSpacing: 0.5,
                            display: 'block', marginBottom: 16,
                        }}>
                            IMPORTANT INFORMATION
                        </Text>
                        <Flex vertical gap={8}>
                            {IMPORTANT_INFO.map((info, i) => (
                                <Flex key={i} gap={10} align="flex-start">
                                    <div style={{
                                        marginTop: 5, width: 5, height: 5,
                                        borderRadius: '50%', backgroundColor: '#FF4F4F', flexShrink: 0,
                                    }} />
                                    <Text style={{ fontSize: 13, color: '#171717' }}>{info}</Text>
                                </Flex>
                            ))}
                        </Flex>
                    </div>

                </div>

                {/* ══ ACTION BUTTONS (hidden on print) ══ */}
                <Flex justify="center" gap={12} style={{ marginTop: 8, paddingBottom: 32 }} className="no-print">
                    <Button
                        size="large"
                        onClick={() => window.print()}
                        icon={<DownloadIcon />}
                        style={{
                            backgroundColor: '#FF4F4F', borderColor: '#FF4F4F',
                            color: '#fff', borderRadius: 8, fontWeight: 600,
                            height: 44, paddingLeft: 24, paddingRight: 24,
                        }}
                    >
                        Download Ticket
                    </Button>
                    <Button
                        size="large"
                        onClick={() => navigate('/corporate-travel')}
                        style={{
                            backgroundColor: '#fff', borderColor: '#D9D9D9',
                            color: '#171717', borderRadius: 8,
                            height: 44, paddingLeft: 24, paddingRight: 24,
                        }}
                    >
                        Back to Home
                    </Button>
                </Flex>

            </div>
            </div>
        </>
    );
};

export default BusTicketConfirmation;
