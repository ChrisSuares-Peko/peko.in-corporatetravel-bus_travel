import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';

import { CommonFileBuffer } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { getAllData, getFileBufferReport, refundApi } from '../api/airline';
import { getData } from '../types';
import { Booking, airlineDataResponse } from '../types/airline';

const useAirline = (payload: getData) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<Booking[]>();
    const getAllTableData = useCallback(async () => {
        setIsLoading(true);
        const data: airlineDataResponse | false = await getAllData({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data) {
            setTableData(data.bookings);
            setCount(data.count);
        }
        setIsLoading(false);
    }, [id, payload, role]);
    useEffect(() => {
        getAllTableData();
    }, [getAllTableData]);

    const downloadReport = async (type: string) => {
        setIsLoading(true);
        const data: CommonFileBuffer | false = await getFileBufferReport({
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
                saveAs(blob, `eSign.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `eSign.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `eSign.pdf`);
            }
        }
        setIsLoading(false);
    };
    const refundAmount = async (payload2: any): Promise<boolean> => {
        setModalLoading(true);
        // Define the type for the response from refundApi
        const data: any | false = await refundApi({
            userId: id,
            userType: role,
            ...payload2,
        });

        setModalLoading(false);
        if (data) {
            return true;
        }

        return false;
    };

    return {
        isLoading,
        modalLoading,
        tableData,
        count,
        downloadReport,
        getAllTableData,
        refundAmount,
    };
};

export default useAirline;
