import React, { useState } from 'react';

import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Row, Typography, Grid, Col } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { icon_1, icon_2 } from '../assets/images';
import AboutModal from '../components/taxRegistration/AboutModal';
import RegistrationForm from '../components/taxRegistration/forms/RegistrationForm';
import IconCard from '../components/taxRegistration/IconCard';

const { useBreakpoint } = Grid;

const TaxRegistration: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { taxData, amount, taxDetails } = useAppSelector(state => state.reducer.accounting);
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <Content>
            <Flex vertical gap={8}>
                <Row>
                    <Col md={20} xs={24}>
                        <Flex gap={5}>
                            <Typography.Text className=" font-medium text-lg sm:text-xl">
                                Corporate Tax Registration
                            </Typography.Text>
                            <Flex
                                align="center"
                                className="ml-2 cursor-pointer"
                                onClick={handleOpen}
                            >
                                <QuestionCircleOutlined />

                                <Typography.Text className="text-lightRed ml-1 ">
                                    What is it
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col md={4} xs={24} className="mt-3 md:mt-0">
                        <Flex justify="end" className="md:mb-14 mb-10" align="center">
                            <Flex className=" lg:block ">
                                <Flex vertical align="center" justify="center" gap={10}>
                                    <Button
                                        type="default"
                                        danger
                                        size={screens.sm ? 'middle' : 'small'}
                                        onClick={() => {
                                            navigate(paths.accounting.TaxHistory);
                                        }}
                                    >
                                        Order History
                                    </Button>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Col>
                </Row>
            </Flex>
            <Typography.Text className="text-base font-medium">
                Complete your registration
            </Typography.Text>
            <Row>
                <Col xs={24} md={12}>
                    {taxDetails && (
                        <Flex vertical className="mt-3">
                            <Flex>
                                <Typography.Text className="">Status :</Typography.Text>
                                <Typography.Text className=" text-lightRed ml-1">
                                    {taxDetails?.status
                                        ? taxDetails.status.charAt(0).toUpperCase() +
                                          taxDetails.status.slice(1).toLowerCase()
                                        : ''}
                                </Typography.Text>
                            </Flex>
                            <Flex>
                                <Typography.Text className=" ">Remarks :</Typography.Text>
                                <Typography.Text className=" ml-1">
                                    {taxDetails.remarks}
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    )}

                    <RegistrationForm />
                </Col>
                <Col xs={24} md={12} className="md:border-l">
                    <Flex vertical gap={50} align="center" className="h-full mt-5">
                        <IconCard
                            title="Upload required documents and provide basic information."
                            icon={icon_1}
                            count="1"
                        />
                        <IconCard
                            title="Post submission, your registration will be processed by our backend and we will update you via email."
                            icon={icon_2}
                            count="2"
                        />
                    </Flex>
                </Col>
            </Row>
            {open && <AboutModal handleCancel={() => setOpen(false)} open={open} />}
        </Content>
    );
};

export default TaxRegistration;
