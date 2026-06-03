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
    Input,
    Radio,
    Row,
    Select,
    Tag,
    Typography,
    message,
} from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

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

interface SavedTraveller {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female';
}

type TravellerFormValues = { name: string; age: string; gender: 'Male' | 'Female' };

interface SeatState {
    savedTravellerId: string | null;
    editFormOpen: boolean;
    editValues: TravellerFormValues;
    addNewOpen: boolean;
    addNewValues: TravellerFormValues;
    addedTraveller: TravellerFormValues | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const SAVED_TRAVELLERS: SavedTraveller[] = [
    { id: 'T1', name: 'John Smith',    age: 34, gender: 'Male'   },
    { id: 'T2', name: 'Sarah Johnson', age: 28, gender: 'Female' },
    { id: 'T3', name: 'Michael Brown', age: 45, gender: 'Male'   },
    { id: 'T4', name: 'Emily Davis',   age: 32, gender: 'Female' },
];

const EMPTY_FORM: TravellerFormValues = { name: '', age: '', gender: 'Male' };

// Fallback shown when no route state (direct URL navigation during development)
const FALLBACK_SEATS: SelectedSeat[] = [
    { id: 'L1', label: 'L1', deck: 'lower', price: 950, originalPrice: 1200 },
    { id: 'U5', label: 'U5', deck: 'upper', price: 850, originalPrice: 1050 },
];

// ─── Inline Traveller Form ────────────────────────────────────────────────────

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
                            ? { backgroundColor: '#FFA827', borderColor: '#FFA827', color: '#fff' }
                            : undefined
                    }
                >
                    {confirmLabel ?? 'Confirm'}
                </Button>
            </Flex>
        )}
    </div>
);

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
    const selectedTraveller = SAVED_TRAVELLERS.find(t => t.id === state.savedTravellerId);

    const handleSelectSaved = (travellerId: string | null) => {
        const t = SAVED_TRAVELLERS.find(tt => tt.id === travellerId);
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

    const handleConfirmAddNew = () => {
        if (!state.addNewValues.name.trim() || !state.addNewValues.age) return;
        onStateChange({
            addedTraveller: { ...state.addNewValues },
            savedTravellerId: null,
            addNewOpen: false,
        });
    };

    const handleChangeAddedTraveller = () => {
        onStateChange({
            addedTraveller: null,
            addNewValues: EMPTY_FORM,
        });
    };

    return (
        <div
            className="border border-gray-100 rounded-2xl bg-white overflow-hidden"
            style={{ boxShadow: '0px 1px 8px rgba(0,0,0,0.05)' }}
        >
            {/* ── Card Header ── */}
            <div className="px-5 pt-4 pb-3">
                <Flex justify="space-between" align="center" className="gap-2 flex-wrap">
                    <Flex align="center" gap={8} className="flex-wrap">
                        <Text
                            className="font-bold text-base leading-tight"
                            style={{ color: '#FFA827' }}
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
                            className="text-amber-500 text-xs cursor-pointer hover:text-amber-600 hover:underline select-none ml-auto"
                        >
                            Change
                        </Text>
                    </Flex>
                ) : (
                    /* ── Saved traveller dropdown ── */
                    <Flex align="center" gap={12} className="flex-wrap sm:flex-nowrap">
                        <Select
                            value={state.savedTravellerId}
                            onChange={handleSelectSaved}
                            placeholder="Select a traveller"
                            size="large"
                            className="w-full"
                            options={SAVED_TRAVELLERS.map(t => ({
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
                                className="text-amber-500 text-sm cursor-pointer hover:text-amber-600 hover:underline whitespace-nowrap select-none flex-shrink-0"
                            >
                                {state.editFormOpen ? 'Close' : 'Edit traveller'}
                            </Text>
                        )}
                    </Flex>
                )}

                {/* Inline Edit Form */}
                {state.editFormOpen && selectedTraveller && (
                    <TravellerForm
                        values={state.editValues}
                        onChange={v => onStateChange({ editValues: v })}
                        showConfirm={false}
                    />
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
                                className="text-amber-400 text-xs transition-transform"
                                style={{
                                    transform: state.addNewOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                                }}
                            />
                            <Text className="text-amber-500 text-sm hover:text-amber-600">
                                Add New Traveller
                            </Text>
                        </Flex>

                        {/* Inline Add New Form */}
                        {state.addNewOpen && (
                            <TravellerForm
                                values={state.addNewValues}
                                onChange={v => onStateChange({ addNewValues: v })}
                                onConfirm={handleConfirmAddNew}
                                confirmLabel="Add Traveller"
                                showConfirm
                            />
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
                    addNewValues: EMPTY_FORM,
                    addedTraveller: null,
                },
            ])
        )
    );

    // ── Contact Details ──
    const [mobile, setMobile] = useState('+917350980296');
    const [email, setEmail] = useState('chrissuares@yahoo.com');

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
            const saved = SAVED_TRAVELLERS.find(t => t.id === s.savedTravellerId);
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

            <Row gutter={[20, 20]} align="top">

                {/* ══════════════════════════════════
                    LEFT COLUMN — Seat cards + contact
                ══════════════════════════════════ */}
                <Col xs={24} md={16}>
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
                            className="border border-gray-100 rounded-2xl bg-white p-5"
                            style={{ boxShadow: '0px 1px 8px rgba(0,0,0,0.05)' }}
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
                    </Flex>
                </Col>

                {/* ══════════════════════════════════
                    RIGHT COLUMN — Terms + Proceed
                ══════════════════════════════════ */}
                <Col xs={24} md={8}>
                    <div className="sticky top-4">
                        <div
                            className="border border-gray-100 rounded-2xl bg-white p-5"
                            style={{ boxShadow: '0px 2px 12px rgba(0,0,0,0.06)' }}
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
                                        className="text-blue-500 hover:text-blue-600"
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
                                              backgroundColor: '#FFA827',
                                              borderColor: '#FFA827',
                                              color: '#fff',
                                          }
                                        : undefined
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
                </Col>
            </Row>
        </Flex>
    );
};

export default BusTicketTraveller;
