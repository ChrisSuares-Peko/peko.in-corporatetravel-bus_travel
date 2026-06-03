import { useState } from 'react';

import { Button, Col, Flex, Form, Row } from 'antd';
import dayjs from 'dayjs';
import { Formik, FormikHelpers } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch } from '@src/hooks/store';

import DatePickerInput from './DatePickerInput';
import SelectInput from './SelectInput';
import SelectInputCustom from './SelectInputCustom';
import useGeneralApi from '../../hooks/employeeHooks/useGetCountry';
import { useValidateEmployeeApi } from '../../hooks/employeeHooks/useGetValidateEmployeeInfoApi';
import { employeePersonalSchema } from '../../schema/employeeProfile';
import { setPersonalData } from '../../slices/employeeSlices';

type Props = {
    nextTab: (key: string) => void;
};

const PersonalInformation = ({ nextTab }: Props) => {
    const dispatch = useAppDispatch();

    const { countriesList } = useGeneralApi();
    const { validateEmployee } = useValidateEmployeeApi();

    const genderOptions = [
        { key: 1, id: 1, value: 'MALE', label: 'Male', name: 'Male' },
        { key: 2, id: 2, value: 'FEMALE', label: 'Female', name: 'Female' },
    ];

    const [searchText, setSearchText] = useState<string>(''); // State to hold the search text

    const handleCountrySearch = (value: string) => {
        setSearchText(value); // Update the search text state
    };

    const handlePersonalInformation = async (values: any, actions: FormikHelpers<any>) => {
        // validateEmployee(values)
        // dispatch(setPersonalData(values));

        // nextTab('2');

        const errors = await actions.validateForm();
        // const bugs=actions.validateField()

        const validationPayload = {
            personalEmail: values.personalEmail,
            mobileNo: values.mobileNo,
        };

        const result = await validateEmployee(validationPayload);

        if (result?.data?.status) {
            dispatch(setPersonalData(values));
            nextTab('2');
        }
    };

    return (
        <Flex vertical className=" my-8">
            <Formik
                initialValues={{
                    sendWelcomeEmail: true,
                    fullName: '',
                    dob: '',
                    gender: '',
                    mobileNo: '',
                    personalEmail: '',
                    emergencyContactNo: '',
                    emergencyContactName: '',
                    emergencyContactRelation: '',

                    nationality: undefined,
                }}
                validationSchema={employeePersonalSchema}
                onSubmit={handlePersonalInformation}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit} className="">
                        <Flex justify="center">
                            <Col span={16}>
                                <Row>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Full Name"
                                            isRequired
                                            name="fullName"
                                            placeholder="Full Name"
                                            type="text"
                                            allowAlphabetsAndSpaceOnly
                                            maxLength={20}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <SelectInput
                                            isRequired
                                            label="Gender"
                                            name="gender"
                                            placeholder="Gender"
                                            classes=" rounded-sm "
                                            options={genderOptions}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <DatePickerInput
                                            label="Date Of Birth"
                                            isRequired
                                            name="dob"
                                            placeholder="Select Date"
                                            classes=" rounded-sm w-full"
                                            // maxDate={dayjs(new Date())}
                                            maxDate={dayjs().subtract(18, 'year')}
                                            defaultValue={undefined}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Mobile Number"
                                            name="mobileNo"
                                            allowNumbersOnly
                                            maxLength={10}
                                            minLength={9}
                                            placeholder="052XXXXXXXX"
                                            type="text"
                                            isRequired
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Email ID"
                                            name="personalEmail"
                                            type="text"
                                            placeholder="Email ID"
                                            isRequired
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Emergency Contact Number"
                                            name="emergencyContactNo"
                                            type="text"
                                            placeholder="Emergency Contact Number"
                                            maxLength={10}
                                            allowNumbersOnly
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Emergency Contact Name"
                                            name="emergencyContactName"
                                            type="text"
                                            placeholder="Emergency Contact Name"
                                            allowAlphabetsAndSpaceOnly
                                            maxLength={20}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Emergency Contact Relation"
                                            name="emergencyContactRelation"
                                            type="text"
                                            placeholder="Emergency Contact Relation"
                                            allowAlphabetsAndSpaceOnly
                                            maxLength={20}
                                        />
                                    </Col>

                                    <Col xs={24} sm={10} className="mx-auto">
                                        <SelectInputCustom
                                            isRequired
                                            label="Nationality"
                                            name="nationality"
                                            options={countriesList ?? []}
                                            placeholder="Nationality"
                                            classes="rounded-sm"
                                            onSearch={setSearchText}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <CheckboxInput name="sendWelcomeEmail">
                                            Send mail to employees
                                        </CheckboxInput>
                                    </Col>
                                    {/* <Col xs={24} sm={10} className="hidden md:block mx-auto" /> */}
                                </Row>
                                <Flex justify="end" className="mx-4">
                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            </Col>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default PersonalInformation;
