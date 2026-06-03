import React, { useMemo, useState } from 'react';

import { EditOutlined } from '@ant-design/icons';
import { Col, InputNumber, Row, Typography } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { telecomPayments, utilityPayments } from '../../billPayments/utils/data';
import { useSurchageApi } from '../hooks/useSurchargeApi';
import { setPaymentData } from '../slices/payment';

interface BulkPaymentData {
    amount: number;
}

interface SummaryProps {
    headName: string;
    value: string | number;
    isInput?: boolean;
    setIsCashbackChecked?: React.Dispatch<React.SetStateAction<boolean>>;
    setIsInvalidAmount?: (value: boolean) => void;
    isInvalidAmount?: boolean;
}
const Summary = ({
    headName,
    value,
    isInput,
    setIsCashbackChecked,
    setIsInvalidAmount,
    isInvalidAmount,
}: SummaryProps) => {
    const dispatch = useAppDispatch();
    const paymentState = useAppSelector(state => state.reducer.payment);
    const [amount, setAmount] = useState<number | string | null>(value);
    const [isEditable, setIsEditable] = useState<boolean>(false);
    const { getEarningCashback } = useSurchageApi();

    const serviceDetails: any = [...utilityPayments, ...telecomPayments].filter(
        service => paymentState?.payload?.accessKey === service.accessKey
    );
    let amountDetails: any;
    if (isInput && serviceDetails) {
        amountDetails = serviceDetails[0].inputComponents.filter(
            (inputFields: any) => inputFields.name === 'rechargeAmount'
        )[0];
    }

    const surchargeValue = useMemo(
        () => paymentState.paymentSummary.find(item => item.key === 'Platform fee'),
        [paymentState.paymentSummary]
    );

    function validateAmount(newAmount: string | number | null) {
        if (!newAmount || Number(newAmount) < 0) {
            return paymentState?.minimumAmount || 0;
        }
        let updatedAmount = Number(newAmount);

        if (paymentState?.minimumAmount && updatedAmount < paymentState?.minimumAmount) {
            updatedAmount = paymentState?.minimumAmount;
        } else if (paymentState?.maximumAmount && updatedAmount > paymentState?.maximumAmount) {
            updatedAmount = paymentState?.maximumAmount;
        }
        return updatedAmount;
    }

    const handleAmountChange = (newAmount: string | number | null) => {
        setAmount(newAmount);

        if (setIsInvalidAmount && newAmount && amountDetails?.multipleOf) {
            newAmount = Number(newAmount);
            if (newAmount % amountDetails.multipleOf !== 0) {
                setIsInvalidAmount(true);
            } else {
                setIsInvalidAmount(false);
            }
        }

        const updatedBillSummary = paymentState?.billSummary.map(item => {
            if (item.key === 'Amount') {
                return {
                    ...item,
                    value: Number(newAmount),
                };
            }
            return item;
        });
        let updatedBulkPaymentData: BulkPaymentData[] =
            paymentState?.payload?.bulkPaymentData || [];
        if (updatedBulkPaymentData.length === 1 && updatedBulkPaymentData[0]) {
            updatedBulkPaymentData = [
                {
                    ...updatedBulkPaymentData[0],
                    amount: Number(newAmount),
                },
            ];
        }
        dispatch(
            setPaymentData({
                ...paymentState,
                totalAmount: Number(newAmount) + Number(surchargeValue?.value!),
                payload: {
                    ...paymentState.payload,
                    amount: Number(newAmount),
                    bulkPaymentData: updatedBulkPaymentData,
                },
                billSummary: updatedBillSummary,
            })
        );
        setIsCashbackChecked!(false);
    };

    return (
        <Row>
            <Col span={16}>
                <Typography.Text className="text-sm sm:text-base font-normal">
                    {headName}
                </Typography.Text>
            </Col>
            <Col span={8}>
                {isInput ? (
                    <>
                        <InputNumber
                            controls={false}
                            value={amount}
                            placeholder="Please Enter the amount"
                            disabled={!isEditable}
                            maxLength={6}
                            onChange={e => handleAmountChange(e)}
                            onBlur={async () => {
                                setIsEditable(false);
                                const updatedAmount = validateAmount(amount);
                                const corporateCashback = await getEarningCashback({
                                    billAmount: Number(updatedAmount),
                                    accessKey: paymentState.payload?.accessKey!,
                                });
                                dispatch(
                                    setPaymentData({
                                        ...paymentState,
                                        earningCashbackAmount: corporateCashback,
                                    })
                                );
                            }}
                            addonAfter={
                                <EditOutlined
                                    onClick={() => setIsEditable(true)}
                                    className={`${isEditable ? 'text-black text-opacity-25 ' : 'text-black'}`}
                                />
                            }
                        />
                        {isInvalidAmount && amountDetails && (
                            <Typography.Text style={{ fontSize: '10px', color: 'red' }}>
                                Amount should be a multiple of {amountDetails.multipleOf}
                            </Typography.Text>
                        )}
                    </>
                ) : (
                    <Typography.Text className="text-sm sm:text-base font-medium">
                        {headName === 'Amount' || headName === 'Platform fee'
                            ? `AED ${formatNumberWithLocalString(value)}`
                            : value}
                    </Typography.Text>
                )}
            </Col>
        </Row>
    );
};

export default Summary;
