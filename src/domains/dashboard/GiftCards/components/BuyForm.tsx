import { useEffect, useState } from 'react';

import { Form, Typography, Button, Flex, message, Grid, Radio } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';

import AmountField from './AmountField';
import QuantityField from './QuantityField';
import { setFormData, setProductData } from '../slices/checkoutSlice';
import { GiftCardOrderTypes } from '../types/employee';
import { GiftCardDetailResponse } from '../types/types';

const { useBreakpoint } = Grid;

interface BuyFormProps {
    productData?: GiftCardDetailResponse;
}

const BuyForm: React.FC<BuyFormProps> = ({ productData }: BuyFormProps) => {
    const dispatch = useAppDispatch();
    const { xs } = useBreakpoint();
    const navigate = useNavigate();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
    const isPurchasedPayroll = useServiceAccess(accessKeys.payroll);
    const [orderType, setOrderType] = useState<GiftCardOrderTypes>(GiftCardOrderTypes.BUYFOROTHER);

    const product_name = productData?.mainGiftCard.name;

    const id = productData?.mainGiftCard.id;
    const product_id = productData?.mainGiftCard.product_id;
    const product_image = productData?.mainGiftCard.image;
    const denominations = productData?.mainGiftCard.denominations;
    const min_price = productData?.mainGiftCard.minDenomination;
    const max_price = productData?.mainGiftCard.maxDenomination;
    const priceType = productData?.mainGiftCard.priceType;

    useEffect(() => {
        const product = { product_name, id, product_image, product_id };
        dispatch(setProductData(product));
    }, [dispatch, product_name, id, product_image, product_id]);

    const handleAmountClick = (amount: number) => {
        setSelectedAmount(amount);
    };
    // const { userData } = GetUserDetails();

    // useEffect(() => {
    //     dispatch(setUserDetails(userData));
    // }, [dispatch, userData]);

    const validateAmount = (val: number): boolean | undefined => {
        const minSellingPrice = Number(min_price) || 0;
        const maxSellingPrice = Number(max_price) || Number.MAX_SAFE_INTEGER;

        // Check if the value is within the min and max prices
        if (val < minSellingPrice || val > maxSellingPrice) {
            message.error('Value must be within the minimum and maximum price range');
            return false;
        }

        // Check if the value is one of the denominations
        if (priceType === 'FIXED') {
            const numericVal = Number(val);
            if (denominations && denominations.length > 0 && !denominations.includes(numericVal)) {
                message.error('Value must be one of the provided denominations');
                return false;
            }
        }

        return true;
    };

    return (
        <Formik
            initialValues={{ amount: '', quantity: '2' }}
            onSubmit={(values, { setSubmitting }) => {
                setIsSubmitting(true);

                const isValidAmount = validateAmount(Number(values.amount));
                values.quantity =
                    orderType === GiftCardOrderTypes.BULKPURCHASE ? values.quantity : '1';
                if (isValidAmount) {
                    dispatch(setFormData({ ...values, orderType }));

                    navigate(paths.giftcards.checkout);
                }

                setSubmitting(false);
            }}
            validateOnChange={false} // Prevent validation on change
            validateOnBlur={false} // Prevent validation on blur
        >
            {({ handleSubmit, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <Content className="md:ml-10">
                        <Typography.Title
                            className="xs:mt-3 "
                            level={1}
                            style={{ fontSize: xs ? '1rem' : '1.9rem' }}
                        >
                            {productData?.mainGiftCard?.name}
                        </Typography.Title>
                        <Flex className="mt-3">
                            <Radio.Group
                                onChange={e => {
                                    setOrderType(e.target.value);
                                    // updateTripData('orderType', e.target.value);
                                }}
                                buttonStyle="outline"
                                size="large"
                                value={orderType}
                                defaultValue="buyForOther"
                                className="mt-1"
                            >
                                <Radio
                                    defaultChecked
                                    value="buyForOther"
                                    className=" xs:text-xs md:text-sm"
                                >
                                    Buy for other
                                </Radio>
                                {isPurchasedPayroll && (
                                    <Radio
                                        value="buyForEmployees"
                                        className="xs:text-xs md:text-sm "
                                    >
                                        Buy for employees
                                    </Radio>
                                )}

                                <Radio value="bulkPurchase" className="xs:text-xs md:text-sm">
                                    Bulk Purchase
                                </Radio>
                            </Radio.Group>
                        </Flex>

                        <Flex className="mt-3">
                            <Form.Item
                                label={
                                    productData?.mainGiftCard?.priceType === 'FIXED'
                                        ? 'Select Amount'
                                        : 'Enter Amount'
                                }
                            >
                                <AmountField
                                    priceType={productData?.mainGiftCard?.priceType}
                                    min_price={productData?.mainGiftCard?.minDenomination}
                                    max_price={productData?.mainGiftCard?.maxDenomination}
                                    setFieldValue={setFieldValue}
                                    isSubmitting={isSubmitting}
                                    denominations={productData?.mainGiftCard.denominations}
                                />
                            </Form.Item>
                        </Flex>
                        <Flex>
                            {' '}
                            {/* {orderType === GiftCardOrderTypes.BULKPURCHASE && (
                                <Form.Item className="mr-2" label="No. of Cards:">
                                    <QuantityField />
                                </Form.Item>
                            )} */}
                            <Form.Item
                                className="mr-2"
                                label="No. of Cards:"
                                style={{
                                    display:
                                        orderType === GiftCardOrderTypes.BULKPURCHASE
                                            ? 'block'
                                            : 'none',
                                }}
                            >
                                <QuantityField />
                            </Form.Item>
                            <Button
                                className="h-10 w-36 xs:mt-7 mt-7"
                                type="primary"
                                htmlType="submit"
                                danger
                            >
                                Buy Now
                            </Button>
                        </Flex>
                    </Content>
                </Form>
            )}
        </Formik>
    );
};
export default BuyForm;
