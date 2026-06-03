import { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';

import { GetLimitResponse } from '../../types';
import { BeneficiaryBulkBalance } from '../../types/bulkPayment';

interface bulkHelperProps {
    limitData?: GetLimitResponse;
}
export default function useBulkHelpers({ limitData }: bulkHelperProps) {
    const { bulkBalanceData } = useAppSelector(state => state.reducer.beneficiary);
    const { state } = useLocation();

    const [totalAmount, setTotalAmount] = useState(0);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [amounts, setAmounts] = useState<{ [key: number]: number }>({});
    const [inputValidity, setInputValidity] = useState<{ [key: number]: boolean }>({});
    const [inputTouched, setInputTouched] = useState<{ [key: number]: boolean }>({});

    const handleAmountChange = (recordId: number, amount: number) => {
        setInputTouched(prevTouched => ({
            ...prevTouched,
            [recordId]: true,
        }));
        if (!Number.isNaN(amount) && limitData) {
            setAmounts(prevAmounts => ({
                ...prevAmounts,
                [recordId]: amount,
            }));
            setInputValidity(prevValidity => ({
                ...prevValidity,
                [recordId]:
                    amount >= limitData.minDenomination && amount <= limitData.maxDenomination,
            }));
        } else {
            setAmounts(prevAmounts => {
                const updatedAmounts = { ...prevAmounts };
                delete updatedAmounts[recordId];
                return updatedAmounts;
            });
            setInputValidity(prevValidity => ({
                ...prevValidity,
                [recordId]: false,
            }));
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: (selectedRowKeys: React.Key[]) => {
            const selectedRowKeysArray = selectedRowKeys.map(key => Number(key));
            setSelectedRows(selectedRowKeysArray);
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < selectedRowKeys.length; i++) {
                const key = selectedRowKeys[i];
                const amount = amounts[Number(key)];
                if (limitData && amount && key) {
                    setInputValidity(prevValidity => ({
                        ...prevValidity,
                        [Number(key)]:
                            amount >= limitData.minDenomination &&
                            amount <= limitData.maxDenomination,
                    }));
                } else {
                    setInputValidity({});
                }
            }
        },
        onSelect: (record: BeneficiaryBulkBalance, selected: boolean) => {
            setInputTouched(prevTouched => ({
                ...prevTouched,
                [Number(record.key)]: selected,
            }));
        },
        onSelectAll: (selected: boolean, allSelectedRows: BeneficiaryBulkBalance[]) => {
            const updatedTouchedState = allSelectedRows.reduce(
                (touchedState: { [key: number]: boolean }, record) => {
                    touchedState[Number(record.key)] = selected;
                    return touchedState;
                },
                {}
            );
            setInputTouched(updatedTouchedState);
        },
        getCheckboxProps: (record: BeneficiaryBulkBalance) => ({
            disabled: !record.status,
            status: record.status,
        }),
    };
    const [searchValue, setSearchValue] = useState('');
    const [bulkBalanceDataArray, setBulkBalanceData] = useState(bulkBalanceData);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        if (value === '') {
            setBulkBalanceData(bulkBalanceData);
            return;
        }
        const searchString = value.trim().toLowerCase();
        const filteredData = bulkBalanceData.filter(item => {
            const { data } = item;
            return (
                data.name.toLowerCase().includes(searchString) ||
                data.accountNo.includes(searchString) ||
                data.optional1.toLowerCase().includes(searchString)
            );
        });
        setBulkBalanceData(filteredData);
    };

    useEffect(() => {
        const updatedAmounts = bulkBalanceData.reduce((acc: { [key: number]: number }, curr) => {
            if (curr.status && curr.data.id && curr.data.dueBalanceInAed) {
                acc[curr.data.id] = parseFloat(curr.data.dueBalanceInAed);
            }
            return acc;
        }, {});
        setAmounts(updatedAmounts);
        setBulkBalanceData(bulkBalanceData);
    }, [bulkBalanceData]);

    useEffect(() => {
        const total = selectedRows.reduce((acc, currRow) => acc + (amounts[currRow] || 0), 0);
        setTotalAmount(total);
    }, [selectedRows, amounts]);

    return {
        totalAmount,
        handleAmountChange,
        selectedRows,
        amounts,
        rowSelection,
        searchValue,
        bulkBalanceDataArray,
        handleSearch,
        inputValidity,
        inputTouched,
    };
}
