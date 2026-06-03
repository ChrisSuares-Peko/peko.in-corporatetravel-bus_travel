import React from 'react';

import { Button, Col, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { paths } from '@src/routes/paths';

import { useDubaiPolice } from '../../hooks/dubai-police/useDubaiPoliceApi';
import { useDubaiPoliceListingData } from '../../hooks/dubai-police/useDubaiPoliceListingData';
import { licenseDetailSchema } from '../../schema/DubaiPolice';

type props = {
    flexiKey: string | undefined;
};

// eslint-disable-next-line arrow-body-style
const LicenseDetails = ({ flexiKey }: props) => {
    const navigate = useNavigate();
    const { getBalance } = useDubaiPolice();

    const { licenseSources } = useDubaiPoliceListingData();
    return (
        <Formik
            initialValues={{
                searchType: 'byLicenceNo',
                licenseNo: '',
                licenseSourceCode: '',
                licenseFrom: '',
            }}
            enableReinitialize
            validationSchema={licenseDetailSchema}
            onSubmit={async values => {
                const reqBody = {
                    searchType: values.searchType,
                    licenseSourceCode: licenseSources?.find(
                        item => item.LicenseSourceName === values.licenseFrom
                    )?.LicenseSourceCode,
                    licenseFrom: values.licenseFrom,
                    licenseNo: values.licenseNo,
                };
                const key = flexiKey ?? '';

                const res = await getBalance(values.licenseNo, key, reqBody);

                if (res !== false) {
                    const searchDetails = {
                        SearchInputValues: `${values.licenseFrom}/${values.licenseNo}`,
                        SearchCriteria: 'byLicenceNo',
                        account: values.licenseNo,
                    };
                    navigate(paths.billPayments.dubaiPoliceTicket, {
                        state: { details: res, flexiKey: key, searchDetails },
                    });
                }
            }}
            validateOnMount
        >
            {({ handleSubmit, setFieldValue, isSubmitting }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-6">
                    <Flex wrap="wrap" className="flex-col sm:flex-row">
                        <Col className="sm:mr-5">
                            <SelectInput
                                label="License From"
                                name="licenseFrom"
                                placeholder="Enter license source"
                                options={
                                    licenseSources?.map(item => ({
                                        label: item.LicenseSourceName,
                                        value: item.LicenseSourceName,
                                    })) || []
                                }
                                isRequired
                            />
                        </Col>
                        <Col className="sm:mr-5">
                            <TextInput
                                label="License Number"
                                name="licenseNo"
                                allowNumbersOnly
                                type="text"
                                isRequired
                                placeholder="Enter license number"
                                classes="sm:w-[18rem]"
                            />
                        </Col>
                    </Flex>
                    <Button
                        htmlType="submit"
                        loading={isSubmitting}
                        type="primary"
                        danger
                        className="mt-4 px-5"
                    >
                        View Bill
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LicenseDetails;
