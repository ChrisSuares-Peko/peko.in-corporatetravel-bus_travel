import React from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { Alert, Typography, Spin, Row, Col } from 'antd';
import { Form, Formik } from 'formik';
import { useLocation } from 'react-router-dom';

import LeftColumnSection from '../components/SendMoney/UploadInvoicePage/LeftColumnSection';
import RightColumnSection from '../components/SendMoney/UploadInvoicePage/RightColumnSection';
import useUploadInvoice from '../hooks/useUploadInvoice';

const { Text } = Typography;

const UploadInvoice = () => {
    const {
        files,
        previews,
        viewPdf,
        fileSelected,
        fileInputRef,
        handleChange,
        subtotalAmount,
        taxAmount,
        invoiceDate,
        invoiceNumber,
        loading,
    } = useUploadInvoice();

    const { state: locationState } = useLocation();
    const selectedData = locationState?.selectedData;

    const formatSelectedData = (data: { id: any; fullName: any }) => ({
        value: data.id,
        label: data.fullName,
    });

    const formattedData = selectedData ? formatSelectedData(selectedData) : null;

    const initialValues = {
        InvoiceNumber: invoiceNumber || '',
        invoiceDate: invoiceDate || '',
        SelectBeneficiary: formattedData || '',
    };

    return (
        <>
            <Text className="text-xl font-medium">Upload Invoice</Text>
            <Spin spinning={loading}>
                <Formik initialValues={initialValues} onSubmit={() => console.log('hi')}>
                    {({ handleSubmit, values }) => (
                        <Form onSubmit={handleSubmit}>
                            <Row gutter={[16, 16]} className="mt-6">
                                <Col xs={24} md={10} className="mb-6 md:mb-0">
                                    <LeftColumnSection
                                        files={files}
                                        previews={previews}
                                        viewPdf={viewPdf}
                                        fileSelected={fileSelected}
                                        fileInputRef={fileInputRef}
                                        handleChange={handleChange}
                                    />
                                </Col>
                                <Col xs={24} md={14}>
                                    <RightColumnSection
                                        subtotalAmount={subtotalAmount}
                                        taxAmount={taxAmount}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
                <Alert
                    message="Note: Pay Schedule cannot be edited once you process the first pay run."
                    type="warning"
                    showIcon
                    banner
                    className="mt-7 w-full custom-alert"
                />
            </Spin>
        </>
    );
};

export default UploadInvoice;
