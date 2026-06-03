import { useEffect, useState } from 'react';

import { Flex, Progress, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const BUS_ANIMATION_DURATION = 3000; // ms

const BusSVG = () => (
    <svg
        viewBox="0 0 160 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width="160"
        height="80"
    >
        {/* Bus body */}
        <rect x="4" y="10" width="148" height="52" rx="8" fill="#FFA827" />
        {/* Roof stripe */}
        <rect x="4" y="10" width="148" height="12" rx="8" fill="#E8920A" />
        {/* Window row */}
        <rect x="16" y="18" width="22" height="16" rx="3" fill="white" opacity="0.85" />
        <rect x="46" y="18" width="22" height="16" rx="3" fill="white" opacity="0.85" />
        <rect x="76" y="18" width="22" height="16" rx="3" fill="white" opacity="0.85" />
        <rect x="106" y="18" width="22" height="16" rx="3" fill="white" opacity="0.85" />
        {/* Lower panel / door */}
        <rect x="120" y="37" width="20" height="22" rx="3" fill="white" opacity="0.45" />
        {/* Front grille */}
        <rect x="146" y="30" width="5" height="10" rx="2" fill="#E8920A" />
        {/* Headlight */}
        <rect x="148" y="20" width="6" height="8" rx="2" fill="#FFF3C4" />
        {/* Peko branding text placeholder */}
        <rect x="50" y="38" width="50" height="10" rx="2" fill="white" opacity="0.25" />
        {/* Wheels */}
        <circle cx="32" cy="65" r="11" fill="#2D2D2D" />
        <circle cx="32" cy="65" r="5" fill="#555" />
        <circle cx="32" cy="65" r="2" fill="#888" />
        <circle cx="120" cy="65" r="11" fill="#2D2D2D" />
        <circle cx="120" cy="65" r="5" fill="#555" />
        <circle cx="120" cy="65" r="2" fill="#888" />
        {/* Exhaust puff */}
        <circle cx="6" cy="55" r="4" fill="#D0D0D0" opacity="0.5" />
        <circle cx="2" cy="52" r="3" fill="#D0D0D0" opacity="0.35" />
    </svg>
);

const RoadDash = () => (
    <Flex className="w-full" gap={8} style={{ marginTop: '-6px' }}>
        {Array.from({ length: 20 }).map((_, i) => (
            <div
                key={i}
                className="h-0.5 flex-1 rounded"
                style={{ backgroundColor: '#CBD5E1' }}
            />
        ))}
    </Flex>
);

const BusTicketSearching = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [progress, setProgress] = useState(0);

    // Fill the progress bar over BUS_ANIMATION_DURATION ms
    useEffect(() => {
        const step = BUS_ANIMATION_DURATION / 100; // ms per 1%
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, step);

        return () => clearInterval(interval);
    }, []);

    // Navigate after progress bar completes
    useEffect(() => {
        if (progress >= 100) {
            const timer = setTimeout(() => {
                navigate('/corporate-travel/bus-ticket/results', {
                        replace: true,
                        state: location.state, // pass search params through to results
                    });
            }, 200);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [progress, navigate]);

    return (
        <>
            {/* Bus drive keyframe — injected once per render */}
            <style>{`
                @keyframes busDrive {
                    0%   { transform: translateX(-180px); }
                    100% { transform: translateX(calc(100vw + 20px)); }
                }
                .bus-drive {
                    animation: busDrive ${BUS_ANIMATION_DURATION + 200}ms linear infinite;
                }
            `}</style>

            <Flex
                vertical
                align="center"
                justify="center"
                gap={32}
                className="min-h-[55vh] px-4"
            >
                {/* Animated bus track */}
                <div className="w-full overflow-hidden relative" style={{ height: '90px' }}>
                    <div className="bus-drive absolute bottom-6">
                        <BusSVG />
                    </div>
                    <div className="absolute bottom-0 w-full">
                        <RoadDash />
                    </div>
                </div>

                {/* Status text */}
                <Typography.Text className="text-base font-medium text-gray-600">
                    Searching for the best buses...
                </Typography.Text>

                {/* Progress bar */}
                <div className="w-full max-w-md">
                    <Progress
                        percent={progress}
                        showInfo={false}
                        strokeColor="#FFA827"
                        trailColor="#F1F5F9"
                        strokeLinecap="round"
                    />
                </div>
            </Flex>
        </>
    );
};

export default BusTicketSearching;
