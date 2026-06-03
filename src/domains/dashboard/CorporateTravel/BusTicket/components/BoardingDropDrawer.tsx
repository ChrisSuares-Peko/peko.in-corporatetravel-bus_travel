import { Button, Divider, Drawer, Flex, Tabs, Typography } from 'antd';

const { Text } = Typography;

// ─── Mock Data ────────────────────────────────────────────────────────────────
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
                    <Text className="font-bold text-sm text-gray-800 tabular-nums">
                        {point.time}
                    </Text>
                    <Text className="text-sm text-gray-600 text-right">{point.location}</Text>
                </Flex>
                {i < points.length - 1 && <Divider className="my-0" />}
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
        title="Boarding &amp; Drop Points"
        placement="right"
        onClose={onClose}
        open={open}
        width={380}
        footer={
            <Flex justify="flex-end">
                <Button
                    onClick={onClose}
                    style={{ backgroundColor: '#FFA827', borderColor: '#FFA827', color: '#fff' }}
                >
                    Dismiss
                </Button>
            </Flex>
        }
    >
        <Tabs
            defaultActiveKey="boarding"
            items={[
                {
                    key: 'boarding',
                    label: 'Boarding Points',
                    children: <PointsList points={BOARDING_POINTS} />,
                },
                {
                    key: 'drop',
                    label: 'Drop Points',
                    children: <PointsList points={DROP_POINTS} />,
                },
            ]}
        />
    </Drawer>
);

export default BoardingDropDrawer;
