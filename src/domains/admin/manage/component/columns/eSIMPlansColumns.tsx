import {
    CheckOutlined,
    CloseOutlined,
    // DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { EsimPlan } from '../../types/eSIM';

interface ColumnsProps {
    handleActive: (planId: number | undefined, isActive: any) => void;
    handleEdit: (record: EsimPlan) => void;
    handleConfirmation: (record: EsimPlan) => void;
}

const getEsimPlanColumns = ({
    handleActive,
    handleEdit,
    handleConfirmation,
}: ColumnsProps): ColumnsType<EsimPlan> => [
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
        title: 'Name',
        sorter: true,
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Data Pack',
        sorter: true,
        dataIndex: 'dataMBs',
        key: 'dataMBs',
        render: (dataMBs: any) => <Typography.Text>{dataMBs} MBs</Typography.Text>,
    },
    {
        title: 'Validity',
        sorter: true,
        dataIndex: 'periodDays',
        key: 'periodDays',
        render: (periodDays: any) => <Typography.Text>{periodDays} days</Typography.Text>,
        // width: '40%',
    },
    {
        title: 'Amount',
        sorter: true,
        dataIndex: 'amount',
        key: 'amount',
        render: (data: any) => `AED ${formatNumberWithLocalString(data)}`,
    },
    {
        title: 'Country',
        sorter: true,
        dataIndex: 'country',
        key: 'country',
    },

    {
        title: 'Status',
        sorter: true,
        dataIndex: 'status',
        key: 'status',
        render: (isActive: any, record: EsimPlan) =>
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
        render: (_: any, record: EsimPlan) => <EditOutlined onClick={() => handleEdit(record)} />,
    },
    // {
    //     title: 'Delete',
    //     dataIndex: 'action',
    //     key: 'delete',
    //     render: (_: any, record: EsimPlan) => (
    //         <DeleteOutlined onClick={() => handleConfirmation(record)} />
    //     ),
    // },
];

export default getEsimPlanColumns;
