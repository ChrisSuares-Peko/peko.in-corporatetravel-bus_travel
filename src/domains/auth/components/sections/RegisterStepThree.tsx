import React, { useState, useEffect } from 'react';

import { Button, Typography, Flex, Image, Col, Row } from 'antd';
import OtpInput from 'react-otp-input';
import { useDispatch } from 'react-redux';

import logo from '@assets/mainLogo/standard';
import back from '@assets/svg/back.svg';
import SignupLogo from '@assets/svg/SignupImage.png';

import useEmailVerify from '../../hooks/useEmailVerify';
import useOtpApi from '../../hooks/useOtpApi';
import { previousStep } from '../../slices/registerSlice';

const { Title } = Typography;

const StepThree = () => {
    const [otp, setOtp] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [resendDisabled, setResendDisabled] = useState(true);
    const dispatch = useDispatch();
    const { handleVerifyOtp, isError, isLoading } = useEmailVerify();
    const { handleOtp } = useOtpApi();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (timeRemaining > 0) {
                setTimeRemaining(time => time - 1);
            } else {
                setResendDisabled(false);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeRemaining]);

    const handleVerify = () => {
        handleVerifyOtp(otp);
    };

    const handlePrevious = () => {
        dispatch(previousStep());
    };

    const formatTime = (seconds: any) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResendOTP = () => {
        handleOtp(true);
        setTimeRemaining(120);
        setResendDisabled(true);
    };

    return (
        <Row className="relative">
            <Col
                xs={{ span: 24, order: 2 }}
                sm={{ span: 24, order: 2 }}
                md={{ span: 24, order: 2 }}
                lg={{ span: 12, order: 1 }}
                xl={{ span: 12, order: 1 }}
                className="flex justify-center items-center"
            >
                <Flex vertical gap={12} className="  pt-3 px-2 md:px-0">
                    <Image
                        src={logo}
                        alt="logo"
                        preview={false}
                        className=" hidden md:flex relative  -left-2"
                        width={130}
                    />
                    <Title level={5}>Verify your email</Title>
                    <Typography.Text className="text-sm text-gray-600">
                        OTP has been sent to your registered email ID
                    </Typography.Text>

                    <div className="w-full">
                        <OtpInput
                            containerStyle={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                            inputStyle={{
                                display: 'inline-flex',
                                flex: 1,
                            }}
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            inputType="tel"
                            renderSeparator={<span>&nbsp; </span>}
                            renderInput={(props, index) => (
                                <input
                                    {...props}
                                    className={`border border-gray-300 h-14  rounded-md ${
                                        isError ? 'border-red-500' : ''
                                    }`}
                                />
                            )}
                        />
                    </div>

                    <Button
                        onClick={handleVerify}
                        htmlType="submit"
                        type="primary"
                        danger
                        loading={isLoading}
                        className="font-semibold w-full"
                    >
                        Verify and Submit
                    </Button>

                    <Flex justify="space-between" align="center" className="w-full">
                        <Typography.Text className="text-green-500">
                            Time Remaining: {formatTime(timeRemaining)}
                        </Typography.Text>
                        <Typography.Text
                            onClick={resendDisabled ? () => {} : () => handleResendOTP()}
                            style={{
                                color: resendDisabled ? 'GrayText' : 'red',
                                cursor: resendDisabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Resend OTP
                        </Typography.Text>
                    </Flex>

                    <Flex
                        align="center"
                        justify="center"
                        className="hidden sm:flex sm:cursor-pointer pt-2"
                        onClick={handlePrevious}
                    >
                        <Typography.Text className="text-black text cursor-pointer ">
                            Go Back
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Col>
            <Col
                xs={{ span: 24, order: 1 }}
                sm={{ span: 24, order: 1 }}
                md={{ span: 24, order: 1 }}
                lg={{ span: 12, order: 2 }}
                xl={{ span: 12, order: 2 }}
            >
                <Flex
                    className="h-[55vh] md:h-svh flex"
                    style={{
                        backgroundImage: `url(${SignupLogo})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                    }}
                >
                    <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-black bg-opacity-80 " />
                    <Flex className="sm:hidden absolute top-2 left-2">
                        <Image
                            src={back}
                            alt="goback"
                            preview={false}
                            style={{ width: '2rem', height: '2rem' }}
                            className="z-50"
                            onClick={handlePrevious}
                        />
                    </Flex>
                    <Typography.Text className="text-sm md:text-3xl xxl:text-4xl text-white px-4 pb-5 font-light self-end p-0 md:p-10 max-w-[19rem] sm:max-w-4xl z-10 xxl:leading-[56px] md:leading-[40px] ">
                        All-in-one platform for SMBs to manage all their payments, expenses, travel,
                        insurance, and automate operations
                    </Typography.Text>
                </Flex>
            </Col>
        </Row>
    );
};

export default StepThree;
