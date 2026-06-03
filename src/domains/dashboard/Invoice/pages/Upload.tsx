import React, { useEffect, useRef, useState } from 'react';

// import { Viewer, Worker } from '@react-pdf-viewer/core';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Button, Col, Flex, Image, Row, Typography, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import uploadIcon from '@domains/dashboard/Invoice/assets/UploadIcon.svg';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import AmountDetails from '../components/AmountDetails';
import UploadWishList from '../components/UploadWishList';
import AddressForm from '../forms/AddressForm';
import BillerDetailsForm from '../forms/BillerDetailsForm';
import CustomerDetailsForm from '../forms/CustomerDetailsForm';
import InvoiceDetailsForm from '../forms/InvoiceDetailsForm';

// import './PDFViewer.css'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// import '@react-pdf-viewer/core/lib/styles/index.css';

const { Dragger } = Upload;

const UploadInvoice = () => {
    const invoicesState = useAppSelector(state => state.reducer.invoices);
    const [files, setFiles] = useState<any>([]);
    const [previews, setPreviews] = useState<any>([]);
    const [viewPdf, setViewPdf] = useState<any>(null);

    const fileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

    // Define file input reference
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!files || files.length === 0) return;

        const temp: any = [];
        const fileReaders: any = [];

        files.forEach((file: any) => {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => {
                    setViewPdf(e?.target?.result);
                };
                fileReaders.push(reader); // Store readers to manage cleanup if needed
            } else {
                setViewPdf(null);
                const url = URL.createObjectURL(file);
                temp.push(url);
            }
        });

        setPreviews(temp);

        // eslint-disable-next-line consistent-return
        return () => {
            temp.forEach((url: string) => URL.revokeObjectURL(url));
            fileReaders.forEach((reader: any) => reader.abort && reader.abort());
        };
    }, [files]);

    const handleChange = (e: any) => {
        const selectedFiles = e.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const validFiles = Array.from(selectedFiles).filter((file: any) =>
                fileTypes.includes(file.type)
            );
            setFiles(validFiles);
        } else {
            console.log('Please select valid files');
        }
    };

    const newPlugin = defaultLayoutPlugin();

    return (
        // <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
        <Content>
            <Typography.Text className="text-xl font-medium">Upload Invoice</Typography.Text>
            <Formik
                initialValues={{
                    shipping: '',
                    amountPaid: '',
                    items: invoicesState.productDetails,
                }}
                onSubmit={() => console.log('hi')}
            >
                {({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Row gutter={30} className="mt-6 px-5">
                            <Col
                                md={10}
                                className="border rounded-md p-3"
                                style={{ maxHeight: '700px' }}
                            >
                                <input
                                    type="file"
                                    onChange={handleChange}
                                    className="mb-3"
                                    multiple
                                    accept={fileTypes.join(',')}
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                />
                                <Flex
                                    justify="center"
                                    align="center"
                                    className="pdf-container h-full"
                                    onClick={() => fileInputRef?.current?.click()}
                                >
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                        {viewPdf && (
                                            <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />
                                        )}
                                    </Worker>
                                </Flex>

                                {previews.length > 0 && (
                                    <div className="image-previews">
                                        {previews.map((img: any, index: number) => (
                                            <Image
                                                key={index}
                                                preview={false}
                                                src={img}
                                                alt={`preview ${index}`}
                                                onClick={() => fileInputRef?.current?.click()}
                                            />
                                        ))}
                                    </div>
                                )}
                                {!viewPdf && previews.length === 0 && (
                                    <Flex
                                        justify="center"
                                        align="center"
                                        vertical
                                        className="h-full"
                                        onClick={() => fileInputRef?.current?.click()}
                                    >
                                        <ReactSVG src={uploadIcon} />
                                        <Typography.Text className="font-medium">
                                            Click file to this area to upload
                                        </Typography.Text>
                                        <Typography.Text
                                            className="w-80 text-xs text-wrap text-center px-3 mt-2"
                                            style={{ color: '#999' }}
                                        >
                                            Upload receipt in JPEG, PNG or PDF format and bank
                                            statement in XML format
                                        </Typography.Text>
                                    </Flex>
                                )}
                            </Col>
                            <Col md={14}>
                                <Flex vertical gap={15} className="w-full px-3">
                                    <Flex vertical className="w-full">
                                        <Row gutter={[60, 20]}>
                                            <Col xs={24} md={12}>
                                                <BillerDetailsForm />
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <CustomerDetailsForm />
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <InvoiceDetailsForm startdate="" />
                                            </Col>
                                            <Col xs={24} md={12}>
                                                <AddressForm />
                                            </Col>
                                        </Row>
                                    </Flex>
                                </Flex>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="mt-7">
                                <UploadWishList values={values.items} />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} className="mt-7">
                                <AmountDetails />
                            </Col>
                        </Row>
                        <Flex justify="start" className="md:max-w-10xl w-full">
                            <Link to={paths.invoice.guidelines}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    danger
                                    className="mt-5 w-28"
                                >
                                    Proceed
                                </Button>
                            </Link>
                        </Flex>
                    </form>
                )}
            </Formik>
        </Content>
        // </Worker>
    );
};

export default UploadInvoice;
