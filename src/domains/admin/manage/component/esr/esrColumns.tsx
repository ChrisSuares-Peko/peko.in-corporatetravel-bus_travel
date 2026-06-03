import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Flex, Typography } from 'antd';
import type { NavigateFunction } from 'react-router-dom'; // Correct import

import { paths } from '@src/routes/paths';
import { formattedDateOnly, formattedTime } from '@utils/dateFormat';

import { EsrRecord } from '../../types/ESR';

export const esrColumns = (handleEdit: (record: EsrRecord) => void, navigate: NavigateFunction) => [
    {
        title: 'Date',
        dataIndex: 'stageCreatedDate', // Updated to match the new data format
        sorter: true,
        key: 'stageCreatedDate',
        render: (stageCreatedDate: string) => (
            <Flex vertical>
                <Typography.Text>{formattedDateOnly(new Date(stageCreatedDate))}</Typography.Text>
                <Typography.Text>{formattedTime(new Date(stageCreatedDate))}</Typography.Text>
            </Flex>
        ),
    },
    {
        title: 'Company Name',
        sorter: true,
        dataIndex: 'companyName', // Matches the provided data format
        key: 'companyName',
        render: (companyName: string) => <Typography.Text>{companyName || '-'}</Typography.Text>,
    },
    {
        title: 'Stage No.',
        dataIndex: 'stageNo', // Updated to match the new data format
        key: 'stageNo',
        render: (stageNo: number) => <Typography.Text>{stageNo || '-'}</Typography.Text>,
    },
    {
        title: 'Service Name',
        sorter: true,
        dataIndex: 'stageTitle', // Assuming this structure is part of EsrRecord
        render: (stageTitle: string) => <Typography.Text>{stageTitle || '-'}</Typography.Text>,
    },
    {
        title: 'Fiscal Year',
        dataIndex: 'fiscalYear', // Matches the provided data format
        sorter: true,
        key: 'fiscalYear',
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
        dataIndex: 'logo', // Assuming this field exists; adjust if needed
        key: 'logo',
        render: (url: string, record: EsrRecord) => (
            <>
                {url ? (
                    <a href={url} target="_blank" rel="noreferrer">
                        <EyeOutlined />
                    </a>
                ) : (
                    <Flex justify="start">
                        <EditOutlined onClick={() => handleEdit(record)} />
                        {record.stageNo === '1' && (
                            <EyeOutlined
                                className="ms-3"
                                onClick={() =>
                                    navigate(paths.systemUser.esrView, {
                                        state: {
                                            docId: record.registrationId,
                                            stageId: record.stageNo,
                                        },
                                    })
                                }
                            />
                        )}
                    </Flex>
                )}
            </>
        ),
    },
];
