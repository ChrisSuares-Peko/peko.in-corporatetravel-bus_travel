import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';

import { CommonFileBuffer } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getFileBufferReportReturnedOrders, getReturnedOrders } from '../api/order';
import { TransactionInfo, getData, transactionResponse } from '../types/types';

const useReturnRequest = (payload: getData) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<TransactionInfo[]>();
    const getAllTableData = useCallback(async () => {
        setIsLoading(true);
        const data: transactionResponse | false = await getReturnedOrders({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data) {
            setTableData(data.data);
            setCount(data.recordsTotal);
        }
        setIsLoading(false);
    }, [id, payload, role]);

    const downloadReport = async (type: string) => {
        setIsLoading(true);
        const data: CommonFileBuffer | false = await getFileBufferReportReturnedOrders({
            userId: id,
            userType: role,
            type,
            ...payload,
        });
        if (data) {
            const arrayBuffer = new Uint8Array(data.buffer.data);

            // Convert ArrayBuffer to Blob
            const blob = new Blob([arrayBuffer], {
                type: data.fileType,
            });

            // Trigger download
            if (type === 'excel') {
                saveAs(blob, `Return Requests.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `Return Requests.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `Return Requests.pdf`);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getAllTableData();
    }, [getAllTableData]);

    return { isLoading, tableData, count, getAllTableData, downloadReport };
};

export default useReturnRequest;
