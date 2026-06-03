import { Flex, Form } from 'antd';

import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import UseUpdateReferalCodes from '../../hooks/UseUpdateReferalCodes';
import referal from '../../schema/referal';
import { Referral, refresh } from '../../types/refferalCode';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Referral;
};

const RefferalCodeModal = ({
    open,
    handleCancel,
    data,
    setRefresh,
}: DepartmentModalProps & refresh) => {
    const { isLoading, createNewReferal, updateCurrentreferal } = UseUpdateReferalCodes();

    const dispatch = useAppDispatch();
    return (
        <CustomModalWithForm
            isLoading={isLoading}
            modalTitle="Referral Code Management"
            open={open}
            validationSchema={referal}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: boolean;
                if (data) {
                    res = await updateCurrentreferal({
                        ...values,
                    });
                } else {
                    res = await createNewReferal({
                        ...values,
                    });
                }
                if (res === true) {
                    setRefresh(true);
                    if (data)
                        dispatch(
                            showToast({
                                description: `Referral updated successfully `,
                                variant: 'success',
                            })
                        );
                    else
                        dispatch(
                            showToast({
                                description: `Referral added successfully`,
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
                referralCode: data?.referralCode || '',
                contactPersonName: data?.contactPersonName || '',
                contactPersonPhone: data?.contactPersonPhone || '',
            }}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <TextInput
                        allowNumbersOnly
                        name="referralCode"
                        label="Referral Code"
                        type="text"
                        placeholder="Please enter referral code"
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextInput
                        name="contactPersonName"
                        label="Contact Person Name"
                        type="text"
                        placeholder="Please enter contact person name"
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextInput
                        allowNumbersOnly
                        name="contactPersonPhone"
                        label="Contact Person Mobile"
                        type="text"
                        placeholder="Please enter contact person mobile"
                        isRequired
                        classes=" rounded-sm"
                        maxLength={10}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default RefferalCodeModal;
