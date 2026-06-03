import React from 'react';

import { Typography, Flex, Image, Col, Row } from 'antd';
// import { AiOutlineLeftCircle } from 'react-icons/ai';
import { useDispatch } from 'react-redux';

import logo from '@assets/mainLogo/standard';
import back from '@assets/svg/back.svg';
import SignupLogo from '@assets/svg/SignupImage.png';

import { previousStep } from '../../slices/registerSlice';
import RegisterStepTwoForm from '../forms/RegisterStepTwoForm';

const { Title } = Typography;

const StepTwo = () => {
    const dispatch = useDispatch();

    const handlePrevious = () => {
        dispatch(previousStep());
    };

    return (
        <Row className="relative">
            {/* <Flex className=" hidden md:inline-block absolute top-3 left-10 ">
                <Image src={logoicon} alt="icon" />
            </Flex> */}
            <Row className="w-full">
                <Col
                    xs={{ span: 24, order: 2 }}
                    sm={{ span: 24, order: 2 }}
                    md={{ span: 24, order: 2 }}
                    lg={{ span: 12, order: 1 }}
                    xl={{ span: 12, order: 1 }}
                    className="flex justify-center items-center"
                >
                    <Flex vertical gap={8} className="w-[23.75rem] pt-4 px-2 md:px-0">
                        <Image
                            src={logo}
                            alt="logo"
                            preview={false}
                            className=" hidden md:flex relative  -left-0"
                            width={130}
                        />
                        <Typography.Text className="text-xl font-normal">
                            Create Password
                        </Typography.Text>

                        <RegisterStepTwoForm />

                        <Flex
                            align="center"
                            justify="center"
                            gap={5}
                            onClick={handlePrevious}
                            className="hidden md:flex md:items-center md:justify-center md:pt-4 md:gap-1 cursor-pointer"
                        >
                            {/* <AiOutlineLeftCircle className="text-2xl text-gray-400 " /> */}
                            <Typography.Text className="text-iconRed">Go Back </Typography.Text>
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
                        className="h-[50vh] md:h-svh flex"
                        style={{
                            backgroundImage: `url(${SignupLogo})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                        <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-black/80 " />
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
                            All-in-one platform for SMBs to manage all their payments, expenses,
                            travel, insurance, and automate operations
                        </Typography.Text>
                    </Flex>
                </Col>
            </Row>
        </Row>
    );
};

export default StepTwo;
