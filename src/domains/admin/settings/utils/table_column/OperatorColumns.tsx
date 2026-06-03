import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString, formatNumberWithoutCommas } from '@utils/priceFormat';

import { serviceOperator } from '../../types/serviceOperator';

interface ColumnsProps {
    handleActive: (operatorId: number | string, isActive: any) => void;
    handleEdit: (record: serviceOperator) => void;
}

const getOperatorColumns = ({
    handleActive,
    handleEdit,
}: ColumnsProps): ColumnsType<serviceOperator> => [
    {
        title: 'Date',
        dataIndex: 'createdAt',
        sorter: true,
        key: 'createdAt',
        render: (createdAt: any) => (
            <Flex vertical>
                <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Operator Name',
        sorter: true,
        dataIndex: 'serviceProvider',
        key: 'serviceProvider',
    },
    {
        title: 'Access Key',
        dataIndex: 'accessKey',
        sorter: true,
        key: 'accessKey',
    },
    {
        title: 'Service Category',
        sorter: true,
        dataIndex: 'serviceCategory',
        key: 'serviceCategory',
    },
    {
        title: 'Commission Type',
        sorter: true,
        dataIndex: 'commissionType',
        key: 'commissionType',
    },
    {
        title: 'Commission',
        sorter: true,
        dataIndex: 'providerCommission',
        key: 'providerCommission',
        render: (providerCommission, record: any) => (
            <Typography.Text>
                {record.commissionType === 'PERCENTAGE'
                    ? `${formatNumberWithoutCommas(providerCommission)} %`
                    : `AED ${formatNumberWithLocalString(providerCommission)}`}
            </Typography.Text>
        ),
    },
    {
        title: 'Vendor Name',
        sorter: true,
        dataIndex: ['vendor', 'vendorName'],
        key: 'vendorName',
        render: (_: any, data: any) => data?.vendor.vendorName || '-',
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'serviceStatus',
        key: 'serviceStatus',
        render: (isActive: any, record: serviceOperator) =>
            isActive === 1 || isActive === true ? (
                <CheckOutlined
                    className="cursor-pointer text-textLime"
                    onClick={() => handleActive(record.id!, record.serviceStatus)}
                />
            ) : (
                <CloseOutlined
                    className="cursor-pointer text-brandColor"
                    onClick={() => handleActive(record.id!, record.serviceStatus)}
                />
            ),
    },
    {
        title: 'Edit',
        dataIndex: 'action',
        key: 'id',
        render: (_: any, record: serviceOperator) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
];

export default getOperatorColumns;
