import { useState } from 'react';

import { Button, Col, Flex, Form, Row } from 'antd';
import { Dayjs } from 'dayjs';
import { Formik } from 'formik';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import DocsCard from './DocsCard';
import { setEmployeeDocuments } from '../../slices/employeeSlices';

type Props = {
    nextTab: (key: string) => void;
};

const Documents = ({ nextTab }: Props) => {
    const dispatch = useAppDispatch();

    const [expiryDate, setExpiryDate] = useState<Dayjs>();
    const formattedExpiryDate = expiryDate?.format('YYYY-MM-DD');
    interface DocumentDetails {
        file: File | null;
        expiryDate: string | null;
    }

    interface UploadedDocumentsState {
        visaDoc: DocumentDetails;
        passport: DocumentDetails;
        offerLetter: DocumentDetails;
        nda: DocumentDetails;
        passportCopy: DocumentDetails;
        healthInsurance: DocumentDetails;
        labourCard: DocumentDetails;
        UAEResidentID: DocumentDetails;
        // Add any additional documents as necessary
    }
    interface UploadedDocState {
        visaDoc: number;
        passport: number;
        offerLetter: number;
        nda: number;
        passportCopy: number;
        healthInsurance: number;
        labourCard: number; // Corrected Typo
        UAEResidentID: number;
    }
    type DocumentName = keyof UploadedDocState;

    interface EmployeeDocument {
        name: string;
        url: {
            base64: string;
            format: string;
        };
        expiryDate?: string;
    }

    const [fileChangeCounters, setFileChangeCounters] = useState({
        visaDoc: 0,
        passport: 0,
        offerLetter: 0,
        nda: 0,
        passportCopy: 0,
        healthInsurance: 0,
        labourCard: 0,
        UAEResidentID: 0,

        // other documents...
    });

    const handleFileChange = (docName: DocumentName) => {
        setFileChangeCounters(prevCounters => ({
            ...prevCounters,
            [docName]: prevCounters[docName] + 1,
        }));
    };

    const [uploadedDocuments, setUploadedDocuments] = useState({
        visaDoc: { file: null, expiryDate: null },
        passport: { file: null, expiryDate: null },
        offerLetter: { file: null, expiryDate: null },
        nda: { file: null, expiryDate: null },
        passportCopy: { file: null, expiryDate: null },
        healthInsurance: { file: null, expiryDate: null },
        labourCard: { file: null, expiryDate: null },
        UAEResidentID: { file: null, expiryDate: null },
        // Add other documents as needed
    });
    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        documentName: keyof UploadedDocumentsState
    ) => {
        const file = e.target.files ? e.target.files[0] : null; // Safely get the uploaded file
        if (file) {
            setUploadedDocuments(prev => ({
                ...prev,
                [documentName]: { ...prev[documentName], file }, // Safely update the state with the new file
            }));
        }
    };

    // const handleDocumentsSubmit = (values: any) => {

    //     const documents = [
    //         'visaDoc',
    //         'passport',
    //         'offerLetter',
    //         'nda',
    //         'passportCopy',
    //         'healthInsurance',
    //         'labourCard',
    //         'UAEResidentID',
    //     ];

    //     const employeeDocs = documents.reduce((acc: any[], docName) => {
    //         if (values[docName]) {
    //             acc.push({
    //                 name: docName,
    //                 url: { base64: values[docName], format: 'pdf' },
    //                 expiryDate: formattedExpiryDate,
    //             });
    //         }
    //         return acc;
    //     }, []);

    //     nextTab('5');
    //     dispatch(setEmployeeDocuments(employeeDocs));
    // };

    const handleDocumentsSubmit = (values: any, formikBag: any) => {
        const documents = [
            'visaDoc',
            'passport',
            'offerLetter',
            'nda',
            'passportCopy',
            'healthInsurance',
            'labourCard',
            'UAEResidentID',
        ];

        let allValid = true;

        const employeeDocs: EmployeeDocument[] = documents.reduce(
            (acc: EmployeeDocument[], docName) => {
                const file = values[docName];
                const expiryKey = `${docName}Expiry`;

                if (file && !values[expiryKey]) {
                    formikBag.setFieldError(expiryKey, 'Please enter the expiry date');
                    allValid = false;
                } else if (file) {
                    acc.push({
                        name: docName,
                        url: { base64: file, format: 'pdf' },
                        expiryDate: values[expiryKey],
                    });
                }
                return acc;
            },
            []
        );

        if (allValid) {
            dispatch(setEmployeeDocuments(employeeDocs));
            nextTab('5');
        } else {
            formikBag.setSubmitting(false);
        }
    };

    const { employeeDocuments } = useAppSelector(state => state.reducer.employeeDetails);

    const handleExpiryDateChange = (date: Dayjs) => {
        setExpiryDate(date);
    };
    return (
        <Flex vertical className="my-8" justify="center" align="middle">
            <Formik
                initialValues={{
                    visaDoc: null,
                    passport: null,
                    offerLetter: null,
                    nda: null,
                    governmentEmployeeContract: null,
                    healthInsurance: null,
                    labourCard: null,
                    UAEResidentID: null,
                    visaDocExpiry: null,
                    passportExpiry: null,
                    offerLetterExpiry: null,
                    ndaExpiry: null,
                    governmentEmployeeContractExpiry: null,
                    healthInsuranceExpiry: null,
                    labourCardExpiry: null,
                    UAEResidentIDExpiry: null,
                }}
                // onSubmit={values => {
                //     handleDocumentsSubmit(values);
                // }}
                onSubmit={(values, formikBag) => handleDocumentsSubmit(values, formikBag)}
            >
                {({ handleSubmit, isValid, errors, touched }) => (
                    <Form layout="vertical" onFinish={handleSubmit} className="w-full">
                        <Flex justify="center">
                            <Col span={16}>
                                <Row>
                                    <Col xs={24} sm={12}>
                                        <Flex justify="start">
                                            <DocsCard
                                                handleFileChange={handleFileChange}
                                                name="governmentEmployeeContract"
                                                // key="visaDoc"
                                                // format="format"
                                                documentUrl={employeeDocuments[0]?.url}
                                                expiry={employeeDocuments[0]?.expiryDate}
                                                onDateChange={handleExpiryDateChange}
                                                label="Government Employee Contract"
                                                error={errors.governmentEmployeeContract}
                                                touched={touched.governmentEmployeeContract}
                                                expiryError={
                                                    errors.governmentEmployeeContractExpiry
                                                }
                                                expiryTouched={
                                                    touched.governmentEmployeeContractExpiry
                                                }
                                            />
                                        </Flex>
                                    </Col>
                                    <Col xs={24} sm={11} className="mx-auto">
                                        <DocsCard
                                            handleFileChange={handleFileChange}
                                            name="passport"
                                            documentUrl={employeeDocuments[1]?.url}
                                            expiry={employeeDocuments[1]?.expiryDate}
                                            onDateChange={handleExpiryDateChange}
                                            label="Passport"
                                            error={errors.passport}
                                            touched={touched.passport}
                                            expiryError={errors.passportExpiry}
                                            expiryTouched={touched.passportExpiry}
                                        />
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Flex justify="start">
                                            <DocsCard
                                                handleFileChange={handleFileChange}
                                                name="offerLetter"
                                                // key="offerLetter"
                                                // format="pdf"
                                                expiry={employeeDocuments[2]?.expiryDate}
                                                documentUrl={employeeDocuments[2]?.url}
                                                onDateChange={handleExpiryDateChange}
                                                label="Offer Letter"
                                                error={errors.offerLetter}
                                                touched={touched.offerLetter}
                                                expiryError={errors.offerLetterExpiry}
                                                expiryTouched={touched.offerLetterExpiry}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col xs={24} sm={11} className="mx-auto">
                                        <DocsCard
                                            handleFileChange={handleFileChange}
                                            name="nda"
                                            // key="nda"
                                            // format="pdf"
                                            expiry={employeeDocuments[3]?.expiryDate}
                                            documentUrl={employeeDocuments[3]?.url}
                                            onDateChange={handleExpiryDateChange}
                                            label="NDA"
                                            error={errors.nda}
                                            touched={touched.nda}
                                            expiryError={errors.ndaExpiry}
                                            expiryTouched={touched.ndaExpiry}
                                        />
                                    </Col>
                                    <Col xs={24} sm={12} className="">
                                        <Flex justify="start">
                                            <DocsCard
                                                handleFileChange={handleFileChange}
                                                name="visaDoc"
                                                // key="passportCopy"
                                                // format="pdf"
                                                expiry={employeeDocuments[4]?.expiryDate}
                                                documentUrl={employeeDocuments[4]?.url}
                                                onDateChange={handleExpiryDateChange}
                                                label="Visa"
                                                error={errors.visaDoc}
                                                touched={touched.visaDoc}
                                                expiryError={errors.visaDocExpiry}
                                                expiryTouched={touched.visaDocExpiry}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col xs={24} sm={11} className="mx-auto">
                                        <DocsCard
                                            handleFileChange={handleFileChange}
                                            name="healthInsurance"
                                            // key="healthInsurance"
                                            // format="pdf"
                                            expiry={employeeDocuments[5]?.expiryDate}
                                            documentUrl={employeeDocuments[5]?.url}
                                            onDateChange={handleExpiryDateChange}
                                            label="Health Insurance"
                                            error={errors.healthInsurance}
                                            touched={touched.healthInsurance}
                                            expiryError={errors.healthInsuranceExpiry}
                                            expiryTouched={touched.healthInsuranceExpiry}
                                        />
                                    </Col>
                                    <Col xs={24} sm={12} className="">
                                        <Flex justify="start">
                                            <DocsCard
                                                handleFileChange={handleFileChange}
                                                name="labourCard"
                                                // key="labourCard"
                                                // format="pdf"
                                                expiry={employeeDocuments[6]?.expiryDate}
                                                documentUrl={employeeDocuments[6]?.url}
                                                onDateChange={handleExpiryDateChange}
                                                label="Labour Card"
                                                error={errors.labourCard}
                                                touched={touched.labourCard}
                                                expiryError={errors.labourCardExpiry}
                                                expiryTouched={touched.labourCardExpiry}
                                            />
                                        </Flex>
                                    </Col>
                                    <Col xs={24} sm={11} className="mx-auto">
                                        <DocsCard
                                            handleFileChange={handleFileChange}
                                            // key="UAEResidentID"
                                            name="UAEResidentID"
                                            // format="pdf"
                                            expiry={employeeDocuments[7]?.expiryDate}
                                            documentUrl={employeeDocuments[7]?.url}
                                            onDateChange={handleExpiryDateChange}
                                            label="Emirates ID"
                                            error={errors.UAEResidentID}
                                            touched={touched.UAEResidentID}
                                            expiryError={errors.UAEResidentIDExpiry}
                                            expiryTouched={touched.UAEResidentIDExpiry}
                                        />
                                    </Col>
                                </Row>
                                <Flex justify="space-between" className=" mt-4">
                                    <Button
                                        onClick={() => nextTab('3')}
                                        type="default"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        danger
                                        className=" font-semibold w-[8rem] "
                                    >
                                        Next
                                    </Button>
                                </Flex>
                            </Col>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default Documents;
