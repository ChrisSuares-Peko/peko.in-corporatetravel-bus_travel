import React, { useState } from 'react';

import { Button, Col, Flex, Row, Typography, theme } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import SettingsIcon from '@domains/dashboard/Payroll/assets/icons/settings.svg';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import LeaveModal from '../Leaves/LeaveModal';

interface DashboardHeaderProps {
    processSalary?: React.MutableRefObject<null>;
    addLeave?: React.MutableRefObject<null>;
    addEmployee?: React.MutableRefObject<null>;
    hrSettings?: React.MutableRefObject<null>;
}
const DashboardHeader = ({
    addLeave,
    hrSettings,
    processSalary,
    addEmployee,
}: DashboardHeaderProps) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const navigate = useNavigate();
    const [openLeaveApplicationModal, setOpenLeaveApplicationModal] = useState(false);
    const dispatch = useAppDispatch();

    const displayMessage = () => {
        dispatch(showToast({ variant: 'info', description: 'Coming soon' }));
    };

    return (
        <Col span={24} className="">
            <Row className="pb-8 " align="middle" justify="space-between" gutter={[20, 20]}>
                <Flex gap="middle" vertical>
                    <Typography.Text className="text-xl font-medium ms-3">
                        HR Dashboard
                    </Typography.Text>
                </Flex>
                <Flex justify="end" align="center" gap={14} className="xs:w-full md:w-auto">
                    <Button
                        ref={processSalary}
                        className=""
                        type="primary"
                        danger
                        onClick={displayMessage}
                    >
                        Process Salary
                    </Button>
                    {/* <Button
                        ref={addEmployee}
                        className="hidden sm:block"
                        danger
                        onClick={() =>
                            navigate(`/${paths.payroll.index}/${paths.payroll.employees}`)
                        }
                    >
                        Add Employee
                    </Button> */}
                    {/* <Button
                        ref={addLeave}
                        className="hidden sm:block"
                        danger
                        onClick={() =>
                            navigate(`/${paths.payroll.index}/${paths.payroll.employeeLeave}`)
                        }
                    >
                        Add Leave
                    </Button> */}

                    <Link
                        ref={hrSettings}
                        className="mx-2 md:mx-0"
                        to={`/${paths.payroll.index}/${paths.payroll.hrSettings}?activeTab=1`}
                    >
                        <Flex align="center" gap={10}>
                            <ReactSVG src={SettingsIcon} />
                            <Typography.Text
                                className="text=[0.6rem] md:text-[1rem]"
                                style={{ color: colorPrimary }}
                            >
                                Settings
                            </Typography.Text>
                        </Flex>
                    </Link>
                </Flex>
            </Row>
            {/* <Divider className='mt-6' /> */}

            {openLeaveApplicationModal && (
                <LeaveModal
                    open={openLeaveApplicationModal}
                    handleCancel={() => setOpenLeaveApplicationModal(false)}
                />
            )}
        </Col>
    );
};
export default DashboardHeader;
