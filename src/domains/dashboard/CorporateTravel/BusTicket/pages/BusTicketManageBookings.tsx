import { useState } from 'react';

import { Button, Flex, Pagination, Tabs, Tag, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import { mockBusBookings, type BusBookingEntry } from '@src/mock/data';

import { BusOutlineIcon } from '../components/SolarIcons';

const { Text } = Typography;

const P   = '#FF4F4F';
const TXT = '#171717';
const HLP = '#8C8C8C';
const BDR = '#E8E8E8';

// ─── Inline icons ─────────────────────────────────────────────────────────────

const HelpCircleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={HLP}
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

// ─── Booking Card ─────────────────────────────────────────────────────────────

const BookingCard = ({ booking }: { booking: BusBookingEntry }) => {
    const navigate = useNavigate();

    const isCancelled = booking.status === 'cancelled';

    return (
        <div style={{
            backgroundColor: '#FFFFFF', border: `1px solid ${BDR}`,
            borderRadius: 8, padding: '20px 24px',
        }}>

            {/* ── Main row ── */}
            <Flex align="flex-start" gap={24} style={{ flexWrap: 'wrap' as const }}>

                {/* Left: operator area */}
                <div style={{
                    width: 120, minHeight: 120, backgroundColor: '#FFF1F0',
                    borderRadius: 8, flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: 4, padding: '10px 8px',
                }}>
                    <BusOutlineIcon size={40} color={P} />
                    <Text style={{
                        fontSize: 13, fontWeight: 600, color: P,
                        textAlign: 'center', lineHeight: 1.3, display: 'block',
                    }}>
                        {booking.bus.operator}
                    </Text>
                    <Text style={{
                        fontSize: 12, color: HLP,
                        textAlign: 'center', lineHeight: 1.3, display: 'block',
                    }}>
                        {booking.bus.busType}
                    </Text>
                    {isCancelled && (
                        <Tag color="error" style={{ margin: '4px 0 0', fontSize: 11 }}>Cancelled</Tag>
                    )}
                </div>

                {/* Centre: journey info */}
                <Flex align="flex-start" style={{ flex: 1, minWidth: 220 }}>

                    {/* Departure */}
                    <Flex vertical gap={2} style={{ minWidth: 90 }}>
                        <Text style={{ fontSize: 12, color: HLP }}>Departure</Text>
                        <Text style={{ fontSize: 22, fontWeight: 700, color: TXT, lineHeight: 1 }}>
                            {booking.bus.departure}
                        </Text>
                        <Text style={{ fontSize: 13, color: TXT }}>{booking.date}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>{booking.sourceCode}</Text>
                        <Text style={{ fontSize: 12, color: HLP }}>{booking.source}</Text>
                        <Text style={{ fontSize: 12, color: HLP }}>{booking.boardingPoint}</Text>
                    </Flex>

                    {/* Duration pill */}
                    <Flex vertical align="center" style={{ flex: 1, paddingTop: 20, paddingLeft: 8, paddingRight: 8 }}>
                        <Flex align="center" style={{ width: '100%' }}>
                            <div style={{ flex: 1, borderTop: `2px dashed ${P}` }} />
                            <div style={{
                                margin: '0 6px', padding: '2px 10px',
                                borderRadius: 20, border: `1px solid ${BDR}`,
                                backgroundColor: '#FAFAFA', flexShrink: 0,
                            }}>
                                <Text style={{ fontSize: 13, color: HLP, whiteSpace: 'nowrap' as const }}>
                                    {booking.bus.duration}
                                </Text>
                            </div>
                            <div style={{ flex: 1, borderTop: `2px dashed ${P}` }} />
                        </Flex>
                        <Text style={{ fontSize: 12, color: HLP, marginTop: 4 }}>{booking.stops}</Text>
                    </Flex>

                    {/* Arrival */}
                    <Flex vertical gap={2} align="flex-end" style={{ minWidth: 90 }}>
                        <Text style={{ fontSize: 12, color: HLP }}>Arrival</Text>
                        <Text style={{ fontSize: 22, fontWeight: 700, color: TXT, lineHeight: 1 }}>
                            {booking.bus.arrival}
                        </Text>
                        <Text style={{ fontSize: 13, color: TXT }}>{booking.arrivalDate}</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>{booking.destinationCode}</Text>
                        <Text style={{ fontSize: 12, color: HLP }}>{booking.destination}</Text>
                        <Text style={{ fontSize: 12, color: HLP }}>{booking.dropPoint}</Text>
                    </Flex>

                </Flex>

                {/* Right: CTAs */}
                <Flex vertical gap={8} style={{ minWidth: 164, flexShrink: 0 }}>
                    <Button
                        onClick={() =>
                            navigate('/corporate-travel/bus-ticket/confirmation', { state: booking })
                        }
                        style={{
                            backgroundColor: P, borderColor: P,
                            color: '#fff', fontWeight: 600, borderRadius: 6, height: 40,
                        }}
                    >
                        Download Booking
                    </Button>
                    <Button
                        onClick={() => void message.info('Coming soon')}
                        style={{
                            backgroundColor: '#fff', borderColor: P,
                            color: P, borderRadius: 6, height: 40,
                        }}
                    >
                        View / Manage Booking
                    </Button>
                </Flex>

            </Flex>

            {/* ── Bottom info row ── */}
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 12, marginTop: 12 }}>
                <Flex gap={24} style={{ flexWrap: 'wrap' as const }}>
                    <Text style={{ fontSize: 13, color: HLP }}>
                        <strong style={{ color: TXT, fontWeight: 600 }}>PNR:</strong> {booking.pnr}
                    </Text>
                    <Text style={{ fontSize: 13, color: HLP }}>
                        <strong style={{ color: TXT, fontWeight: 600 }}>Confirmation Number:</strong>{' '}
                        {booking.confirmationNumber}
                    </Text>
                    <Text style={{ fontSize: 13, color: HLP }}>
                        <strong style={{ color: TXT, fontWeight: 600 }}>Booking Date:</strong>{' '}
                        {booking.bookingDate}
                    </Text>
                </Flex>
            </div>

        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BusTicketManageBookings = () => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const upcomingList = mockBusBookings.filter(b => b.status === 'upcoming');
    const pastList     = mockBusBookings.filter(b => b.status === 'past' || b.status === 'cancelled');
    const displayed    = activeTab === 'upcoming' ? upcomingList : pastList;

    return (
        <>
            <style>{`
                .bus-manage-tabs .ant-tabs-ink-bar { background: #FF4F4F !important; }
                .bus-manage-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #FF4F4F !important; }
                .bus-manage-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn { color: #FF4F4F !important; }
            `}</style>

            <Flex vertical gap={20} style={{ padding: '0 24px 40px' }}>

                {/* ── Header row ── */}
                <Flex justify="space-between" align="flex-start">
                    <Flex vertical gap={4}>
                        {/* Breadcrumb */}
                        <Flex align="center" gap={6}>
                            <Text style={{ fontSize: 13, color: HLP }}>Corporate Travel</Text>
                            <Text style={{ fontSize: 13, color: HLP }}>›</Text>
                            <Text style={{ fontSize: 13, color: TXT }}>Manage Bookings</Text>
                        </Flex>
                        {/* Title */}
                        <Text style={{ fontSize: 22, fontWeight: 600, color: TXT }}>
                            Manage Your Bookings
                        </Text>
                    </Flex>

                    {/* Support link */}
                    <Flex align="center" gap={6} style={{ cursor: 'pointer', paddingTop: 4 }}>
                        <HelpCircleIcon />
                        <Text style={{ fontSize: 13, color: HLP }}>Support</Text>
                    </Flex>
                </Flex>

                {/* ── Tabs ── */}
                <Tabs
                    className="bus-manage-tabs"
                    activeKey={activeTab}
                    onChange={k => setActiveTab(k as 'upcoming' | 'past')}
                    style={{ marginBottom: 0 }}
                    items={[
                        { key: 'upcoming', label: 'Upcoming Ticket' },
                        { key: 'past',     label: 'Past and Cancelled' },
                    ]}
                />

                {/* ── Booking cards ── */}
                <Flex vertical gap={16}>
                    {displayed.length > 0
                        ? displayed.map(b => <BookingCard key={b.id} booking={b} />)
                        : (
                            <div style={{ textAlign: 'center', padding: 48 }}>
                                <Text style={{ fontSize: 14, color: HLP }}>No bookings found.</Text>
                            </div>
                        )
                    }
                </Flex>

                {/* ── Pagination ── */}
                {displayed.length > 0 && (
                    <Flex justify="flex-end">
                        <Pagination
                            current={1}
                            total={displayed.length}
                            pageSize={10}
                            showSizeChanger={false}
                        />
                    </Flex>
                )}

            </Flex>
        </>
    );
};

export default BusTicketManageBookings;
