import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Image, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { SubscriptionBody } from '../../types/subscription';

interface ColumnsProps {
    handleActive: (SubscriptionId: number | string, isActive: any) => void;
    handleEdit: (record: SubscriptionBody) => void;
    handleConfirmation: (record: SubscriptionBody) => void;
}

const getSubscriptionColumns = ({
    handleActive,
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<SubscriptionBody> => [
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
        title: 'Image',
        dataIndex: 'image',
        key: 'image',
        render: image => (image ? <Image src={image} height={30} width={30} /> : 'N/A'),
    },
    {
        title: 'Name',
        sorter: true,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Description',
        sorter: true,
        dataIndex: 'description',
        key: 'description',
        width: '40%',
    },
    {
        title: 'Type',
        sorter: true,
        dataIndex: 'typeOfOrder',
        key: 'typeOfOrder',
        render: typeOfOrder =>
            typeOfOrder.charAt(0).toUpperCase() + typeOfOrder.slice(1).toLowerCase(),
    },
    // {
    //     title: 'Send mail',
    //     dataIndex: 'sendMail',
    //     key: 'sendMail',
    //     width:'10%',
    //     render: sendMail => <Switch checked={sendMail} size="small" />,
    // },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: SubscriptionBody) =>
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
        render: (_: any, record: SubscriptionBody) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'action',
        key: 'delete',
        render: (_: any, record: SubscriptionBody) => (
            <DeleteOutlined onClick={() => handleConfirmation(record)} />
        ),
    },
];

export default getSubscriptionColumns;
