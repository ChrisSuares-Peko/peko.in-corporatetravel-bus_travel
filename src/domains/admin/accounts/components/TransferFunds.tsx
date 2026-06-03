import React, { useState } from 'react';

import { Button, Col, Form, Row } from 'antd';
import { Formik } from 'formik';

import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import PasswordInput from '@components/atomic/inputs/PasswordInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { UserInfoResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import DetailsTransferFunds from './DetailsTransferFunds';
import useGetCorporate from '../hooks/useGetCorporate';
import useSelfTransfer from '../hooks/useSelfTransfer';
import { transferFundsSchema } from '../schema/transferFunds';
import { transferFundsDetailsResponse } from '../types/SelfTransferTypes';
import { transferTypes } from '../utils/data';

const TransferFunds = () => {
    const { balance } = useAppSelector(state => state.reducer.user.user as UserInfoResponse);
    const { handleTransferForOther, isLoading } = useSelfTransfer(false);
    const [walletDetails, setWalletDetails] = useState<transferFundsDetailsResponse>();
    const {
        corporatesList,
        isLoading: corporateLoading,
        getCorporateDetailsById,
        initialVal,
        setCorporatesList,
        getCorporateList,
    } = useGetCorporate();
    const handleCorporateChange = (corporateId: string) => {
        const details = getCorporateDetailsById(corporateId);
        setWalletDetails(details);
    };
    const handleClear = (setFieldValue: any) => {
        setCorporatesList(initialVal);
        setFieldValue('credentialId', '');
        setWalletDetails(undefined);
    };
    const handleSearch = (searchText: string) => {
        if (searchText) {
            const results = initialVal.filter(item =>
                item.oName.toLowerCase().includes(searchText.toLowerCase())
            );
            setCorporatesList(results);
        } else {
            setCorporatesList(initialVal);
        }
    };
    return (
        <Row className="mt-5" gutter={[60, 30]}>
            <Col xs={24} sm={12} lg={10} xxl={8}>
                <Formik
                    initialValues={{
                        credentialId: '',
                        amount: '',
                        password: '',
                        type: '',
                        remarks: '',
                    }}
                    onSubmit={(values, { resetForm }) => {
                        handleTransferForOther(values).then(response => {
                            if (response) {
                                setWalletDetails(
                                    (prev: transferFundsDetailsResponse | undefined) => ({
                                        ...prev!,
                                        balance: response.corporateFinalBalance,
                                    })
                                );
                                getCorporateList();
                                resetForm();
                            }
                        });
                    }}
                    validationSchema={transferFundsSchema(
                        walletDetails?.balance || '0',
                        balance || '0'
                    )}
                >
                    {({ handleSubmit }) => (
                        <Form onFinish={handleSubmit} className="w-full " layout="vertical">
                            <CustomSelectSearch
                                onClear={handleClear}
                                showSearch
                                filterOption={false}
                                label="Corporate Name"
                                name="credentialId"
                                onChange={handleCorporateChange}
                                placeholder="Select Corporate"
                                loading={corporateLoading}
                                options={corporatesList}
                                onSearch={handleSearch}
                            />
                            <SelectInput
                                label="Transfer Type"
                                name="type"
                                placeholder="Select Transfer Type"
                                options={transferTypes}
                            />
                            <TextInput
                                name="amount"
                                label="Amount"
                                placeholder="Enter Amount"
                                type="text"
                                size="large"
                                allowDecimalsOnly
                                maxLength={8}
                            />
                            <TextInput
                                name="remarks"
                                label="Remarks"
                                placeholder="Enter Remarks"
                                type="text"
                                size="large"
                                maxLength={50}
                            />
                            <PasswordInput
                                label="Password"
                                name="password"
                                placeholder="Enter Password"
                                type="password"
                                size="large"
                            />

                            <Button
                                htmlType="submit"
                                type="primary"
                                danger
                                className="mt-5 "
                                loading={isLoading}
                            >
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Col>
            <DetailsTransferFunds isLoading={isLoading} walletDetails={walletDetails} />
        </Row>
    );
};

export default TransferFunds;
