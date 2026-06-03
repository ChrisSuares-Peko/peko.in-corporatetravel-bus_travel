import React from 'react';

import { Button, Form, Typography, Flex } from 'antd';
import { Formik } from 'formik';
import { IoCheckmark, IoClose } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

import PasswordInput from '@components/atomic/inputs/PasswordInput';

import useOtpApi from '../../hooks/useOtpApi';
import usePasswordValidation from '../../hooks/usePasswordValidation';
import { registerStepTwoSchema } from '../../schema';
import { setFormData } from '../../slices/registerSlice';

const getPasswordStrengthColor = (password: any, minLength: any) =>
    password.length >= minLength &&
    /[A-Z]/.test(password) &&
    /[0-9!@#$%^&*(),.?":{}|<>]/.test(password)
        ? '#05BE63'
        : '#E01A1A';

const passwordStrength = (password: any, minLength: any) =>
    password.length < minLength ? 'Weak' : 'Strong';

const RegisterStepTwoForm = () => {
    const dispatch = useDispatch();

    const { handleOtp, isLoading } = useOtpApi();
    const { validatePassword } = usePasswordValidation();

    return (
        <Formik
            initialValues={{
                password: '',
                confirmpassword: '',
            }}
            validationSchema={registerStepTwoSchema}
            onSubmit={values => {
                dispatch(setFormData(values));
                handleOtp(false, values);
            }}
        >
            {({ handleSubmit, isSubmitting, values }) => {
                const errors = validatePassword(values.password);

                return (
                    <Form onFinish={handleSubmit} className="w-full">
                        <PasswordInput
                            name="password"
                            label=""
                            placeholder="Enter Password"
                            type="password"
                            size="large"
                            disablePaste
                            allowAllExceptSpace
                        />
                        <PasswordInput
                            name="confirmpassword"
                            label=""
                            placeholder="Confirm Password"
                            type="password"
                            size="large"
                            disablePaste
                            allowAllExceptSpace
                        />

                        <Flex vertical gap={8}>
                            {errors.length === 0 ? (
                                <Flex align="center" gap={1}>
                                    <IoCheckmark color="#05BE63" />
                                    <Typography.Text style={{ color: '#05BE63' }}>
                                        Password is valid.
                                    </Typography.Text>
                                </Flex>
                            ) : (
                                errors.map((error, index = 1) => (
                                    <Flex key={index} align="baseline" gap={1}>
                                        <Flex className="ml-[-5px]">
                                            <IoClose className="pt-1" size={15} color="#E01A1A" />
                                        </Flex>
                                        <Typography.Text style={{ color: '#E01A1A' }}>
                                            <>{error}</>
                                        </Typography.Text>
                                    </Flex>
                                ))
                            )}
                        </Flex>

                        <Button
                            disabled={errors.length > 0}
                            htmlType="submit"
                            type="primary"
                            danger
                            loading={isLoading}
                            className="font-semibold w-full mt-7"
                        >
                            Next
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
};

// Helper function to determine password strength
// const passwordStrength = (password: string) =>
//     // Implement your password strength logic here and return a string (e.g., 'Weak', 'Medium', 'Strong')
//     // For simplicity, this function returns 'Weak' if the password is less than 8 characters
//     password.length < 8 ? 'Weak' : 'Strong';

export default RegisterStepTwoForm;
