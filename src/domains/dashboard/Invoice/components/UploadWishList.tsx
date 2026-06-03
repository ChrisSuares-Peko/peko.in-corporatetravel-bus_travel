import React from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Typography } from 'antd';
import { FieldArray } from 'formik';

import WishListForm from '../forms/WishListForm';

type WishListProps = {
    values: any;
};
const UploadWishList = ({ values }: WishListProps) => (
    <Flex vertical>
        <Flex justify="space-between" align="center" className="w-full">
            <Typography.Text className="xs:text-sm md:text-lg font-medium">Items</Typography.Text>
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
                                    subTotal: '',
                                })
                            }
                        >
                            Add New Item
                        </Button>
                    )
                }
            </FieldArray>
        </Flex>
        <Card size="small" className="w-full mt-5">
            <FieldArray name="items">
                {({ push, remove }) => (
                    <>
                        {values.map((_: any, index: number) => (
                            <Flex key={index} justify="space-between" align="center">
                                <WishListForm index={index} />
                                {index > 0 && (
                                    <DeleteOutlined
                                        onClick={() => remove(index)}
                                        className="text-xl text-bgOrange2 pl-3"
                                    />
                                )}
                            </Flex>
                        ))}
                    </>
                )}
            </FieldArray>
        </Card>
    </Flex>
);

export default UploadWishList;
