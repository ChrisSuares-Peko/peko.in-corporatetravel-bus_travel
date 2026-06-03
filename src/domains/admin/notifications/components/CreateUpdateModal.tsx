import { useState } from 'react';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import FormComponent from './FormComponent';
import useNotificationUpdate from '../hooks/useNotificationUpdate';
import { notificationSchema } from '../schema';
import { NotificationData } from '../types';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: NotificationData;
    handleRefresh: () => void;
};

const CreateUpdateModal = ({ open, handleCancel, data, handleRefresh }: DepartmentModalProps) => {
    const [specificCorporate, setSpecificCorporate] = useState(
        data ? data?.notificationTo !== 'ALL' : false
    );
    const [searchText, setSearchText] = useState('');
    const { isLoading, handleNotificationCreation, updateNotificationDetails, corporates } =
        useNotificationUpdate(searchText);
    const dispatch = useAppDispatch();
    return (
        <CustomModalWithForm
            modalTitle="Notification Management"
            open={open}
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={async (values, { resetForm }) => {
                let result: any;
                if (values.id) {
                    delete values.selCorporate;
                    result = await updateNotificationDetails(values);
                } else {
                    delete values.id;
                    delete values.selCorporate;
                    result = await handleNotificationCreation(values);
                }

                if (result.status === true) {
                    let description = '';
                    if (values.id) {
                        description = 'Notification updated successfully';
                    } else {
                        description = 'Notification created successfully';
                    }
                    dispatch(
                        showToast({
                            description,
                            variant: 'success',
                        })
                    );
                    handleCancel();
                    resetForm();
                    handleRefresh();
                } else {
                    dispatch(
                        showToast({
                            description: `${result?.message} `,
                            variant: 'error',
                        })
                    );
                }
            }}
            validationSchema={notificationSchema}
            initialValues={{
                id: data?.id || '',
                notificationTitle: data?.notificationTitle || '',
                notificationBrief: data?.notificationBrief || '',
                notificationCategory: data?.notificationCategory || '',
                notificationTo: data?.notificationTo || '',
                selCorporate: data?.notificationTo !== 'ALL',
            }}
        >
            <FormComponent
                corporates={corporates}
                specificCorporate={specificCorporate}
                setSpecificCorporate={setSpecificCorporate}
                searchText={searchText}
                setSearchText={setSearchText}
            />
        </CustomModalWithForm>
    );
};

export default CreateUpdateModal;
