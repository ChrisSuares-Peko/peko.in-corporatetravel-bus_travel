import { Flex, Typography } from 'antd';

const { Text } = Typography;

// ─── Design tokens ─────────────────────────────────────────────────────────────
const P   = '#FF4F4F';
const TXT = '#171717';
const BDR = '#E8E8E8';

// ─── Tab Icon SVGs ─────────────────────────────────────────────────────────────
// Illustrated flat icons at 32px — coloured circle backgrounds.

const AirIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFF1F0" />
        <path d="M24 16L10.5 10l2.5 4.5H8l1.5 1.5L8 17.5h5l-2.5 4.5L24 16z" fill="#FF4F4F" />
        <rect x="14" y="14.5" width="5" height="3" rx="0.5" fill="#FFB3B3" />
    </svg>
);

const HotelIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F0F5FF" />
        <rect x="9" y="18" width="14" height="7" rx="1" fill="#4080FF" />
        <rect x="7" y="22" width="18" height="3" rx="1" fill="#1D4ED8" />
        <rect x="11" y="11" width="4" height="7" rx="0.5" fill="#93C5FD" />
        <rect x="17" y="11" width="4" height="7" rx="0.5" fill="#93C5FD" />
        <path d="M9 18l7-7 7 7" fill="#60A5FA" />
    </svg>
);

const EsimIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#F6FFED" />
        <ellipse cx="16" cy="16" rx="7" ry="7" stroke="#52C41A" strokeWidth="1.5" />
        <ellipse cx="16" cy="16" rx="3" ry="7" stroke="#52C41A" strokeWidth="1" />
        <line x1="9" y1="16" x2="23" y2="16" stroke="#52C41A" strokeWidth="1" />
        <line x1="10" y1="12" x2="22" y2="12" stroke="#52C41A" strokeWidth="0.8" strokeDasharray="2 1" />
        <line x1="10" y1="20" x2="22" y2="20" stroke="#52C41A" strokeWidth="0.8" strokeDasharray="2 1" />
    </svg>
);

const VisaIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFFBE6" />
        <rect x="9" y="10" width="14" height="12" rx="1.5" fill="#FAAD14" />
        <rect x="11" y="13" width="10" height="1.5" rx="0.5" fill="white" />
        <rect x="11" y="16" width="7" height="1.5" rx="0.5" fill="white" opacity="0.7" />
        <circle cx="20" cy="19" r="3" fill="#F5722A" />
        <path d="M18.5 19l1 1 2-2" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const BusIcon = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="16" fill="#FFF7E6" />
        <rect x="7" y="11" width="18" height="10" rx="2" fill="#FA8C16" />
        <rect x="9" y="13" width="4" height="3" rx="0.5" fill="white" />
        <rect x="14" y="13" width="4" height="3" rx="0.5" fill="white" />
        <rect x="19" y="13" width="4" height="3" rx="0.5" fill="white" />
        <circle cx="11" cy="22" r="1.5" fill="#AD4E00" />
        <circle cx="21" cy="22" r="1.5" fill="#AD4E00" />
        <rect x="6" y="17" width="2" height="3" rx="0.5" fill="#D46B08" />
        <rect x="24" y="17" width="2" height="3" rx="0.5" fill="#D46B08" />
    </svg>
);

// ─── Tab Config ─────────────────────────────────────────────────────────────────

export interface ServiceTab {
    key: string;
    label: string;
    icon: React.ReactNode;
}

export const SERVICE_TABS: ServiceTab[] = [
    { key: '1', label: 'Air Tickets',    icon: <AirIcon /> },
    { key: '2', label: 'Hotel Booking',  icon: <HotelIcon /> },
    { key: '3', label: 'Travel eSIM',    icon: <EsimIcon /> },
    { key: '4', label: 'Visa',           icon: <VisaIcon /> },
    { key: '5', label: 'Bus Ticket',     icon: <BusIcon /> },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface ServiceTabSelectorProps {
    activeTab: string;
    onChange: (key: string) => void;
}

const ServiceTabSelector = ({ activeTab, onChange }: ServiceTabSelectorProps) => (
    <Flex
        justify="center"
        gap={12}
        className="flex-wrap py-2"
    >
        {SERVICE_TABS.map(tab => {
            const isActive = tab.key === activeTab;
            return (
                <div
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className="flex flex-col items-center gap-2 px-5 py-3 cursor-pointer transition-all select-none"
                    style={{
                        borderRadius: 24,
                        border: isActive ? `2px solid ${P}` : `1px solid ${BDR}`,
                        backgroundColor: '#FFFFFF',
                        boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        minWidth: 88,
                    }}
                >
                    {tab.icon}
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? P : TXT,
                            lineHeight: 1,
                        }}
                    >
                        {tab.label}
                    </Text>
                </div>
            );
        })}
    </Flex>
);

export default ServiceTabSelector;
