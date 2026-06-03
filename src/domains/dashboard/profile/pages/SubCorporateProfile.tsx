import { Suspense, lazy, useState } from 'react';

import { Avatar, Col, Flex, Row, Skeleton, Typography } from 'antd';

import FieldLabelValue from '@components/molecular/Text/FieldLabelValue';
import { useAppSelector } from '@src/hooks/store';

import useGetPasswordPolicies from '../hooks/useGetPasswordPolicies';
import usePasswordPolicyValidation from '../hooks/usePasswordPolicyValidation';
import useSubCorporateInfoApi from '../hooks/useSubUserProfile';

const ChangerPasswordModal = lazy(() => import('../components/ChangePasswordModal'));

const SubCorporateProfile = () => {
    const { packageName } = useAppSelector(state => state.reducer.auth);
    const { data } = useAppSelector(state => state.reducer.basicInfo);
    const { profileData, isLoading } = useSubCorporateInfoApi();

    const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
    const { respData } = useGetPasswordPolicies();
    const { validatePassword } = usePasswordPolicyValidation(respData);
    return (
        <Row gutter={[52, 52]} className="md:mr-[-.7rem!important]">
            <Col
                xs={24}
                md={12}
                lg={13}
                xl={14}
                className="sm:px-[.5rem!important] md:px-[1.57rem!important]"
            >
                <Col xs={24} xl={11} className="w-full">
                    <Skeleton active avatar loading={isLoading}>
                        <Flex gap={20} align="center">
                            <Avatar
                                src={data?.logo}
                                alt="Profile"
                                shape="square"
                                size={64}
                                draggable={false}
                                className="bg-[#ffeeee]"
                            >
                                <Typography.Text className=" text-4xl font-bold">
                                    {data?.name?.slice(0, 1)}
                                </Typography.Text>
                            </Avatar>

                            <Flex vertical>
                                <Flex gap={10} align="center">
                                    <Typography.Text className=" text-lg font-semibold">
                                        {data?.name}
                                    </Typography.Text>
                                </Flex>
                                <Typography.Text className=" text-gray-400 font-normal">
                                    {packageName} Account
                                </Typography.Text>
                            </Flex>
                        </Flex>
                    </Skeleton>
                </Col>
                <>
                    <Flex
                        vertical
                        className="  border border-solid border-gray-200 p-6  mt-8 rounded-xl"
                    >
                        <Flex className=" w-full" justify="space-between" align="center">
                            <Typography.Title level={5}>Basic Information</Typography.Title>
                            <Flex align="center" gap={20}>
                                <Typography
                                    className="text-bgOrange2 cursor-pointer"
                                    onClick={() => setOpenChangePasswordModal(true)}
                                >
                                    Change Password
                                </Typography>
                            </Flex>
                        </Flex>
                        <Row className=" mt-7">
                            <Col span={11}>
                                {isLoading ? (
                                    <Skeleton active />
                                ) : (
                                    <Flex vertical gap={30}>
                                        <FieldLabelValue
                                            label="Full Name"
                                            value={profileData?.name}
                                        />
                                        <FieldLabelValue label="Role" value={profileData?.role} />
                                        <FieldLabelValue
                                            label="Username"
                                            value={profileData?.credential?.username}
                                        />
                                    </Flex>
                                )}
                            </Col>
                            <Col span={13}>
                                {isLoading ? (
                                    <Skeleton active />
                                ) : (
                                    <Flex vertical gap={30}>
                                        <Flex align="flex-end" gap={12}>
                                            <FieldLabelValue
                                                label="Mobile Number"
                                                value={profileData?.mobileNo}
                                            />
                                            <Typography.Link className="hidden">
                                                Verify
                                            </Typography.Link>
                                        </Flex>
                                        <FieldLabelValue label="Email" value={profileData?.email} />
                                        <FieldLabelValue label="Company Name" value={data?.name} />
                                    </Flex>
                                )}
                            </Col>
                        </Row>
                    </Flex>
                    <Suspense>
                        <ChangerPasswordModal
                            validatePassword={validatePassword}
                            open={openChangePasswordModal}
                            handleCancel={() => setOpenChangePasswordModal(false)}
                        />
                    </Suspense>
                </>
            </Col>
        </Row>
    );
};

export default SubCorporateProfile;
