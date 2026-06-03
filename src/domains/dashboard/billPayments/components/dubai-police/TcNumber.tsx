import React from 'react';

import { Button, Col, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import TextInput from '@components/atomic/inputs/TextInput';
import { paths } from '@src/routes/paths';

import { useDubaiPolice } from '../../hooks/dubai-police/useDubaiPoliceApi';
import { tcNumberDetailSchema } from '../../schema/DubaiPolice';

type props = {
    flexiKey: string | undefined;
};

const TcNumber = ({ flexiKey }: props) => {
    const { getBalance } = useDubaiPolice();
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                searchType: 'byTrfNo',
                plateNumber: '',
            }}
            enableReinitialize
            validationSchema={tcNumberDetailSchema}
            onSubmit={async values => {
                const reqBody = {
                    searchType: values.searchType,
                    trfNo: values.plateNumber,
                };
                const key = flexiKey ?? '';
                const res = await getBalance(values.plateNumber, key, reqBody);
                if (res !== false) {
                    const searchDetails = {
                        SearchInputValues: res.TrafficFileNo,
                        SearchCriteria: 'byTrfNo',
                        account: res.TrafficFileNo,
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
                            <TextInput
                                label="Traffic File Number"
                                name="plateNumber"
                                allowNumbersOnly
                                type="text"
                                isRequired
                                placeholder="Enter traffic file number"
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

export default TcNumber;
