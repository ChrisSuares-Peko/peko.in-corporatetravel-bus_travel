import React from 'react';

import { Button, Col, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { paths } from '@src/routes/paths';

import { useDubaiPolice } from '../../hooks/dubai-police/useDubaiPoliceApi';
import { useDubaiPoliceListingData } from '../../hooks/dubai-police/useDubaiPoliceListingData';
import { ticketDetailSchema } from '../../schema/DubaiPolice';

type props = {
    flexiKey: string | undefined;
};

const TicketDetails = ({ flexiKey }: props) => {
    const { getBalance } = useDubaiPolice();
    const navigate = useNavigate();

    const { fineSources } = useDubaiPoliceListingData();
    return (
        <Formik
            initialValues={{
                searchType: 'byTicketNo',
                beneficiaryCode: '',
                beneficiaryName: '',
                ticketNumber: '',
                ticketYear: '',
            }}
            validationSchema={ticketDetailSchema}
            enableReinitialize
            onSubmit={async values => {
                const reqBody = {
                    searchType: values.searchType,
                    beneficiaryCode: fineSources?.find(
                        item => item.FineSourceName === values.beneficiaryName
                    )?.FineSourceCode,
                    beneficiaryName: values.beneficiaryName,
                    ticketNumber: values.ticketNumber,
                    ticketYear: values.ticketYear,
                };
                const key = flexiKey ?? '';
                const res = await getBalance(values.ticketNumber, key, reqBody);

                if (res !== false) {
                    const searchDetails = {
                        SearchInputValues: `${values.ticketNumber}/${values.ticketYear}`,
                        SearchCriteria: 'byTicketNo',
                        account: values.ticketNumber,
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
                        <Col className="sm:w-72 sm:mr-5">
                            <SelectInput
                                label="Beneficiary Name"
                                name="beneficiaryName"
                                placeholder="Enter beneficiary name"
                                options={
                                    fineSources?.map(item => ({
                                        label: item.FineSourceName,
                                        value: item.FineSourceName,
                                    })) || []
                                }
                                isRequired
                            />
                        </Col>
                        <Col className="sm:w-72 sm:mr-5">
                            <SelectInput
                                label="Fine Year"
                                name="ticketYear"
                                placeholder="Select fine year"
                                options={[
                                    {
                                        label: '2020',
                                        value: '2020',
                                    },
                                    {
                                        label: '2021',
                                        value: '2021',
                                    },
                                    {
                                        label: '2022',
                                        value: '2022',
                                    },
                                    {
                                        label: '2023',
                                        value: '2023',
                                    },
                                    {
                                        label: '2024',
                                        value: '2024',
                                    },
                                ]}
                                isRequired
                            />
                        </Col>
                        <Col className="sm:mr-5">
                            <TextInput
                                label="Ticket Number"
                                name="ticketNumber"
                                allowAlphabetsAndNumbersOnly
                                type="text"
                                isRequired
                                placeholder="Enter ticket number"
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

export default TicketDetails;
