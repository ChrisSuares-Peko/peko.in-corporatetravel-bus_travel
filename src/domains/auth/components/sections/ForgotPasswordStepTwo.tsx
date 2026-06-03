/* eslint-disable @typescript-eslint/no-unused-vars */
import { Typography, Flex, Image } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import logoicon from '@assets/svg/logo-icon.svg';
import reset from '@assets/svg/reset.svg';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import useForgotPasswordApi from '../../hooks/useForgotPasswordApi';
import { forgotpasswordReset, forgotpasswordpreviousStep } from '../../slices/forgotpasswordSlice';

const ForgotPasswordStepTwo = () => {
    const { Title } = Typography;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { email } = useAppSelector(state => state.reducer.forgotpassword);
    const { handleForgotPassword, isLoading } = useForgotPasswordApi();

    const handleBackToLogin = () => {
        dispatch(forgotpasswordReset());
        navigate('/auth/login');
    };

    return (
        <Flex className="absolute h-screen w-full">
            <Image
                src={logoicon}
                alt=""
                preview={false}
                className="relative hidden md:block left-10 top-6"
            />
            <Flex vertical align="center" justify="center" className="gap-4 items-center w-full">
                <Image src={reset} alt="" preview={false} />
                <Title level={3}>Check your email for reset link</Title>
                <Flex vertical className="text-center">
                    <Typography.Text className=" text-black  font-normal">
                        A verification link has been sent to your email id.{' '}
                    </Typography.Text>
                    <Typography.Text className=" text-black  font-normal">
                        Please click on the link to reset your password. It may take a few minutes{' '}
                        <br /> for the email to arrive (check your spam folder).
                    </Typography.Text>
                </Flex>
                <Flex vertical className="text-center">
                    <Typography.Text className="text-black  font-normal">
                        Didn’t get it?{' '}
                        <Link to="">
                            {isLoading ? (
                                <Typography.Text className="text-red-500 ">
                                    Sending...
                                </Typography.Text>
                            ) : (
                                <Typography.Text
                                    className="text-red-500 "
                                    onClick={() => dispatch(forgotpasswordpreviousStep())}
                                >
                                    Resend Email.
                                </Typography.Text>
                            )}
                        </Link>
                    </Typography.Text>
                </Flex>
                <Flex
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleBackToLogin()}
                >
                    <Typography.Text className="text-iconRed border border-red-600 px-12  rounded-sm   text-lg">
                        Login
                    </Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ForgotPasswordStepTwo;
