import React from 'react';

import { Button, Col, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { paths } from '@src/routes/paths';

import { useDubaiPolice } from '../../hooks/dubai-police/useDubaiPoliceApi';
import { useDubaiPoliceListingData } from '../../hooks/dubai-police/useDubaiPoliceListingData';
import { plateDetailSchema } from '../../schema/DubaiPolice';

type props = {
    flexiKey: string | undefined;
};
// eslint-disable-next-line arrow-body-style
const PlateTab = ({ flexiKey }: props) => {
    const { getBalance } = useDubaiPolice();
    const navigate = useNavigate();

    const { plateCategory, plateCode, plateSource } = useDubaiPoliceListingData();
    return (
        <Formik
            initialValues={{
                searchType: 'byPlateNo',
                plateNumber: '',
                plateSource: '',
                plateCategory: '',
                plateCode: '',
            }}
            validationSchema={plateDetailSchema}
            enableReinitialize
            onSubmit={async values => {
                const reqBody = {
                    searchType: values.searchType,
                    plateCategory: values.plateCategory,
                    plateCode: values.plateCode,
                    plateNo: values.plateNumber,
                    plateSource: values.plateSource,
                };
                const key = flexiKey ?? '';
                const res = await getBalance(values.plateNumber, key, reqBody);
                if (res !== false) {
                    const searchDetails = {
                        SearchInputValues: `${values.plateCategory}/${values.plateSource}/${values.plateCode}/${values.plateNumber}`,
                        SearchCriteria: 'byPlateNo',
                        account: values.plateNumber,
                    };
                    navigate(paths.billPayments.dubaiPoliceTicket, {
                        state: { details: res, flexiKey: key, searchDetails },
                    });
                }
            }}
            validateOnMount
        >
            {({ handleSubmit, setFieldValue, isSubmitting, values }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-6">
                    <Flex wrap="wrap" className="flex-col sm:flex-row">
                        <Col className="sm:w-72 sm:mr-5">
                            <SelectInput
                                label="Plate Source"
                                name="plateSource"
                                placeholder="Enter plate source"
                                options={
                                    plateSource?.map(item => ({
                                        label: item.PlateSourceName,
                                        value: item.PlateSourceCode,
                                    })) || []
                                }
                                isRequired
                            />
                        </Col>
                        <Col className="sm:w-72 sm:mr-5">
                            {values.plateSource && (
                                <SelectInput
                                    label="Plate Category"
                                    name="plateCategory"
                                    placeholder="Enter plate category"
                                    options={
                                        plateCategory
                                            ?.filter(
                                                item => item.EmiratesCode === values.plateSource
                                            )
                                            .map(item => ({
                                                label: item.PlateCategoryName,
                                                value: item.PlateCategoryName,
                                            })) || []
                                    }
                                    isRequired
                                />
                            )}
                        </Col>
                        <Col className="sm:w-72 sm:mr-5">
                            {values.plateCategory && (
                                <SelectInput
                                    label="Plate Code"
                                    name="plateCode"
                                    placeholder="Enter plate code"
                                    options={
                                        plateCode
                                            ?.filter(
                                                item =>
                                                    item.EmiratesCode === values.plateSource &&
                                                    item.PlateCategory === values.plateCategory
                                            )
                                            .map(item => ({
                                                label: item.PlateCodes,
                                                value: item.PlateCodes,
                                            })) || []
                                    }
                                    isRequired
                                />
                            )}
                        </Col>
                        <Col className="sm:mr-5">
                            {values.plateCode && (
                                <TextInput
                                    label="Plate Number"
                                    name="plateNumber"
                                    allowNumbersOnly
                                    type="text"
                                    isRequired
                                    maxLength={5}
                                    placeholder="Enter plate number"
                                    classes="sm:w-[18rem]"
                                />
                            )}
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

export default PlateTab;
