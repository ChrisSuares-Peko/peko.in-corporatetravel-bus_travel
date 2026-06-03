import { useState } from 'react';

import { Button, Col, Flex, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import BulkUploadModal from '@components/molecular/modals/BulkUploadModal';
import OtpModal from '@components/molecular/modals/OtpModal';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import BulkUploadTable from '../../components/bulkUpload/BulkUploadTable';
import useEtiSalatBulkUpload from '../../hooks/beneficiary/useBeneficiaryBulkUpload';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';

function BulkUpload() {
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item.vendor;

    const bulkEtiSalat = useAppSelector(state => state.reducer.beneficiary).bulkData;
    const { limitData } = useFetchLimitApi(serviceData ? serviceData.path : '');
    const [openBulkModal, setOpenBulkModal] = useState(false);
    const [showBulkOtpModal, setShowBulkOtpModal] = useState(false);
    const dispatch = useAppDispatch();

    const BulkUploadService = useEtiSalatBulkUpload({
        openOtpModal: () => setShowBulkOtpModal(true),
        closeOtpModal: () => setShowBulkOtpModal(false),
        limitData,
        serviceData,
    });

    const serviceName = serviceData?.accessKey ?? '';
    const serviceFunctionsMap: any = {
        [serviceName]: {
            bulkUploadFunction: BulkUploadService.BulkUpload,
            bulkCreateFunction: BulkUploadService.BulkCreate,
            getTemplateFunction: BulkUploadService.getetiSalatBulkUploadTemplate,
            sendBulkOtpApi: BulkUploadService.sendBulkOtpApi,
            BulkisOtpSending: BulkUploadService.BulkisOtpSending,
            buttonLoader: BulkUploadService.buttonLoader,
            isTemplateLoading: BulkUploadService.isTemplateFileLoading,
            isLoading: BulkUploadService.isLoading,
            otpLoading: BulkUploadService.otpLoading,
            isExcelUploading: BulkUploadService.isExcelUploading,
            component: <BulkUploadTable limitData={limitData!} />,
            records: bulkEtiSalat.length,
            errorCount: bulkEtiSalat.filter(data => data.errors && data.errors.length > 0).length,
        },
    };

    const handleSubmit = async (Otp: string) => {
        const payload = {
            jsonData: bulkEtiSalat,
            otp: Otp,
        };
        selectedService.bulkCreateFunction(payload);
    };

    const handleClick = async () => {
        if (selectedService.errorCount > 0) {
            dispatch(
                showToast({
                    description: `Please preview the data and resolve all errors `,
                    variant: 'error',
                })
            );
        } else {
            setShowBulkOtpModal(true);
            selectedService.sendBulkOtpApi();
        }
    };

    const selectedService = serviceFunctionsMap[serviceName];

    return (
        <Content>
            <Row className="mt-3">
                <Col span={24}>
                    <Flex className="flex-col md:justify-between md:flex-row">
                        <Typography.Paragraph className="text-xl font-medium text-neutral-700">
                            Preview Bulk Upload
                        </Typography.Paragraph>
                        <Flex gap={10} className="justify-end">
                            <Button danger onClick={() => setOpenBulkModal(true)}>
                                Reupload
                            </Button>
                            <Button
                                danger
                                type="primary"
                                onClick={handleClick}
                                loading={selectedService?.isLoading}
                            >
                                Submit and Save
                            </Button>
                        </Flex>
                    </Flex>
                    <Typography.Paragraph className="text-gray-500">
                        Total Records: <span className="bold-text">{selectedService.records}</span>
                    </Typography.Paragraph>
                    {selectedService.errorCount !== undefined && (
                        <Typography.Paragraph className="text-red-500 text-xs mt-1">
                            ({selectedService.errorCount} out of {selectedService.records} records
                            have errors)
                        </Typography.Paragraph>
                    )}
                </Col>
                <Col xs={24}>{selectedService?.component}</Col>
            </Row>
            <OtpModal
                isOpen={showBulkOtpModal}
                isLoading={selectedService.buttonLoader}
                handleCancel={() => setShowBulkOtpModal(false)}
                onResend={() => selectedService.sendBulkOtpApi()}
                isOtpSending={selectedService.BulkisOtpSending}
                handleSubmit={handleSubmit}
                title="OTP Verification"
            />

            {openBulkModal && (
                <BulkUploadModal
                    open={openBulkModal}
                    handleCancel={() => setOpenBulkModal(false)}
                    handleBulkUpload={selectedService.bulkUploadFunction}
                    handleTemplateDownload={selectedService.getTemplateFunction}
                    isTemplateFileLoading={selectedService.isTemplateLoading}
                    isUploading={selectedService.isExcelUploading}
                />
            )}
        </Content>
    );
}

export default BulkUpload;
