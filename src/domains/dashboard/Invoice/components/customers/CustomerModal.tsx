import React, { useState } from 'react';

import { Flex, Form, Select } from 'antd';

import TextAreaInput from '@components/atomic/inputs/TextAreaInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { refresh } from '@src/domains/admin/manage/types/edocTypes';
import { useAppSelector } from '@src/hooks/store';

import { useCustomerAdd } from '../../hooks/useCustomerAdd';
import { useCorporates } from '../../hooks/useGetCorporates';
import { customersSchema } from '../../schema';
import { RowData } from '../../types/customertypes';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: RowData;
};

const CustomerModal = ({
    open,
    handleCancel,
    data,
    setRefresh,
}: DepartmentModalProps & refresh) => {
    // const dispatch = useAppDispatch();
    const [searchText, setSearchText] = useState('');
    const [userData, setUser] = useState<any>();
    const { user } = useAppSelector(state => state.reducer.user);
    const { customerAdd, customerUpdate } = useCustomerAdd();

    const { tableData } = useCorporates(searchText);

    const customerOptions = tableData?.map(corporate => ({
        value: corporate.value,
        label: corporate.label,
        corporate,
    }));

    const handleSearch = (value: any) => {
        setSearchText(value);
    };
    const handleChange = (value: any, option: any) => {
        setUser(option.corporate);
    };

    return (
        <CustomModalWithForm
            modalTitle="Add Customer"
            open={open}
            handleCancel={handleCancel}
            validationSchema={customersSchema}
            reinitialise
            handleFormSubmit={async values => {
                if (data) {
                    const res = await customerUpdate({ id: data.id, ...values });
                    if (res) {
                        setRefresh(true);
                        handleCancel();
                    }
                } else {
                    const res = await customerAdd(values);
                    if (res) {
                        setRefresh(true);
                        handleCancel();
                    }
                }
            }}
            initialValues={{
                name: data?.name || userData?.label || '',
                email: data?.email || userData?.email || '',
                phoneNumber: data?.phoneNumber || userData?.mobileNo || '',
                address: data?.address || '',
                trnNo: data?.trnNo || '',
                credentialId: userData?.value || data?.id,
            }}
        >
            <Flex vertical className=" w-full">
                <Form layout="vertical">
                    {tableData && (
                        <Form.Item name="credentialId" label="Select user">
                            <Select
                                showSearch
                                placeholder="Select Customer"
                                options={customerOptions}
                                onSearch={handleSearch}
                                filterOption={false}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    )}

                    <TextInput
                        name="name"
                        label="Customer Name"
                        type="text"
                        placeholder="Enter Customer Name"
                        classes=" rounded-sm"
                        isRequired
                        allowAlphabetsAndSpaceOnly
                        maxLength={50}
                    />
                    <TextInput
                        name="email"
                        label="Email ID"
                        type="text"
                        placeholder="Enter Email ID"
                        classes="rounded-sm"
                        isRequired
                        maxLength={50}
                    />
                    <TextInput
                        name="phoneNumber"
                        label="Mobile Number"
                        type="text"
                        placeholder="Enter Mobile Number"
                        classes="rounded-sm"
                        isRequired
                        allowNumbersOnly
                        maxLength={10}
                    />
                    <TextAreaInput
                        name="address"
                        label="Address"
                        placeholder="Enter Address"
                        isRequired
                        maxLength={200}
                    />
                    <TextInput
                        name="trnNo"
                        label="TRN Number"
                        type="text"
                        placeholder="Enter TRN Number"
                        classes="rounded-sm"
                        isRequired
                        allowNumbersOnly
                        maxLength={15}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default CustomerModal;
