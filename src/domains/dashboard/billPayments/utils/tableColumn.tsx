import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Flex, Input, Space, Switch, TableProps, Typography } from 'antd';

import { formatNumberWithLocalString } from '@utils/priceFormat';

import { Beneficiary, GetLimitResponse } from '../types';
import { BeneficiaryBulkBalance } from '../types/bulkPayment';

export const beneficiaryTableColumn = (
    handleEditClick: (beneficiary: Beneficiary) => void,
    handleDeleteClick: (beneficiary: Beneficiary) => void,
    handleStatus: (beneficiary: Beneficiary) => void
): TableProps<Beneficiary>['columns'] => [
    {
        title: <Typography.Text className="text-xs sm:text-base">Beneficiary Name</Typography.Text>,
        dataIndex: 'name',
        key: 'name',
        width: '40%',
        render: text => <Typography.Text className="text-xs sm:text-sm">{text}</Typography.Text>,
    },
    {
        title: <Typography.Text className="text-xs sm:text-base">Account Number</Typography.Text>,
        dataIndex: 'accountNo',
        key: 'accountNo',
        width: '40%',
        render: accountNo => (
            <Typography.Text className="text-xs sm:text-sm">{accountNo}</Typography.Text>
        ),
    },
    {
        title: <Typography.Text className="text-xs sm:text-base">Action</Typography.Text>,
        dataIndex: 'edit',
        key: 'edit',
        width: '20%',
        align: 'center',
        render: (_, record) => (
            <Space align="center">
                <Switch
                    className="mb-1"
                    size="small"
                    checked={record.isActive}
                    onChange={() => handleStatus(record)}
                />
                <EditOutlined className="text-bgOrange2" onClick={() => handleEditClick(record)} />
                <DeleteOutlined
                    className="text-bgOrange2"
                    onClick={() => handleDeleteClick(record)}
                />
            </Space>
        ),
    },
];

export const beneficiaryBalanceColumn = (
    amounts: { [key: string]: number },
    handleAmountChange: (recordId: number, amount: number) => void,
    inputValidity: { [key: number]: boolean },
    inputTouched: { [key: number]: boolean },
    screens: any,
    limitData?: GetLimitResponse
): TableProps<BeneficiaryBulkBalance>['columns'] => {
    const columns: TableProps<BeneficiaryBulkBalance>['columns'] = [];
    const handleKeyPress = (e: { charCode: any; keyCode: any; preventDefault: () => void }) => {
        const charCode = e.charCode || e.keyCode;
        if (charCode < 48 || charCode > 57) {
            e.preventDefault();
        }
    };

    if (screens.xs) {
        columns.push(
            {
                title: (
                    <Typography.Text className="text-xs sm:text-base">
                        Beneficiary Name
                    </Typography.Text>
                ),
                dataIndex: 'beneficiaryName',
                key: 'beneficiaryName',
                width: '50%',
                render: (_, record) => (
                    <Flex vertical gap={10}>
                        <Typography.Text className="text-xs">{record.data.name}</Typography.Text>
                        <Typography.Text className="text-xs">
                            {record.data.accountNo}
                        </Typography.Text>
                        {limitData?.accessKey === 'etisalat_bill' && (
                            <Typography.Text className="text-xs">
                                {record.data.optional1 ?? ''}
                            </Typography.Text>
                        )}
                    </Flex>
                ),
            },
            {
                title: <Typography.Text className="text-xs">Bill Amount</Typography.Text>,
                dataIndex: 'billAmount',
                key: 'billAmount',
                width: '50%',
                render: (billAmount, record) =>
                    record.status ? (
                        <Flex vertical gap={10}>
                            <Input
                                value={amounts[record.data.id]}
                                onChange={e =>
                                    handleAmountChange(record.data.id, parseFloat(e.target.value))
                                }
                                maxLength={5}
                                className={`w-full md:w-2/3 xl:w-2/6 rounded ${!inputValidity[record.data.id] && inputTouched[record.data.id] ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {limitData && (
                                <Typography.Text
                                    className={`text-xs ${!inputValidity[record.data.id] && inputTouched[record.data.id] ? 'text-red-500' : ''}`}
                                >
                                    Minimum: AED{' '}
                                    {formatNumberWithLocalString(limitData?.minDenomination || 0)}{' '}
                                    Maximum: AED
                                    {formatNumberWithLocalString(limitData.maxDenomination)}{' '}
                                </Typography.Text>
                            )}
                        </Flex>
                    ) : (
                        <Typography.Text>{record.message}</Typography.Text>
                    ),
            }
        );
    } else {
        columns.push(
            {
                title: 'Beneficiary Name',
                dataIndex: 'beneficiaryName',
                key: 'beneficiaryName',
                width: '20%',
                render: (_, record) => <Typography.Text>{record.data.name}</Typography.Text>,
            },
            {
                title: 'Account Number',
                dataIndex: 'accountNo',
                key: 'accountNo',
                width: '20%',
                render: (_, record) => record.data.accountNo,
            }
        );

        if (limitData?.accessKey === 'etisalat_bill') {
            columns.push({
                title: 'Service Type',
                dataIndex: 'serviceType',
                key: 'serviceType',
                width: '20%',
                render: (_, record) => record.data.optional1 ?? '',
            });
        }

        columns.push({
            title: 'Bill Amount',
            dataIndex: 'billAmount',
            key: 'billAmount',
            width: '40%',
            render: (billAmount, record) =>
                record.status ? (
                    <Flex vertical gap={10}>
                        <Input
                            value={amounts[record.data.id]}
                            onChange={e =>
                                handleAmountChange(record.data.id, parseFloat(e.target.value))
                            }
                            onKeyPress={handleKeyPress}
                            maxLength={5}
                            className={`w-full md:w-2/3 xl:w-2/6 rounded ${!inputValidity[record.data.id] && inputTouched[record.data.id] ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {limitData && (
                            <Typography.Text
                                className={`text-xs ${!inputValidity[record.data.id] && inputTouched[record.data.id] ? 'text-red-500' : ''}`}
                            >
                                {` Min: AED ${formatNumberWithLocalString(limitData?.minDenomination || 0)} and Max: AED ${formatNumberWithLocalString(limitData?.maxDenomination || 0)}`}
                            </Typography.Text>
                        )}
                    </Flex>
                ) : (
                    <Typography.Text>{record.message}</Typography.Text>
                ),
        });
    }

    return columns;
};
