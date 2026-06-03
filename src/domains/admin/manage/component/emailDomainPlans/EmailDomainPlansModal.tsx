import React, { useState } from 'react';

import { Flex, Form } from 'antd';
import { useDispatch } from 'react-redux';

import CustomFileUploadInput from '@components/atomic/inputs/CustomFileUploadInput';
import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { showToast } from '@src/slices/apiSlice';

import AddFeatureDetails from './AddFeatureDetails';
import useCreateEmailDomainPlan from '../../hooks/emailDomainPlans/useCreateEmailDomainPlan';
import emailDomainPlansSchema from '../../schema/emailDomainPlansSchema';
import { featureDetails } from '../../types/emailDomainPlan';

interface modalProps {
    open: boolean;
    handleCancel: () => void;
    data?: any;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const EmailDomainPlansModal = ({ handleCancel, open, data, setRefresh }: modalProps) => {
    const { isLoading, createNewEmailDomainPlan, updateCurrentEmailDomainPlan, allProducts } =
        useCreateEmailDomainPlan();
    const [file, setFile] = useState<any>('');
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    return (
        <CustomModalWithForm
            isLoading={isLoading}
            modalTitle="Add Email/Domain Plan"
            open={open}
            validationSchema={emailDomainPlansSchema}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: any;
                const formattedValues = {
                    ...values,
                    features: values.features.map((feature: featureDetails) => ({
                        label: feature.label,
                        value: feature.value,
                    })),
                };

                if (formattedValues.id) {
                    res = await updateCurrentEmailDomainPlan(formattedValues);
                } else {
                    res = await createNewEmailDomainPlan(formattedValues);
                }
                if (res.status === true) {
                    dispatch(
                        showToast({
                            description: `${res.message} `,
                            variant: 'success',
                        })
                    );
                    setRefresh(true);
                    handleCancel();
                }
                if (res.status === false) {
                    dispatch(
                        showToast({
                            description: `${res.message}`,
                            variant: 'error',
                        })
                    );
                }
            }}
            initialValues={{
                id: data?.id || '',
                name: data?.name || '',
                softwaresSubscriptionId: data?.softwaresSubscriptionId || '',
                monthlyPrice: data?.monthlyPrice || '',
                yearlyPrice: data?.yearlyPrice || '',
                features:
                    data?.features && data?.features.length > 0
                        ? data?.features
                        : [
                              {
                                  id: '',
                                  label: '',
                                  value: '',
                              },
                          ],
                descriptions: data?.descriptions || '',
                image: data?.image_url || '',
            }}
        >
            {({ handleSubmit, values }) => (
                <Flex vertical className="w-full ">
                    <Form layout="vertical">
                        <TextInput
                            name="name"
                            label="Plan Name"
                            type="text"
                            placeholder="Enter Plan Name"
                            isRequired
                            classes=" rounded-sm"
                        />
                        <SelectInput
                            isRequired
                            name="softwaresSubscriptionId"
                            options={allProducts}
                            placeholder="Please select a product"
                            label="Product"
                        />
                        <TextInput
                            name="monthlyPrice"
                            label="Monthly Price"
                            type="text"
                            placeholder="Enter Monthly Price"
                            isRequired
                            classes=" rounded-sm"
                            maxLength={15}
                            allowTwoDecimalsOnly
                        />
                        <TextInput
                            name="yearlyPrice"
                            label="Yearly Price"
                            type="text"
                            placeholder="Enter Yearly Price"
                            isRequired
                            classes=" rounded-sm"
                            maxLength={15}
                            allowTwoDecimalsOnly
                        />
                        <AddFeatureDetails values={values.features} />
                        <InputTextArea
                            name="descriptions"
                            label="Descriptions"
                            placeholder="Enter Descriptions"
                            isRequired
                        />
                        <CustomFileUploadInput
                            isRequired
                            name="image"
                            label="Image"
                            classes="rounded-sm"
                            format="imageFormat"
                            existingFileUrl={data?.image_url}
                            showFileName
                            showNotification
                            setFile={setFile}
                        />
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};

export default EmailDomainPlansModal;
