import { useRef, useState } from 'react';

import { Button, Flex, Form, Select, Typography } from 'antd';
import { FormikProps } from 'formik';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useUpdateTemplate from '../../hooks/useUpdateTemplates';
import template from '../../schema/template';
import { refresh } from '../../types/disabledTypes';
import { formInputs, Template } from '../../types/invoiceTemplates';
import { templateTypes } from '../../utils/templateTypes';

const { Text } = Typography;
const { Option } = Select;
const placeholders = [
    '[Customer Name]',
    '[Invoice Number]',
    '[Due Date]',
    '[Amount]',
    '[service/product]',
];
type TemplateModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Template;
};
const TemplateModal = ({ open, handleCancel, data, setRefresh }: TemplateModalProps & refresh) => {
    const dispatch = useAppDispatch();
    const { updateCurrentTemplate, createNewTemplate } = useUpdateTemplate();
    const [selectedPlaceholder, setSelectedPlaceholder] = useState('');
    const formRef = useRef<FormikProps<formInputs>>(null);
    const insertPlaceholder = () => {
        if (selectedPlaceholder && formRef.current) {
            const bodyvalue = formRef.current?.values.body;
            formRef.current?.setFieldValue('body', `${bodyvalue}${selectedPlaceholder}`);
        }
    };
    return (
        <CustomModalWithForm
            formRefName={formRef}
            modalTitle="Invoice Template Management"
            open={open}
            validationSchema={template}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: boolean;
                if (data) {
                    res = await updateCurrentTemplate({
                        ...values,
                    });
                } else {
                    res = await createNewTemplate({
                        ...values,
                    });
                }
                if (res === true) {
                    setRefresh(true);
                    if (data)
                        dispatch(
                            showToast({
                                description: `Templates updated successfully `,
                                variant: 'success',
                            })
                        );
                    else
                        dispatch(
                            showToast({
                                description: `Templates added successfully`,
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
                type: data?.type || '',
                subject: data?.subject || '',
                body: data?.body || '',
            }}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <SelectInput
                        name="type"
                        label="Type"
                        placeholder="Select type"
                        isRequired
                        classes="rounded-sm"
                        options={templateTypes}
                        showSearch
                    />
                    <TextInput
                        name="subject"
                        label="Subject"
                        type="text"
                        placeholder="Enter subject"
                        isRequired
                        classes=" rounded-sm"
                    />
                    <InputTextArea
                        label="Body"
                        isRequired
                        name="body"
                        placeholder="Enter body"
                        autoSize={{ minRows: 4 }}
                    />
                    <Flex>
                        <Select
                            showSearch
                            onChange={value => setSelectedPlaceholder(value)}
                            placeholder="Select Placeholder"
                            style={{ width: '200px' }}
                        >
                            {placeholders.map(placeholder => (
                                <Option key={placeholder} value={placeholder}>
                                    {placeholder}
                                </Option>
                            ))}
                        </Select>
                        <Button onClick={insertPlaceholder}>Insert</Button>
                    </Flex>
                    <Text type="secondary" style={{ marginTop: '8px' }}>
                        Select a placeholder and click Insert to add it to the email body.
                    </Text>
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};
export default TemplateModal;
