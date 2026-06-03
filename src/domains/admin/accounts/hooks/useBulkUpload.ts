import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getAllData, getOtpData, sentBulkData } from '../api/bulkRefund';
import { Transaction, getData, BulkDataRespone, payloadData } from '../types/bulkRefund';

const useBulkUpload = (payload: getData) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loader, setLoader] = useState(false);
    const [otpLoader, setOtpLoader] = useState(false);
    const [tableData, setTableData] = useState<Transaction[]>();
    const getDataFromApi = useCallback(async () => {
        setIsLoading(true);
        const data: BulkDataRespone | false = await getAllData({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data) {
            setTableData(data.rows);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, payload, role]);

    const getOtp = useCallback(async () => {
        setOtpLoader(true);
        const data: BulkDataRespone | false = await getOtpData({
            userId: id,
            userType: role,
        });
        if (data) {
            setOtpLoader(false);
            return true;
        }
        setOtpLoader(false);
        return false;
    }, [id, role]);

    const bulkPaymentApi = useCallback(
        async (payloaData: payloadData) => {
            setLoader(true);
            const data: BulkDataRespone | false = await sentBulkData({
                userId: id,
                userType: role,
                ...payloaData,
            });
            if (data) {
                setLoader(false);
                setRefresh(true);
                return true;
            }
            setLoader(false);
            return false;
        },
        [id, role]
    );

    useEffect(() => {
        getDataFromApi();
    }, [getDataFromApi, refresh]);

    return { isLoading, tableData, getOtp, bulkPaymentApi, loader, otpLoader };
};

export default useBulkUpload;
