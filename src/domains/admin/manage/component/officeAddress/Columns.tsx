import {
    CheckOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Link } from 'react-router-dom';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { PlanBody } from '../../types/plans';

import { formatNumberWithLocalString } from '@utils/priceFormat';

interface ColumnsProps {
    handleActive: (connectId: number | string, isActive: any) => void;
    handleEdit: (record: PlanBody) => void;
    handleConfirmation: (record: PlanBody) => void;
}

const getPlanColumns = ({
    handleActive,
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<PlanBody> => [
    {
        title: 'Date',
        dataIndex: 'createdAt',
        sorter: true,
        key: 'createdAt',
        render: (createdAt: any) => (
            <Flex vertical>
                <Typography.Text className="text-nowrap">
                    {formattedDateOnly(new Date(createdAt))}
                </Typography.Text>
                <Typography.Text>{formattedTime(new Date(createdAt))}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Plan Name',
        sorter: true,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Plan Price',
        sorter: true,
        dataIndex: 'price',
        key: 'price',
        render: (data: any) => `AED ${formatNumberWithLocalString(data)}`,
    },
    {
        title: 'Description',
        sorter: true,
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Highlights',
        sorter: true,
        dataIndex: 'highlights',
        key: 'highlights',
    },
    {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        render: (logo: any) => {
            if (!logo) return 'N/A';
            return (
                <Link to={logo} target="_blank" rel="noopener noreferrer">
                    <EyeOutlined />
                </Link>
            );
        },
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: PlanBody) =>
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
        render: (_: any, record: PlanBody) => <EditOutlined onClick={() => handleEdit(record)} />,
    },
    {
        title: 'Delete',
        dataIndex: 'action',
        key: 'id',
        render: (_: any, record: PlanBody) => (
            <DeleteOutlined onClick={() => handleConfirmation(record)} />
        ),
    },
];

export default getPlanColumns;
