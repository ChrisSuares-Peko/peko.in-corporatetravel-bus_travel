import React from 'react';

import { Row, Col, Typography, Button, Flex, Space, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';

import { DropDown } from '@customtypes/general';
import { paths } from '@src/routes/paths';

import SelectOptions from './SelectOptions'; // Import the new DynamicSelect component

const { Paragraph, Text } = Typography;

interface Props {
    fiscalYearOptions: DropDown;
    setDropDownData: React.Dispatch<React.SetStateAction<string>>;
    dropdownData: string;
}
const RegistrationOverview = ({ fiscalYearOptions, dropdownData, setDropDownData }: Props) => {
    const navigate = useNavigate();
    return (
        <Flex vertical className="mx-4 md:mx-20 my-4 md:my-20 mb-8">
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} className="text-center md:mt-10">
                    <Space direction="vertical">
                        <Text className="text-[18px] md:text-[22px] font-bold text-greyHead mb-4">
                            ESR Registration Process
                        </Text>

                        <Paragraph className="text-newBlack text-[12px] md:text-[15px] ">
                            Our ESR registration is a streamlined three-stage process designed to be
                            user-friendly and efficient.
                        </Paragraph>
                        <Divider className="hidden my-30" />
                    </Space>

                    <Row justify="space-between">
                        <Col xs={24} sm={12} lg={8} xl={4} className="mb-0 md:mb-4 mt-10">
                            <Text className=" text-left block  py-2 font-semibold">
                                Select Fiscal Year
                            </Text>
                            <SelectOptions
                                value={dropdownData}
                                options={fiscalYearOptions}
                                dropdownAlign={{ offset: [0, 8] }}
                                onChange={val => setDropDownData(val)}
                            />
                        </Col>

                        <Col xs={24} sm={12} lg={8} xl={4} className="mb-4 md:mt-10 mt-0  ">
                            <Text className=" text-left block  py-2 font-semibold">&nbsp;</Text>
                            <Button
                                size="middle"
                                danger
                                block
                                onClick={() => navigate(paths.logistics.orderHistory)}
                            >
                                Order History
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Flex>
    );
};

export default RegistrationOverview;
