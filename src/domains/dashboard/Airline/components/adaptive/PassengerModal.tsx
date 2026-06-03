import { useState } from 'react';

import { Col, Flex, Form, Radio, Row, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { employeeTypes } from '@src/domains/dashboard/Payroll/types/docAndAssetsTypes';
import { useAppDispatch } from '@src/hooks/hooks';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { travellerDataWeb } from '../../schema/travellerData';
import { IFareRulesData } from '../../types/fareRules';
import { getTitleOptions } from '../../utils/options';

interface PassengerModalProps {
    open: boolean;
    handleCancel: () => void;
    handleSubmit: (val: {}) => void;
    passengerType?: 'adult' | 'child' | 'infant';
    cardTitle: string;
    initialValue?: any | null;
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

const PassengerModal = ({
    open,
    handleCancel,
    handleSubmit,
    passengerType,
    cardTitle,
    initialValue,
    fareRules,
    countryData,
    phoneCodes,
    data,
    generateEmployeesDropdown,
}: PassengerModalProps) => {
    const dispatch = useAppDispatch();
    console.log({ initialValue });
    const [gender, setGender] = useState<'M' | 'F'>('M');

    const { flightSegments } = useAppSelector(state => state.reducer.airline.formData);

    const passengerRules = fareRules[0]?.bookingRules?.passengerRules?.[0];
    const isPassportRequired =
        passengerRules?.isDocumentNumberMandatory ||
        passengerRules?.isResidenceCountryCodeMandatory;

    // should be valid till last flight departure
    let minDate: Dayjs | undefined;
    let maxDate: Dayjs | undefined;
    // Use current date as fallback if departureDate is not available
    const { departureDate } = flightSegments[0] || {};
    const departureDateDayjs = departureDate ? dayjs(departureDate) : dayjs();
    const passPortExpMin = departureDateDayjs.add(1, 'day');
    if (passengerType === 'adult') {
        minDate = undefined;
        maxDate = departureDateDayjs.subtract(12, 'year');
    }
    if (passengerType === 'child') {
        minDate = departureDateDayjs.subtract(12, 'year');
        maxDate = departureDateDayjs.subtract(2, 'year');
    }
    if (passengerType === 'infant') {
        minDate = departureDateDayjs.subtract(2, 'year');
        maxDate = dayjs();
    }
    return (
        <CustomModalWithForm
            modalTitle={`${initialValue ? `Edit` : `Add`} ${cardTitle}`}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={val => {
                const today = new Date();
                const dob = new Date(val.dob);
                const age = today.getFullYear() - dob.getFullYear();
                const valPassengerType = val.passengerType;
                if (valPassengerType === 'adult' && age < 12) {
                    dispatch(
                        showToast({
                            description: 'Age of adult passenger should be greater than 12',
                            variant: 'error',
                        })
                    );
                    return;
                }
                if (valPassengerType === 'child' && (age < 3 || age > 12)) {
                    dispatch(
                        showToast({
                            description: 'Age of child passenger should between 3 and 12',
                            variant: 'error',
                        })
                    );
                    return;
                }
                if (valPassengerType === 'infant' && age > 3) {
                    dispatch(
                        showToast({
                            description: 'Age of infant passenger should below 3',
                            variant: 'error',
                        })
                    );
                    return;
                }
                handleSubmit(val);
            }}
            validationSchema={travellerDataWeb}
            initialValues={{
                employee: initialValue?.employee || '',
                nameTitle: initialValue?.nameTitle || '',
                gender: initialValue?.gender || gender,
                firstName: initialValue?.firstName || '',
                lastName: initialValue?.lastName || '',
                dob: initialValue?.dob || '',
                passportNo: initialValue?.passportNo || '',
                issuedCountry: initialValue?.issuedCountry || '',
                residenceCountryCode: initialValue?.residenceCountryCode || '',
                expiryDate: initialValue?.expiryDate || '',
                passengerType: initialValue?.passengerType || passengerType,
                phoneCode: initialValue?.phoneCode || '+971',
                phone: initialValue?.phone || '',
                email: initialValue?.email || '',
                isPassportRequired,
                passengerId: initialValue?.passengerId || cardTitle,
                ptc: initialValue?.ptc || '',
            }}
            // reinitialise
        >
            {({ values, handleChange, setFieldValue }) => (
                <Flex vertical className="w-full mt-6">
                    <Form layout="vertical">
                        {passengerType === 'adult' && (
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
                                                setGender(
                                                    employeeData.gender === 'MALE' ? 'M' : 'F'
                                                );
                                                setFieldValue('dob', employeeData?.dateOfBirth);
                                                setFieldValue('phone', employeeData.mobileNo);
                                                setFieldValue('email', employeeData.personalEmail);
                                            }
                                        }}
                                    />
                                </Flex>
                            </Col>
                        )}
                        <Radio.Group
                            className="mb-4"
                            value={values.gender}
                            onChange={async e => {
                                handleChange('gender')(e.target.value);
                                setGender(e.target.value);
                                await setFieldValue('nameTitle', '');
                            }}
                        >
                            <Radio value="M">Male</Radio>
                            <Radio value="F">Female</Radio>
                        </Radio.Group>
                        <SelectInput
                            label="Name Title"
                            name="nameTitle"
                            options={getTitleOptions(passengerType!, gender) ?? []}
                            placeholder="Select Title"
                            classes="w-10/12"
                            isRequired
                        />
                        <TextInput
                            name="firstName"
                            label="First Name"
                            type="text"
                            placeholder="Enter First Name"
                            classes=" rounded-sm"
                            allowAlphabetsAndSpaceOnly
                            isRequired
                            maxLength={25}
                        />
                        <TextInput
                            name="lastName"
                            label="Last Name"
                            type="text"
                            placeholder="Enter Last Name"
                            classes=" rounded-sm"
                            allowAlphabetsAndSpaceOnly
                            isRequired
                            maxLength={25}
                        />
                        <DatePickerInput
                            placeholder="Select Date Of Birth"
                            isRequired
                            name="dob"
                            classes=" rounded-sm w-full"
                            label="Date of Birth"
                            maxDate={maxDate}
                            minDate={minDate}
                            needConfirm={false}
                        />
                        <TextInput
                            name="passportNo"
                            label="Passport No"
                            type="text"
                            placeholder="Enter Passport No"
                            classes=" rounded-sm"
                            isRequired={isPassportRequired}
                            maxLength={50}
                        />
                        <SelectInput
                            label="Nationality"
                            name="residenceCountryCode"
                            placeholder="Select Nationality"
                            options={countryData ?? []}
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
                            needConfirm={false}
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
                            maxLength={50}
                        />
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};

export default PassengerModal;
