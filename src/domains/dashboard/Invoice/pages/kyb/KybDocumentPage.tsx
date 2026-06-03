import React from 'react';

import { Alert, Button, Col, Flex, Form, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import DocumentViewer from '../../components/kyb/DocumentViewer';
import useKybSubmit from '../../hooks/useKybSubmit';
import { kybDocumentsSchema } from '../../schema';

const KybDocumentPage = () => {
    const { handleUploadKybDocs, isLoading, existingDocumentsList: docsData } = useKybSubmit();
    const { kybStatus, kybRejectReason } = useAppSelector(state => state.reducer.invoices);
    const navigate = useNavigate();
    if (kybStatus === 'DOCUMENT UPLOADED' || kybStatus === 'APPROVED') {
        navigate(`/${paths.invoice.index}`);
        return null;
    }

    return (
        <Flex vertical className="w-full" gap={15}>
            <Formik
                initialValues={{
                    tradeLicense: docsData?.Trade_License || '',
                    articleOfAssociation: docsData?.Article_Of_Association || '',
                    emiratesID: docsData?.Emirates_ID || '',
                    passportCopy: docsData?.Passport || '',
                    bankLetter: docsData?.Bank_Letter || '',
                    websiteLink: '',
                }}
                validationSchema={kybDocumentsSchema}
                onSubmit={handleUploadKybDocs}
                enableReinitialize
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        {kybRejectReason && (
                            <Alert
                                message={`Remarks: ${kybRejectReason}`}
                                type="error"
                                banner
                                className="mb-6 w-full"
                            />
                        )}
                        <Typography.Text className="text-lg font-medium">
                            KYB Document
                        </Typography.Text>
                        <Typography.Text className="text-xs font-normal ml-4">
                            ( Formats Supported : JPG, JPEG, PNG, BMP, GIF, XLS, XLSX, PDF, DOC,
                            DOCX, Maximum file size: 5 MB )
                        </Typography.Text>

                        <Flex className="flex-col sm:flex-row mt-6 gap-3 sm:gap-10">
                            <Col xs={24} sm={12} xl={8} className="flex flex-col md:flex-row">
                                <FileUploadInput
                                    label="Upload Trade License"
                                    name="tradeLicense"
                                    format="tradeLicenseFormat"
                                    showFileName
                                    maxFileSize={5000}
                                    isRequired
                                    allowedFileTypes={[
                                        'image/png',
                                        'image/jpeg',
                                        'image/bmp',
                                        'image/gif',
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'application/vnd.ms-excel',
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    ]}
                                    returnOriginalFile
                                    defaultFileName="TRN Certificate"
                                />
                                {docsData?.Trade_License && (
                                    <DocumentViewer
                                        documentName="Trade License"
                                        link={docsData?.Trade_License}
                                    />
                                )}
                            </Col>
                            <Col xs={24} sm={12} xl={8} className="flex flex-col md:flex-row">
                                <FileUploadInput
                                    label="Upload Memorandum of association/Article of association"
                                    name="articleOfAssociation"
                                    format="articleOfAssociationFormat"
                                    showFileName
                                    maxFileSize={5000}
                                    isRequired
                                    allowedFileTypes={[
                                        'image/png',
                                        'image/jpeg',
                                        'image/bmp',
                                        'image/gif',
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'application/vnd.ms-excel',
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    ]}
                                    returnOriginalFile
                                />
                                {docsData?.Article_Of_Association && (
                                    <DocumentViewer
                                        documentName="Article of Association"
                                        link={docsData?.Article_Of_Association}
                                    />
                                )}
                            </Col>
                        </Flex>

                        <Flex className="flex-col sm:flex-row mt-6 gap-3 sm:gap-10">
                            <Col xs={24} sm={12} xl={8} className="flex flex-col md:flex-row">
                                <FileUploadInput
                                    label="Upload Emirates IDs of Owner/Owners/Manager"
                                    name="emiratesID"
                                    format="emiratesIDFormat"
                                    showFileName
                                    maxFileSize={5000}
                                    isRequired
                                    allowedFileTypes={[
                                        'image/png',
                                        'image/jpeg',
                                        'image/bmp',
                                        'image/gif',
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'application/vnd.ms-excel',
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    ]}
                                    returnOriginalFile
                                />
                                {docsData?.Emirates_ID && (
                                    <DocumentViewer
                                        documentName="Emirates ID"
                                        link={docsData?.Emirates_ID}
                                    />
                                )}
                            </Col>
                            <Col xs={24} sm={12} xl={8} className="flex flex-col md:flex-row">
                                <FileUploadInput
                                    label="Upload Passport copy/copies of Owner/Owners/Manager"
                                    name="passportCopy"
                                    format="passportCopyFormat"
                                    showFileName
                                    maxFileSize={5000}
                                    isRequired
                                    allowedFileTypes={[
                                        'image/png',
                                        'image/jpeg',
                                        'image/bmp',
                                        'image/gif',
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'application/vnd.ms-excel',
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    ]}
                                    returnOriginalFile
                                />
                                {docsData?.Passport && (
                                    <DocumentViewer
                                        documentName="Passport"
                                        link={docsData?.Passport}
                                    />
                                )}
                            </Col>
                        </Flex>
                        <Flex className="flex-col sm:flex-row mt-6 gap-3 sm:gap-10">
                            <Col xs={24} sm={12} xl={8} className="flex flex-col md:flex-row">
                                <FileUploadInput
                                    label="Upload Bank letter/IBAN certificate"
                                    name="bankLetter"
                                    format="bankLetterFormat"
                                    showFileName
                                    maxFileSize={5000}
                                    isRequired
                                    allowedFileTypes={[
                                        'image/png',
                                        'image/jpeg',
                                        'image/bmp',
                                        'image/gif',
                                        'application/pdf',
                                        'application/msword',
                                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                        'application/vnd.ms-excel',
                                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                    ]}
                                    returnOriginalFile
                                />
                                {docsData?.Bank_Letter && (
                                    <DocumentViewer
                                        documentName="Bank Letter"
                                        link={docsData?.Bank_Letter}
                                    />
                                )}
                            </Col>
                            <Col xs={24} sm={12} xl={8}>
                                <TextInput
                                    name="websiteLink"
                                    placeholder="Enter Website link/ Social Media Profile Link"
                                    type="text"
                                    isRequired
                                    label="Proof of business"
                                />
                            </Col>
                        </Flex>
                        <Button
                            htmlType="submit"
                            loading={isLoading}
                            type="primary"
                            danger
                            className="mt-4 px-8"
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default KybDocumentPage;
