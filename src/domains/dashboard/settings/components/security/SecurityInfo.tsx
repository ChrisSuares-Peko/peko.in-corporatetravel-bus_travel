import { useState } from 'react';

import { Col, Flex, Row, Skeleton, Typography } from 'antd';

import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import SecurityService from './SecurityService';
import { getOtp } from '../../api/general';
import useSecurityInfoApi from '../../hooks/security/useSecurityInfoApi';
import { setData } from '../../slices/securityInfo';
import { SecurityInfoUpdatePayload } from '../../types/security';

const SecurityInfo = () => {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { data, isLoading, refresh, isEditLoading, handleUpdateSecurityInfo } =
        useSecurityInfoApi({
            handleCancel: () => setIsOpen(false),
        });
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState<SecurityInfoUpdatePayload>();

    const getSecurityOtp = async () => {
        const resp = await getOtp({ userId: id, userType: role });
        if (resp) {
            setIsOpen(true);
        }
    };
    const handleCancel = () => {
        dispatch(setData({ refresh: !refresh, isEditLoading: false }));
        setIsOpen(false);
    };

    return (
        <Row gutter={[20, 20]}>
            <Col xs={24} sm={12} md={6} className="p-2 sm:p-6  rounded-xl">
                <Skeleton paragraph={{ rows: 6 }} active loading={isLoading}>
                    <Typography.Title level={5}> Multi-Factor Authentication</Typography.Title>
                    <Flex vertical className=" mt-8" gap={40}>
                        <SecurityService
                            title="SMS"
                            isChecked={data?.sendMfaCodeToPhone === 1}
                            handleSubmit={val => {
                                const { checked } = val;
                                getSecurityOtp();
                                setFormData(prev => ({
                                    ...prev,
                                    sendMfaCodeToPhone: checked ? 1 : 0,
                                    userId: id,
                                    userType: role,
                                }));
                            }}
                        />
                        <SecurityService
                            title="Email"
                            isChecked={data?.sendMfaCodeToEmail === 1}
                            handleSubmit={val => {
                                const { checked } = val;
                                getSecurityOtp();
                                setFormData(prev => ({
                                    ...prev,
                                    sendMfaCodeToEmail: checked ? 1 : 0,
                                    userId: id,
                                    userType: role,
                                }));
                            }}
                        />
                        <SecurityService
                            title="Authenticator App"
                            isChecked={data?.sendMfaCodeToAuthApp === 1}
                            handleSubmit={val => {
                                const { checked } = val;
                                getSecurityOtp();
                                setFormData(prev => ({
                                    ...prev,
                                    sendMfaCodeToAuthApp: checked ? 1 : 0,
                                    userId: id,
                                    userType: role,
                                }));
                            }}
                        />
                    </Flex>
                </Skeleton>
            </Col>
            <OtpModal
                isOpen={isOpen}
                isLoading={isEditLoading!}
                handleCancel={() => handleCancel()}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    const res = await getOtp({
                        userId: id,
                        userType: role,
                    });
                    if (res) setIsOtpSending(false);
                    else setIsOtpSending(false);
                }}
                handleSubmit={value => {
                    handleUpdateSecurityInfo({
                        ...formData!,
                        otp: value,
                        scope: Scope.EMAIL,
                    });
                }}
                title="Confirmation"
            />
        </Row>
    );
};

export default SecurityInfo;
