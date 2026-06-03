import { DownloadOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { ActiveSubscription, Package } from '../../types/subscription';

const getPurchaseHistoryColumns = (
    handleDownloadInvoice: any,
    loadingRows: any
): ColumnsType<ActiveSubscription> => [
    {
        key: 'id',
        title: 'Invoice ID',
        dataIndex: 'id',
    },
    {
        key: 'subscriptionStartDate',
        title: 'Billing Date',
        dataIndex: 'subscriptionStartDate',
        render: (date: Date) => formattedDateOnly(new Date(date)),
    },
    {
        key: 'package',
        title: 'Plan',
        dataIndex: 'package',
        render: (data: Package) => data.packageName,
    },
    {
        key: 'subscriptionAmountPaid',
        title: 'Amount',
        dataIndex: 'subscriptionAmountPaid',
        render: (amount: number) => `AED ${formatNumberWithLocalString(amount)}`,
    },
    {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        render: (text: string) => (
            <span className={`${text === 'ACTIVE' ? 'text-textGreen' : 'text-bgOrange2'}`}>
                {text}
            </span>
        ),
    },
    {
        key: 'details',
        title: 'Details',
        dataIndex: 'id',
        render: (invoiceId: string) => (
            <span
                tabIndex={0}
                role="button"
                onClick={() => handleDownloadInvoice(invoiceId)}
                aria-disabled={loadingRows[invoiceId]}
                onKeyDown={(event: React.KeyboardEvent<HTMLSpanElement>) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        handleDownloadInvoice(invoiceId);
                    }
                }}
                className="text-bgOrange2"
                aria-label={`Download invoice for transaction ID ${invoiceId}`}
            >
                {loadingRows[invoiceId] ? (
                    <Spin size="small" className="text-xs pe-3" />
                ) : (
                    <DownloadOutlined className="text-xs pe-2" />
                )}
                {loadingRows[invoiceId] ? 'Downloading...' : 'Download Invoice'}
                {/* Download Invoice */}
            </span>
        ),
    },
];

export default getPurchaseHistoryColumns;
