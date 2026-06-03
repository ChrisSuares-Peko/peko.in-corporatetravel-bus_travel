import React from 'react';

import { Button, Col, Form, Row } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useBasicInfoApi from '../../profile/hooks/useBasicInfoApi';
import { WorkspaceSchema } from '../schema';

interface props {
    setFormData: (data: any) => void;
    formData: any;
    setIsFormSubmitted: (data: any) => void;
}
const WorkspaceForm = ({ setFormData, formData, setIsFormSubmitted }: props) => {
    const dispatch = useAppDispatch();
    const { data } = useBasicInfoApi({});
    return (
        <Formik
            initialValues={{
                company_name: data?.name ?? '',
                current_email_provider: '',
                number_of_users: '',
                name: data?.contactPersonName ?? '',
                domain_name: '',
                email_Id: data?.email ?? '',
                alternative_email_Id: '',
                mobile_number: data?.mobileNo ?? '',
            }}
            enableReinitialize
            onSubmit={values => {
                if (values.alternative_email_Id === values.email_Id) {
                    dispatch(
                        showToast({
                            description:
                                'Your primary email ID and alternative email ID cannot be the same',
                            variant: 'error',
                        })
                    );
                    return Promise.reject();
                }
                setFormData(values);
                setIsFormSubmitted(true);
                return Promise.resolve();
            }}
            validationSchema={WorkspaceSchema}
        >
            {({ handleSubmit, isSubmitting }) => (
                <Form layout="vertical" className="w-full mt-3" id="emailDomainForm">
                    <Row>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="company_name"
                                isRequired
                                label="Company Name"
                                placeholder="Enter company name"
                                type="text"
                                maxLength={50}
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="current_email_provider"
                                label="Who is your current email provider?"
                                placeholder="Enter current email provider"
                                type="text"
                                // isRequired
                                maxLength={50}
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="number_of_users"
                                isRequired
                                placeholder="Enter number of users"
                                type="text"
                                allowNumbersOnly
                                maxLength={5}
                                label="How many users?"
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="name"
                                isRequired
                                label="What is your name?"
                                placeholder="Enter your name"
                                type="text"
                                maxLength={50}
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                label="What is your domain name?"
                                name="domain_name"
                                placeholder="Enter domain name"
                                type="text"
                                isRequired
                                maxLength={50}
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="email_Id"
                                label="What is your email ID?"
                                isRequired
                                placeholder="Enter your email ID"
                                type="email"
                                maxLength={50}
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="alternative_email_Id"
                                placeholder="Enter alternative email ID"
                                type="email"
                                isRequired
                                maxLength={50}
                                label="Please provide an alternative email ID"
                            />
                        </Col>
                        <Col className="w-full mr-10" md={10}>
                            <TextInput
                                name="mobile_number"
                                placeholder="Enter mobile number"
                                type="text"
                                isRequired
                                label="What is your mobile number?"
                                allowNumbersOnly
                                maxLength={10}
                                minLength={9}
                            />
                        </Col>
                    </Row>
                    <Button
                        danger
                        size="small"
                        type="primary"
                        loading={isSubmitting}
                        className="justify-center w-32 h-10 mt-5 text-xs font-normal rounded-md sm:text-base sm:font-medium sm:w-32"
                        onClick={() => handleSubmit()}
                    >
                        Next
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default WorkspaceForm;
