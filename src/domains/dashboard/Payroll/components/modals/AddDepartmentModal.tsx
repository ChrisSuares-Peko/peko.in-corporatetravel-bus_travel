import { Flex, Form } from 'antd';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { useCreateDepartmentApi } from '../../hooks/departmentHooks/useCreateDepartment';
import { departmentSchema } from '../../schema/departmentSchema';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    handleCreate: () => void;
    setRefresh: (value: any) => void;
};

const DepartmentModal = ({
    open,
    handleCancel,
    handleCreate,
    setRefresh,
}: DepartmentModalProps) => {
    const { createDepartment } = useCreateDepartmentApi();

    const dispatch = useAppDispatch();

    return (
        <CustomModalWithForm
            modalTitle="Department"
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const res: boolean = await createDepartment(values);

                if (res === true) {
                    setRefresh(true);

                    dispatch(
                        showToast({
                            description: `Department created successfully`,
                            variant: 'success',
                        })
                    );
                    handleCreate();
                    handleCancel();
                }

                if (res === false) {
                    dispatch(
                        showToast({
                            description: `Department with this name already exists. Please create a department with a new name or edit existing department.`,
                            variant: 'error',
                        })
                    );
                    handleCancel();
                }
            }}
            initialValues={{
                departmentName: '',
                departmentCode: '',
                description: '',
            }}
            validationSchema={departmentSchema}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <TextInput
                        name="departmentName"
                        label="Department Name"
                        type="text"
                        placeholder="Department Name"
                        isRequired
                        classes=" rounded-sm"
                        minLength={3}
                        maxLength={30}
                    />
                    <TextInput
                        name="departmentCode"
                        label="Code"
                        type="text"
                        placeholder="Enter Department Code"
                        maxLength={20}
                        classes="rounded-sm"
                    />
                    <InputTextArea
                        name="description"
                        placeholder="Enter Description"
                        label="Description"
                        maxLength={250}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default DepartmentModal;
