import React from 'react';

import { Flex, Pagination, TableProps, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import GenericTable from '@components/atomic/GenericTable';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import { setEsimDetails } from '../../slice/esimSlice';

type Props = {
    data: any;
    setCurrentPage: (num: number) => void;
    totalRecord: number;
    isLoading: boolean;
};

const OrderTable = ({ data, setCurrentPage, totalRecord, isLoading }: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleGetEsimDetails = (id: string, iccid: string) => {
        dispatch(setEsimDetails({ id, iccid }));
        navigate(`${paths.esim.esimDetails}`);
    };

    const columns: TableProps<any>['columns'] = [
        {
            title: 'Order Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date: string) => formattedDateTime(new Date(date)),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        // {
        //     title: 'Plan',
        //     dataIndex: 'plan',
        //     key: 'plan',
        // },
        {
            title: 'ICCID No.',
            dataIndex: 'iccid',
            key: 'iccid',
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (text: string) => (
                <Typography.Text className="capitalize">{text}</Typography.Text>
            ),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amt: string) => (
                <Typography.Text>AED {Number(amt).toFixed(2)}</Typography.Text>
            ),
        },
        // {
        //     title: 'Action',
        //     key: 'id',
        //     dataIndex: 'id',
        //     render: (text, record: any) => (
        //         <Flex vertical>
        //             {record?.iccid.map((ele: string, i: number) => (
        //                 <Typography.Text
        //                     key={i}
        //                     className="text-red-500 cursor-pointer"
        //                     onClick={() => handleGetEsimDetails(record.id, ele)}
        //                 >
        //                     View eSIM {record.iccid.length !== 1 && i + 1}
        //                 </Typography.Text>
        //             ))}
        //         </Flex>
        //     ),
        // },
    ];

    return (
        <Flex vertical>
            <GenericTable
                rowKey={record => record.id}
                bordered={false}
                className="w-full mt-8"
                columns={columns}
                dataSource={data || []}
                pagination={false}
                loading={isLoading}
            />

            <Pagination
                className="sm:text-end text-center mt-10"
                defaultPageSize={10}
                defaultCurrent={1}
                size="small"
                total={totalRecord}
                onChange={(pageCount, pageSize) => {
                    setCurrentPage(pageCount);
                }}
            />
        </Flex>
    );
};

export default OrderTable;
