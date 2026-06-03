import { Button, Col, Flex, Form, Row, Typography } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { useLocation } from 'react-router-dom';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import useGetStaticDataWithFilter from '@src/domains/dashboard/vendorPayouts/hooks/useGetStaticDataWithFilterApi';
import { beneficiaryPersonalSchema } from '@src/domains/dashboard/vendorPayouts/schema/beneficiaryProfile';
import { setPersonalData } from '@src/domains/dashboard/vendorPayouts/slices/beneficiarySlices';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import FormHeader from './FormHeader';

type Props = {
    changeTab: (direction: 'next' | 'prev') => void;
};

const PersonalDetails = ({ changeTab }: Props) => {
    const filterType: string = 'relationships';
    const { relationShipOptions } = useGetStaticDataWithFilter({ filterType });
    const dispatch = useAppDispatch();
    const { state: locationState } = useLocation();
    const selectedData = locationState?.selectedData;
    const personalDetails = useAppSelector(
        state => state.reducer.vendorBeneficiary.personalDetails
    );

    const initialValues = selectedData ||
        personalDetails || {
            fullName: '',
            email: '',
            phoneNumber: '',
            relationShip: undefined,
            additionalDetails: '',
        };

    const handlePersonalInformation = async (values: any, actions: FormikHelpers<any>) => {
        const errors = await actions.validateForm();
        if (Object.keys(errors).length === 0) {
            dispatch(setPersonalData(values));
            changeTab('next');
        } else {
            console.log('Form Errors:', errors);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={beneficiaryPersonalSchema}
            onSubmit={handlePersonalInformation}
            enableReinitialize
        >
            {({ handleSubmit }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <Flex vertical className="gap-4">
                        <Typography.Paragraph className="text-base font-medium">
                            Upload Logo
                        </Typography.Paragraph>
                        <FileUploadInput
                            name="logo"
                            classes="rounded-sm py-1"
                            format="format"
                            showFileName
                            showNotification
                        />
                    </Flex>

                    <FormHeader step="1/3" title="Personal Details" />
                    <Row className="mt-6" gutter={[20, 40]}>
                        <Col xs={24} md={12}>
                            <TextInput
                                name="fullName"
                                type="text"
                                label="Full Name"
                                placeholder="Enter Biller Name"
                                isRequired
                            />
                            <TextInput
                                name="email"
                                type="email"
                                label="Email"
                                placeholder="Enter Email"
                                isRequired
                            />
                            <TextInput
                                name="phoneNumber"
                                type="text"
                                label="Phone Number"
                                isRequired
                                allowNumbersOnly
                                maxLength={10}
                                minLength={9}
                                placeholder="052XXXXXXXX"
                            />
                            <SelectInput
                                name="relationShip"
                                options={relationShipOptions}
                                placeholder="Select"
                                label="Relationship"
                                isRequired
                            />
                            <InputTextArea
                                name="additionalDetails"
                                label="Additional Details"
                                placeholder="Additional details here"
                                isRequired
                            />
                        </Col>
                    </Row>

                    <Flex gap={10} className="mt-16">
                        <Button type="primary" danger htmlType="submit">
                            Next
                        </Button>
                        <Button htmlType="button" onClick={() => changeTab('prev')}>
                            Back
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default PersonalDetails;
