import { useState, type FC } from 'react';

import { FilePdfOutlined, InboxOutlined } from '@ant-design/icons';
import { Upload, Typography, Flex, Form, Button } from 'antd';
import type { UploadProps } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import TextInput from '@components/atomic/inputs/TextInput';
// import PdfThumbnail from '@components/molecular/pdfViewer/PdfThumbnail';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { fileUploadSchema } from '../../schema';
import { setESignDocData } from '../../slices/eSignDocSlice';

interface UploadFormProps {}
const { Dragger } = Upload;

const UploadForm: FC<UploadFormProps> = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [base64, setBase64] = useState<string | null>(null);
    const [fileName, setFileName] = useState('');
    const [pdfUrl, setPdfUrl] = useState<any>(null);

    const getBase64 = (file: File): Promise<string | null> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });

    const handleFile = async (file: File) => {
        const isPDF = file.type === 'application/pdf';
        if (!isPDF) {
            dispatch(
                showToast({ description: 'You can only upload PDF files.', variant: 'warning' })
            );
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 <= 20;
        if (!isLt2M) {
            dispatch(
                showToast({ description: 'File must be smaller than 20 mb.', variant: 'warning' })
            );
            return false;
        }
        try {
            const base64Data = await getBase64(file);
            setBase64(base64Data);
            // --for preview
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                setPdfUrl(e?.target?.result);
            };

            const fileNameWithoutExtension = file.name.substring(0, file.name.lastIndexOf('.'));
            setFileName(fileNameWithoutExtension);
            dispatch(showToast({ description: 'File uploaded', variant: 'success' }));
        } catch (error) {
            dispatch(
                showToast({
                    description: 'Something went wrong while uploading',
                    variant: 'warning',
                })
            );
            return false;
        }
        return true;
    };

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        showUploadList: false,
        accept: 'application/pdf',
        beforeUpload: async file => {
            const isValid = await handleFile(file);
            return !isValid ? Upload.LIST_IGNORE : false; // Prevent automatic upload
        },
        onDrop: async e => {
            const { files } = e.dataTransfer;
            if (files.length > 0) {
                const file = files[0];
                const isValid = await handleFile(file);
                if (!isValid) {
                    return Upload.LIST_IGNORE;
                }
            }
            return undefined;
        },
        onRemove: () => {
            setBase64(null);
            setFileName('');
        },
    };
    const handleNext = (params: { docket_title: string; base64: string }) => {
        dispatch(
            setESignDocData({
                docket_title: params.docket_title,
                documentBase64: params.base64,
                document_url: pdfUrl,
                isDisabled: false,
            })
        );
        navigate(`${paths.eSign.viewPage}`);
    };

    return (
        <Formik
            initialValues={{ docket_title: fileName || '', base64: base64 || '' }}
            enableReinitialize
            onSubmit={handleNext}
            validationSchema={fileUploadSchema}
        >
            {({ handleSubmit, errors, touched }) => (
                <Form layout="vertical" onFinish={handleSubmit} className=" w-full">
                    <Flex vertical className="mb-10">
                        <Dragger {...props} className="bg-white w-full h-52 sm:h-96">
                            <Flex vertical className="mx-5">
                                <p className="ant-upload-drag-icon text-black">
                                    {pdfUrl ? <FilePdfOutlined /> : <InboxOutlined />}
                                </p>
                                <Typography.Text>
                                    Click or drag file to this area to upload
                                </Typography.Text>
                                <Typography.Text className="text-gray-400 font-light">
                                    Upload the document in PDF format (max 20 MB).
                                </Typography.Text>
                            </Flex>
                        </Dragger>
                        {errors.base64 && touched.base64 && (
                            <Typography.Text type="danger">{errors.base64}</Typography.Text>
                        )}
                    </Flex>
                    <TextInput
                        label="Document Name"
                        name="docket_title"
                        placeholder="Enter document name"
                        type="text"
                        isRequired
                        maxLength={60}
                    />

                    <Button
                        danger
                        htmlType="submit"
                        type="primary"
                        loading={false}
                        className="mt-3 w-full sm:w-24"
                    >
                        Next
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default UploadForm;
