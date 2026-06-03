/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect } from 'react';

import { Flex } from 'antd';
import { ErrorMessage, useFormikContext } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

interface Item {
    item: string;
    quantity: number;
    price: number;
    vat: number;
    discount: number;
    amount: number;
}

interface FormValues {
    items: Item[];
}

interface WishListFormProps {
    index: number;
}

const WishListForm = ({ index }: WishListFormProps) => {
    const { values, setFieldValue } = useFormikContext<FormValues>();

    if (!values) {
        return null;
    }

    const currentItem = values.items[index];
    const quantity = currentItem.quantity || 0;
    const totalPrice = quantity * currentItem.price;
    const totalVAT = totalPrice * (currentItem.vat / 100);
    const totalDiscount = totalPrice * (currentItem.discount / 100);
    const totalValue = (totalPrice + totalVAT - totalDiscount).toFixed(2);

    useEffect(() => {
        setFieldValue(`items[${index}].amount`, totalValue);
    }, [totalValue, index, setFieldValue]);

    return (
        <Flex className="w-fit">
            <Flex className="w-fit flex gap-3 flex-col md:flex-row">
                <Flex className="flex-col">
                    <TextInput
                        name={`items[${index}].item`}
                        placeholder="Description"
                        label="Item Description"
                        type="text"
                        isRequired
                        maxLength={200}
                    />
                    <ErrorMessage
                        name={`items[${index}].item`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`items[${index}].quantity`}
                        placeholder="Quantity"
                        label="Qty"
                        type="text"
                        allowNumbersOnly
                        maxLength={10}
                        isRequired
                    />
                    <ErrorMessage
                        name={`items[${index}].quantity`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`items[${index}].price`}
                        placeholder="Price"
                        label="Price"
                        type="text"
                        allowNumbersAndDots
                        maxLength={10}
                        isRequired
                    />
                    <ErrorMessage
                        name={`items[${index}].price`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`items[${index}].vat`}
                        placeholder="VAT  "
                        label="VAT (%)"
                        type="text"
                        maxLength={2}
                        allowNumbersAndDots
                    />
                    <ErrorMessage
                        name={`items[${index}].vat`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`items[${index}].discount`}
                        placeholder="Discount"
                        label="Discount (%)"
                        type="text"
                        allowNumbersAndDots
                        maxLength={2}
                    />
                    <ErrorMessage
                        name={`items[${index}].discount`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`items[${index}].amount`}
                        placeholder=""
                        label="Total"
                        type="text"
                        isDisabled
                        allowNumbersOnly
                    />
                    <ErrorMessage
                        name={`items[${index}].amount`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export default WishListForm;
