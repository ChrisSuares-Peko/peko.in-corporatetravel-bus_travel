import { useState } from 'react';

import {
    InfoCircleOutlined,
    MailOutlined,
    PhoneOutlined,
    RightOutlined,
} from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Tag,
    Typography,
    message,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import { mockSavedTravellers } from '@src/mock/data';

const { Text, Title } = Typography;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedSeat {
    id: string;
    label: string;
    deck: 'lower' | 'upper';
    price: number;
    originalPrice: number;
    designation?: 'male' | 'female';
}

type TravellerFormValues = { name: string; age: string; gender: 'Male' | 'Female' };

type AddNewValues = {
    title: string;
    name: string;
    gender: 'Male' | 'Female';
    age: string;
    mobile: string;
    email: string;
    idType: string;
    idNumber: string;
    address: string;
};

interface SeatState {
    savedTravellerId: string | null;
    editFormOpen: boolean;
    editValues: TravellerFormValues;
    addNewOpen: boolean;
    addedTraveller: AddNewValues | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_FORM: TravellerFormValues = { name: '', age: '', gender: 'Male' };

const FALLBACK_SEATS: SelectedSeat[] = [
    { id: 'L1', label: 'L1', deck: 'lower', price: 950, originalPrice: 1200 },
    { id: 'U5', label: 'U5', deck: 'upper', price: 850, originalPrice: 1050 },
];

// ─── Inline Edit Form ─────────────────────────────────────────────────────────

const TravellerForm = ({
    values,
    onChange,
    onConfirm,
    confirmLabel,
    showConfirm,
}: {
    values: TravellerFormValues;
    onChange: (v: TravellerFormValues) => void;
    onConfirm?: () => void;
    confirmLabel?: string;
    showConfirm?: boolean;
}) => (
    <div className="pt-4 border-t border-gray-100 mt-3">
        <Row gutter={[12, 14]}>
            <Col xs={24}>
                <div>
                    <Text className="text-xs text-gray-500 block mb-1">Full Name</Text>
                    <Input
                        value={values.name}
                        onChange={e => onChange({ ...values, name: e.target.value })}
                        placeholder="Enter full name"
                        size="large"
                    />
                </div>
            </Col>
            <Col xs={24} sm={10}>
                <div>
                    <Text className="text-xs text-gray-500 block mb-1">Age</Text>
                    <Input
                        type="number"
                        value={values.age}
                        onChange={e => onChange({ ...values, age: e.target.value })}
                        placeholder="Age"
                        size="large"
                        min={1}
                        max={120}
                    />
                </div>
            </Col>
            <Col xs={24} sm={14}>
                <div>
                    <Text className="text-xs text-gray-500 block mb-2">Gender</Text>
                    <Radio.Group
                        value={values.gender}
                        onChange={e => onChange({ ...values, gender: e.target.value })}
                    >
                        <Radio value="Male">Male</Radio>
                        <Radio value="Female">Female</Radio>
                    </Radio.Group>
                </div>
            </Col>
        </Row>
        {showConfirm && (
            <Flex justify="flex-end" className="mt-4">
                <Button
                    size="small"
                    disabled={!values.name.trim() || !values.age}
                    onClick={onConfirm}
                    style={
                        values.name.trim() && values.age
                            ? { backgroundColor: '#FF4F4F', borderColor: '#FF4F4F', color: '#fff', borderRadius: 6, fontWeight: 600 }
                            : undefined
                    }
                >
                    {confirmLabel ?? 'Confirm'}
                </Button>
            </Flex>
        )}
    </div>
);

// ─── Add New Traveller Form ───────────────────────────────────────────────────

const AddNewTravellerForm = ({ onConfirm }: { onConfirm: (values: AddNewValues) => void }) => {
    const [form] = Form.useForm<AddNewValues>();

    const handleAdd = async () => {
        try {
            const values = await form.validateFields();
            onConfirm(values);
            form.resetFields();
        } catch {
            // inline validation errors shown by Form
        }
    };

    return (
        <div style={{ paddingTop: 16, borderTop: '1px solid #F5F5F5', marginTop: 12 }}>
            <Form form={form} layout="vertical" size="middle" requiredMark={false}>

                {/* Row 1: Title + Full Name */}
                <Row gutter={[12, 0]}>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            name="title"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Title</Text>}
                            rules={[{ required: true, message: 'Please select a title' }]}
                        >
                            <Select
                                placeholder="Title"
                                options={[
                                    { label: 'Mr', value: 'Mr' },
                                    { label: 'Mrs', value: 'Mrs' },
                                    { label: 'Ms', value: 'Ms' },
                                    { label: 'Dr', value: 'Dr' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={16}>
                        <Form.Item
                            name="name"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Full Name</Text>}
                            rules={[{ required: true, message: "Please enter the traveller's full name" }]}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 2: Gender + Age */}
                <Row gutter={[12, 0]}>
                    <Col xs={24} sm={14}>
                        <Form.Item
                            name="gender"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Gender</Text>}
                            initialValue="Male"
                        >
                            <Radio.Group>
                                <Radio value="Male">Male</Radio>
                                <Radio value="Female">Female</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={10}>
                        <Form.Item
                            name="age"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Age</Text>}
                        >
                            <Input type="number" placeholder="Enter age" min={1} max={120} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 3: Mobile + Email */}
                <Row gutter={[12, 0]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="mobile"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Mobile</Text>}
                            rules={[{ required: true, message: 'Please enter a valid mobile number' }]}
                        >
                            <Input
                                placeholder="Enter mobile number"
                                prefix={<PhoneOutlined style={{ color: '#8C8C8C' }} />}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="email"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Email</Text>}
                            rules={[
                                { required: true, message: 'Please enter a valid email address' },
                                { type: 'email', message: 'Please enter a valid email address' },
                            ]}
                        >
                            <Input
                                placeholder="Enter email address"
                                prefix={<MailOutlined style={{ color: '#8C8C8C' }} />}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 4: ID Type + ID Number */}
                <Row gutter={[12, 0]}>
                    <Col xs={24} sm={10}>
                        <Form.Item
                            name="idType"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>ID Type</Text>}
                            rules={[{ required: true, message: 'Please select an ID type and enter the number' }]}
                        >
                            <Select
                                placeholder="Select ID type"
                                options={[
                                    { label: 'Aadhaar Card',     value: 'Aadhaar Card'     },
                                    { label: 'Passport',         value: 'Passport'         },
                                    { label: 'PAN Card',         value: 'PAN Card'         },
                                    { label: 'Driving Licence',  value: 'Driving Licence'  },
                                    { label: 'Voter ID',         value: 'Voter ID'         },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={14}>
                        <Form.Item
                            name="idNumber"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>ID Number</Text>}
                            rules={[{ required: true, message: 'Please select an ID type and enter the number' }]}
                        >
                            <Input placeholder="Enter ID number" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Row 5: Address (full width) */}
                <Row gutter={[12, 0]}>
                    <Col xs={24}>
                        <Form.Item
                            name="address"
                            label={<Text style={{ fontSize: 12, color: '#8C8C8C' }}>Address</Text>}
                        >
                            <Input.TextArea placeholder="Enter full address" rows={2} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <Flex justify="flex-end" style={{ marginTop: 4 }}>
                <Button
                    onClick={handleAdd}
                    style={{ backgroundColor: '#FF4F4F', borderColor: '#FF4F4F', color: '#fff', borderRadius: 6, fontWeight: 600 }}
                >
                    Add Traveller
                </Button>
            </Flex>
        </div>
    );
};

