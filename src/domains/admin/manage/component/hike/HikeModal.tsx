import React, { useState } from 'react';

import { Flex, Form } from 'antd';
import { useDispatch } from 'react-redux';

import CustomFileUploadInput from '@components/atomic/inputs/CustomFileUploadInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextAreaInput from '@components/atomic/inputs/TextAreaInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import hikeCodeSchema from '@src/domains/admin/manage/schema/hikeSchema';
import { showToast } from '@src/slices/apiSlice';

import UseCreateHike from '../../hooks/hike/useCreateHike';

interface modalProps {
    open: boolean;
    handleCancel: () => void;
    data?: any;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}
const HikeModal = ({ handleCancel, open, setRefresh, data }: modalProps) => {
    const { createNewHike, isLoading, updateCurrentHike } = UseCreateHike();
    const [file, setFile] = useState<any>('');
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch();
    return (
        <CustomModalWithForm
            isLoading={isLoading}
            modalTitle="Document Management"
            open={open}
            validationSchema={hikeCodeSchema}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: any;
                if (data) {
                    res = await updateCurrentHike(values);
                } else {
                    res = await createNewHike(values);
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
                            description: `${res.message} `,
                            variant: 'error',
                        })
                    );
                }
            }}
            initialValues={{
                id: data?.id,
                name: data?.name || '',
                features: data?.features || '',
                logoBase: data?.logo || '',
                logoFormat: data?.logoFormat || '',
                partnersBase: data?.partners || '',
                partnersFormat: data?.partnersFormat || '',
                planType: data?.planType || '',
                amount: data?.amount || '',
                salaryAmount: data?.salaryAmount || '',
                salaryValidation: data?.salaryValidation || '',
            }}
        >
            <Flex vertical className="w-full ">
                <Form layout="vertical">
                    <TextInput
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Please enter name "
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextAreaInput
                        name="features"
                        label="Features"
                        placeholder="please enter features"
                        isRequired
                    />
                    <SelectInput
                        name="planType"
                        isRequired
                        options={[
                            { value: 'YEARLY', label: 'Yearly' },
                            { value: 'MONTHLY', label: 'Monthly' },
                        ]}
                        placeholder="Please select a plan type"
                        label="Plan Type"
                    />
                    <SelectInput
                        name="salaryValidation"
                        isRequired
                        options={[
                            { value: 'LESS_THAN', label: 'Less than' },
                            { value: 'GREATER_THAN', label: 'Greater than' },
                        ]}
                        placeholder="Please select a salary validation"
                        label="Salary Validation"
                    />
                    <TextInput
                        name="amount"
                        label="Amount"
                        type="text"
                        placeholder="Please enter amount "
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextInput
                        name="salaryAmount"
                        label="Salary Amount"
                        type="text"
                        placeholder="Please enter salary amount "
                        isRequired
                        classes=" rounded-sm"
                    />
                    <CustomFileUploadInput
                        isRequired
                        name="logoBase"
                        label="Logo"
                        classes="rounded-sm"
                        format="logoFormat"
                        existingFileUrl={data?.logo}
                        showFileName
                        showNotification
                        setFile={setFile}
                    />

                    <CustomFileUploadInput
                        isRequired
                        name="partnersBase"
                        label="Partners Logo"
                        classes="rounded-sm"
                        existingFileUrl={data?.partners}
                        format="partnersFormat"
                        setFile={setFile}
                        showFileName
                        showNotification
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default HikeModal;
