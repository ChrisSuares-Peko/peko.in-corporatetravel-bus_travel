import { useCallback, useState } from 'react';

import saveAs from 'file-saver';

import { CommonFileBuffer } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { getFileBufferReport, updateStatus } from '../../api/vendorPayout';

export default function useUpdateStatusApi() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    const statusUpdate = useCallback(
        async (status?: string, kybId?: number, remarks?: string) => {
            setIsLoading(true);
            const data: {} | false = await updateStatus({
                userId: id,
                userType: role,
                status,
                remarks,
                kybId,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: 'Status updated successfully',
                        variant: 'success',
                    })
                );
                return true;
            }
            setRefresh(false);
            setIsLoading(false);
            return false;
        },
        [dispatch, id, role]
    );

    const downloadReport = async (type: string) => {
        setIsLoading(true);
        const data: CommonFileBuffer | false = await getFileBufferReport({
            userId: id,
            userType: role,
            type,
        });
        if (data) {
            const arrayBuffer = new Uint8Array(data.buffer.data);

            const blob = new Blob([arrayBuffer], {
                type: data.fileType,
            });

            if (type === 'excel') {
                saveAs(blob, `Vendors.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `Vendors.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `Vendors.pdf`);
            }
        }
        setIsLoading(false);
    };

    return { isLoading, setRefresh, statusUpdate, downloadReport };
}
