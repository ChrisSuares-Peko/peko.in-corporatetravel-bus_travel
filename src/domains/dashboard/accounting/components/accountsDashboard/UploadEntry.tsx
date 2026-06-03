import React from 'react';

import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Flex, Form, Grid, message, Upload } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

const { Dragger } = Upload;
const { useBreakpoint } = Grid;
const props: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            // console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        // console.log('Dropped files', e.dataTransfer.files);
    },
};

const UploadEntry = () => {
    const screens = useBreakpoint();
    const vertical = !screens.xl;
    return (
        <Flex vertical={vertical} gap={20} align="end" className="py-3 ">
            <Dragger {...props} className="bg-white w-100">
                <Flex vertical className="mx-5">
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Upload receipt in JPEG, PNG or PDF format and bank statement in XML format
                    </p>
                </Flex>
            </Dragger>
            <Formik
                initialValues={{
                    // these are some dummy names change according to api intergration
                    typeOfEntry: '',
                }}
                onSubmit={values => {
                    // console.log(values);
                }}
            >
                {({ handleSubmit }) => (
                    <Form onFinish={handleSubmit} className="w-full" layout="vertical">
                        <TextInput
                            name="typeOfEntry"
                            label="Type of entry"
                            placeholder="Select"
                            type="select"
                            showToolTip
                        />
                        <Button type="primary" danger className="w-full">
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default UploadEntry;
