import { Suspense, lazy, useState } from 'react';

import { Flex, Typography, Button, Skeleton, Image } from 'antd';
import moment from 'moment';

import EmptyImage from '@assets/svg/emptyDocs.svg';
import OtpModal from '@components/molecular/modals/OtpModal';
import FieldLabelValue from '@components/molecular/Text/FieldLabelValue';
import { Scope } from '@src/enums/enums';
import { useAppSelector } from '@src/hooks/store';

import CertificateCard from './CertificateCard';
import { getOtp } from '../api/general';
import useCompanyInfoApi from '../hooks/useCompanyInfoApi';

const CompanyInfoModal = lazy(() => import('./CompanyInfoModal'));
const CompanyInfo = () => {
    const [openCompanyInfoModal, setOpenCompanyInfoModal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const [formValues, setFormValues] = useState<any>();

    const { handleUpdateCompanyInfo, isEditLoading, data, isLoading } = useCompanyInfoApi({
        handleCancel: () => setIsOpen(false),
        handleOtpClose: () => setIsOpen(false),
    });
    const { id, role } = useAppSelector(state => state.reducer.auth);

    const handleDeleteDocs = async (value: string): Promise<void> => {
        const body: { [key: string]: null } = {};
        body[value] = null;
        setFormValues(body);
        const resp = await getOtp({
            userId: id,
            userType: role,
        });
        if (resp) {
            setIsOpen(true);
        }
    };

    return (
        <>
            <Flex className=" w-full" justify="space-between" align="center">
                <Typography.Title level={5}>Company Information</Typography.Title>

                <Button danger size="small" onClick={() => setOpenCompanyInfoModal(true)}>
                    Edit Info
                </Button>
            </Flex>
            <Skeleton loading={isLoading} active>
                <Flex vertical gap={16} className="mt-6">
                    <FieldLabelValue
                        label="Activity"
                        value={data?.activity ? data?.activity : 'N/A'}
                    />
                    <FieldLabelValue
                        label="Trade License Number"
                        value={data?.tradeLicenseNo ? data?.tradeLicenseNo : 'N/A'}
                    />
                    <FieldLabelValue
                        label="Trade License Expiry"
                        value={
                            data?.tradeLicenseExpiry
                                ? moment(data.tradeLicenseExpiry).format('YYYY-MM-DD')
                                : 'N/A'
                        }
                    />
                    <FieldLabelValue label="TRN Number" value={data?.trnNo ? data?.trnNo : 'N/A'} />
                </Flex>
                <Flex vertical gap={16} className="mt-8  min-h-[25%]">
                    {data?.tradeLicenseDoc === null &&
                    data?.trnCertificate === null &&
                    data?.eidDoc === null ? (
                        <Flex vertical align="center" justify="center">
                            <Image src={EmptyImage} preview={false} />
                            <Typography.Text className="text-base font-normal py-4 text-center text-gray-400 ">
                                No documents available
                            </Typography.Text>
                        </Flex>
                    ) : (
                        <>
                            {data?.trnCertificate && (
                                <CertificateCard
                                    label="TRN Certificate"
                                    certificateName="TRN Certificate.png"
                                    link={data?.trnCertificate!}
                                    handleDeleteDocs={() => handleDeleteDocs('trnCertificate')}
                                />
                            )}
                            {data?.tradeLicenseDoc && (
                                <CertificateCard
                                    label="Trade License"
                                    certificateName="Trade License.png"
                                    link={data?.tradeLicenseDoc!}
                                    handleDeleteDocs={() => handleDeleteDocs('tradeLicenseDoc')}
                                />
                            )}
                            {data?.eidDoc && (
                                <CertificateCard
                                    label="Emirates ID"
                                    certificateName="EID.png"
                                    link={data?.eidDoc!}
                                    handleDeleteDocs={() => handleDeleteDocs('eidDoc')}
                                />
                            )}
                        </>
                    )}
                </Flex>
            </Skeleton>
            <Suspense>
                {openCompanyInfoModal && (
                    <CompanyInfoModal
                        open={openCompanyInfoModal}
                        handleCancel={() => setOpenCompanyInfoModal(false)}
                    />
                )}
            </Suspense>
            {isOpen && (
                <OtpModal
                    isOpen={isOpen}
                    isLoading={isEditLoading!}
                    handleCancel={() => setIsOpen(false)}
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
                    handleSubmit={otp => {
                        handleUpdateCompanyInfo({
                            ...formValues!,
                            otp,
                            scope: Scope.EMAIL,
                            userId: id,
                            userType: role,
                        });
                    }}
                    title="Confirmation"
                />
            )}
        </>
    );
};

export default CompanyInfo;
