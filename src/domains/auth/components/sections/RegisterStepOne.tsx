import React from 'react';

import { Typography, Flex, Image, Row, Col } from 'antd';
import { GoArrowUpRight } from 'react-icons/go';
import { Link, useNavigate } from 'react-router-dom';

import logo from '@assets/mainLogo/standard';
import back from '@assets/svg/back.svg';
import SignupLogo from '@assets/svg/SignupImage.png';

import RegisterStepOneForm from '../forms/RegisterStepOneForm';

const { Title } = Typography;

const StepOne = () => {
    const navigate = useNavigate();

    return (
        <Row className="relative">
            {/* <Flex className=" hidden md:inline-block absolute top-3 left-10 ">
            <Image src={logoicon} alt="icon" />
        </Flex> */}
            <Row className="w-full" justify="center" align="middle">
                <Col
                    xs={{ span: 24, order: 2 }}
                    sm={{ span: 24, order: 2 }}
                    md={{ span: 24, order: 2 }}
                    lg={{ span: 12, order: 1 }}
                    xl={{ span: 12, order: 1 }}
                    className="flex justify-center items-center"
                >
                    <Flex
                        vertical
                        justify="center"
                        align="start"
                        className="w-full sm:w-[23.75rem] px-4 md:px-0 pt-2 md:pt-0"
                    >
                        <Image
                            src={logo}
                            alt="logo"
                            preview={false}
                            className="hidden md:flex relative -left-1"
                            width={130}
                        />
                        <Typography.Text className="text-xl font-normal mt-1">
                            Let’s get started for free
                        </Typography.Text>
                        <RegisterStepOneForm />
                        <Typography.Text className="text-[.65rem] text-center md:text-left font-thin text-signInText mt-4">
                            By clicking next you verify that you are an authorised representative of
                            this organisation.The organisation and you agree to the{' '}
                            <Link
                                to="https://peko.one/ae/platform-agreement"
                                className=""
                                target="_blank"
                            >
                                <Typography.Text className="text-[.65rem] underline text-signInText">
                                    terms and conditions
                                </Typography.Text>
                                <Typography.Text className="text-[.65rem] text-signInText ms-1">
                                    of Peko.
                                </Typography.Text>
                            </Link>
                        </Typography.Text>
                        <Col className="mt-6 border-b-[.3px] w-full border-textInfoGrey" />
                        <Typography.Text className="text-textBlack text-sm flex w-full justify-center items-center mt-4">
                            Already have an account ?
                            <Typography.Text
                                className="text-sm font-semibold text-center underline cursor-pointer text-red-500 ms-1 flex justify-center items-center"
                                onClick={() => navigate('/auth/login')}
                            >
                                Sign in <GoArrowUpRight />
                            </Typography.Text>
                        </Typography.Text>
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
                        className="h-[50vh] md:h-svh flex"
                        style={{
                            backgroundImage: `url(${SignupLogo})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-black/70 " />
                        <Link to="/auth/login" className="sm:hidden absolute top-2 left-2 h-max">
                            <Image
                                src={back}
                                alt="goback"
                                preview={false}
                                style={{ width: '2rem', height: '2rem' }}
                                className="z-50"
                            />
                        </Link>
                        <Typography.Text className=" text-sm md:text-3xl xxl:text-4xl text-white px-4 pb-5 font-light self-end p-0 md:p-10 max-w-[19rem] sm:max-w-4xl z-10 xxl:leading-[56px] md:leading-[40px]">
                            All-in-one platform for SMBs to manage all their payments, expenses,
                            travel, insurance, and automate operations
                        </Typography.Text>
                    </Flex>
                </Col>
            </Row>
        </Row>
    );
};
export default StepOne;
