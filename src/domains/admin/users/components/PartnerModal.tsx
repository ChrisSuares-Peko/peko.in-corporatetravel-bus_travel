import { Flex, Form } from 'antd';

import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { refresh } from '../../officeSupplies/types/products';
import partnerSchema from '../schema/partner';
import { Partner } from '../types/systemUserTypes';

type EditUserProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Partner;
    handleUpdate: (value: Partner) => void;
    handleCreate: (value: Partner) => void;
};

const PartnerModal = ({
    open,
    handleCancel,
    data,
    setRefresh,
    handleUpdate,
    handleCreate,
}: EditUserProps & refresh) => {
    const dispatch = useAppDispatch();
    const initialValues = {
        id: data?.id || '',
        name: data?.name || '',
        portalUrl: data?.portalUrl || '',
    };

    return (
        <CustomModalWithForm
            modalTitle="Partner Management"
            open={open}
            reinitialise
            validationSchema={partnerSchema}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: any;
                if (data) {
                    res = await handleUpdate(values);
                } else {
                    res = await handleCreate({
                        ...values,
                    });
                }
                if (res.status === true) {
                    setRefresh(true);
                    dispatch(
                        showToast({
                            description: res.message,
                            variant: 'success',
                        })
                    );
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
            initialValues={initialValues}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <TextInput
                        name="name"
                        label="Name"
                        type="text"
                        placeholder="Enter Partner Name"
                        isRequired
                        classes=" rounded-sm"
                    />

                    <TextInput
                        name="portalUrl"
                        label="Portal URL (Optional)"
                        type="text"
                        placeholder="Enter Portal URL"
                        classes=" rounded-sm"
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default PartnerModal;
