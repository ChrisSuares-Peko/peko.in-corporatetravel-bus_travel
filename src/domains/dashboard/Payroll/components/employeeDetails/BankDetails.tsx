import { useState } from 'react';

import { Col, Flex, Row, Typography } from 'antd';

import BankDetailsDrawer from './forms/BankDetailsDrawer';
import { UpdateEmployee } from '../../types/types';
import { retrieveEmployeeData } from '../../utils/RetrieveEmployeeData';

type Props = {
    employeeData: UpdateEmployee;
    setRefState: (num: number) => void;
};
const BankDetails = ({ employeeData, setRefState }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dataLeft = [
        {
            title: retrieveEmployeeData(employeeData?.bankDetails?.beneficiaryName),
            subTitle: 'Account Holder Name',
        },
        {
            title: retrieveEmployeeData(employeeData?.bankDetails?.accountNumber),
            subTitle: 'Account Number',
        },
        {
            title: retrieveEmployeeData(employeeData?.bankDetails?.swiftCode),
            subTitle: 'Swift Code',
        },
    ];
    const dataRight = [
        {
            title: retrieveEmployeeData(employeeData?.bankDetails?.bankName),
            subTitle: 'Bank Name',
        },
        {
            title: retrieveEmployeeData(employeeData?.bankDetails?.ibanNumber),
            subTitle: 'IBAN Number',
        },
        {
            title: retrieveEmployeeData(employeeData?.bankDetails?.routingCode),
            subTitle: 'Routing Code',
        },
    ];

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Flex vertical>
            <Flex className="mt-12" justify="start">
                <Typography.Text className="text-textGrey">Bank Details</Typography.Text>
                <Typography.Text
                    className="text-iconRed ms-6 cursor-pointer"
                    onClick={() => toggleModal()}
                >
                    Edit
                </Typography.Text>
            </Flex>
            <Row justify="start">
                <Col xs={12} md={3}>
                    <Flex vertical gap={20} className="mt-6">
                        {dataLeft.map((item, index) => (
                            <Flex vertical>
                                <Flex className="w-full" vertical align="start">
                                    <Typography.Text className="text-textBlack font-medium">
                                        {item.title}
                                    </Typography.Text>
                                    <Typography.Text className="text-textGrey">
                                        {item.subTitle}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Col>
                <Col xs={12} md={21}>
                    <Flex vertical gap={20} className="mt-6 md:ms-24">
                        {dataRight.map((item, index) => (
                            <Flex vertical>
                                <Flex className="w-full" vertical align="start">
                                    <Typography.Text className="text-textBlack font-medium">
                                        {item.title}
                                    </Typography.Text>
                                    <Typography.Text className="text-textGrey">
                                        {item.subTitle}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Col>
            </Row>
            <BankDetailsDrawer
                handleCancel={toggleModal}
                open={isModalOpen}
                setRefState={setRefState}
                initialValues={{
                    id: employeeData?._id,
                    employeeId: employeeData?.employeeInformation.employeeId,
                    name: employeeData?.bankDetails?.beneficiaryName,
                    accountNumber: employeeData?.bankDetails?.accountNumber,
                    swiftCode: employeeData?.bankDetails?.swiftCode,
                    bankName: employeeData?.bankDetails?.bankName,
                    iBan: employeeData?.bankDetails?.ibanNumber,
                    routingCode: employeeData?.bankDetails?.accountType,
                }}
            />
        </Flex>
    );
};

export default BankDetails;
