import { Button, Divider, Drawer, Flex, Table, Typography } from 'antd';

const { Text, Title, Paragraph } = Typography;

// ─── Travel Policy data ───────────────────────────────────────────────────────

const TRAVEL_POLICIES = [
    {
        label: 'Child Passenger Policy',
        value: 'Children above the age of 3 will need a ticket',
    },
    {
        label: 'Luggage Policy',
        value:
            '1 piece of luggage will be accepted free of charge per passenger. Excess items will be chargeable',
    },
    {
        label: 'Excess Baggage',
        value: 'Excess baggage over 10 kgs per passenger will be chargeable',
    },
    {
        label: 'Pets Policy',
        value: 'Pets are not allowed',
    },
    {
        label: 'Liquor Policy',
        value:
            'Carrying or consuming liquor inside the bus is prohibited. Bus operator reserves the right to deboard drunk passengers',
    },
    {
        label: 'Pick Up Time Policy',
        value:
            'Bus operator is not obligated to wait beyond the scheduled departure time. No refund will be entertained for late arriving passengers',
    },
];

// ─── Cancellation Policy data ─────────────────────────────────────────────────

type CancellationRow = { key: string; time: string; percent: string; amount: string };

const CANCELLATION_DATA: CancellationRow[] = [
    {
        key: '1',
        time: 'Before 4th Jun 10:30 AM',
        percent: '15%',
        amount: '₹184.50',
    },
    {
        key: '2',
        time: 'After 4th Jun 10:30 AM & Before 4th Jun 02:30 PM',
        percent: '30%',
        amount: '₹369.00',
    },
    {
        key: '3',
        time: 'After 4th Jun 02:30 PM & Before 4th Jun 06:30 PM',
        percent: '60%',
        amount: '₹738.00',
    },
    {
        key: '4',
        time: 'After 4th Jun 06:30 PM & Before 4th Jun 10:30 PM',
        percent: '95%',
        amount: '₹1,168.50',
    },
];

const CANCELLATION_COLUMNS = [
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        render: (v: string) => <Text className="text-xs text-gray-700">{v}</Text>,
    },
    {
        title: 'Cancellation %',
        dataIndex: 'percent',
        key: 'percent',
        align: 'center' as const,
        render: (v: string) => (
            <Text className="text-xs font-semibold text-gray-700">{v}</Text>
        ),
    },
    {
        title: 'Cancellation Amount',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right' as const,
        render: (v: string) => (
            <Text className="text-xs font-semibold text-red-500">{v}</Text>
        ),
    },
];

const DISCLAIMERS = [
    'Any cancellation of tickets can incur cancellation charges based on the bus operator policy',
    'Cancellation charges shown above are indicative and exact charges will be available after the ticket is booked',
    'Cancellation charges are computed on a per seat basis. Above fare is calculated based on seat fare of ₹1,230.00',
    'Partial cancellation is allowed for this ticket',
    "Customers will receive refunds after deducting cashbacks, offer discounts and non-refundable charges as per the bus operator's policy",
    'Note: Cancellation charges shown above are exclusive of GST',
    'For RTC buses — cancellation amount shown is an estimate and can change at the time of the Final RTC Cancellation Call Time',
];

// ─── Drawer ───────────────────────────────────────────────────────────────────

interface PoliciesDrawerProps {
    open: boolean;
    onClose: () => void;
}

const PoliciesDrawer = ({ open, onClose }: PoliciesDrawerProps) => (
    <Drawer
        title={<Text style={{ fontSize: 16, fontWeight: 600, color: '#171717' }}>Policies</Text>}
        placement="right"
        onClose={onClose}
        open={open}
        width={520}
        styles={{ body: { paddingBottom: 80 } }}
        footer={
            <Flex justify="flex-end">
                {/* Secondary button */}
                <Button
                    onClick={onClose}
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#D9D9D9',
                        color: '#171717',
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
        <Flex vertical gap={24}>

            {/* ── Section 1: Travel Policy ── */}
            <div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }} className="block mb-4">
                    Travel Policy
                </Text>
                <Flex vertical gap={12}>
                    {TRAVEL_POLICIES.map(policy => (
                        <Flex key={policy.label} gap={10} align="flex-start">
                            <div
                                className="mt-1.5 flex-shrink-0 rounded-full"
                                style={{ width: 6, height: 6, backgroundColor: '#FF4F4F' }}
                            />
                            <Paragraph style={{ fontSize: 13, color: '#171717', marginBottom: 0 }}>
                                <Text style={{ fontWeight: 600, fontSize: 13 }}>
                                    {policy.label}:{' '}
                                </Text>
                                {policy.value}
                            </Paragraph>
                        </Flex>
                    ))}
                </Flex>
            </div>

            <Divider className="my-0" style={{ borderColor: '#F0F0F0' }} />

            {/* ── Section 2: Cancellation Policy ── */}
            <div>
                <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }} className="block mb-4">
                    Cancellation Policy
                </Text>

                <Table
                    dataSource={CANCELLATION_DATA}
                    columns={CANCELLATION_COLUMNS}
                    pagination={false}
                    size="small"
                    bordered
                    className="mb-5"
                />

                {/* Disclaimer notes */}
                <Flex vertical gap={5}>
                    {DISCLAIMERS.map((note, i) => (
                        <Flex key={i} gap={5} align="flex-start">
                            <Text style={{ fontSize: 11, color: '#8C8C8C', flexShrink: 0, lineHeight: 1.6 }}>*</Text>
                            <Text style={{ fontSize: 11, fontWeight: 300, color: '#8C8C8C', lineHeight: 1.6 }}>{note}</Text>
                        </Flex>
                    ))}
                </Flex>
            </div>

        </Flex>
    </Drawer>
);

export default PoliciesDrawer;
