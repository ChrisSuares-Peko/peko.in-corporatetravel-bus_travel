import { useState, type FC } from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Flex, Pagination, Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import useFileDownloader from '@src/hooks/useFileDownloader';
import { paths } from '@src/routes/paths';
import { formattedDateTime } from '@utils/dateFormat';

import SignersBadges from './SignersBadges';
import StatusBadge from './StatusBadge';
import { useESignDocument } from '../../hooks/useESignDocument';
import useESignHistory from '../../hooks/useESignHistory';
import { setESignDocData } from '../../slices/eSignDocSlice';
import { HistoryTableItem, SignerInfo } from '../../types';

interface TableProps {
    searchText: string;
}

const TableBody: FC<TableProps> = ({ searchText }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const { handleDownloadLink } = useFileDownloader();
    const { tableData, isLoading, count } = useESignHistory({
        searchText,
        pageSize,
        page: currentPage,
    });
    const { isLoading: l2, getOrderDetails } = useESignDocument();
    // const handleViewDetails = (record: HistoryTableItem) => {
    //     const { expiry_date } = record;
    //     let formattedDate = undefined
    //     if (expiry_date) {
    //         // Convert date from DD-MM-YYYY to YYYY-MM-DD
    //         const [day, month, year] = expiry_date.split('-');
    //         formattedDate = `${year}-${month}-${day}`;
    //     }
    //     dispatch(setESignDocData({ ...record, expiry_date: formattedDate, isDisabled: true }));
    //     navigate(`${paths.eSign.viewPage}`);
    // }

    const columns = [
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => (
                <Typography.Text className="text-nowrap">
                    {formattedDateTime(new Date(createdAt))}
                </Typography.Text>
            ),
        },
        {
            title: 'Document Name',
            dataIndex: 'docket_title',
            key: 'docket_title',
        },
        {
            title: 'Signers Name',
            dataIndex: 'signers_info',
            key: 'signers_info',
            render: (signers_info: [SignerInfo]) => <SignersBadges signers_info={signers_info} />,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <StatusBadge status={status} />,
        },
        {
            title: <Flex justify="center">Actions</Flex>,
            dataIndex: 'document_url',
            key: 'document_url',
            render: (document_url: string, record: HistoryTableItem) => (
                <Flex align="center" gap={10}>
                    {record.status === 'COMPLETED' && record?.document_url !== null ? (
                        <Button
                            className="text-green-600 hover:!text-green-700"
                            type="link"
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownloadLink(document_url)}
                        >
                            {' '}
                            Download
                        </Button>
                    ) : (
                        <Button disabled type="link" icon={<DownloadOutlined />}>
                            {' '}
                            Download
                        </Button>
                    )}
                    <Flex
                        onClick={async () => {
                            dispatch(setESignDocData({ id: record.id, isDisabled: true }));
                            navigate(`${paths.eSign.viewPage}`);
                        }}
                        className="text-green-600 cursor-pointer hover:text-green-700"
                    >
                        View
                    </Flex>
                </Flex>
            ),
        },
        // ,
        // {
        //     title: '',
        //     dataIndex: 'id',
        //     key: 'id',
        //     render: (id: number, record: HistoryTableItem) =>
        //         <Flex onClick={() => getOrderDetails(id)} className='text-green-600 cursor-pointer hover:text-green-700'>View</Flex>
        // }
    ];
    return (
        <>
            <Table
                scroll={{ x: 756 }}
                loading={isLoading || l2}
                dataSource={tableData}
                columns={columns}
                pagination={false}
            />
            <Pagination
                className="mt-3 text-center sm:mt-10 sm:text-end"
                total={count}
                current={currentPage}
                defaultPageSize={pageSize}
                onChange={(page, pageSize2) => {
                    setCurrentPage(page);
                    setPageSize(pageSize2);
                }}
            />
        </>
    );
};

export default TableBody;
