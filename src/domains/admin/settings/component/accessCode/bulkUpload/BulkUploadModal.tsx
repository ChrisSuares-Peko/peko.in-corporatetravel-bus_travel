import { useState } from 'react';

import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, Form, Button, Typography, Flex, Input, Col } from 'antd';
import { Formik } from 'formik';

import { useAccessCodeBulkUpload } from '../../../hooks/useAccessCodeBulkUpload';
import { fileSchema } from '../../../schema/bulkSchema';
import { BulkAccessCodeUploadPayload, refresh } from '../../../types/accessCode';

type BulkUploadModalProps = {
    open: boolean;
    handleCancel: () => void;
};

const BulkUploadModal = ({ open, handleCancel, setRefresh }: BulkUploadModalProps & refresh) => {
    const { getProductBulkUploadTemplate, BulkUpload, isLoading, isTempLoading } =
        useAccessCodeBulkUpload(handleCancel);

    const [fileName, setFileName] = useState<string | null>(null);
    const [form] = Form.useForm();

    const handleUpload = async (values: any) => {
        const payload: BulkAccessCodeUploadPayload = {
            file: values.file as File,
        };
        const res = await BulkUpload(payload);
        if (res) {
            setRefresh(true);
        }
    };

    return (
        <Modal
            title={
                <Flex justify="space-between" align="center">
                    <Typography.Text className="text-sm">Bulk Upload</Typography.Text>
                </Flex>
            }
            open={open}
            onCancel={handleCancel}
            footer={null} // Remove the footer from here
        >
            <Formik
                initialValues={{
                    file: null,
                }}
                validationSchema={fileSchema}
                onSubmit={values => handleUpload(values)}
            >
                {({ values, handleChange, isSubmitting, setFieldValue, errors, handleSubmit }) => (
                    <Form form={form}>
                        {' '}
                        {/* Add onSubmit handler to the Form component */}
                        <Flex vertical className=" mt-5">
                            <Typography.Text className="">Upload Excel</Typography.Text>
                            <Input
                                name="file"
                                type="file"
                                onChange={event => {
                                    // const files =
                                    //     event.currentTarget.files && event.currentTarget.files[0];
                                    const files = event.currentTarget.files
                                        ? event.currentTarget.files[0]
                                        : null;
                                    if (files) {
                                        setFieldValue('file', files);
                                        setFileName(files.name);
                                    }
                                }}
                                style={{ display: 'none' }}
                            />

                            <Button
                                className="mt-4"
                                icon={<UploadOutlined />}
                                onClick={() => document.getElementsByName('file')[0]?.click()}
                            >
                                Upload New
                            </Button>
                            {fileName && ( // Conditionally render the file name
                                <Typography.Text className="uploaded-file-name mt-2 text-blue-400">
                                    {fileName}
                                </Typography.Text>
                            )}
                            {errors.file && (
                                <div className="error-message text-red-500"> {errors.file} </div>
                            )}
                        </Flex>
                        <Flex gap={10} className="flex-col sm:flex-row sm:justify-between">
                            <Col className="mt-4">
                                <Button
                                    key="submit"
                                    type="primary"
                                    danger
                                    htmlType="submit" // Specify htmlType as "submit"
                                    loading={isSubmitting || isLoading}
                                    onClick={() => handleSubmit()}
                                    className=" mr-5 px-5"
                                    style={{ marginTop: '1rem' }} // Add some margin to separate it from the input
                                >
                                    Submit
                                </Button>
                                <Button
                                    onClick={() => handleCancel()}
                                    style={{ marginTop: '1rem' }} // Add some margin to separate it from the input
                                >
                                    Cancel
                                </Button>
                            </Col>
                            <Button
                                className="text-green-400 mt-7"
                                type="link"
                                icon={<DownloadOutlined />}
                                loading={isTempLoading}
                                onClick={getProductBulkUploadTemplate}
                                style={{ color: 'rgb(74 222 128)' }}
                            >
                                Download Excel Template
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default BulkUploadModal;
