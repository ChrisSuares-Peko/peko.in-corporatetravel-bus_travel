import { Flex, Form } from 'antd';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { useEditDepartmentApi } from '../../hooks/departmentHooks/useEditDepartment';
import { departmentSchema } from '../../schema/departmentSchema';
import { departmentTableData } from '../../types/departmentTypes/departmentTypes';

type DepartmentModalProps = {
    open: boolean;
    edit?: boolean;
    handleCancel: () => void;
    data?: departmentTableData | undefined;
    setRefresh: (values: any) => void;
};

const EditDepartmentModal = ({
    open,
    handleCancel,
    data,
    edit,
    setRefresh,
}: DepartmentModalProps) => {
    const { editDepartment } = useEditDepartmentApi();
    const dispatch = useAppDispatch();

    return (
        <CustomModalWithForm
            modalTitle="Edit Department"
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const res: boolean = await editDepartment({ ...values });

                if (res === true) {
                    setRefresh(true);
                    dispatch(
                        showToast({
                            description: `Department edited successfully`,
                            variant: 'success',
                        })
                    );
                }
                if (res === false) {
                    dispatch(
                        showToast({
                            description: `Failed to create department. Please try again.`,
                            variant: 'error',
                        })
                    );
                }
                handleCancel();
            }}
            initialValues={{
                departmentName: data?.name || '',
                departmentCode: data?.code || '',
                description: data?.description || '',
                id: data?.id || '',
            }}
            validationSchema={departmentSchema}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <TextInput
                        name="departmentName"
                        label="Name"
                        type="text"
                        placeholder="Department Name"
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextInput
                        name="departmentCode"
                        label="Code"
                        type="text"
                        placeholder="Department Code"
                        classes="rounded-sm"
                    />
                    <InputTextArea
                        name="description"
                        placeholder="Description"
                        label="Description"
                        maxLength={50}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default EditDepartmentModal;
