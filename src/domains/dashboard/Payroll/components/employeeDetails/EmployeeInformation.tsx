import React, { useState } from 'react';

import { Col, Flex, Row, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';

import EmployeeInformationsDrawer from './forms/EmployeeInformationsDrawer';
import GetEmployeeReportingStaff from '../../hooks/employeeHooks/useGetReportingStaff';
import { UpdateEmployee } from '../../types/types';
import { retrieveEmployeeData } from '../../utils/RetrieveEmployeeData';

type Props = {
    employeeData: UpdateEmployee;
    setRefState: (num: number) => void;
    isLoading: boolean;
};
function capitalizeFirstLetter(string: any) {
    if (!string) return ''; // Return an empty string if input is falsy
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const EmployeeInformation = ({ employeeData, setRefState, isLoading }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data } = GetEmployeeReportingStaff(
        employeeData?.employeeInformation?.reportingStaff ?? '0010cf356218e32137252857'
    );
    const officialEmail = employeeData?.personalEmail;

    const dataLeft = [
        {
            title: retrieveEmployeeData(employeeData?.employeeInformation?.designation),
            subTitle: 'Designation',
        },
        {
            title: retrieveEmployeeData(employeeData?.employeeInformation?.employeeId),
            subTitle: 'Employee ID',
        },

        {
            title: retrieveEmployeeData(
                capitalizeFirstLetter(employeeData?.employeeInformation?.jobType)
            ),
            subTitle: 'Job Type',
        },

        {
            title: employeeData?.employeeInformation?.probation
                ? `${retrieveEmployeeData(employeeData?.employeeInformation?.probation)} Months`
                : 'Completed',
            subTitle: 'Probation Period',
        },
    ];

    const dataRight = [
        {
            title: retrieveEmployeeData(
                employeeData?.employeeInformation?.department?.departmentName ?? 'N/A'
            ),
            subTitle: 'Department',
        },
        {
            title: retrieveEmployeeData(
                dayjs(new Date(employeeData?.employeeInformation?.dateOfJoin)).format('DD-MM-YYYY')
            ),
            subTitle: 'Joining Date',
        },
        {
            title: retrieveEmployeeData(employeeData?.employeeInformation?.schedule),
            subTitle: 'Time Schedule',
        },

        {
            title: retrieveEmployeeData(data && data?.fullName),
            subTitle: 'Reporting Staff',
        },
    ];

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Flex vertical>
            <Flex className="mt-6" justify="start">
                <Typography.Text className="text-textGrey">Employee Information</Typography.Text>
                <Typography.Text
                    className="text-iconRed ms-6 cursor-pointer"
                    onClick={() => toggleModal()}
                >
                    Edit
                </Typography.Text>
            </Flex>
            <Row className="mt-3 md:w-3/5">
                <Col span={10}>
                    <Flex vertical gap={20} className="mt-6">
                        {dataLeft.map((item, index) => (
                            <Flex vertical>
                                {isLoading ? (
                                    <Skeleton active avatar />
                                ) : (
                                    <Flex className="w-full" vertical align="start">
                                        <Skeleton active avatar loading={isLoading}>
                                            <Typography.Text className="text-textBlack font-medium">
                                                {item.title}
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
                <Col span={10}>
                    <Flex vertical gap={20} className="mt-6">
                        {dataRight.map((item, index) => (
                            <Flex vertical>
                                <Flex className="w-full" vertical align="start">
                                    <Skeleton active avatar loading={isLoading}>
                                        <Typography.Text className="text-textBlack font-medium">
                                            {item.title}
                                        </Typography.Text>
                                        <Typography.Text className="text-textGrey">
                                            {item.subTitle}
                                        </Typography.Text>
                                    </Skeleton>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </Col>
            </Row>
            <EmployeeInformationsDrawer
                handleCancel={toggleModal}
                isLoading={isLoading}
                officialEmail={officialEmail}
                open={isModalOpen}
                setRefState={setRefState}
                initialValues={{
                    id: employeeData?._id,
                    joinDate: employeeData?.employeeInformation?.dateOfJoin,
                    department: employeeData?.employeeInformation?.department?._id,
                    // workingDays: employeeData?.employeeInformation?.workingDays,
                    workingHours: employeeData?.employeeInformation?.workingHours,
                    employeeType: employeeData?.employeeInformation?.jobType,
                    reportingStaff: employeeData?.employeeInformation?.reportingStaff,
                    employeeId: employeeData?.employeeInformation?.employeeId,
                    designation: employeeData?.employeeInformation?.designation,
                    timeSchedule: employeeData?.employeeInformation?.schedule,
                    probation: employeeData?.employeeInformation?.probation,
                }}
            />
        </Flex>
    );
};

export default EmployeeInformation;
