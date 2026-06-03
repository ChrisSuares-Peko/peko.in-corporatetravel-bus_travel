import { useState } from 'react';

import { Col, Flex, Form, Radio, Row, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { employeeTypes } from '@src/domains/dashboard/Payroll/types/docAndAssetsTypes';
import { useAppSelector } from '@src/hooks/store';

// import { travellerEditData } from '../../schema/travellerData';

import { travellerDataWeb } from '../../schema/travellerData';
import { IFareRulesData } from '../../types/fareRules';

interface PassengerModalProps {
    open: boolean;
    handleCancel: () => void;
    handleSubmit: (val: {}) => void;
    passengerType: string;
    initialValue: any | null;
    fareRules: IFareRulesData[];
    countryData: any[];
    phoneCodes: any[];
    data: employeeTypes[];
    generateEmployeesDropdown: (data: employeeTypes[]) => {
        fullName: any;
        value: string;
        label: string;
        dateOfBirth: string;
        gender: string;
        mobileNo: string;
        personalEmail: string;
        passportExpiryDate: string;
    }[];
}

const PassengerEditModal = ({
    open,
    handleCancel,
    handleSubmit,
    passengerType,
    initialValue,
    fareRules,
    countryData,
    phoneCodes,
    data,
    generateEmployeesDropdown,
}: PassengerModalProps) => {
    const { flightSegments } = useAppSelector(state => state.reducer.airline.formData);
    const passengerRules = fareRules[0]?.bookingRules?.passengerRules?.[0];
    const isPassportRequired =
        passengerRules?.isDocumentNumberMandatory ||
        passengerRules?.isResidenceCountryCodeMandatory;

    const [defaultValue, setDefaultValue] = useState('M');
    const [title, setTitle] = useState(initialValue?.passengerType || '');

    // should be valid till last flight departure
    let minDate: Dayjs | undefined;
    let maxDate: Dayjs | undefined;
    // Use current date as fallback if departureDate is not available
    const { departureDate } = flightSegments[0] || {};
    const departureDateDayjs = departureDate ? dayjs(departureDate) : dayjs();
    const passPortExpMin = departureDateDayjs.add(1, 'day');
    if (passengerType.includes('Adult')) {
        minDate = undefined;
        maxDate = departureDateDayjs.subtract(12, 'year');
    }
    if (passengerType.includes('Child')) {
        minDate = departureDateDayjs.subtract(12, 'year');
        maxDate = departureDateDayjs.subtract(2, 'year');
    }
    if (passengerType.includes('Infant')) {
        minDate = departureDateDayjs.subtract(2, 'year');
        maxDate = dayjs();
    }

    return (
        <CustomModalWithForm
            modalTitle={`Edit ${title}`}
            open={open}
            handleCancel={handleCancel}
            validationSchema={travellerDataWeb}
            initialValues={{
                employee: initialValue?.employee,
                gender: initialValue?.gender,
                firstName: initialValue?.firstName,
                lastName: initialValue?.lastName,
                dob: initialValue?.dob,
                passportNo: initialValue?.passportNo,
                issuedCountry: initialValue?.issuedCountry,
                expiryDate: initialValue?.expiryDate,
                passengerType: initialValue?.passengerType,
                phoneCode: '',
                phone: initialValue?.phone,
                email: initialValue?.email,
            }}
            handleFormSubmit={val => {
                handleSubmit(val);
            }}
            reinitialise
        >
            {({ values, setFieldValue }) => (
                <Flex vertical className="w-full mt-6">
                    <Form layout="vertical">
                        {passengerType.includes('Adult') && (
                            <Col className="mr-10" sm={10}>
                                <Flex vertical gap="small">
                                    <Typography.Text>Select Employee</Typography.Text>

                                    <SelectInputWithSearch
                                        name="employee"
                                        options={generateEmployeesDropdown(data) || []}
                                        placeholder="Select employee"
                                        isRequired
                                        handleChange={eid => {
                                            const employeeData = generateEmployeesDropdown(
                                                data
                                            ).find(emp => emp.value === eid);
                                            if (employeeData) {
                                                const nameParts = employeeData?.fullName.split(' ');
                                                const firstName = nameParts[0];
                                                const lastName =
                                                    nameParts.length > 1
                                                        ? nameParts.slice(1).join(' ')
                                                        : '';

                                                setFieldValue('firstName', firstName);
                                                setFieldValue('lastName', lastName);
                                                setFieldValue(
                                                    'gender',
                                                    employeeData.gender === 'MALE' ? 'M' : 'F'
                                                );
                                                setFieldValue('dob', employeeData?.dateOfBirth);
                                                setFieldValue('phone', employeeData.mobileNo);
                                                setFieldValue('email', employeeData.personalEmail);
                                                setFieldValue(
                                                    'expiryDate',
                                                    employeeData.passportExpiryDate
                                                );
                                            }
                                        }}
                                    />
                                </Flex>
                            </Col>
                        )}
                        <Radio.Group
                            className="mb-4"
                            onChange={e => setDefaultValue(e.target.value)}
                            value={defaultValue}
                        >
                            <Radio value="M">Male</Radio>
                            <Radio value="F">Female</Radio>
                        </Radio.Group>
                        <TextInput
                            name="firstName"
                            label="First Name"
                            type="text"
                            placeholder="Enter First Name"
                            classes=" rounded-sm"
                        />
                        <TextInput
                            name="lastName"
                            label="Last Name"
                            type="text"
                            placeholder="Enter Last Name"
                            classes=" rounded-sm"
                        />
                        <DatePickerInput
                            name="dob"
                            label="Date of Birth"
                            placeholder="Select Date Of Birth"
                            classes=" rounded-sm w-full"
                            maxDate={maxDate}
                            minDate={minDate}
                        />
                        <TextInput
                            name="passportNo"
                            label="Passport No"
                            type="text"
                            placeholder="Enter Passport No"
                            classes=" rounded-sm"
                            isRequired={isPassportRequired}
                        />
                        <SelectInput
                            label="Passport issued country"
                            name="issuedCountry"
                            placeholder="Select Country"
                            options={countryData ?? []}
                            isRequired={isPassportRequired}
                        />
                        <DatePickerInput
                            name="expiryDate"
                            label="Passport expiry"
                            placeholder="Enter Passport Expiry"
                            classes=" rounded-sm w-full"
                            minDate={passPortExpMin}
                            isRequired={isPassportRequired}
                        />
                        <Row className="w-full mt-2">
                            <Col span={8}>
                                <SelectInput
                                    name="phoneCode"
                                    placeholder="select country"
                                    options={phoneCodes ?? []}
                                    isRequired
                                    label="Mobile No"
                                />
                            </Col>
                            <Col span={16}>
                                <TextInput
                                    type="text"
                                    placeholder="Enter mobile number"
                                    name="phone"
                                    allowNumbersOnly
                                    maxLength={10}
                                    classes="w-full mt-[1.9rem]"
                                    isRequired
                                />
                            </Col>
                        </Row>
                        <TextInput
                            type="text"
                            placeholder="Enter email address"
                            name="email"
                            classes="w-full"
                            label="Email ID"
                            isRequired
                        />
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};

export default PassengerEditModal;
