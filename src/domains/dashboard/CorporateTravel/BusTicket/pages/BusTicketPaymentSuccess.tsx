import { useState } from 'react';

import { Button, Flex, Typography } from 'antd';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const CheckCircleIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="32" fill="#52C41A" />
        <polyline
            points="18 33 27 42 46 23"
            stroke="#fff" strokeWidth="3.5"
            strokeLinecap="round" strokeLinejoin="round"
        />
    </svg>
);

const BusTicketPaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const rs = (location.state ?? {}) as Record<string, any>;

    const grandTotal = typeof rs.grandTotal === 'number' ? rs.grandTotal : 0;

    const [transactionId] = useState<string>(() =>
        String(Math.floor(Math.random() * 9000000000000) + 1000000000000)
    );

    const transactionDate = dayjs().format('MMMM D, YYYY, hh:mm:ss A');

    const txRows = [
        { label: 'Date',           value: transactionDate },
        { label: 'Transaction ID', value: transactionId },
        { label: 'Service',        value: 'Bus Ticket' },
        { label: 'Paid Amount',    value: `₹ ${grandTotal.toLocaleString()}` },
        { label: 'Payment Mode',   value: 'UPI' },
    ];

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 48 }}>
            <div style={{ width: '60%', maxWidth: '60%', margin: '0 auto' }}>

                {/* Green checkmark */}
                <Flex justify="center" style={{ marginBottom: 16 }}>
                    <CheckCircleIcon />
                </Flex>

                {/* Title */}
                <Text style={{
                    fontSize: 22, fontWeight: 600, color: '#171717',
                    textAlign: 'center', display: 'block', marginBottom: 8,
                }}>
                    Your payment for bus ticket booking was successful
                </Text>

                {/* Subtitle */}
                <Text style={{
                    fontSize: 14, color: '#8C8C8C',
                    textAlign: 'center', display: 'block', marginBottom: 28,
                }}>
                    You will receive a confirmation email shortly. Thank you for using Peko.
                </Text>

                {/* CTAs */}
                <Flex justify="center" gap={16} style={{ marginBottom: 36 }}>
                    <Button
                        size="large"
                        onClick={() => navigate('/corporate-travel/bus-ticket/manage-bookings')}
                        style={{
                            backgroundColor: '#FF4F4F', borderColor: '#FF4F4F',
                            color: '#fff', fontWeight: 600, borderRadius: 8,
                            height: 44, paddingLeft: 24, paddingRight: 24,
                        }}
                    >
                        Go to Manage Bookings
                    </Button>
                    <Button
                        size="large"
                        onClick={() => navigate('/corporate-travel/bus-ticket/confirmation', { state: rs })}
                        style={{
                            backgroundColor: '#fff', borderColor: '#D9D9D9',
                            color: '#171717', borderRadius: 8,
                            height: 44, paddingLeft: 24, paddingRight: 24,
                        }}
                    >
                        View Ticket
                    </Button>
                </Flex>

                {/* Transaction details card */}
                <div style={{
                    backgroundColor: '#FFFFFF', border: '1px solid #E8E8E8',
                    borderRadius: 8, overflow: 'hidden',
                }}>
                    {txRows.map((row, i) => (
                        <div
                            key={row.label}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 24px',
                                borderBottom: i < txRows.length - 1 ? '1px solid #F0F0F0' : undefined,
                            }}
                        >
                            <Text style={{ fontSize: 13, color: '#8C8C8C' }}>{row.label}</Text>
                            <Text style={{ fontSize: 13, color: '#171717', fontWeight: 500 }}>{row.value}</Text>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default BusTicketPaymentSuccess;
