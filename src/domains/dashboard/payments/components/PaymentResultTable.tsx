import React from 'react';

import { Descriptions } from 'antd';
import Moment from 'moment';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { PaymentResultTableProps } from '../types';

const PaymentResultTable: React.FC<PaymentResultTableProps> = ({ paymentData }) => {
    const formattedDateTime = Moment(paymentData?.transactionDate).format(
        'MMMM DD YYYY hh:mm:ss a'
    );
    return (
        <Descriptions bordered size="middle" column={1} className="lg:w-2/3 pg-success-table">
            <Descriptions.Item label="Date">{formattedDateTime}</Descriptions.Item>
            <Descriptions.Item label="Transaction ID">
                {paymentData?.corporateTxnId}
            </Descriptions.Item>
            <Descriptions.Item label="Service">{paymentData?.serviceProvider}</Descriptions.Item>
            <Descriptions.Item label="Paid Amount">{`AED ${formatNumberWithLocalString(paymentData?.amount)}`}</Descriptions.Item>
            <Descriptions.Item label="Payment Mode" className="capitalize">
                {paymentData?.paymentMode?.toLowerCase()}
            </Descriptions.Item>
        </Descriptions>
    );
};
export default PaymentResultTable;
