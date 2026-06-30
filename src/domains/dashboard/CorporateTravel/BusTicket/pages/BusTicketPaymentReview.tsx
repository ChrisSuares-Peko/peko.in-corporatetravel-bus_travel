import { useState } from 'react';

import { Button, Col, Divider, Flex, Input, Row, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

import { ArrowLeftIcon } from '../components/SolarIcons';

const { Text } = Typography;

const PLATFORM_FEE = 57.82;

const FALLBACK_BUS = { operator: 'Parveen Travels' };

const FALLBACK_SEATS = [
    { id: 'L1', label: 'L1', deck: 'lower', price: 950 },
    { id: 'U5', label: 'U5', deck: 'upper', price: 850 },
];

const formatDate = (dateStr: string): string => {
    if (!dateStr || dateStr === 'Today') return dayjs().format('ddd, DD MMM');
    const parsed = dayjs(dateStr, 'DD MMM');
    return parsed.isValid() ? parsed.format('ddd, DD MMM') : dateStr;
};

const getSeatNumbers = (seats: any[]): string =>
    seats.map(s => s.label ?? s.id).join(', ');

// ─── Payment Provider Icon ────────────────────────────────────────────────────

const CashfreeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect width="28" height="28" rx="6" fill="#00D09C" />
        <text x="14" y="19" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="Roboto, sans-serif">CF</text>
    </svg>
);

// ─── Bill Row ─────────────────────────────────────────────────────────────────

