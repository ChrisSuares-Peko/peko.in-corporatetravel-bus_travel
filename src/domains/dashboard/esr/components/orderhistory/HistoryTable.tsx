import { useState, type FC } from 'react';

import { EyeOutlined } from '@ant-design/icons';
import { Pagination, Table, Typography, Space, Flex } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';
import { formattedDateTime } from '@utils/dateFormat';

import DownloadStageData from '../../hooks/DownloadStageData';
import useFetchEsrHistory from '../../hooks/useFetchEsrHistory';
import { ESRRecord } from '../../types';

interface HistoryTableProps {
    searchText: string;
}

const HistoryTable: FC<HistoryTableProps> = ({ searchText }: HistoryTableProps) => {
    const [filter, setFilters] = useState({
        searchText,
        page: 1,
        itemsPerPage: 10,
        sort: 'DESC' as 'ASC' | 'DESC',
        sortField: '',
    });

    const { data, count, isLoading } = useFetchEsrHistory(filter);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { getStageDetails, loader } = DownloadStageData();

    const handleDownloadStageData = async (stageId: number, fiscalYear: string) => {
        await getStageDetails(stageId, fiscalYear);
    };
    const columns = [
        {
            title: 'Date',
            dataIndex: 'stageCreatedDate',
            key: 'stageCreatedDate',
            render: (date: string) =>
                data ? (
                    <Typography.Text>{formattedDateTime(new Date(date))}</Typography.Text>
                ) : (
                    'N/A'
                ),
        },
        {
            title: 'Stage No.',
            dataIndex: 'stageNo',
            key: 'stageNo',
            render: (text: string) => (
                <Typography.Text>{text ? `Stage ${text}` : '-'}</Typography.Text>
            ),
        },
        {
            title: 'Service Name',
            dataIndex: 'stageTitle',
            key: 'stageTitle',
            render: (companyName: any) => <Typography.Text>{companyName || '-'}</Typography.Text>,
        },
        {
            title: 'Fiscal Year',
            dataIndex: 'fiscalYear',
            key: 'fiscalYear',
            width: '10',
            render: (text: string) => (
                <Typography.Text>{`${Number(text)} - ${Number(text) + 1}` || '-'}</Typography.Text>
            ),
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            sorter: true,
            key: 'remarks',
            render: (text: string) => (
                <Typography.Paragraph className="max-w-96 line-clamp-1 hover:line-clamp-none hover:text-red-500 w-52">
                    {text || 'N/A'}
                </Typography.Paragraph>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                // Define color mapping for each status
                const statusColors: Record<string, { background: string; text: string }> = {
                    pending: {
                        background: '#CCE5FF',
                        text: '#0056b3',
                    },
                    'in progress': {
                        background: '#FFFBCC',
                        text: '#C89C00',
                    },
                    completed: {
                        background: '#E0FFE0',
                        text: '#027A48',
                    },
                    resubmit: {
                        background: '#FFCCCC',
                        text: '#CC0000',
                    },
                };
                // Get the colors for the current status, with default values
                const { background, text } = statusColors[status.toLowerCase()] || {
                    background: '#E0E0E0', // default background color
                    text: '#000', // default text color
                };

                return (
                    <Typography.Text
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            backgroundColor: background,
                            padding: '4px 8px',
                            borderRadius: '4px',
                            color: text,
                        }}
                        className="capitalize"
                    >
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: text,
                                marginRight: '8px',
                            }}
                        />
                        {status?.toLowerCase() || 'status'}
                    </Typography.Text>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: ESRRecord) => (
                <Flex justify="space-between">
                    {status === 'Completed' ? (
                        <Flex justify="space-between">
                            <Space size="middle">
                                {record.stageNo === '1' && (
                                    <EyeOutlined
                                        onClick={() => {
                                            navigate(
                                                `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.stageView}`,
                                                {
                                                    state: {
                                                        fiscalYear: record.fiscalYear,
                                                        stageId: record.stageNo,
                                                    },
                                                }
                                            );
                                        }}
                                    />
                                )}
                            </Space>
                        </Flex>
                    ) : (
                        <Flex justify="space-between">
                            <Space size="middle">
                                {record.stageNo === '1' && (
                                    <EyeOutlined
                                        onClick={() => {
                                            if (record.status === 'Pending') {
                                                dispatch(
                                                    showToast({
                                                        description: 'View is not available',
                                                        variant: 'error',
                                                    })
                                                );
                                            } else {
                                                navigate(
                                                    `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.stageView}`,
                                                    {
                                                        state: {
                                                            fiscalYear: record.fiscalYear,
                                                            stageId: record.stageNo,
                                                        },
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                )}
                            </Space>
                        </Flex>
                    )}
                </Flex>
            ),
        },
    ];

    const handlePageChange = (page: number) => {
        setFilters(prevFilter => ({
            ...prevFilter,
            page,
        }));
    };
    return (
        <>
            <Table
                scroll={{ x: 756 }}
                dataSource={data}
                columns={columns}
                loading={isLoading || loader}
                pagination={false}
                rowKey={record => Math.random()}
            />
            <Pagination
                className="mt-3 text-center sm:mt-10 sm:text-end"
                total={count}
                current={filter.page}
                defaultPageSize={filter.itemsPerPage}
                onChange={handlePageChange}
            />
        </>
    );
};

export default HistoryTable;
