import { CheckOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { Vendor } from '../../types/vendors';

interface ColumnsProps {
    handleActive: (connectId: number | string, isActive: any) => void;
    handleEdit: (record: Vendor) => void;
}

const getVendorColumns = ({ handleActive, handleEdit }: ColumnsProps): ColumnsType<Vendor> => [
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
        title: 'Vendor Name',
        sorter: true,
        dataIndex: 'vendorName',
        key: 'vendorName',
    },
    {
        title: 'API URL',
        sorter: true,
        dataIndex: 'apiUrl',
        key: 'apiUrl',
    },
    {
        title: 'Health URL',
        sorter: true,
        dataIndex: 'healthUrl',
        key: 'healthUrl',
    },
    // {
    //     title: 'Vendor Email',
    //     sorter: true,
    //     dataIndex: 'vendorEmail',
    //     key: 'vendorEmail',
    // },
    {
        title: 'Type',
        sorter: true,
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Status',
        sorter: true,
        dataIndex: 'isActive',
        key: 'isActive',
        render: (isActive: any, record: Vendor) =>
            isActive === 1 || isActive === true ? (
                <CheckOutlined
                    className="cursor-pointer text-textLime"
                    onClick={() => handleActive(record.id, record.isActive)}
                />
            ) : (
                <CloseOutlined
                    className="cursor-pointer text-brandColor"
                    onClick={() => handleActive(record.id, record.isActive)}
                />
            ),
    },
    {
        title: 'Edit',
        dataIndex: 'action',
        key: 'id',
        render: (_: any, record: Vendor) => <EditOutlined onClick={() => handleEdit(record)} />,
    },
];

export default getVendorColumns;
