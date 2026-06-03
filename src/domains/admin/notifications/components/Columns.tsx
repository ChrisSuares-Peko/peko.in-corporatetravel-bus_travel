import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { NotificationData } from '../types';

interface ColumnsProps {
    handleEdit: (record: NotificationData) => void;
    handleConfirmation: (record: NotificationData) => void;
}

const getNotificationsColumns = ({
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<NotificationData> => [
    {
        title: 'Notification Date',
        sorter: true,
        dataIndex: 'createdAt',
        key: 'date',
        render: (createdAt: any) => (
            <Flex vertical>
                <Typography.Text>{formattedDateOnly(new Date(createdAt))}</Typography.Text>
                <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Notification Title',
        sorter: true,
        dataIndex: 'notificationTitle',
        key: 'notificationTitle',
    },
    {
        title: 'Notification Brief',
        sorter: true,
        dataIndex: 'notificationBrief',
        key: 'notificationBrief',
    },
    {
        title: 'Notification Category',
        sorter: true,
        dataIndex: 'notificationCategory',
        key: 'notificationCategory',
    },
    {
        title: 'Notification To',
        sorter: true,
        dataIndex: 'notificationTo',
        key: 'notificationTo',
    },
    {
        title: 'Edit',
        dataIndex: 'action',
        key: 'id',
        render: (_: any, record: NotificationData) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'action',
        key: 'id',
        render: (_: any, record: NotificationData) => (
            <DeleteOutlined onClick={() => handleConfirmation(record)} />
        ),
    },
];

export default getNotificationsColumns;
