import { useState } from 'react';

import { Flex, Form, Select, Skeleton } from 'antd';
import { Field, FieldProps } from 'formik';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useAddDisabledService from '../../hooks/disableService/useAddDisabledService';
import disabledServiceSchema from '../../schema/disabledServiceSchema';
import { refresh } from '../../types/disabledTypes';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
};

const DisabledServiceModal = ({
    open,
    handleCancel,
    setRefresh,
}: DepartmentModalProps & refresh) => {
    const [searchCorporate, setSearchCorporate] = useState<string>('');
    const [searchOperator, setSearchOperator] = useState<string>('');
    const { corporateData, operatorData, createDisabledServices } = useAddDisabledService({
        searchCorporate,
        searchOperator,
    });

    const dispatch = useAppDispatch();
    return (
        <CustomModalWithForm
            modalTitle="Disable Service Management"
            open={open}
            validationSchema={disabledServiceSchema}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const res: boolean = await createDisabledServices({
                    credentialId: values.credentialId,
                    serviceOperatorId: values.serviceOperatorId,
                });

                if (res === true) {
                    setRefresh(true);

                    dispatch(
                        showToast({
                            description: `Disabled service successfully`,
                            variant: 'success',
                        })
                    );
                }
                if (res === false) {
                    dispatch(
                        showToast({
                            description: `Something went wrong ,please try again later`,
                            variant: 'error',
                        })
                    );
                }
                handleCancel();
            }}
            initialValues={{
                credentialId: '',
                serviceOperatorId: '',
            }}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    <Field name="credentialId">
                        {({ field, form: { touched, errors, setFieldValue } }: FieldProps) => (
                            <Form.Item
                                validateStatus={
                                    touched.credentialId && errors.credentialId ? 'error' : ''
                                }
                                help={
                                    touched.credentialId && errors.credentialId
                                        ? (errors.credentialId as React.ReactNode)
                                        : undefined
                                }
                                name="credentialId"
                                label="Select Corporate User"
                                required
                            >
                                {corporateData ? (
                                    <Select
                                        allowClear
                                        showSearch
                                        className="w-full"
                                        placeholder="Please select a corporate user"
                                        options={corporateData}
                                        onChange={e => setFieldValue('credentialId', e)}
                                        onSearch={setSearchCorporate}
                                        defaultActiveFirstOption={false}
                                        filterOption={false}
                                    />
                                ) : (
                                    <Skeleton.Input block active />
                                )}
                            </Form.Item>
                        )}
                    </Field>
                    <Field name="serviceOperatorId">
                        {({ field, form: { touched, errors, setFieldValue } }: FieldProps) => (
                            <Form.Item
                                validateStatus={
                                    touched.serviceOperatorId && errors.serviceOperatorId
                                        ? 'error'
                                        : ''
                                }
                                help={
                                    touched.serviceOperatorId && errors.serviceOperatorId
                                        ? (errors.serviceOperatorId as React.ReactNode)
                                        : undefined
                                }
                                name="serviceOperatorId"
                                label="Select Service Operator"
                                required
                            >
                                {operatorData ? (
                                    <Select
                                        allowClear
                                        showSearch
                                        className="w-full"
                                        placeholder="Please select a service operator"
                                        options={operatorData}
                                        onChange={e => setFieldValue('serviceOperatorId', e)}
                                        onSearch={setSearchOperator}
                                        defaultActiveFirstOption={false}
                                        filterOption={false}
                                    />
                                ) : (
                                    <Skeleton.Input block active />
                                )}
                            </Form.Item>
                        )}
                    </Field>
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default DisabledServiceModal;
