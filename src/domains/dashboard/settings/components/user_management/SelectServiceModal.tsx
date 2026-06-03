import React from 'react';

import { Col, Form, Row } from 'antd';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import useCrud from '../../hooks/user_management/useCrud';
import { SubCorporate } from '../../types/userManagement';

interface modalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRow: SubCorporate;
    reloadTable: () => void;
}

const SelectServiceModal = ({ handleCancel, open, selectedRow, reloadTable }: modalProps) => {
    const { isLoading, updateServiceAccess, initialValues, corporateServices } = useCrud({
        reloadTable,
        handleCancel,
        selectedRow,
    });

    return (
        <CustomModalWithForm
            modalTitle="Select Services"
            open={open}
            handleCancel={handleCancel}
            reinitialise
            initialValues={initialValues}
            handleFormSubmit={values => {
                updateServiceAccess(values, selectedRow.id);
            }}
            isLoading={isLoading}
        >
            {({ values, setFieldValue }) => (
                <Form>
                    <Row>
                        {corporateServices.map((item, i) => (
                            <Col span={12} key={i}>
                                <CheckboxInput
                                    name={item}
                                    checked={values[item]}
                                    onChange={e => setFieldValue(item, e.target.checked)}
                                >
                                    {item}
                                </CheckboxInput>
                            </Col>
                        ))}
                    </Row>
                </Form>
            )}
        </CustomModalWithForm>
    );
};

export default SelectServiceModal;