const BillRow = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, color: '#171717', fontWeight: bold ? 700 : 400 }}>
            {label}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: 600, color: bold ? '#FF4F4F' : '#171717' }}>
            {value}
        </Text>
    </Flex>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const BusTicketPaymentReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as Record<string, any>;
    const [messageApi, contextHolder] = message.useMessage();

    const bus           = rs.bus ?? FALLBACK_BUS;
    const source        = rs.source      ?? 'Bangalore';
    const destination   = rs.destination ?? 'Mumbai';
    const date          = rs.date        ?? 'Today';
    const selectedSeats = Array.isArray(rs.selectedSeats) && rs.selectedSeats.length > 0
        ? rs.selectedSeats
        : FALLBACK_SEATS;
    const totalAmount   = (typeof rs.totalAmount === 'number' && rs.totalAmount > 0)
        ? rs.totalAmount
        : selectedSeats.reduce((s: number, seat: any) => s + (seat.price ?? 0), 0);
    const grandTotal    = (typeof rs.grandTotal === 'number' && rs.grandTotal > 0)
        ? rs.grandTotal
        : totalAmount;

    const [couponCode, setCouponCode] = useState('');

    const handleApplyCoupon = () => {
        messageApi.error('Invalid coupon code');
    };

    const handlePay = () => {
        navigate('/corporate-travel/bus-ticket/payment-success', {
            state: { ...rs, grandTotal },
        });
    };

    return (
        <Flex vertical>
            {contextHolder}

            {/* ══ BACK LINK ══ */}
            <div
                role="button"
                tabIndex={0}
                onClick={() => navigate('/corporate-travel/bus-ticket/review', { state: rs })}
                onKeyDown={e => e.key === 'Enter' && navigate('/corporate-travel/bus-ticket/review', { state: rs })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
            >
                <ArrowLeftIcon size={15} color="#8C8C8C" />
                <Text style={{ fontSize: 13, color: '#8C8C8C' }}>Cancel and Go Back</Text>
            </div>

            {/* ══ PAGE TITLE ══ */}
            <Text style={{ fontSize: 22, fontWeight: 700, color: '#171717', marginTop: 16, marginBottom: 24, display: 'block' }}>
                Review your payment
            </Text>

            {/* ══ TWO-COLUMN LAYOUT ══ */}
            <Row gutter={[24, 24]} align="top">

                {/* ══════════════════════
                    LEFT — Bill Summary
                ══════════════════════ */}
                <Col xs={24} md={14}>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #E8E8E8', borderRadius: 8, padding: 32 }}>

                        <Text style={{ fontSize: 16, fontWeight: 700, color: '#171717', display: 'block', marginBottom: 20 }}>
                            Bill Summary
                        </Text>

                        <BillRow label="Service name" value="Bus Ticket" />
                        <BillRow label="Route"        value={`${source} → ${destination}`} />
                        <BillRow label="Travel Date"  value={formatDate(date)} />
                        <BillRow label="Operator"     value={bus.operator} />
                        <BillRow label="Seat(s)"      value={getSeatNumbers(selectedSeats)} />
                        <BillRow label="Amount"       value={`₹ ${totalAmount.toLocaleString()}`} />

                        <Divider style={{ borderColor: '#F0F0F0', margin: '4px 0 24px' }} />

                        <Text style={{ fontSize: 16, fontWeight: 700, color: '#171717', display: 'block', marginBottom: 20 }}>
                            Total Payment Summary
                        </Text>

                        <BillRow label="Platform fee (inclusive of GST)" value={`₹ ${PLATFORM_FEE.toFixed(2)}`} />

                        {/* Amount Payable — last row, no bottom margin */}
                        <Flex justify="space-between" align="center">
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>Amount Payable</Text>
                            <Text style={{ fontSize: 14, fontWeight: 700, color: '#FF4F4F' }}>
                                ₹ {grandTotal.toLocaleString()}
                            </Text>
                        </Flex>
                    </div>
                </Col>

                {/* ══════════════════════
                    RIGHT — Payment Method
                ══════════════════════ */}
                <Col xs={24} md={10}>
                    <div style={{ backgroundColor: '#fff', border: '1px solid #E8E8E8', borderRadius: 8, padding: 32 }}>

                        <Text style={{ fontSize: 16, fontWeight: 700, color: '#171717', display: 'block' }}>
                            Choose your payment method
                        </Text>

                        {/* ── Coupon Code Card ── */}
                        <div style={{ border: '1px solid #E8E8E8', borderRadius: 8, padding: 20, marginTop: 16 }}>
                            <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717', display: 'block', marginBottom: 4 }}>
                                Apply Coupon Code
                            </Text>
                            <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 12 }}>
                                Have a discount/coupon code to redeem
                            </Text>
                            <Flex gap={8}>
                                <Input
                                    placeholder="Enter code"
                                    value={couponCode}
                                    onChange={e => setCouponCode(e.target.value)}
                                    onPressEnter={handleApplyCoupon}
                                    style={{ flex: 1 }}
                                />
                                <Button
                                    onClick={handleApplyCoupon}
                                    style={{
                                        backgroundColor: '#FF4F4F',
                                        borderColor: '#FF4F4F',
                                        color: '#fff',
                                        fontWeight: 600,
                                        flexShrink: 0,
                                    }}
                                >
                                    Apply
                                </Button>
                            </Flex>
                        </div>

                        {/* ── Payment Provider Card ── */}
                        <div style={{ border: '1px solid #E8E8E8', borderRadius: 8, padding: '16px 20px', marginTop: 16 }}>
                            <Flex align="center" gap={10} style={{ marginBottom: 6 }}>
                                <CashfreeIcon />
                                <Text style={{ fontSize: 14, fontWeight: 700, color: '#171717' }}>
                                    Cashfree Payments
                                </Text>
                            </Flex>
                            <Text style={{ fontSize: 12, color: '#8C8C8C' }}>
                                BHIM / UPI / Credit Card / Debit Card / Bank Account
                            </Text>
                        </div>

                        {/* ── Pay Button ── */}
                        <Button
                            block
                            size="large"
                            onClick={handlePay}
                            style={{
                                backgroundColor: '#FF4F4F',
                                borderColor: '#FF4F4F',
                                color: '#fff',
                                fontWeight: 600,
                                borderRadius: 6,
                                height: 48,
                                marginTop: 24,
                            }}
                        >
                            Pay ₹ {grandTotal.toLocaleString()}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Flex>
    );
};

export default BusTicketPaymentReview;
