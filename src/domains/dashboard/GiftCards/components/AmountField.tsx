import { useState } from 'react';

import { Col, Flex, Input, Row, Tag } from 'antd';
import { Field, FieldProps } from 'formik';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import PriceTag from './Pricetag';

interface AmountFieldProps {
    priceType: string | undefined;
    min_price: string | undefined;
    max_price: string | undefined;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    isSubmitting: boolean;
    denominations?: number[];
}

const AmountField = ({
    priceType,
    min_price,
    max_price,
    setFieldValue,
    isSubmitting,
    denominations,
}: AmountFieldProps) => {
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [inputAmount, setInputAmount] = useState<string>('');
    const dispatch = useAppDispatch();
    const minSellingPrice = Number(min_price) || 0;
    const maxSellingPrice = Number(max_price) || Number.MAX_SAFE_INTEGER;

    // State to track form submission
    const validateAmount = (val: number): string | undefined => {
        if (priceType === 'FIXED') {
            const numericVal = Number(val);
            if (denominations && denominations.length > 0 && !denominations.includes(numericVal)) {
                dispatch(
                    showToast({
                        description: 'Please enter denomination values mentioned on Gift Card',
                        variant: 'error',
                    })
                );
                return `Value must be one of the provided denominations: ${denominations.join(', ')}`;
            }
        }

        // Check if the value is within the min and max prices
        if (val < minSellingPrice || val > maxSellingPrice) {
            dispatch(
                showToast({
                    description:
                        'Please enter a value between the minimum and maximum prices of the Gift Card',
                    variant: 'error',
                })
            );
            return `Value must be within the min and max prices`;
        }

        // Check if the value is one of the denominations

        return undefined;
    };

    const handleClick = (amount: number) => {
        setInputAmount(String(amount));
        setSelectedAmount(amount);
        setFieldValue('amount', amount);
    };
    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setInputAmount(e.target.value);
    //     const parsedValue = parseFloat(e.target.value);
    //     if (parsedValue) {
    //         setSelectedAmount(parsedValue);
    //     }
    // };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const truncatedValue = inputValue.slice(0, 5); // Truncate to 4 digits
        setInputAmount(truncatedValue);

        const parsedValue = parseFloat(truncatedValue);
        if (
            !Number.isNaN(parsedValue) &&
            parsedValue <= maxSellingPrice &&
            truncatedValue.length <= maxSellingPrice.toString().length
        ) {
            setInputAmount(inputValue);
            setSelectedAmount(parsedValue);
            setFieldValue('amount', parsedValue);
        } else {
            setInputAmount('');
            setSelectedAmount(null);
            setFieldValue('amount', '');
        }
    };

    return (
        <Flex className="mt-2 flex-wrap" gap={8}>
            {priceType === 'FLEXI' ? (
                <Flex className="flex-wrap " gap={8}>
                    <Field name="amount" validate={validateAmount}>
                        {({ field, form }: FieldProps<number>) => (
                            <Flex vertical>
                                <Input
                                    placeholder="Enter Amount"
                                    className="w-32 mr-1"
                                    {...field}
                                    onChange={e => {
                                        handleInputChange(e);
                                        field.onChange(e);
                                    }}
                                    onBlur={() => form.setFieldTouched('quantity', true)}
                                    onKeyDown={e => {
                                        // Allow only numbers (digits 0 to 9)
                                        if (e.key < '0' || (e.key > '9' && e.key !== 'Backspace')) {
                                            e.preventDefault();
                                        }
                                    }}
                                    value={inputAmount}
                                />
                            </Flex>
                        )}
                    </Field>
                    {min_price && max_price && (
                        <Flex gap={8} align="center">
                            <Tag
                                style={{
                                    textAlign: 'center',
                                    borderColor: '#E2BE00', // Outline color
                                    color: '#E2BE00', // Text color
                                    borderRadius: '.25rem', // Rounded corners
                                }}
                            >
                                Min: AED {formatNumberWithLocalString(min_price)}, Max: AED{' '}
                                {formatNumberWithLocalString(max_price)}
                            </Tag>
                        </Flex>
                    )}
                </Flex>
            ) : (
                // If price type is FIXED, render PriceTags based on denominations
                <Flex>
                    <Row gutter={[20, 20]}>
                        <Field name="amount" validate={validateAmount}>
                            {({ field, form }: FieldProps<number>) => (
                                <Flex vertical>
                                    <Col xs={6}>
                                        <Input
                                            size="large"
                                            placeholder="Select Amount"
                                            className="w-32"
                                            disabled
                                            {...field}
                                            onChange={e => {
                                                handleInputChange(e);
                                                field.onChange(e);
                                            }}
                                            style={{ borderRadius: '.4rem', display: 'none' }}
                                            onBlur={() => form.setFieldTouched('quantity', true)}
                                            value={inputAmount}
                                        />
                                    </Col>
                                </Flex>
                            )}
                        </Field>
                        <Flex className=" md:overflow-x-auto xs:flex-wrap">
                            {denominations?.map((price, index) => (
                                <PriceTag
                                    key={index}
                                    price={price}
                                    onClick={() => handleClick(price)}
                                    selected={selectedAmount === price}
                                />
                            ))}
                        </Flex>
                    </Row>
                </Flex>
            )}
        </Flex>
    );
};

export default AmountField;
