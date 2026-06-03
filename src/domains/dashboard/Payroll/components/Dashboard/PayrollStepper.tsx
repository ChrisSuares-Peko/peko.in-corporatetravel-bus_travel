import React, { useState } from 'react';

import { CalendarOutlined, RightOutlined } from '@ant-design/icons';
import { Flex, Image, Progress, Typography } from 'antd';
import { IoSettingsOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import play from '@assets/icons/play.svg';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
// import setup from '../../assets/icons/setup.png';
import { showToast } from '@src/slices/apiSlice';

import users from '../../assets/icons/users.svg';
import Vector from '../../assets/icons/Vector.png';
import { setPayrollProgress } from '../../slices/payrollAuth';

const PayrollStepper = () => {
    const [isHoveredHrSettings, setIsHoveredHrSettings] = useState(false);
    const [isHoveredDepartments, setIsHoveredDepartments] = useState(false);
    const [isHoveredHolidays, setIsHoveredHolidays] = useState(false);
    const data = useAppSelector(state => state.reducer.payrollAuth);
    const dispatch = useAppDispatch();

    const percent = data?.progress ? data.progress.replace('%', '') : '';
    const progress = parseInt(percent, 10);

    return (
        <Flex vertical gap={20} justify="center" align="center" className="mt-8">
            <Flex vertical gap={16} className="w-3/5">
                <Typography.Text className="font-medium " style={{ fontSize: '1.2rem' }}>
                    Get started with Peko Payroll
                </Typography.Text>
                <Typography.Text
                    className="font-normal text-fontSubHeader "
                    style={{ fontSize: '0.8rem' }}
                >
                    Complete the following steps to have a smooth payroll system.
                </Typography.Text>
                <Progress percent={progress} strokeColor="#05BE63" />
                <Link
                    to={`/${paths.payroll.index}/${paths.payroll.hrSettings}?activeTab=1`}
                    style={{ color: '#101828', textDecoration: 'none' }}
                >
                    <Flex
                        className={`rounded-xl h-16 mt-2 border px-3 transition-transform ${
                            isHoveredHrSettings ? 'transform scale-102' : ''
                        }`}
                        justify="space-between"
                        align="center"
                        style={{
                            transition: 'transform .3s ease-in-out',
                        }}
                        onMouseEnter={() => setIsHoveredHrSettings(true)}
                        onMouseLeave={() => setIsHoveredHrSettings(false)}
                    >
                        <Flex align="center" gap={15}>
                            <IoSettingsOutline height={18} width={18} />
                            <Typography.Text>HR Settings</Typography.Text>
                        </Flex>
                        {data?.hrSettings ? (
                            <Flex align="center">
                                <Image preview={false} src={Vector} height={30} width={30} />
                            </Flex>
                        ) : (
                            <Flex align="center">
                                <RightOutlined />
                            </Flex>
                        )}
                    </Flex>
                </Link>
                <Link
                    to={`/${paths.payroll.index}/${paths.payroll.employees}`}
                    style={{ color: '#101828', textDecoration: 'none' }}
                >
                    <Flex
                        className={`rounded-xl h-16 mt-2 border px-3 transition-transform ${
                            isHoveredDepartments ? 'transform scale-102' : ''
                        }`}
                        justify="space-between"
                        align="center"
                        style={{
                            transition: 'transform .3s ease-in-out',
                        }}
                        onMouseEnter={() => setIsHoveredDepartments(true)}
                        onMouseLeave={() => setIsHoveredDepartments(false)}
                    >
                        <Flex align="center" gap={15}>
                            <Image preview={false} src={users} height={18} width={18} />
                            <Typography.Text>Add Departments & Employees</Typography.Text>
                        </Flex>
                        {data?.departmentAndEmployees ? (
                            <Image preview={false} src={Vector} height={30} width={30} />
                        ) : (
                            <RightOutlined />
                        )}
                    </Flex>
                </Link>
                <Link
                    to={`/${paths.payroll.index}/${paths.payroll.activityCalendar}`}
                    style={{ color: '#101828', textDecoration: 'none' }}
                >
                    <Flex
                        className={`rounded-xl h-16 mt-2 border px-3 transition-transform ${
                            isHoveredHolidays ? 'transform scale-102' : ''
                        }`}
                        justify="space-between"
                        align="center"
                        style={{
                            transition: 'transform .3s ease-in-out',
                        }}
                        onMouseEnter={() => setIsHoveredHolidays(true)}
                        onMouseLeave={() => setIsHoveredHolidays(false)}
                    >
                        <Flex align="center" gap={15}>
                            <CalendarOutlined height={18} width={18} />
                            <Typography.Text>Add Holidays</Typography.Text>
                        </Flex>
                        {data?.holidays ? (
                            <Flex align="center">
                                <Image preview={false} src={Vector} height={30} width={30} />
                            </Flex>
                        ) : (
                            <Flex align="center">
                                <RightOutlined />
                            </Flex>
                        )}
                    </Flex>
                </Link>

                {/* <Link to="" style={{ color: '#101828', textDecoration: 'none' }}>
                    <Flex
                        className="rounded-xl h-16 mt-2 border px-3"
                        justify="space-between"
                        align="center"
                    >
                        <Flex align="center" gap={15}>
                            <Image preview={false} src={setup} height={18} width={18} />
                            <Typography.Text>Setup WPS </Typography.Text>
                        </Flex>
                        {data?.setUpWps ? (
                            <Flex align="center">
                                <Image preview={false} src={Vector} height={30} width={30} />
                            </Flex>
                        ) : (
                            <Flex align="center">
                                <RightOutlined />
                            </Flex>
                        )}
                    </Flex>
                </Link> */}
                <Flex align="center" justify="space-between" className="mt-6">
                    <Flex align="center" gap={5}>
                        <Image src={play} preview={false} height={18} width={18} />
                        <Typography.Text className="text-lightRed xs:text-sm">
                            Watch Tutorial
                        </Typography.Text>
                    </Flex>
                    <Flex>
                        <Typography.Text
                            className="text-right font-medium text-lightRed cursor-pointer xs:text-xs md:text-sm"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                whiteSpace: 'nowrap',
                            }}
                            onClick={() => {
                                if (data?.hrSettings && data?.departmentAndEmployees) {
                                    dispatch(setPayrollProgress({ showDashboard: true }));
                                } else {
                                    dispatch(
                                        showToast({
                                            description:
                                                'Please complete the first two steps before proceeding to the dashboard.',
                                            variant: 'warning',
                                        })
                                    );
                                }
                            }}
                        >
                            Go to Dashboard{' '}
                            <RightOutlined className="text-lightRed cursor-pointer " />
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default PayrollStepper;
