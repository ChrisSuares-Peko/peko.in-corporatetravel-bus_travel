import { Card, Col, Flex, Radio, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs, { Dayjs } from 'dayjs';
import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { showToast } from '@src/slices/apiSlice';
import { accessKeys } from '@utils/accessKeys';

import { employeeTypes } from '../../../Payroll/types/docAndAssetsTypes';
import { userDetailsSchema } from '../../schema';
import { TotalFormCount, addPassengersData, addUserData } from '../../slices/getHotelSlice';

type Props = {
    passengerType: string;
    passengerKey: number;
    roomIndex: number;
    roomKey: string;
    formRef: React.MutableRefObject<any>;
    totalForm: string[];
    setTotalForm: any;
    childAge?: number;
    totalPassengers?: any;
    passengerCount?: number;
    data: employeeTypes[];
    generateEmployeesDropdown: (data: employeeTypes[]) => {
        fullName: string;
        value: string;
        label: string;
        dateOfBirth: string;
        gender: string;
        mobileNo: string;
        personalEmail: string;
        passportExpiryDate: string;
    }[];
};

const DetailBookings = ({
    passengerType,
    passengerKey,
    roomIndex,
    roomKey,
    formRef,
    totalForm,
    setTotalForm,
    childAge,
    totalPassengers,
    passengerCount,
    data,
    generateEmployeesDropdown,
}: Props) => {
    const dispatch = useDispatch();
    const ageChild = childAge as number;
    const isPurchased = useServiceAccess(accessKeys.payroll);
    const formKey = `${roomIndex}-${passengerType}-${passengerKey}`;

    const handleFormSubmit = async (submitForm: () => void) => {
        await submitForm();
    };

    let minDate: Dayjs | undefined;
    let maxDate: Dayjs | undefined;

    if (passengerType === 'adult') {
        minDate = undefined;
        maxDate = dayjs().subtract(12, 'year');
    }
    if (passengerType === 'child') {
        minDate = dayjs().subtract(ageChild + 1, 'year');
        maxDate = dayjs().subtract(ageChild, 'year');
    }

    return (
        <Content className="">
            <Card
                bodyStyle={{ padding: 25, border: '0' }}
                className={`rounded-md border border-gray-200 ${
                    roomIndex === 1 && passengerKey === 1 ? '' : 'my-4'
                }`}
            >
                <Typography.Text className="font-medium text-lg">
                    {passengerType === 'adult' ? 'Adult' : 'Child'} Guest {passengerCount}
                </Typography.Text>
                <Row className="mt-3">
                    <Formik
                        key={passengerKey}
                        initialValues={{
                            employee: '',
                            firstName: '',
                            lastName: '',
                            dob: '',
                            email: '',
                            passengerType,
                            gender: 'M',
                            phone: '',
                            meal: false,
                        }}
                        innerRef={formRef}
                        validationSchema={userDetailsSchema}
                        validateOnChange
                        validateOnBlur
                        onSubmit={(values, { setSubmitting }) => {
                            console.log('Form submitted with values: ', values);
                            const bookingRoom: any = [];
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
                                                'Age of adult guest should be greater than 12',
                                            variant: 'error',
                                        })
                                    );
                                }
                            } else if (passengerType === 'child') {
                                ptc = 'CHD';
                                if (age > 12) {
                                    dispatch(
                                        showToast({
                                            description: 'Age of child guest should less than 12',
                                            variant: 'error',
                                        })
                                    );
                                }
                            }

                            const passengerData = {
                                passengerKey,
                                isLead:
                                    passengerType === 'adult' &&
                                    passengerKey === 1 &&
                                    roomIndex === 1,
                                ptc,
                                mealPreference: values.meal ? 'breakfast' : '',
                                passengerInfo: {
                                    surname: values?.lastName || '',
                                    gender: values.gender,
                                    birthDate:
                                        values.employee !== ''
                                            ? values?.dob?.split('T')[0]
                                            : values.dob,
                                    nameTitle: values.gender === 'M' ? 'Mr' : 'Mrs',
                                    middleName: '',
                                    givenName: values?.firstName || '',
                                },
                                contact: {
                                    // postalAddress: {
                                    //     label: 'test123',
                                    //     street: ['testStreet'],
                                    //     postalCode: '2432434',
                                    //     cityName: 'mumbai',
                                    //     countryCode: 'IN',
                                    // },
                                    contactProvided: [
                                        {
                                            emailAddress: [values.email],
                                            phone: [
                                                {
                                                    label: 'string',
                                                    areaCode: 971,
                                                    phoneNumber: values.phone,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            };

                            if (
                                values.firstName &&
                                values.lastName &&
                                values.dob &&
                                values.email &&
                                values.gender
                            ) {
                                if (!totalForm.includes(formKey)) {
                                    setTotalForm((prevTotalForm: any) => [
                                        ...prevTotalForm,
                                        formKey,
                                    ]);
                                    dispatch(TotalFormCount([...totalForm, formKey]));
                                }
                            }

                            const existingPassengerIndex = bookingRoom.findIndex(
                                (passenger: any) => passenger.passengerKey === passengerKey
                            );

                            if (existingPassengerIndex !== -1) {
                                bookingRoom[existingPassengerIndex] = {
                                    ...bookingRoom[existingPassengerIndex],
                                    ...passengerData,
                                };
                            } else {
                                bookingRoom.push(passengerData);
                            }
                            dispatch(addPassengersData(bookingRoom));
                            dispatch(
                                addUserData({ roomIndex, roomKey, userdetails: passengerData })
                            );
                            setSubmitting(false);
                        }}
                    >
                        {({
                            handleSubmit,
                            values,
                            handleChange,
                            setFieldValue,
                            submitForm,
                            isSubmitting,
                        }) => (
                            <Form onSubmit={handleSubmit} className="w-full" id="hotelsbtn">
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

                                                        console.log(
                                                            'Selected employee data: ',
                                                            employeeData
                                                        );

                                                        await setFieldValue('firstName', firstName);
                                                        await setFieldValue('lastName', lastName);
                                                        await setFieldValue(
                                                            'gender',
                                                            employeeData.gender === 'MALE'
                                                                ? 'M'
                                                                : 'F'
                                                        );
                                                        await setFieldValue(
                                                            'dob',
                                                            employeeData.dateOfBirth
                                                        );
                                                        await setFieldValue(
                                                            'phone',
                                                            employeeData.mobileNo
                                                        );
                                                        await setFieldValue(
                                                            'email',
                                                            employeeData.personalEmail
                                                        );

                                                        // Submit the form after setting the values
                                                        handleFormSubmit(submitForm);
                                                    }
                                                }}
                                            />
                                        </Flex>
                                    </Col>
                                )}
                                <Row onBlur={() => handleFormSubmit(submitForm)}>
                                    <Radio.Group
                                        value={values.gender}
                                        onChange={e => handleChange('gender')(e.target.value)}
                                    >
                                        <Radio value="M">Male</Radio>
                                        <Radio value="F">Female</Radio>
                                    </Radio.Group>
                                </Row>
                                <Row>
                                    <Col
                                        className="mt-3 mr-10 w-full"
                                        md={10}
                                        onBlur={() => handleFormSubmit(submitForm)}
                                    >
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                First Name
                                            </Typography.Text>
                                            <TextInput
                                                name="firstName"
                                                isRequired
                                                placeholder="First Name"
                                                type="text"
                                                allowAlphabetsAndSpaceOnly
                                                maxLength={12}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col
                                        className="mr-10 mt-3 w-full"
                                        md={10}
                                        onBlur={() => handleFormSubmit(submitForm)}
                                    >
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Last Name
                                            </Typography.Text>
                                            <TextInput
                                                name="lastName"
                                                isRequired
                                                placeholder="Last Name"
                                                type="text"
                                                allowAlphabetsAndSpaceOnly
                                                maxLength={12}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col
                                        className="mr-10 w-full"
                                        md={10}
                                        onBlur={() => handleFormSubmit(submitForm)}
                                    >
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
                                                needConfirm={false}
                                                classes="w-full"
                                                maxDate={maxDate}
                                                minDate={minDate}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col
                                        className="mr-10 w-full"
                                        md={10}
                                        onBlur={() => handleFormSubmit(submitForm)}
                                    >
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Email ID
                                            </Typography.Text>
                                            <TextInput
                                                name="email"
                                                isRequired
                                                placeholder="Email ID"
                                                type="text"
                                                maxLength={50}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col
                                        className="mr-10 w-full"
                                        md={10}
                                        onBlur={() => handleFormSubmit(submitForm)}
                                    >
                                        <Flex vertical gap="small">
                                            <Typography.Text>
                                                <Typography.Text className="text-red-500 me-1">
                                                    *
                                                </Typography.Text>
                                                Mobile Number
                                            </Typography.Text>
                                            <TextInput
                                                name="phone"
                                                placeholder="Mobile Number"
                                                type="text"
                                                isRequired
                                                allowNumbersOnly
                                                maxLength={10}
                                                minLength={10}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col
                                        className="mr-10 w-full"
                                        md={10}
                                        onBlur={() => handleFormSubmit(submitForm)}
                                    >
                                        <Flex vertical gap="small" className="mt-9">
                                            <CheckboxInput name="meal" classes="mb-3 ">
                                                Add Breakfast
                                            </CheckboxInput>
                                        </Flex>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </Row>
            </Card>
        </Content>
    );
};

export default DetailBookings;
