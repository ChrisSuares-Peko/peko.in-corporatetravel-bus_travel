import { Button, Divider, Drawer, Flex, Tabs, Typography } from 'antd';

const { Text } = Typography;

// ─── Design tokens ─────────────────────────────────────────────────────────────
const P   = '#FF4F4F';
const TXT = '#171717';
const HLP = '#8C8C8C';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
// Shared across all buses in the prototype — replace with per-bus data from API.

type StopPoint = { time: string; location: string };

const BOARDING_POINTS: StopPoint[] = [
    { time: '09:40 PM', location: 'Majestic' },
    { time: '09:45 PM', location: 'Anand Rao Circle' },
    { time: '10:00 PM', location: 'Shanthinagar' },
    { time: '10:10 PM', location: 'Dairy Circle Christ University' },
    { time: '10:20 PM', location: 'St Johns Hospital' },
    { time: '10:30 PM', location: 'Madiwala' },
    { time: '10:45 PM', location: 'Silk Board' },
];

const DROP_POINTS: StopPoint[] = [
    { time: '04:15 AM', location: 'Sriperumbudur' },
    { time: '04:20 AM', location: 'Sriperumbudur Toll Plaza' },
    { time: '04:40 AM', location: 'Saveetha Medical College' },
    { time: '04:50 AM', location: 'Poonamallee Bypass' },
    { time: '05:05 AM', location: 'Maduravoyal' },
    { time: '05:20 AM', location: 'Koyambedu' },
    { time: '05:25 AM', location: 'Vadapalani' },
];

// ─── Points List ──────────────────────────────────────────────────────────────

const PointsList = ({ points }: { points: StopPoint[] }) => (
    <div>
        {points.map((point, i) => (
            <div key={point.location}>
                <Flex justify="space-between" align="center" className="py-3 px-1">
                    <Text
                        className="tabular-nums"
                        style={{ fontSize: 13, fontWeight: 600, color: P }}
                    >
                        {point.time}
                    </Text>
                    <Text
                        className="text-right"
                        style={{ fontSize: 14, fontWeight: 600, color: TXT }}
                    >
                        {point.location}
                    </Text>
                </Flex>
                {i < points.length - 1 && <Divider className="my-0" style={{ borderColor: '#F0F0F0' }} />}
            </div>
        ))}
    </div>
);

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface BoardingDropDrawerProps {
    open: boolean;
    onClose: () => void;
}

const BoardingDropDrawer = ({ open, onClose }: BoardingDropDrawerProps) => (
    <Drawer
        title={
            <Text style={{ fontSize: 16, fontWeight: 600, color: TXT }}>
                Boarding &amp; Drop Points
            </Text>
        }
        placement="right"
        onClose={onClose}
        open={open}
        width={380}
        footer={
            <Flex justify="flex-end">
                {/* Secondary button style */}
                <Button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D9D9D9',
                        color: TXT,
                        borderRadius: 6,
                        fontWeight: 400,
                        fontSize: 14,
                    }}
                >
                    Dismiss
                </Button>
            </Flex>
        }
    >
        <Tabs
            defaultActiveKey="boarding"
            className="bus-ticket-tabs"
            items={[
                {
                    key: 'boarding',
                    label: <Text style={{ fontSize: 14, color: 'inherit' }}>Boarding Points</Text>,
                    children: <PointsList points={BOARDING_POINTS} />,
                },
                {
                    key: 'drop',
                    label: <Text style={{ fontSize: 14, color: 'inherit' }}>Drop Points</Text>,
                    children: <PointsList points={DROP_POINTS} />,
                },
            ]}
        />
    </Drawer>
);

export default BoardingDropDrawer;
