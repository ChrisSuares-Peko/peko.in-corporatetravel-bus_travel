import React, { useState } from 'react';

import { Col, Card, Row, Typography, Radio, Flex, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { Formik, Form } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';

// import { travellerData } from '../schema/travellerData';
import { useGetEmployee } from '../hooks/useGetEmployeeApi';
import { travellerDataWeb } from '../schema/travellerData';
import { addCustomerInfo, addPassengersData } from '../slices/airlineSlice';
import { IFareRulesData } from '../types/fareRules';
import { getTitleOptions } from '../utils/options';

type Props = {
    cardTitle: string;
    formRef: React.MutableRefObject<any>;
    passengerType: 'adult' | 'child' | 'infant';
    fareRules: IFareRulesData[];
    countryData: any[];
    phoneCodes: any[];
};

const PassengerCard = ({
    cardTitle,
    formRef,
    passengerType,
    fareRules,
    countryData,
    phoneCodes,
}: Props) => {
    const { Paragraph } = Typography;
    const dispatch = useAppDispatch();
    const { flightSegments } = useAppSelector(state => state.reducer.airline.formData);
    const { data, generateEmployeesDropdown } = useGetEmployee();
    const isPurchased = useServiceAccess(accessKeys.payroll);
    const [gender, setGender] = useState<'M' | 'F'>('M');
    const handleFormSubmit = async (submitForm: () => void) => {
        await submitForm();
    };

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
        <Col span={24}>
            <Card
                bodyStyle={{ padding: 25, border: '0' }}
                className="my-4 border border-gray-200 rounded-sm "
            >
                <Row className="mb-8">
                    <Paragraph className="text-lg font-medium leading-7 capitalize">
                        Add {cardTitle}
                    </Paragraph>
                </Row>
                <Row>
                    <Formik
                        initialValues={{
                            employee: '',
                            nameTitle: '',
                            firstName: '',
                            lastName: '',
                            dob: '',
                            passportNo: '',
                            issuedCountry: '',
                            residenceCountryCode: '',
                            expiryDate: '',
                            gender: 'M',
                            phoneCode: +971,
                            phone: '',
                            email: '',
                            passengerType,
                            isPassportRequired,
                            isDefault: false,
                        }}
                        innerRef={formRef}
                        validationSchema={travellerDataWeb}
                        onSubmit={values => {
                            const today = new Date();
                            const dob = new Date(values.dob);
                            const age = today.getFullYear() - dob.getFullYear();
                            let ptc;

                            if (passengerType === 'adult') {
                                ptc = 'ADT';
                                if (age < 12) {
                                    dispatch(
                                        showToast({
                                            description:
                                                'Age of adult passenger should be greater than 12',
                                            variant: 'error',
                                        })
                                    );
                                    return;
                                }
                            } else if (passengerType === 'child') {
                                ptc = 'CHD';
                                if (age < 3 || age > 12) {
                                    dispatch(
                                        showToast({
                                            description:
                                                'Age of child passenger should between 3 and 12',
                                            variant: 'error',
                                        })
                                    );
                                    return;
                                }
                            } else if (passengerType === 'infant') {
                                ptc = 'INF';
                                if (age > 3) {
                                    dispatch(
                                        showToast({
                                            description: 'Age of infant passenger should below 3',
                                            variant: 'error',
                                        })
                                    );
                                    return;
                                }
                            }

                            const customerInfo = {
                                phone: values.phone,
                                email: values.email,
                            };
                            dispatch(addCustomerInfo(customerInfo));

                            const passengerData: any = {
                                passengerId: cardTitle,
                                passengerKey: Math.random().toString(36).substring(2),
                                ptc,
                                age,
                                isDefault: values.isDefault,
                                passengerInfo: {
                                    surname: values?.lastName || '',
                                    gender: values.gender,
                                    birthDate:
                                        values.employee !== ''
                                            ? values?.dob?.split('T')[0]
                                            : values.dob,
                                    nameTitle: values?.nameTitle,
                                    middleName: '',
                                    givenName: values?.firstName || '',
                                },
                                contact: {
                                    contactsProvided: [
                                        {
                                            phone: [
                                                {
                                                    label: 'Origin',
                                                    areaCode: values.phoneCode,
                                                    phoneNumber: values.phone,
                                                },
                                            ],
                                            emailAddress: [values.email],
                                        },
                                    ],
                                },
                            };
                            if (
                                isPassportRequired ||
                                (values.passportNo !== '' && values.expiryDate !== '')
                            )
                                passengerData.identityDocuments = [
                                    {
                                        idDocumentNumber: values.passportNo,
                                        idType: 'PT',
                                        issuingCountryCode: values.issuedCountry,
                                        residenceCountryCode: values.residenceCountryCode,
                                        expiryDate:
                                            values.employee !== ''
                                                ? values?.expiryDate?.split('T')[0]
                                                : values.expiryDate,
                                    },
                                ];
                            dispatch(addPassengersData(passengerData));
                        }}
                    >
                        {({
                            handleSubmit,
                            values,
                            handleChange,
                            errors,
                            isValid,
                            setFieldValue,
                            submitForm,
                        }) => (
                            <Form onSubmit={handleSubmit} className="w-full" id="airlineBtn">
                                {passengerType === 'adult' && (
                                    <Col className="mr-10" sm={10}>
                                        <Flex vertical gap="small">
                                            <Typography.Text>Select Employee</Typography.Text>

                                            <SelectInputWithSearch
                                                name="employee"
                                                options={generateEmployeesDropdown(data) || []}
                                                placeholder="Select employee"
                                                isRequired
                                                isDisabled={!isPurchased}
                                                handleChange={async eid => {
                                                    const employeeData = generateEmployeesDropdown(
                                                        data
                                                    ).find(emp => emp.value === eid);
                                                    if (employeeData) {
                                                        const nameParts =
                                                            employeeData?.fullName.split(' ');
                                                        const firstName = nameParts[0];
                                                        const lastName =
                                                            nameParts.length > 1
                                                                ? nameParts.slice(1).join(' ')
                                                                : '';

                                                        await setFieldValue('firstName', firstName);
                                                        await setFieldValue('lastName', lastName);
                                                        await setFieldValue(
                                                            'gender',
                                                            employeeData.gender === 'MALE'
                                                                ? 'M'
                                                                : 'F'
                                                        );
                                                        setGender(
                                                            employeeData.gender === 'MALE'
                                                                ? 'M'
                                                                : 'F'
                                                        );
                                                        await setFieldValue('nameTitle', '');
                                                        await setFieldValue(
                                                            'dob',
                                                            employeeData.dateOfBirth,
                                                            true
                                                        );
                                                        await setFieldValue(
                                                            'phone',
                                                            employeeData.mobileNo,
                                                            true
                                                        );
                                                        await setFieldValue(
                                                            'email',
                                                            employeeData.personalEmail,
                                                            true
                                                        );

                                                        handleFormSubmit(submitForm);
                                                    }
                                                }}
                                            />
                                        </Flex>
                                    </Col>
                                )}
                                <Row className="flex flex-col">
                                    <Radio.Group
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
                                    <Typography.Text className="mt-2 text-red-500">
                                        {errors.gender}
                                    </Typography.Text>
                                </Row>
                                <Row
                                    className="mt-2"
                                    onBlur={() => {
                                        if (isValid) handleFormSubmit(submitForm);
                                    }}
                                >
                                    <Col className="mr-10" sm={10}>
                                        <Typography.Text>
                                            <Typography.Text className="text-red-500 me-1">
                                                *
                                            </Typography.Text>
                                            First Name
                                        </Typography.Text>
                                        <Row className="flex justify-between mt-2">
                                            <Col sm={6}>
                                                <SelectInput
                                                    name="nameTitle"
                                                    options={
                                                        getTitleOptions(passengerType, gender) ?? []
                                                    }
                                                    placeholder="Select Title"
                                                    classes="w-10/12"
                                                />
                                            </Col>
                                            <Col sm={17}>
                                                <TextInput
                                                    name="firstName"
                                                    placeholder="First Name"
                                                    type="text"
                                                    allowAlphabetsAndSpaceOnly
                                                    isRequired
                                                    maxLength={25}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col className="mr-10" sm={10}>
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Last Name
                                            </Typography.Text>
                                            <TextInput
                                                name="lastName"
                                                placeholder="Last Name"
                                                type="text"
                                                allowAlphabetsAndSpaceOnly
                                                isRequired
                                                maxLength={25}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col className="mr-10" sm={10}>
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Date of Birth
                                            </Typography.Text>
                                            <DatePickerInput
                                                placeholder="Select Date"
                                                isRequired
                                                name="dob"
                                                classes="w-full"
                                                maxDate={maxDate}
                                                minDate={minDate}
                                                needConfirm={false}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col className="mr-10" sm={10}>
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                {isPassportRequired && (
                                                    <Typography.Text className="text-red-500 me-1">
                                                        *
                                                    </Typography.Text>
                                                )}
                                                Passport No
                                            </Typography.Text>
                                            <TextInput
                                                name="passportNo"
                                                isRequired
                                                allowAlphabetsAndNumbersOnly
                                                placeholder="Passport No"
                                                type="text"
                                                maxLength={50}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col className="mr-10 " sm={10}>
                                        <Flex vertical gap={0}>
                                            <Typography.Text>
                                                {isPassportRequired && (
                                                    <Typography.Text className="text-red-500 me-1">
                                                        *
                                                    </Typography.Text>
                                                )}
                                                Passport issued country
                                            </Typography.Text>
                                            <Select
                                                showSearch
                                                options={countryData ?? []}
                                                placeholder="Passport Issued Country"
                                                // defaultValue="United Arab Emirates"
                                                onSelect={e => handleChange('issuedCountry')(e)}
                                                className="w-full mt-1 p"
                                                virtual={false}
                                                filterOption={(input: string, option) =>
                                                    (
                                                        (option &&
                                                            // @ts-ignore
                                                            option?.label.toLowerCase()) ??
                                                        ''
                                                    ).includes(input.toLowerCase())
                                                }
                                            />
                                            <Typography.Text className="text-red-500">
                                                {errors.issuedCountry}
                                            </Typography.Text>
                                        </Flex>
                                    </Col>
                                    <Col className="mr-10 " sm={10}>
                                        <Flex vertical gap={0}>
                                            <Typography.Text>
                                                {isPassportRequired && (
                                                    <Typography.Text className="text-red-500 me-1">
                                                        *
                                                    </Typography.Text>
                                                )}
                                                Nationality
                                            </Typography.Text>
                                            <Select
                                                showSearch
                                                options={countryData ?? []}
                                                placeholder="Nationality"
                                                // defaultValue="United Arab Emirates"
                                                onSelect={e =>
                                                    handleChange('residenceCountryCode')(e)
                                                }
                                                className="w-full mt-1 p"
                                                virtual={false}
                                                filterOption={(input: string, option) =>
                                                    (
                                                        (option &&
                                                            // @ts-ignore
                                                            option?.label.toLowerCase()) ??
                                                        ''
                                                    ).includes(input.toLowerCase())
                                                }
                                            />
                                            <Typography.Text className="text-red-500">
                                                {errors.residenceCountryCode}
                                            </Typography.Text>
                                        </Flex>
                                    </Col>
                                    <Col className="mt-3 mr-10" sm={10}>
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                {isPassportRequired && (
                                                    <Typography.Text className="text-red-500 me-1">
                                                        *
                                                    </Typography.Text>
                                                )}
                                                Expiry Date
                                            </Typography.Text>
                                            <DatePickerInput
                                                placeholder="Select Date"
                                                name="expiryDate"
                                                classes="w-full"
                                                minDate={passPortExpMin}
                                                isRequired
                                                needConfirm={false}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col className="mt-3 mr-10" sm={10}>
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Email ID
                                            </Typography.Text>
                                            <TextInput
                                                type="text"
                                                placeholder="Enter Email ID"
                                                name="email"
                                                classes="w-full"
                                                allowLowerCaseOnly
                                                isRequired
                                                maxLength={50}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col className="mr-10" sm={10}>
                                        <Typography.Text>
                                            <Typography.Text className="text-red-500 me-1">
                                                *
                                            </Typography.Text>
                                            Mobile Number
                                        </Typography.Text>
                                        <Row className="mt-2">
                                            <Col sm={8}>
                                                <Select
                                                    showSearch
                                                    options={phoneCodes ?? []}
                                                    placeholder="Select Phone Code"
                                                    defaultValue="+971"
                                                    onSelect={e => handleChange('phoneCode')(e)}
                                                    className="w-11/12"
                                                    filterOption={(input: string, option) =>
                                                        (
                                                            (option &&
                                                                // @ts-ignore
                                                                option?.label.toLowerCase()) ??
                                                            ''
                                                        ).includes(input.toLowerCase())
                                                    }
                                                />
                                                <Typography.Text className="mt-2 text-red-500">
                                                    {errors.phoneCode}
                                                </Typography.Text>
                                            </Col>
                                            <Col sm={16}>
                                                <TextInput
                                                    type="text"
                                                    placeholder="Enter Mobile Number"
                                                    name="phone"
                                                    allowNumbersOnly
                                                    maxLength={10}
                                                    isRequired
                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col
                                        className={`mr-10 ${cardTitle === 'Adult Passenger 1' ? '' : 'hidden'}`}
                                        sm={20}
                                    >
                                        <Flex vertical gap="small">
                                            <CheckboxInput
                                                name="isDefault"
                                                classes="mb-3"
                                                isRequired
                                                onChange={async e => {
                                                    const isChecked = e.target.checked;

                                                    if (isChecked) {
                                                        await setFieldValue('email', values.email);
                                                        await setFieldValue('phone', values.phone);

                                                        handleFormSubmit(submitForm);
                                                    } else {
                                                        await setFieldValue('email', '');
                                                        await setFieldValue('phone', '');
                                                    }
                                                }}
                                            >
                                                Use the same contact information for sending booking
                                                details
                                            </CheckboxInput>
                                        </Flex>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Row>
            </Card>
        </Col>
    );
};

export default PassengerCard;
