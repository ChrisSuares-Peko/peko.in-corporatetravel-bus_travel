import { useState } from 'react';

import { Form, Button, Flex } from 'antd';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import UAEFlag from '@assets/svg/uaeflag.svg';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import { ValidateUser } from '../../api';
import { registerSteponeSchema } from '../../schema';
import { setPasswordPolicy } from '../../slices/passwordPolicySlice';
import { nextStep, setFormData } from '../../slices/registerSlice';
import { ValidateUserValues } from '../../types';

const RegisterStepOneForm = () => {
    const dispatch = useDispatch();
    const { formData } = useAppSelector(state => state.reducer.registration);
    const [isLoading, setIsLoading] = useState(false);
    const handleValidateUser = async (values: ValidateUserValues) => {
        setIsLoading(true);
        const res = await ValidateUser({
            mobileNo: values.phonenumber,
            email: values.email,
            referralCode: values.referralCode,
        });
        if (res.status === true) {
            if (!values.referralCode) {
                delete values.referralCode;
            }
            dispatch(setFormData(values));
            dispatch(setPasswordPolicy(res.data));
            dispatch(nextStep());
        }
        setIsLoading(false);
    };
    const [searchParams] = useSearchParams();
    const referralCode = searchParams.get('referralCode');
    return (
        <Formik
            initialValues={{
                contactPersonName: formData.contactPersonName,
                name: formData.name,
                phonenumber: formData.phonenumber,
                email: formData.email,
                referralCode: referralCode || formData.referralCode,
            }}
            validationSchema={registerSteponeSchema}
            onSubmit={values => {
                handleValidateUser(values);
            }}
        >
            {({ handleSubmit }) => (
                <Form onFinish={handleSubmit} className="w-full mt-5">
                    <TextInput
                        name="contactPersonName"
                        label=""
                        placeholder="Full Name"
                        type="text"
                        size="large"
                        classes="md:h-12 "
                        maxLength={50}
                    />
                    <TextInput
                        name="name"
                        label=""
                        placeholder="Company Name"
                        type="text"
                        size="large"
                        classes="md:h-12 mt-2"
                        maxLength={50}
                    />

                    <TextInput
                        name="phonenumber"
                        label=""
                        placeholder="Mobile Number"
                        type="text"
                        size="large"
                        maxLength={10}
                        allowNumbersOnly
                        prefix={
                            <Flex
                                align="center"
                                gap={6}
                                className="h-full p-2 cursor-not-allowed border-e me-2"
                            >
                                <img src={UAEFlag} alt="" />
                                <p>+971</p>
                            </Flex>
                        }
                        classes="md:h-12 p-0 mt-2"
                    />

                    <TextInput
                        name="email"
                        label=""
                        placeholder="Business Email"
                        type="text"
                        size="large"
                        classes="md:h-12 mt-2"
                        allowLowerCaseOnly
                        maxLength={50}
                    />

                    <TextInput
                        name="referralCode"
                        label=""
                        placeholder="Referral Code (Optional)"
                        type="text"
                        size="large"
                        classes="md:h-12 mt-2"
                        maxLength={50}
                    />
                    <Button
                        htmlType="submit"
                        type="primary"
                        danger
                        className="w-full h-10 font-semibold"
                        loading={isLoading}
                    >
                        Next
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default RegisterStepOneForm;
