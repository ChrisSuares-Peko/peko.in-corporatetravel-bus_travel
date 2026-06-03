/* eslint-disable import/no-extraneous-dependencies */
import { Button, Col, Flex, Form, Row, Typography } from 'antd';
import { Formik } from 'formik';
import numberToWords from 'number-to-words';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { salarySchema } from '../../schema/employeeProfile';
import { setSalaryData } from '../../slices/employeeSlices';

type Props = {
    nextTab: (key: string) => void;
};

const SalaryInfo = ({ nextTab }: Props) => {
    const dispatch = useAppDispatch();
    const handleSalaryInfoSubmit = (values: any) => {
        dispatch(setSalaryData(values));
        nextTab('4');
    };

    const { salaryInformation } = useAppSelector(state => state.reducer.employeeDetails);
    return (
        <Flex vertical className="my-8">
            <Formik
                initialValues={{
                    basicPay: salaryInformation.basicPay || '',
                    homeAllowances: salaryInformation.homeAllowances || '',
                    travelAllowances: salaryInformation.travelAllowances || '',
                    medicalAllowances: salaryInformation.medicalAllowances || '',
                    otherAllowances: salaryInformation.otherAllowances || '',
                    other: salaryInformation.other || '',
                }}
                validationSchema={salarySchema}
                onSubmit={values => handleSalaryInfoSubmit(values)}
            >
                {({ handleSubmit, values }) => (
                    <>
                        <Form layout="vertical" onFinish={handleSubmit} className="w-full">
                            <Flex justify="center">
                                <Col span={16}>
                                    <Row>
                                        <Col xs={24} sm={10} className="mx-auto">
                                            <TextInput
                                                isRequired
                                                label="Monthly Basic"
                                                name="basicPay"
                                                placeholder="Basic Salary"
                                                type="text"
                                                allowNumbersOnly
                                                maxLength={7}
                                            />
                                        </Col>
                                        <Col xs={24} sm={10} className="mx-auto">
                                            <TextInput
                                                isRequired
                                                label="House Rent Allowance"
                                                name="homeAllowances"
                                                placeholder="House Rent Allowance"
                                                type="text"
                                                allowNumbersOnly
                                                maxLength={7}
                                            />
                                        </Col>
                                        <Col xs={24} sm={10} className="mx-auto">
                                            <TextInput
                                                isRequired
                                                label="Travel  Allowances"
                                                name="travelAllowances"
                                                placeholder="Travel  Allowances"
                                                type="text"
                                                allowNumbersOnly
                                                maxLength={7}
                                            />
                                        </Col>
                                        <Col xs={24} sm={10} className="mx-auto">
                                            <TextInput
                                                isRequired
                                                label="Medical  Allowances"
                                                name="medicalAllowances"
                                                placeholder="Medical  Allowances"
                                                type="text"
                                                allowNumbersOnly
                                                maxLength={7}
                                            />
                                        </Col>
                                        <Col xs={24} sm={10} className="mx-auto">
                                            <TextInput
                                                label="Other Allowances"
                                                name="otherAllowances"
                                                placeholder="Other Allowances"
                                                type="text"
                                                allowNumbersOnly
                                                maxLength={7}
                                            />
                                        </Col>
                                        <Col xs={24} sm={10} className="mx-auto" />
                                        {/* <TextInput
                                                label="Other"
                                                name="other"
                                                placeholder="Others"
                                                type="text"
                                                allowNumbersOnly
                                                maxLength={7}
                                            />
                                        </Col> */}

                                        <Col md={22} className="mx-auto">
                                            <Flex
                                                className="py-3 mx-auto mt-5 bg-bgGrayF8 min-h-8"
                                                style={{ paddingInline: '1rem' }}
                                            >
                                                <Typography.Text
                                                    className="font-bold "
                                                    style={{ fontSize: ' 1rem' }}
                                                >
                                                    Total Salary: AED{' '}
                                                    {(
                                                        Number(values.basicPay) +
                                                        Number(values.homeAllowances) +
                                                        Number(values.medicalAllowances) +
                                                        Number(values.other) +
                                                        Number(values.travelAllowances) +
                                                        Number(values.otherAllowances)
                                                    ).toLocaleString()}{' '}
                                                    (
                                                    {
                                                        numberToWords
                                                            .toWords(
                                                                Number(values.basicPay) +
                                                                    Number(values.homeAllowances) +
                                                                    Number(
                                                                        values.medicalAllowances
                                                                    ) +
                                                                    Number(values.other) +
                                                                    Number(
                                                                        values.travelAllowances
                                                                    ) +
                                                                    Number(values.otherAllowances)
                                                            )
                                                            .toLowerCase() // Convert the whole string to lowercase
                                                            .split(' ') // Split the string into an array of words
                                                            .map(
                                                                word =>
                                                                    word.charAt(0).toUpperCase() +
                                                                    word.slice(1)
                                                            ) // Capitalize the first letter of each word
                                                            .join(' ') // Join the words back into a string
                                                    }{' '}
                                                    Only)
                                                </Typography.Text>
                                            </Flex>
                                        </Col>
                                        <Col md={22} className="mx-auto">
                                            <Flex
                                                className="py-3 mx-auto mt-5 bg-bgGrayF8 min-h-8"
                                                style={{ paddingInline: '1rem' }}
                                            >
                                                <Typography.Text
                                                    className="font-bold "
                                                    style={{ fontSize: ' 1rem' }}
                                                >
                                                    Salary Per Annum: AED{' '}
                                                    {(
                                                        (Number(values.basicPay) +
                                                            Number(values.homeAllowances) +
                                                            Number(values.medicalAllowances) +
                                                            Number(values.other) +
                                                            Number(values.travelAllowances) +
                                                            Number(values.otherAllowances)) *
                                                        12
                                                    ).toLocaleString()}{' '}
                                                    (
                                                    {numberToWords
                                                        .toWords(
                                                            (Number(values.basicPay) +
                                                                Number(values.homeAllowances) +
                                                                Number(values.medicalAllowances) +
                                                                Number(values.other) +
                                                                Number(values.travelAllowances) +
                                                                Number(values.otherAllowances)) *
                                                                12
                                                        )
                                                        .toLowerCase()
                                                        .split(' ')
                                                        .map(
                                                            word =>
                                                                word.charAt(0).toUpperCase() +
                                                                word.slice(1)
                                                        )
                                                        .join(' ')}{' '}
                                                    Only)
                                                </Typography.Text>
                                            </Flex>
                                        </Col>
                                        <Col md={22} className="mx-auto">
                                            <Flex justify="space-between" className=" mt-11">
                                                <Button
                                                    onClick={() => nextTab('2')}
                                                    type="default"
                                                    danger
                                                    className=" font-semibold w-[8rem] "
                                                >
                                                    Back
                                                </Button>

                                                <Button
                                                    htmlType="submit"
                                                    type="primary"
                                                    danger
                                                    className=" font-semibold w-[8rem] "
                                                >
                                                    Next
                                                </Button>
                                            </Flex>
                                        </Col>
                                    </Row>
                                </Col>
                            </Flex>
                        </Form>

                        {/* <Typography.Text className="text-stone-300 text-[1rem] font-light mt-[2rem]">
                            PS: All are Monthly Calculation{' '}
                        </Typography.Text> */}
                    </>
                )}
            </Formik>
        </Flex>
    );
};
export default SalaryInfo;