// ─── Seat Card ────────────────────────────────────────────────────────────────

const SeatCard = ({
    seat,
    index,
    state,
    onStateChange,
}: {
    seat: SelectedSeat;
    index: number;
    state: SeatState;
    onStateChange: (updates: Partial<SeatState>) => void;
}) => {
    const isPrimary = index === 0;
    const selectedTraveller = mockSavedTravellers.find(t => t.id === state.savedTravellerId);

    const handleSelectSaved = (travellerId: string | null) => {
        const t = mockSavedTravellers.find(tt => tt.id === travellerId);
        onStateChange({
            savedTravellerId: travellerId,
            addedTraveller: null,
            editValues: t
                ? { name: t.name, age: String(t.age), gender: t.gender }
                : EMPTY_FORM,
            editFormOpen: false,
            addNewOpen: false,
        });
    };

    const handleConfirmAddNew = (values: AddNewValues) => {
        onStateChange({
            addedTraveller: values,
            savedTravellerId: null,
            addNewOpen: false,
        });
    };

    const handleChangeAddedTraveller = () => {
        onStateChange({ addedTraveller: null });
    };

    return (
        <div
            className="bg-white overflow-hidden"
            style={{ border: '1px solid #E8E8E8', borderRadius: 12 }}
        >
            {/* ── Card Header ── */}
            <div className="px-5 pt-4 pb-3">
                <Flex justify="space-between" align="center" className="gap-2 flex-wrap">
                    <Flex align="center" gap={8} className="flex-wrap">
                        <Text
                            className="font-bold text-base leading-tight"
                            style={{ color: '#FF4F4F' }}
                        >
                            Seat number{' '}
                            {seat.deck === 'lower' ? 'L' : 'U'}
                            {seat.label}
                        </Text>
                        {seat.designation === 'male' && (
                            <Tag color="default" className="text-xs">
                                Reserved for male
                            </Tag>
                        )}
                        {seat.designation === 'female' && (
                            <Tag color="default" className="text-xs">
                                Reserved for female
                            </Tag>
                        )}
                    </Flex>
                    {isPrimary && (
                        <Tag color="blue" className="text-xs flex-shrink-0">
                            Primary Traveller
                        </Tag>
                    )}
                </Flex>
            </div>

            <Divider className="my-0" />

            {/* ── Traveller Assignment Area ── */}
            <div className="px-5 pt-4 pb-3">
                {state.addedTraveller ? (
                    /* ── New traveller confirmed ── */
                    <Flex align="center" gap={8} className="flex-wrap">
                        <Text className="text-green-600 font-semibold text-sm">
                            ✓ {state.addedTraveller.name}
                        </Text>
                        <Text className="text-gray-400 text-xs">
                            {state.addedTraveller.gender}, {state.addedTraveller.age} yrs
                        </Text>
                        <Text
                            onClick={handleChangeAddedTraveller}
                            className="text-xs cursor-pointer select-none ml-auto" style={{ color: '#FF4F4F' }}
                        >
                            Change
                        </Text>
                    </Flex>
                ) : (
                    /* ── Saved traveller dropdown ── */
                    <>
                        <Flex align="center" gap={12} className="flex-wrap sm:flex-nowrap">
                            <Select
                                value={state.savedTravellerId}
                                onChange={handleSelectSaved}
                                placeholder="Select a traveller"
                                size="large"
                                className="w-full"
                                options={mockSavedTravellers.map(t => ({
                                    label: t.name,
                                    value: t.id,
                                }))}
                                allowClear
                                onClear={() => handleSelectSaved(null)}
                            />
                            {selectedTraveller && (
                                <Text
                                    onClick={() =>
                                        onStateChange({
                                            editFormOpen: !state.editFormOpen,
                                            addNewOpen: false,
                                        })
                                    }
                                    className="text-sm cursor-pointer whitespace-nowrap select-none flex-shrink-0"
                                    style={{ color: '#FF4F4F' }}
                                >
                                    {state.editFormOpen ? 'Close' : 'Edit traveller'}
                                </Text>
                            )}
                        </Flex>

                        {/* Traveller details info row */}
                        {selectedTraveller && (
                            <div style={{
                                backgroundColor: '#F5F5F5',
                                borderRadius: 8,
                                padding: 12,
                                marginTop: 8,
                                display: 'flex',
                                gap: 24,
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                            }}>
                                <Text style={{ fontSize: 13, fontWeight: 600, color: '#171717' }}>
                                    {selectedTraveller.name}
                                </Text>
                                <div>
                                    <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>Gender</Text>
                                    <Text style={{ fontSize: 13, color: '#171717' }}>{selectedTraveller.gender}</Text>
                                </div>
                                <div>
                                    <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>Age</Text>
                                    <Text style={{ fontSize: 13, color: '#171717' }}>{selectedTraveller.age}</Text>
                                </div>
                                <div>
                                    <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>Mobile</Text>
                                    <Text style={{ fontSize: 13, color: '#171717' }}>{selectedTraveller.mobile}</Text>
                                </div>
                                <div>
                                    <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block' }}>Email</Text>
                                    <Text style={{ fontSize: 13, color: '#171717' }}>{selectedTraveller.email}</Text>
                                </div>
                            </div>
                        )}

                        {/* Inline Edit Form */}
                        {state.editFormOpen && selectedTraveller && (
                            <TravellerForm
                                values={state.editValues}
                                onChange={v => onStateChange({ editValues: v })}
                                showConfirm={false}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Only show "Add New" row when no added traveller yet */}
            {!state.addedTraveller && (
                <>
                    <Divider className="my-0" />
                    <div className="px-5 py-3">
                        {/* Add New Traveller Toggle Row */}
                        <Flex
                            align="center"
                            gap={6}
                            onClick={() =>
                                onStateChange({
                                    addNewOpen: !state.addNewOpen,
                                    editFormOpen: false,
                                })
                            }
                            className="cursor-pointer select-none"
                        >
                            <RightOutlined
                                className="text-xs transition-transform"
                                style={{
                                    color: '#FF4F4F',
                                    transform: state.addNewOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                }}
                            />
                            <Text className="text-sm" style={{ color: '#FF4F4F' }}>
                                Add New Traveller
                            </Text>
                        </Flex>

                        {/* Inline Add New Form */}
                        {state.addNewOpen && (
                            <AddNewTravellerForm onConfirm={handleConfirmAddNew} />
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const BusTicketTraveller = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const routeState = (location.state ?? {}) as Record<string, any>;

    const seats: SelectedSeat[] = Array.isArray(routeState.selectedSeats) && routeState.selectedSeats.length > 0
        ? (routeState.selectedSeats as SelectedSeat[])
        : FALLBACK_SEATS;

    // ── Per-seat traveller assignment state ──
    const [seatStates, setSeatStates] = useState<Record<string, SeatState>>(() =>
        Object.fromEntries(
            seats.map(s => [
                s.id,
                {
                    savedTravellerId: null,
                    editFormOpen: false,
                    editValues: EMPTY_FORM,
                    addNewOpen: false,
                    addedTraveller: null,
                },
            ])
        )
    );

    // ── Contact Details ──
    const [mobile, setMobile] = useState('+917350980296');
    const [email, setEmail] = useState('chrissuares@yahoo.com');

    // ── GST ──
    const [gstChecked, setGstChecked] = useState(false);
    const [gstValues, setGstValues] = useState({ regName: '', gstId: '', email: '', address: '' });

    // ── Terms ──
    const [termsAccepted, setTermsAccepted] = useState(false);

    // ── Helpers ──
    const updateSeatState = (seatId: string, updates: Partial<SeatState>) =>
        setSeatStates(prev => ({
            ...prev,
            [seatId]: { ...prev[seatId], ...updates },
        }));

    const isSeatAssigned = (seatId: string): boolean => {
        const s = seatStates[seatId];
        return s.savedTravellerId !== null || s.addedTraveller !== null;
    };

    const allSeatsAssigned = seats.every(s => isSeatAssigned(s.id));
    const proceedDisabled = !allSeatsAssigned || !termsAccepted;

    // ── Proceed ──
    const handleProceed = () => {
        if (!allSeatsAssigned) {
            message.warning('Please assign a traveller to every seat before proceeding');
            return;
        }
        if (!termsAccepted) {
            message.warning('Please agree to the Terms and Conditions to proceed');
            return;
        }

        const travellerDetails = seats.map(seat => {
            const s = seatStates[seat.id];
            if (s.addedTraveller) {
                return { seatId: seat.id, ...s.addedTraveller };
            }
            const saved = mockSavedTravellers.find(t => t.id === s.savedTravellerId);
            return {
                seatId: seat.id,
                name: saved?.name ?? '',
                age: String(saved?.age ?? ''),
                gender: saved?.gender ?? 'Male',
            };
        });

        navigate('/corporate-travel/bus-ticket/review', {
            state: {
                ...routeState,
                travellerDetails,
                contactDetails: { mobile, email },
            },
        });
    };

    const unassignedCount = seats.filter(s => !isSeatAssigned(s.id)).length;

    return (
        <Flex vertical gap={20}>

            {/* ── Page Title ── */}
            <Title level={4} className="m-0">
                Traveller Details
            </Title>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '0 24px', width: '100%' }}>

                {/* ══════════════════════════════════
                    LEFT COLUMN — Seat cards + contact
                ══════════════════════════════════ */}
                <div style={{ flex: '0 0 55%' }}>
                    <Flex vertical gap={16}>

                        {/* Per-seat traveller cards */}
                        {seats.map((seat, idx) => (
                            <SeatCard
                                key={seat.id}
                                seat={seat}
                                index={idx}
                                state={seatStates[seat.id]}
                                onStateChange={updates => updateSeatState(seat.id, updates)}
                            />
                        ))}

                        {/* Contact Details */}
                        <div
                            className="bg-white p-5"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 12 }}
                        >
                            <Text className="font-bold text-base block mb-4">
                                Contact details
                            </Text>

                            <Flex
                                align="center"
                                gap={8}
                                className="mb-5 p-3 rounded-xl border border-blue-100"
                                style={{ backgroundColor: '#EFF6FF' }}
                            >
                                <InfoCircleOutlined className="text-blue-500 flex-shrink-0" />
                                <Text className="text-sm text-gray-600">
                                    Your ticket details will be sent to below details
                                </Text>
                            </Flex>

                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Text className="text-xs text-gray-500 block mb-1">
                                        Mobile
                                    </Text>
                                    <Input
                                        value={mobile}
                                        onChange={e => setMobile(e.target.value)}
                                        size="large"
                                        prefix={<PhoneOutlined className="text-gray-400" />}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Text className="text-xs text-gray-500 block mb-1">
                                        Email
                                    </Text>
                                    <Input
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        size="large"
                                        prefix={<MailOutlined className="text-gray-400" />}
                                    />
                                </Col>
                            </Row>
                        </div>

                        {/* GST Number Card */}
                        <div
                            className="bg-white"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 12, overflow: 'hidden' }}
                        >
                            <div style={{ padding: '16px 20px' }}>
                                <Flex justify="space-between" align="center">
                                    <Checkbox
                                        checked={gstChecked}
                                        onChange={e => {
                                            setGstChecked(e.target.checked);
                                            if (!e.target.checked) {
                                                setGstValues({ regName: '', gstId: '', email: '', address: '' });
                                            }
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: 600, color: '#171717' }}>
                                            I have a GST Number
                                        </Text>
                                    </Checkbox>
                                    <Tag color="default">Optional</Tag>
                                </Flex>
                            </div>

                            {gstChecked && (
                                <div style={{
                                    backgroundColor: '#FFF9F0',
                                    borderTop: '1px solid #F0F0F0',
                                    padding: '12px 20px 16px',
                                }}>
                                    <Row gutter={[12, 12]}>
                                        <Col xs={24} sm={12}>
                                            <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 4 }}>
                                                Registration Name
                                            </Text>
                                            <Input
                                                value={gstValues.regName}
                                                onChange={e => setGstValues(v => ({ ...v, regName: e.target.value }))}
                                                placeholder="Enter registered business name"
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 4 }}>
                                                GST ID
                                            </Text>
                                            <Input
                                                value={gstValues.gstId}
                                                onChange={e => setGstValues(v => ({ ...v, gstId: e.target.value }))}
                                                placeholder="Enter GST number"
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 4 }}>
                                                Email ID
                                            </Text>
                                            <Input
                                                value={gstValues.email}
                                                onChange={e => setGstValues(v => ({ ...v, email: e.target.value }))}
                                                placeholder="Enter registered email"
                                            />
                                        </Col>
                                        <Col xs={24} sm={12}>
                                            <Text style={{ fontSize: 12, color: '#8C8C8C', display: 'block', marginBottom: 4 }}>
                                                Address
                                            </Text>
                                            <Input
                                                value={gstValues.address}
                                                onChange={e => setGstValues(v => ({ ...v, address: e.target.value }))}
                                                placeholder="Enter registered address"
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )}
                        </div>
                    </Flex>
                </div>

                {/* ── Spacer ── */}
                <div style={{ flex: 1 }} />

                {/* ══════════════════════════════════
                    RIGHT COLUMN — Terms + Proceed
                ══════════════════════════════════ */}
                <div style={{ flex: '0 0 30%', position: 'sticky', top: 24 }}>
                        <div
                            className="bg-white p-5"
                            style={{ border: '1px solid #E8E8E8', borderRadius: 12 }}
                        >
                            <Checkbox
                                checked={termsAccepted}
                                onChange={e => setTermsAccepted(e.target.checked)}
                                className="items-start"
                            >
                                <Text className="text-sm text-gray-600 leading-relaxed">
                                    By checking this box, I understand and agree with the{' '}
                                    <a
                                        href="#"
                                        style={{ color: '#FF4F4F', textDecoration: 'none' }}
                                        onClick={e => e.preventDefault()}
                                    >
                                        Terms and Conditions
                                    </a>
                                    {' '}and consent to the sharing of my details with Peko and
                                    the relevant Bus operator(s)
                                </Text>
                            </Checkbox>

                            <Button
                                block
                                size="large"
                                disabled={proceedDisabled}
                                onClick={handleProceed}
                                className="mt-5 rounded-md font-semibold"
                                style={
                                    !proceedDisabled
                                        ? {
                                              backgroundColor: '#FF4F4F',
                                              borderColor: '#FF4F4F',
                                              color: '#fff',
                                              borderRadius: 8,
                                              fontWeight: 600,
                                          }
                                        : { borderRadius: 8 }
                                }
                            >
                                Proceed to Review
                            </Button>

                            {/* Progress hint */}
                            {unassignedCount > 0 && (
                                <Text className="text-xs text-gray-400 mt-3 block text-center">
                                    {unassignedCount === seats.length
                                        ? `Assign a traveller to all ${seats.length} seat${seats.length > 1 ? 's' : ''}`
                                        : `${unassignedCount} seat${unassignedCount > 1 ? 's' : ''} still need${unassignedCount === 1 ? 's' : ''} a traveller`}
                                </Text>
                            )}

                            {unassignedCount === 0 && !termsAccepted && (
                                <Text className="text-xs text-gray-400 mt-3 block text-center">
                                    Tick the checkbox above to continue
                                </Text>
                            )}
                        </div>
                </div>
            </div>
        </Flex>
    );
};

export default BusTicketTraveller;
