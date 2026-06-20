// Solar Outline-style SVG icon components used across the Bus Ticket flow.
// Consistent: 1.5px stroke, rounded caps/joins, no fill, 24×24 viewBox.

type IconProps = { size?: number; color?: string; className?: string };
const S = 1.5; // stroke width

export const SnowflakeIcon = ({ size = 18, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="12" y1="2" x2="9" y2="5" />
        <line x1="12" y1="2" x2="15" y2="5" />
        <line x1="12" y1="22" x2="9" y2="19" />
        <line x1="12" y1="22" x2="15" y2="19" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="12" x2="5" y2="9" />
        <line x1="2" y1="12" x2="5" y2="15" />
        <line x1="22" y1="12" x2="19" y2="9" />
        <line x1="22" y1="12" x2="19" y2="15" />
    </svg>
);

export const BedIcon = ({ size = 18, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2 20v-4a4 4 0 014-4h12a4 4 0 014 4v4" />
        <path d="M2 20v2M22 20v2" />
        <rect x="7" y="9" width="10" height="7" rx="1" />
        <path d="M2 16V8a2 2 0 012-2h2" />
    </svg>
);

export const ChairIcon = ({ size = 18, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 10V4a2 2 0 012-2h8a2 2 0 012 2v6" />
        <rect x="4" y="10" width="16" height="4" rx="1" />
        <path d="M7 14v6M17 14v6M7 20h10" />
    </svg>
);

export const SunriseIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 18a5 5 0 00-10 0" />
        <line x1="12" y1="2" x2="12" y2="9" />
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
        <line x1="1" y1="18" x2="3" y2="18" />
        <line x1="21" y1="18" x2="23" y2="18" />
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
        <line x1="23" y1="22" x2="1" y2="22" />
        <polyline points="8 6 12 2 16 6" />
    </svg>
);

export const SunIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

export const SunsetIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M17 18a5 5 0 00-10 0" />
        <line x1="12" y1="9" x2="12" y2="2" />
        <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
        <line x1="1" y1="18" x2="3" y2="18" />
        <line x1="21" y1="18" x2="23" y2="18" />
        <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
        <line x1="23" y1="22" x2="1" y2="22" />
        <polyline points="16 5 12 9 8 5" />
    </svg>
);

export const MoonIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

export const WifiIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M5 12.55a11 11 0 0114.08 0" />
        <path d="M1.42 9a16 16 0 0121.16 0" />
        <path d="M8.53 16.11a6 6 0 016.95 0" />
        <circle cx="12" cy="20" r="1" fill={color} />
    </svg>
);

export const ChargingIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

export const PhoneIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
);

export const FilmIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="2" width="20" height="20" rx="2.18" />
        <line x1="7" y1="2" x2="7" y2="22" />
        <line x1="17" y1="2" x2="17" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <line x1="2" y1="7" x2="7" y2="7" />
        <line x1="2" y1="17" x2="7" y2="17" />
        <line x1="17" y1="17" x2="22" y2="17" />
        <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
);

export const WaterIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
);

export const LocationIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

export const ClockIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export const MoneyIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9 9.5c0-1.1 1.3-2 3-2s3 .9 3 2-1.3 2-3 2-3 .9-3 2 1.3 2 3 2 3-.9 3-2" />
    </svg>
);

export const ArrowRightIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
    </svg>
);

export const LightningIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);

export const CloudIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
);

export const BusOutlineIcon = ({ size = 24, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="5" width="18" height="13" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <circle cx="8" cy="19" r="1.5" />
        <circle cx="16" cy="19" r="1.5" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <line x1="7" y1="5" x2="7" y2="10" />
        <line x1="12" y1="5" x2="12" y2="10" />
        <line x1="17" y1="5" x2="17" y2="10" />
    </svg>
);

export const ArrowLeftIcon = ({ size = 24, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

export const SearchIcon = ({ size = 24, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

export const SwapHorizIcon = ({ size = 20, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 5h18" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 19H3" />
    </svg>
);

export const ShieldCheckIcon = ({ size = 16, color = 'currentColor', className }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
    </svg>
);
