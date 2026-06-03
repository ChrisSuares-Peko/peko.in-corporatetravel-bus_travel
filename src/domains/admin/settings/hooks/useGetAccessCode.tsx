import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';
import { useDispatch } from 'react-redux';

import { CommonFileBuffer } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { deleteCode, getAllData, getFileBufferReport } from '../api/accessCode';
import { AccessData, activeResponse, getData, AccessDataResponse } from '../types/accessCode';

const useGetAccessCode = ({ searchText, itemsPerPage, page, sort }: getData) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<AccessData[]>();
    const getDataFromApi = useCallback(async () => {
        setIsLoading(true);
        const data: AccessDataResponse | false = await getAllData({
            userId: id,
            userType: role,
            searchText,
            itemsPerPage,
            page,
            sort,
        });
        if (data) {
            setTableData(data.data);
            setCount(data.recordsTotal);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, itemsPerPage, page, role, searchText, sort]);

    const deleteDoc = useCallback(
        async (accessCodeId: number) => {
            setIsLoading(true);
            const data: activeResponse | false = await deleteCode({
                userId: id,
                userType: role,
                id: accessCodeId,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: `Access Code deleted successfully`,
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
            searchText,
            itemsPerPage,
            page,
            sort,
        });
        if (data) {
            const arrayBuffer = new Uint8Array(data.buffer.data);

            // Convert ArrayBuffer to Blob
            const blob = new Blob([arrayBuffer], {
                type: data.fileType,
            });

            // Trigger download
            if (type === 'excel') {
                saveAs(blob, `Access code.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `Access code.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `Access code.pdf`);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getDataFromApi();
    }, [getDataFromApi, refresh]);

    return { isLoading, tableData, count, deleteDoc, setRefresh, downloadReport };
};

export default useGetAccessCode;
