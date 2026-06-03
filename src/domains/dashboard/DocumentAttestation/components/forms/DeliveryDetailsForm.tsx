import { Flex, Form, Button, Select } from 'antd';
import { Formik } from 'formik';

import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import InputTextArea from '@components/atomic/inputs/InputTextArea';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { useFetchAddressApi } from '../../hooks/useGetAddress';
import usePayment from '../../hooks/usePayment';
import { useUploadDocument } from '../../hooks/useUploadFile';
import { deliveryDetailsSchema } from '../../schema';

interface DeliveryDetailsFormProps {
    form1Ref?: any;
}
const DeliveryDetailsForm = ({ form1Ref }: DeliveryDetailsFormProps) => {
    const dispatch = useAppDispatch();
    const { addressOptions } = useFetchAddressApi();
    const { handleUploadDocument } = useUploadDocument();
    const { handleSubmission } = usePayment();
    const docData = useAppSelector(state => state.reducer.documentAttestation.data);
    const { user } = useAppSelector(state => state.reducer.user);
    return (
        <Formik
            initialValues={{
                address: '',
                email: user?.email || '',
                phoneNumber: user?.mobileNo || '',
                passportDoc: '',
                format: '',
            }}
            onSubmit={async (values, { setSubmitting }) => {
                const data = {
                    passportDoc: {
                        documentBase: values.passportDoc,
                        documentFormat: values.format,
                    },
                };
                if (form1Ref) {
                    if (
                        form1Ref.current.values.documentType === '' ||
                        form1Ref.current.values.issuedCountry === '' ||
                        form1Ref.current.values.submissionCountry === ''
                    ) {
                        form1Ref.current.handleSubmit();
                        return dispatch(
                            showToast({
                                variant: 'error',
                                description: 'Please fill in the required fields',
                            })
                        );
                    }
                }
                if (docData.amount === '' && docData.issuedCountry === '') {
                    return dispatch(
                        showToast({
                            variant: 'error',
                            description: 'Please check the price before proceeding with payment.',
                        })
                    );
                }
                setSubmitting(true);
                const res = await handleUploadDocument(data);
                handleSubmission({
                    passportDoc: res.firebaseUrl,
                    email: values.email,
                    submissionCountry: 'UAE',
                    address: values.address,
                    contactPersonPhone: values.phoneNumber,
                });
                return setSubmitting(false);
            }}
            validationSchema={deliveryDetailsSchema}
        >
            {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full md:w-1/2">
                    <FileUploadInput
                        label="Upload Passport of Document Holder"
                        name="passportDoc"
                        classes="rounded-sm py-1"
                        format="format"
                        showFileName
                        showNotification
                    />

                    <Form.Item label="Saved Address">
                        <Select
                            placeholder="Select Saved Address"
                            options={addressOptions}
                            onSelect={value => {
                                const address = JSON.parse(value);
                                setFieldValue('address', address.address);
                                setFieldValue('email', address.email);
                                setFieldValue('phoneNumber', address.phoneNumber);
                            }}
                        />
                    </Form.Item>

                    <InputTextArea
                        autoSize={{ minRows: 3 }}
                        name="address"
                        label="Address"
                        placeholder="Address"
                        isRequired
                        maxLength={200}
                    />

                    <TextInput
                        classes="w-full"
                        label="Email ID"
                        type="email"
                        size="middle"
                        name="email"
                        placeholder="Enter Email ID"
                        allowLowerCaseOnly
                        isRequired
                        maxLength={50}
                    />

                    <TextInput
                        classes="w-full"
                        label="Mobile Number"
                        type="tel"
                        size="middle"
                        name="phoneNumber"
                        placeholder="Enter Mobile Number"
                        allowNumbersOnly
                        maxLength={10}
                        isRequired
                    />

                    <Flex>
                        <Button
                            loading={isSubmitting}
                            htmlType="submit"
                            type="primary"
                            danger
                            className="hidde w-full md:w-1/2"
                        >
                            Pay Now
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default DeliveryDetailsForm;
