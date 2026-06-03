import { useState } from 'react';

import { Button, Col, Flex, Form, Row } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import animation from '@src/assets/animation/Employee-Loader.json';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { useCreateEmployeeApi } from '../../hooks/employeeHooks/useCreateEmployeeApi';
import { bankSchema } from '../../schema/employeeProfile';
import { setBankData } from '../../slices/employeeSlices';
import { CreatePayload } from '../../types/types';

type Props = {
    nextTab: (key: string) => void;
    formData: any;
    setFormData: (data: any) => void;
    // setLoading: (loading: boolean) => void;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
};

const BankDetails = ({ nextTab, formData, setFormData, setLoading, loading }: Props) => {
    const { createUser } = useCreateEmployeeApi(setLoading);

    const dispatch = useAppDispatch();
    const [fdata, setfdata] = useState<any>();
    const personalInformation = useAppSelector(state => state.reducer.employee.personalDetails);
    const profileImage = useAppSelector(state => state.reducer.employee.imageDetails);

    const {
        fullName,
        dob,
        gender,
        mobileNo,
        personalEmail,
        emergencyContactName,
        emergencyContactNo,
        emergencyContactRelation,
        gccNational,
        nationality,
        sendWelcomeEmail,
    } = personalInformation;
    const employeeInfo = useAppSelector(state => state.reducer.employee.employeeDetails);

    const salaryInformation = useAppSelector(state => state.reducer.employee.salaryDetails);
    const employeeDocuments = useAppSelector(state => state.reducer.employee.employeeDocuments);
    const bankDetails = useAppSelector(state => state.reducer.employee.bankDetails);
    const {
        dateOfJoin,
        employeeId,
        department,
        reportingStaff,
        workingHours,

        status,
        designation,
        jobType,
        probation,

        schedule,
    } = employeeInfo;

    const { bankDetails: Details } = useAppSelector(state => state.reducer.employeeDetails);

    const employeeDetails = {
        dateOfJoin,
        employeeId,
        department,
        reportingStaff,
        workingHours,

        probation,
        designation,
        jobType,
        schedule,
    };
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const handleBankDetailsSubmit = async (values: any) => {
        const employeeData: CreatePayload = {
            sendWelcomeEmail,
            profileImage: profileImage?.profileImage,
            fullName,
            dateOfBirth: dob,
            gender,
            mobileNo,
            personalEmail,
            emergencyNo: emergencyContactNo,
            emergencyContactName,
            emergencyContactRelation,
            isGccNationality: gccNational,
            nationality,
            employeeInformation: employeeDetails,
            salaryInformation,
            employeeDocuments,
            bankDetails: values,
        };

        createUser(employeeData);

        dispatch(setBankData(values));
        setFormData(values);

        nextTab('5');
    };

    return (
        <Flex vertical className=" my-8">
            <Formik
                initialValues={{
                    beneficiaryName: fdata?.beneficiaryName || '',
                    accountNumber: fdata?.accountNumber || '',
                    bankName: fdata?.bankName || '',
                    swiftCode: fdata?.swiftCode || '',
                    ibanNumber: fdata?.ibanNumber || '',
                    routingCode: '',
                }}
                onSubmit={values => {
                    setFormData(values);

                    setfdata(values);

                    handleBankDetailsSubmit(values);
                }}
                validationSchema={bankSchema}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit} className="w-full">
                        <Flex justify="center">
                            <Col span={16}>
                                <Row>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Beneficiary Name"
                                            name="beneficiaryName"
                                            placeholder="Beneficiary Name"
                                            type="text"
                                            allowAlphabetsAndSpaceOnly
                                            minLength={3}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Account Number"
                                            name="accountNumber"
                                            placeholder="Account Number"
                                            type="text"
                                            allowNumbersOnly
                                            maxLength={16}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Bank Name"
                                            name="bankName"
                                            placeholder="Bank Name"
                                            type="text"
                                            allowAlphabetsAndSpaceOnly
                                            minLength={3}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Swift Code"
                                            name="swiftCode"
                                            placeholder="Swift Code"
                                            type="text"
                                            allowAlphabetsAndNumbersOnly
                                            maxLength={11}
                                            minLength={8}
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="IBAN Number"
                                            name="ibanNumber"
                                            placeholder="AEXXXXXXXXXXXXX"
                                            type="text"
                                            allowAlphabetsAndNumbersOnly
                                            maxLength={23}
                                            tooltipText="23 character code starting with 'AE'"
                                            showToolTip
                                        />
                                    </Col>
                                    <Col xs={24} sm={10} className="mx-auto">
                                        <TextInput
                                            label="Routing Code"
                                            name="routingCode"
                                            placeholder="Routing Code"
                                            type="text"
                                            maxLength={10}
                                            allowNumbersOnly
                                        />
                                    </Col>
                                </Row>
                                <Flex justify="space-between" className=" mt-4 mx-8">
                                    <Button
                                        onClick={() => nextTab('4')}
                                        type="default"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Create
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

export default BankDetails;
