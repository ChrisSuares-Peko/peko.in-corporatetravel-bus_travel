import { useState } from 'react';

import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Modal, Form, Button, Typography, Flex, Input } from 'antd';
import { Formik } from 'formik';

import { useBulkUploadApi } from '../../hooks/employeeHooks/useBulkUploadApi';
import GetExcelTemplate from '../../hooks/employeeHooks/useGetExceltemplate';
import { fileSchema } from '../../schema/bulkSchema';
import { BulkUploadPayload } from '../../types/types';

type BulkUploadModalProps = {
    open: boolean;
    handleCancel: () => void;
};

const BulkUploadModal = ({ open, handleCancel }: BulkUploadModalProps) => {
    const { getBulkExcelTemplate, isLoading: excelLoading } = GetExcelTemplate();
    const { BulkUpload, isLoading, isresponse, count } = useBulkUploadApi();

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [form] = Form.useForm();
    const handleFormSubmit = async (values: any) => {
        try {
            const res = await BulkUpload(values);

            handleCancel();
        } catch (error) {
            console.error('Validation error:', error);
        }
    };

    const onFinish = (values: any) => {
        // Process form values here, including the file
    };

    const onFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name); // Update state with file name
            // Continue with your existing logic
        }
    };

    const handleUpload = async (values: any) => {
        const selectedFile = values.file;

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        const payload: BulkUploadPayload = {
            file: formData.get('file') as File,
        };

        try {
            const res = await BulkUpload(payload);

            handleCancel();
        } catch (error) {
            console.error('Error uploading file:', error);
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
                    <Form form={form} onFinish={onFinish}>
                        {' '}
                        {/* Add onSubmit handler to the Form component */}
                        <Flex vertical className="mt-5 ">
                            <Typography.Text className="">Upload Excel</Typography.Text>
                            <Input
                                name="file"
                                type="file"
                                onChange={event => {
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
                                <Typography.Text className="mt-2 text-blue-500 uploaded-file-name">
                                    {fileName}
                                </Typography.Text>
                            )}
                            {errors.file && (
                                <div className="text-red-500 error-message"> {errors.file} </div>
                            )}
                        </Flex>
                        <Flex gap={10}>
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                htmlType="submit" // Specify htmlType as "submit"
                                loading={isSubmitting || isLoading}
                                onClick={() => handleSubmit()}
                                style={{ marginTop: '1rem' }} // Add some margin to separate it from the input
                            >
                                Submit
                            </Button>
                            <Button
                                // Specify htmlType as "submit"

                                onClick={() => handleCancel()}
                                style={{ marginTop: '1rem' }} // Add some margin to separate it from the input
                            >
                                Cancel
                            </Button>
                        </Flex>
                        <Button
                            className="mt-3 text-green-400"
                            type="link"
                            icon={<DownloadOutlined />}
                            onClick={getBulkExcelTemplate}
                            loading={excelLoading}
                            style={{ color: 'rgb(74 222 128)' }}
                        >
                            Download Excel Template
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default BulkUploadModal;
