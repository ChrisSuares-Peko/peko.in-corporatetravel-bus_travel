import React from 'react';

import { Col, Flex, Form, Input, Row, Typography } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';

const AmountDetails = () => (
    <Row>
        <Col span={8}>
            <Flex vertical className="xs:w-full md:w-[21rem]" justify="space-between" gap={15}>
                <Flex justify="space-between" align="center">
                    <Flex align="center" className="">
                        <Typography.Text> SubTotal</Typography.Text>
                    </Flex>
                    <Flex>
                        <Input

                        // value={`AED ${values
                        //     .reduce(
                        //         (acc, item) =>
                        //             acc +
                        //             (parseFloat(item.price) * parseFloat(item.quantity) ||
                        //                 0),
                        //         0
                        //     )
                        //     .toFixed(2)}`}
                        />
                    </Flex>
                </Flex>
                <Flex justify="space-between" align="center">
                    <Typography.Text> VAT</Typography.Text>
                    <Flex>
                        <Input

                        // value={`AED   ${values
                        //     .reduce(
                        //         (acc, item) =>
                        //             acc +
                        //             ((parseFloat(item.vat) *
                        //                 (parseFloat(item.price) *
                        //                     parseFloat(item.quantity) || 0)) /
                        //                 100 || 0),
                        //         0
                        //     )
                        //     .toFixed(2)}`}
                        />
                    </Flex>
                </Flex>
                <Flex justify="space-between" align="center">
                    <Typography.Text> Discount</Typography.Text>
                    <Flex>
                        <Input

                        // value={`AED ${values
                        //     .reduce(
                        //         (acc, item) =>
                        //             acc +
                        //             ((parseFloat(item.discount) *
                        //                 (parseFloat(item.price) *
                        //                     parseFloat(item.quantity) || 0)) /
                        //                 100 || 0),
                        //         0
                        //     )
                        //     .toFixed(2)}`}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Col>
        <Col span={8}>
            <Flex vertical className="xs:w-full md:w-[21rem]" justify="space-between" gap={15}>
                <Flex justify="space-between" align="center">
                    <Typography.Text> Shipping</Typography.Text>
                    <Flex>
                        <TextInput
                            formItemClass="mb-0"
                            name="shipping"
                            placeholder="Enter Amount"
                            type="text"
                            isRequired
                            allowNumbersOnly
                        />
                    </Flex>
                </Flex>
                {/* <Flex justify="space-between" align="center">
                        <Typography.Text> Total</Typography.Text>
                        <Flex>
                            <Input
                                disabled
                                value={`AED ${(
                                    values.reduce(
                                        (acc, item) => acc + (parseFloat(item.amount) || 0),
                                        0
                                    ) + Number(charge || 0)
                                ).toFixed(2)}`}
                            />
                        </Flex>
                    </Flex> */}
                <Flex justify="space-between" align="center">
                    <Flex align="center" className="">
                        <Typography.Text> Amount Paid</Typography.Text>
                    </Flex>
                    <Flex justify="center" align="center">
                        <TextInput
                            formItemClass="mb-0"
                            name="amountPaid"
                            placeholder="Enter Amount"
                            type="text"
                            isRequired
                            allowNumbersOnly
                        />
                    </Flex>
                </Flex>
                <Flex justify="space-between" align="center">
                    <Typography.Text className="font-medium"> Amount Due</Typography.Text>
                    <Flex>
                        <Input

                        // value={`AED ${(
                        //     values.reduce(
                        //         (acc, item) => acc + (parseFloat(item.amount) || 0),
                        //         0
                        //     ) +
                        //     Number(charge || 0) -
                        //     Number(amountPaid || 0)
                        // ).toFixed(2)}`}
                        />
                    </Flex>
                </Flex>
            </Flex>
        </Col>
        <Col span={8}>
            <Form layout="vertical" className="w-full ">
                <SelectInput
                    options={[
                        {
                            value: 'cash',
                            label: 'Cash',
                        },
                        {
                            value: 'bank',
                            label: 'Bank',
                        },
                        {
                            value: 'cheque',
                            label: 'Cheque',
                        },
                        {
                            value: 'others',
                            label: 'Others',
                        },
                    ]}
                    name="paymentMode"
                    label="Payment Method"
                    placeholder="Payment Method"
                />
                <SelectInput
                    options={[
                        {
                            value: 'cash',
                            label: 'Cash',
                        },
                        {
                            value: 'bank',
                            label: 'Bank',
                        },
                        {
                            value: 'cheque',
                            label: 'Cheque',
                        },
                        {
                            value: 'others',
                            label: 'Others',
                        },
                    ]}
                    name="paymentMode"
                    label="Bank Account"
                    placeholder="Bank Account"
                />
            </Form>
        </Col>
    </Row>
);

export default AmountDetails;
