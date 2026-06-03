import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';

import { CommonFileBuffer } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    deleteCode,
    getAllData,
    getFileBufferReport,
    updateCurrentStatus,
} from '../api/refferalCode';
import {
    ReferalResponse,
    Referral,
    activeResponse,
    getData,
    updateStatus,
} from '../types/refferalCode';

const useGetRefaralCodes = (payload: getData) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<Referral[]>();
    const dispatch = useDispatch();
    const getDataFromApi = useCallback(async () => {
        setIsLoading(true);
        const data: ReferalResponse | false = await getAllData({
            userId: id,
            userType: role,
            ...payload,
        });
        if (data) {
            setTableData(data.data);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, role, payload]);

    const updateActiveStatus = useCallback(
        async ({ referalId, status }: updateStatus) => {
            setIsLoading(true);
            const data: activeResponse | false = await updateCurrentStatus({
                userId: id,
                userType: role,
                referalId,
                status,
            });
            if (data) {
                setRefresh(true);
            }
        },
        [id, role]
    );

    const deleteDoc = useCallback(
        async (referalId: number) => {
            setIsLoading(true);
            const data: activeResponse | false = await deleteCode({
                userId: id,
                userType: role,
                id: referalId,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: `Referral deleted successfully `,
                        variant: 'success',
                    })
                );
                setRefresh(true);
            }
        },
        [dispatch, id, role]
    );

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
                saveAs(blob, `Referral Code.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `Referral Code.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `Referral Code.pdf`);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getDataFromApi();
    }, [getDataFromApi, refresh]);

    return {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        downloadReport,
    };
};

export default useGetRefaralCodes;
