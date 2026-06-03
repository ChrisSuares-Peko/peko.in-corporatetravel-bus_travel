import { useState } from 'react';

import { Flex, Form, Skeleton } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import UseUpdateAccessCode from '../../hooks/UseUpdateAccessCode';
import accessCode from '../../schema/accessCode';
import { AccessData, refresh } from '../../types/accessCode';

type props = {
    open: boolean;
    handleCancel: () => void;
    data?: AccessData;
};

const AccessCodeModal = ({ open, handleCancel, data, setRefresh }: props & refresh) => {
    const [searchPartner, setSearchPartner] = useState<string>('');
    const { createNewAccess, partnerDatas, updateCurrentAccess } =
        UseUpdateAccessCode(searchPartner);
    const dispatch = useAppDispatch();
    return (
        <CustomModalWithForm
            modalTitle="Access Code Management"
            open={open}
            validationSchema={accessCode}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: boolean;
                if (data) {
                    res = await updateCurrentAccess({
                        ...values,
                    });
                } else {
                    res = await createNewAccess({
                        ...values,
                    });
                }
                if (res === true) {
                    setRefresh(true);
                    if (data)
                        dispatch(
                            showToast({
                                description: `Access Code updated successfully`,
                                variant: 'success',
                            })
                        );
                    else
                        dispatch(
                            showToast({
                                description: `Access Code added successfully`,
                                variant: 'success',
                            })
                        );
                    handleCancel();
                }
                if (res === false) {
                    dispatch(
                        showToast({
                            description: `Something went wrong ,please try again later`,
                            variant: 'error',
                        })
                    );
                }
            }}
            initialValues={{
                id: data?.id || '',
                access_code: data?.access_code || '',
                partnerId: data?.partnerId || '',
            }}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <TextInput
                        allowNumbersOnly
                        name="access_code"
                        label="Access Code"
                        type="text"
                        placeholder="Please enter referal code "
                        isRequired
                        classes=" rounded-sm"
                    />
                    {partnerDatas ? (
                        <SelectInput
                            filterOption={false}
                            allowClear
                            onSearch={setSearchPartner}
                            showSearch
                            isRequired
                            name="partnerId"
                            options={partnerDatas}
                            placeholder="Please select a partner "
                            label="Select Partner"
                        />
                    ) : (
                        <Skeleton.Input active block className="my-2" />
                    )}
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default AccessCodeModal;
