import { Button, Form, Radio, Typography } from 'antd';
import dayjs from 'dayjs';
import { Formik } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useForm from '../hooks/useForm';
import { planSchema } from '../schema';

const FormInput = ({
    locationRequired = false,
    buttonState = null,
    setButtonState = null,
}: {
    locationRequired?: boolean;
    buttonState?: number | null;
    setButtonState?: null | any;
}) => {
    const { handleSubmission, isLoading } = useForm();
    const { workspaceId } = useAppSelector(state => state.reducer.plan);
    const dispatch = useAppDispatch();

    const handleButtonClick = () => {
        if (setButtonState !== null && buttonState !== null) setButtonState(buttonState + 1);
    };
    return (
        <Formik
            initialValues={{
                licenseType: '',
                companyName: '',
                expiryDate: '',
                tradeLicenseDoc: '',
                visaDoc: '',
            }}
            validationSchema={planSchema}
            onSubmit={values => {
                if (locationRequired && !workspaceId) {
                    dispatch(
                        showToast({
                            description: 'Please choose a workspace location',
                            variant: 'warning',
                        })
                    );
                    return;
                }
                handleSubmission(values);
            }}
        >
            {({ handleSubmit, handleChange, errors, touched }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="xl:w-2/4">
                    <Form.Item
                        help={
                            errors.licenseType &&
                            touched.licenseType && (
                                <Typography.Text className="text-sm font-normal text-red-500 ">
                                    {errors.licenseType as string}
                                </Typography.Text>
                            )
                        }
                    >
                        <Radio.Group name="licenseType" onChange={handleChange}>
                            <Radio value="existing">Existing License</Radio>
                            <Radio value="new">New License</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <TextInput
                        name="companyName"
                        label="Company Name"
                        placeholder="Enter Company Name"
                        type="text"
                        maxLength={50}
                        allowAlphabetsSpaceAndNumbersOnly
                        isRequired
                    />
                    <DatePickerInput
                        name="expiryDate"
                        label="Expiry Date"
                        placeholder="Enter Expiry Date"
                        classes="w-full"
                        minDate={dayjs(new Date())}
                        isRequired
                    />

                    <FileUploadInput
                        label="Owner Visa Copy"
                        name="visaDoc"
                        showFileName
                        format="visaDocFormat"
                        showNotification
                        classes="min-w-full h-9"
                        isRequired
                    />

                    <FileUploadInput
                        label="Trade License"
                        name="tradeLicenseDoc"
                        showFileName
                        format="tradeLicenseFormat"
                        showNotification
                        classes="min-w-full h-9"
                        isRequired
                    />

                    <Button
                        danger
                        type="primary"
                        className="w-full mt-4 sm:w-2/4 "
                        htmlType="submit"
                        loading={isLoading}
                        onClick={() => handleButtonClick()}
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default FormInput;
