import React, { useState } from 'react';

import { Button, Col, Flex, Row, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import useHafilatPayment from '../../hooks/hafilat/useHafilatPayment';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';
import { hafilatPaymentPayload, HaflatBalanceResponse } from '../../types/haflat';

type Props = {};
type ISelectedPack = {
    ProductCode: string;
    ItemCode: string;
    ItemTitle: string;
    Price: number;
};
const HafilatDetailsPage = (props: Props) => {
    const { state } = useLocation();
    const dispatch = useAppDispatch();
    const { handleSubmission } = useHafilatPayment();
    const { res, cardNumber, mobileNumber, flexiKey, typeKey } = state;
    const response = res as HaflatBalanceResponse;

    const [selectedPack, setSelectedPack] = useState<ISelectedPack | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [customAmount, setCustomAmount] = useState<number | null>(null);
    const { limitData } = useFetchLimitApi('hafilat');
    const [err, setErr] = useState(false);
    const cardDetails = [
        {
            title: 'Card Serial Number :',
            value: cardNumber,
        },
        {
            title: 'Expires on :',
            value: dayjs(res.ExpiryDate).format('DD-MM-YYYY'),
        },
        {
            title: 'Status :',
            value: res.CardStatus,
        },
        {
            title: 'Balance :',
            value: `AED ${formatNumberWithLocalString(response.ProductDetails[0].BalanceAmount)}`,
        },
    ];

    const handlePayment = () => {
        if (err) {
            return dispatch(
                showToast({
                    description: ` The entered amount should be within the limit
                            ${limitData?.minDenomination} and ${limitData?.maxDenomination}`,
                    variant: 'error',
                })
            );
        }
        if (err || (selectedId === null && customAmount === null)) {
            return dispatch(
                showToast({
                    description: `select amount`,
                    variant: 'error',
                })
            );
        }
        const amount = customAmount === null ? selectedPack?.Price : customAmount;
        const postData: hafilatPaymentPayload = {
            account: cardNumber,
            amount: Number(amount),
            flexiKey,
            typeKey,
            optionals: {
                ProductCode: res.ProductDetails[0].ProductCode,
                isTPurse: res.ProductDetails[0].ProductCategory === 'tpurse' ? '1' : '0',
                customerMobileNo: mobileNumber,
                itemCode: selectedId,
            },
            transactionId: state?.res?.TransactionId,
        };

        return handleSubmission(postData);
    };
    return (
        <Row className="rounded-2xl border md:w-3/5 md:p-8 md:px-14 gap-8">
            <Col span={24}>
                <Typography.Text className="text-lg font-medium">Card Details</Typography.Text>
            </Col>
            <Col className="w-full" span={24}>
                <Flex className="w-full" vertical gap={20}>
                    {cardDetails.map((item, i) => (
                        <Flex className="w-full" justify="space-between">
                            <Typography.Text className="text-base">{item.title}</Typography.Text>
                            <Typography.Text className="text-base">{item.value}</Typography.Text>
                        </Flex>
                    ))}
                </Flex>
            </Col>
            <Col className="w-full" span={24}>
                <Typography.Text className="text-xl font-medium">Recharge Options</Typography.Text>
            </Col>
            <Col className="w-full" span={24}>
                <Typography.Text className="text-base">Enter Amount:</Typography.Text>
            </Col>
            <Col className="w-full" span={24}>
                <Flex wrap="wrap" gap={10}>
                    {/* <Flex vertical>
                        <InputNumber
                            placeholder="Custom Amount"
                            onChange={e => {
                                if (
                                    (e != null && limitData && e < limitData?.minDenomination) ||
                                    e! > limitData!?.maxDenomination
                                ) {
                                    setErr(true);
                                } else setErr(false);
                                setCustomAmount(e);
                                setSelectedPack(null);
                                setSelectedId(
                                    response.ProductDetails[0].ItemInfo?.find(
                                        item => item.ItemTitle === 'Other Amount'
                                    )?.ItemCode || null
                                );
                            }}
                            value={customAmount}
                            className="w-36 rounded-md"
                            controls={false}
                        />
                    </Flex> */}
                    {limitData
                        ? response.ProductDetails[0].ItemInfo?.sort(
                              (a, b) => a.Price - b.Price
                          ).map(
                              (item, i) =>
                                  item.Price >= limitData.minDenomination &&
                                  item.Price <= limitData.maxDenomination && (
                                      <Button
                                          className={`w-24 rounded-md ${item.Price === 0 ? 'hidden' : ''} ${item.ItemCode === selectedId ? 'border-red-500 text-red-500' : ''}`}
                                          key={i}
                                          onClick={() => {
                                              setCustomAmount(null);
                                              setSelectedPack(item);
                                              setSelectedId(item.ItemCode);
                                          }}
                                      >
                                          AED {formatNumberWithLocalString(item.Price)}
                                      </Button>
                                  )
                          )
                        : Array.from({ length: 8 }).map((_, index) => (
                              <Skeleton.Button
                                  key={index}
                                  shape="square"
                                  className="w-fit"
                                  style={{ borderRadius: '0.8rem' }}
                                  active
                                  size="large"
                              />
                          ))}
                </Flex>
            </Col>

            <Button type="primary" danger onClick={handlePayment}>
                Pay Bill
            </Button>
        </Row>
    );
};

export default HafilatDetailsPage;
