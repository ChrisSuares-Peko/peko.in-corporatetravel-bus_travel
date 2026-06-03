import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Input, Typography } from 'antd';
import { FieldArray } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import AdditionalDetailsForm from '../forms/AdditionalDetailsForm';
import WishListForm from '../forms/WishListForm';
import { ProductDetail } from '../types';

type WishListProps = {
    values: ProductDetail[];
    charge: string;
    amountPaid: string;
};

const WishList: React.FC<WishListProps> = ({ values, charge, amountPaid }) => (
    <Flex vertical className="w-full" gap={20}>
        <Flex justify="space-between" align="center" className="w-full">
            <Typography.Text className="xs:text-sm md:text-lg font-medium">
                Enter the items you wish to bill:
            </Typography.Text>
            <FieldArray name="items">
                {({ push }) =>
                    values.length < 10 && (
                        <Button
                            danger
                            onClick={() =>
                                push({
                                    item: '',
                                    quantity: '',
                                    price: '',
                                    vat: '',
                                    discount: '',
                                    amount: '',
                                    // subTotal: '',
                                })
                            }
                        >
                            Add New Item
                        </Button>
                    )
                }
            </FieldArray>
        </Flex>
        <Card size="small" className="w-full">
            <FieldArray name="items">
                {({ push, remove }) => (
                    <>
                        {values.map((_, index) => (
                            <Flex key={index} justify="space-between" align="center">
                                <WishListForm index={index} />
                                <DeleteOutlined
                                    data-testid={`delete-item-${index}`}
                                    onClick={() => remove(index)}
                                    className={`text-xl text-bgOrange2 pl-3 ${index === 0 ? 'invisible' : ''}`}
                                />
                            </Flex>
                        ))}
                    </>
                )}
            </FieldArray>
        </Card>
        <Flex className="flex xs:flex-col md:flex-row">
            <AdditionalDetailsForm />
            <Flex vertical className="w-full md:items-end">
                <Flex vertical className="xs:w-full md:w-[21rem]" justify="space-between" gap={15}>
                    <Flex justify="space-between" align="center">
                        <Flex align="center" className="">
                            <Typography.Text> SubTotal</Typography.Text>
                        </Flex>
                        <Flex>
                            <Input
                                disabled
                                value={`AED ${values
                                    .reduce(
                                        (acc, item) =>
                                            acc +
                                            (parseFloat(item.price) * parseFloat(item.quantity) ||
                                                0),
                                        0
                                    )
                                    .toFixed(2)}`}
                            />
                        </Flex>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Typography.Text> VAT</Typography.Text>
                        <Flex>
                            <Input
                                disabled
                                value={`AED   ${values
                                    .reduce(
                                        (acc, item) =>
                                            acc +
                                            ((parseFloat(item.vat) *
                                                (parseFloat(item.price) *
                                                    parseFloat(item.quantity) || 0)) /
                                                100 || 0),
                                        0
                                    )
                                    .toFixed(2)}`}
                            />
                        </Flex>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Typography.Text> Discount</Typography.Text>
                        <Flex>
                            <Input
                                disabled
                                value={`AED ${values
                                    .reduce(
                                        (acc, item) =>
                                            acc +
                                            ((parseFloat(item.discount) *
                                                (parseFloat(item.price) *
                                                    parseFloat(item.quantity) || 0)) /
                                                100 || 0),
                                        0
                                    )
                                    .toFixed(2)}`}
                            />
                        </Flex>
                    </Flex>

                    <Flex justify="space-between" align="center">
                        <Typography.Text> Shipping</Typography.Text>
                        <Flex>
                            <TextInput
                                formItemClass="mb-0"
                                name="shipping"
                                placeholder="Enter Amount"
                                type="text"
                                isRequired
                                allowNumbersAndDots
                                maxLength={10}
                            />
                        </Flex>
                    </Flex>
                    <Flex justify="space-between" align="center">
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
                    </Flex>
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
                                allowNumbersAndDots
                            />
                        </Flex>
                    </Flex>
                    <Flex justify="space-between" align="center">
                        <Typography.Text className="font-medium"> Amount Due</Typography.Text>
                        <Flex>
                            <Input
                                data-testid="amount-due-field"
                                disabled
                                value={`AED ${(
                                    values.reduce(
                                        (acc, item) => acc + (parseFloat(item.amount) || 0),
                                        0
                                    ) +
                                    Number(charge || 0) -
                                    Number(amountPaid || 0)
                                ).toFixed(2)}`}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Flex>
);

export default WishList;
