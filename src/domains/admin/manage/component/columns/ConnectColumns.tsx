import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { ConnectBody } from '../../types/connect';

interface ColumnsProps {
    handleActive: (connectId: number | string | undefined, isActive: any) => void;
    handleEdit: (record: ConnectBody) => void;
    handleConfirmation: (record: ConnectBody) => void;
}

const getConnectColumns = ({
    handleActive,
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<ConnectBody> => [
    {
        title: 'Date',
        sorter: true,
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt: any) => (
            <Flex vertical>
                <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Service Provider',
        sorter: true,
        dataIndex: 'serviceProvider',
        key: 'serviceProvider',
    },
    {
        title: 'Address',
        sorter: true,
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Category',
        sorter: true,
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Description',
        sorter: true,
        dataIndex: 'description',
        key: 'description',
        width: '40%',
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: ConnectBody) =>
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
        render: (_: any, record: ConnectBody) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'action',
        key: 'delete',
        render: (_: any, record: ConnectBody) => (
            <DeleteOutlined onClick={() => handleConfirmation(record)} />
        ),
    },
];

export default getConnectColumns;
