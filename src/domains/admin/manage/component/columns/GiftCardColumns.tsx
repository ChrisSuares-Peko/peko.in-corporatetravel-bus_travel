import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { GiftCardsBody } from '../../types/giftCards';

interface ColumnsProps {
    handleActive: (connectId: number | string, isActive: any) => void;
    handleEdit: (record: GiftCardsBody) => void;
}

const getGiftCardsColumns = ({
    handleActive,
    handleEdit,
}: ColumnsProps): ColumnsType<GiftCardsBody> => [
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
        title: 'Name',
        sorter: true,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Price Type',
        sorter: true,
        dataIndex: 'priceType',
        key: 'priceType',
    },
    {
        title: 'Price Range',
        dataIndex: ['denominations', 'minDenomination'],
        sorter: true,
        key: 'denominations',
        render: (_: any, record: GiftCardsBody) => (
            <Typography.Text>{`Min: ${record.minDenomination} - Max: ${record.maxDenomination}`}</Typography.Text>
        ),
    },
    {
        title: 'Currency',
        sorter: true,
        dataIndex: 'currency',
        key: 'currency',
    },
    {
        title: 'Vendor',
        sorter: true,
        dataIndex: ['serviceOperator', 'id'],
        key: 'serviceOperatorId',
        render: (_: any, record: GiftCardsBody) => (
            <Typography.Text>{`${record?.serviceOperator?.serviceProvider ?? 'N/A'}`}</Typography.Text>
        ),
        hidden: false,
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: GiftCardsBody) =>
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
        key: 'id',
        render: (_: any, record: GiftCardsBody) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
];

export default getGiftCardsColumns;
