import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { WorkspaceBody } from '../../types/workspace';
import { formatNumberWithLocalString } from '@utils/priceFormat';

interface ColumnsProps {
    handleActive: (connectId: number | string, isActive: any) => void;
    handleEdit: (record: WorkspaceBody) => void;
    handleConfirmation: (record: WorkspaceBody) => void;
}

const getWorkspaceColumns = ({
    handleActive,
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<WorkspaceBody> => [
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
        title: 'Workspace Name',
        sorter: true,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Monthly Price',
        sorter: true,
        dataIndex: 'monthlyPrice',
        key: 'monthlyPrice',
        render: (data: any) => `AED ${formatNumberWithLocalString(data)}`,
    },
    {
        title: 'Yearly Price',
        sorter: true,
        dataIndex: 'yearlyPrice',
        key: 'yearlyPrice',
        render: (data: any) => `AED ${formatNumberWithLocalString(data)}`,
    },
    {
        title: 'Workspace Address',
        sorter: true,
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Lat/Long',
        sorter: true,
        dataIndex: 'latLng',
        key: 'latLng',
    },
    {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        render: (url: string) => (
            <>
                {url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                        <EyeOutlined />
                    </a>
                ) : (
                    <EyeOutlined />
                )}
            </>
        ),
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: WorkspaceBody) =>
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
        render: (_: any, record: WorkspaceBody) => (
            <EditOutlined onClick={() => handleEdit(record)} />
        ),
    },
    {
        title: 'Delete',
        dataIndex: 'action',
        key: 'id',
        render: (_: any, record: WorkspaceBody) => (
            <DeleteOutlined onClick={() => handleConfirmation(record)} />
        ),
    },
];

export default getWorkspaceColumns;
