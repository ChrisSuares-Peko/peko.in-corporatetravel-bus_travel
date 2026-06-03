import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { SubscriptionPlan } from '../../types/subscriptionPlans';
import { formatNumberWithLocalString } from '@utils/priceFormat';

interface ColumnsProps {
    handleActive: (SubscriptionId: number | string, isActive: any) => void;
    handleEdit: (record: SubscriptionPlan) => void;
    handleConfirmation: (record: SubscriptionPlan) => void;
}

const getSubscriptionPlansColumns = ({
    handleActive,
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<SubscriptionPlan> => [
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
        title: 'Plan Name',
        dataIndex: 'name',
        sorter: true,
        key: 'name',
    },
    {
        title: 'Software name',
        dataIndex: ['software', 'name'],
        key: 'software',
        sorter: true,
        render: software => software,
    },
    {
        title: 'Vendor Price',
        dataIndex: 'vendorPrice',
        sorter: true,
        key: 'vendorPrice',
        render: (vendorPrice: string) => `AED ${formatNumberWithLocalString(vendorPrice)}`,
    },
    {
        title: 'Customer Price',
        sorter: true,
        dataIndex: 'price',
        key: 'price',
        render: (price: string) => `AED ${formatNumberWithLocalString(price)}`,
    },
    {
        title: 'Validity',
        sorter: true,
        dataIndex: 'validity',
        key: 'validity',
    },
    {
        title: 'No of users',
        sorter: true,
        dataIndex: 'noOfUsers',
        key: 'noOfUsers',
        className: 'text-center',
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: SubscriptionPlan) =>
            isActive === 1 || isActive === true ? (
                <CheckOutlined
                    className="cursor-pointer text-textLime"
                    onClick={() => handleActive(record.id, record.status)}
                />
            ) : (
                <CloseOutlined
                    className="cursor-pointer text-brandColor"
                    onClick={() => handleActive(record.id, record.status)}
                />
            ),
    },
    {
        title: 'Edit',
        dataIndex: 'action',
        key: 'edit',
        render: (_: any, record: SubscriptionPlan) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'action',
        key: 'delete',
        render: (_: any, record: SubscriptionPlan) => (
            <DeleteOutlined onClick={() => handleConfirmation(record)} />
        ),
    },
];

export default getSubscriptionPlansColumns;
