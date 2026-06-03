import { useState } from 'react';

import { Col, Flex, Row, Typography, Skeleton } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import SalaryDetailsDrawer from './forms/SalaryDetailsDrawer';
import { UpdateEmployee } from '../../types/types';
import { getTotalSalary, retrieveEmployeeSalaryData } from '../../utils/RetrieveEmployeeData';

type Props = {
    employeeData: UpdateEmployee;
    setRefState: (num: number) => void;
    isLoading: boolean;
};

const SalaryDetails = ({ employeeData, setRefState, isLoading }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const dataLeft = [
        {
            title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.basicPay),
            subTitle: 'Monthly Basic',
        },
        {
            title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.travelAllowances),
            subTitle: 'Travel Allowances',
        },
        {
            title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.otherAllowances),
            subTitle: 'Other Allowances',
        },
        {
            title: retrieveEmployeeSalaryData(getTotalSalary(employeeData?.salaryInformation)),
            subTitle: 'Total Salary',
        },
        {
            title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.totalIncrements),
            subTitle: 'Total Increment',
        },
    ];
    const dataRight = [
        {
            title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.homeAllowances),
            subTitle: 'House Rent Allowance',
        },
        {
            title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.medicalAllowances),
            subTitle: 'Medical Allowances',
        },
        // {
        //     title: retrieveEmployeeSalaryData(employeeData?.salaryInformation?.other),
        //     subTitle: 'Other',
        // },
        {
            title: retrieveEmployeeSalaryData(getTotalSalary(employeeData?.salaryInformation) * 12),
            subTitle: 'Salary Per Annum',
        },
    ];

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Flex vertical>
            <Flex className="mt-6" justify="start">
                <Typography.Text className="text-textGrey">Salary Details</Typography.Text>
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
                                {isLoading ? (
                                    <Skeleton active avatar />
                                ) : (
                                    <Flex className="w-full" vertical align="start">
                                        <Skeleton active avatar loading={isLoading}>
                                            <Typography.Text className="text-textBlack font-medium">
                                                AED {formatNumberWithLocalString(item.title)}
                                            </Typography.Text>
                                            <Typography.Text className="text-textGrey">
                                                {item.subTitle}
                                            </Typography.Text>
                                        </Skeleton>
                                    </Flex>
                                )}
                            </Flex>
                        ))}
                    </Flex>
                </Col>

                <Col xs={12} md={21}>
                    <Flex vertical gap={20} className="mt-6 md:ms-28">
                        {dataRight.map((item, index) => (
                            <Flex vertical>
                                <Flex className="w-full" vertical align="start">
                                    <Typography.Text className="text-textBlack font-medium">
                                        AED {formatNumberWithLocalString(item.title)}
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
            <SalaryDetailsDrawer
                open={isModalOpen}
                handleCancel={toggleModal}
                setRefState={setRefState}
                initialValues={{
                    id: employeeData?._id,
                    monthlyBasic: employeeData?.salaryInformation?.basicPay,
                    homeAllowances: employeeData?.salaryInformation?.homeAllowances,
                    travelAllowances: employeeData?.salaryInformation?.travelAllowances,
                    medicalAllowances: employeeData?.salaryInformation?.medicalAllowances,
                    otherAllowances: employeeData?.salaryInformation?.otherAllowances,
                    other: employeeData?.salaryInformation?.other,
                }}
            />
        </Flex>
    );
};

export default SalaryDetails;
