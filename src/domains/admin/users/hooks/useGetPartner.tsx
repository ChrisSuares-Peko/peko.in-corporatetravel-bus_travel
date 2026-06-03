import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';

import { CommonFileBuffer, SuccessGenericResponse } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import {
    putUpdatePartner,
    getPartners,
    putUpdatePartnerStatus,
    postCreatePartner,
    downloadPartnerReport,
} from '../api/partner';
import { activeResponse } from '../types/corporateUserTypes';
import { Partner, Role, getSystemUsers } from '../types/systemUserTypes';

type PartnerUpdatePayload = {
    partnerId: number;
    isActive: boolean;
};
export const useGetPartner = ({
    searchText,
    itemsPerPage,
    page,
    sort,
    sortField,
}: getSystemUsers) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<Role[]>();

    const getAllRoles = useCallback(async () => {
        setIsLoading(true);
        const data: any | false = await getPartners({
            userId: id,
            userType: role,
            searchText,
            itemsPerPage,
            page,
            sort,
            sortField,
        });
        if (data) {
            setTableData(data.rows);
            setCount(data.count);
        }
        setRefresh(false);
        setIsLoading(false);
    }, [id, itemsPerPage, page, role, searchText, sort, sortField]);

    const updateActiveStatus = useCallback(
        async ({ partnerId, isActive }: PartnerUpdatePayload) => {
            setIsLoading(true);
            const dataResp: activeResponse | false = await putUpdatePartnerStatus({
                userId: id,
                userType: role,
                partnerId,
                isActive,
            });
            if (dataResp) {
                setRefresh(true);
            }
            setRefresh(true);
            setIsLoading(false);
        },
        [id, role]
    );

    const updatePartner = useCallback(
        async (values: Partner) => {
            setIsLoading(true);
            const dataResp: SuccessGenericResponse<Partner> | false = await putUpdatePartner({
                userId: id,
                userType: role,
                ...values,
            });
            setIsLoading(false);
            if (dataResp) {
                setRefresh(true);
                return dataResp;
            }
            return false;
        },
        [id, role]
    );

    const createPartner = useCallback(
        async (values: Partner) => {
            setIsLoading(true);
            const dataResp: SuccessGenericResponse<Partner> | false = await postCreatePartner({
                userId: id,
                userType: role,
                ...values,
            });
            setIsLoading(false);
            if (dataResp) {
                setRefresh(true);
                return dataResp;
            }
            return false;
        },
        [id, role]
    );

    const downloadReport = useCallback(
        async (type: string) => {
            setIsLoading(true);
            const data: CommonFileBuffer | false = await downloadPartnerReport({
                userId: id,
                userType: role,
                searchText,
                sort,
                sortField,
                type,
            });

            if (data) {
                const arrayBuffer = new Uint8Array(data.buffer.data);

                // Convert ArrayBuffer to Blob
                const blob = new Blob([arrayBuffer], {
                    type: data.fileType,
                });

                // Trigger download
                if (type === 'excel') {
                    saveAs(blob, `Partner.xlsx`);
                } else if (type === 'csv') {
                    saveAs(blob, `Partner.csv`);
                } else if (type === 'pdf') {
                    saveAs(blob, `Partner.pdf`);
                }
            }
            setIsLoading(false);
        },
        [sort, searchText, sortField, id, role]
    );

    useEffect(() => {
        getAllRoles();
    }, [getAllRoles, refresh]);

    return {
        isLoading,
        tableData,
        count,
        setRefresh,
        updateActiveStatus,
        updatePartner,
        createPartner,
        downloadReport,
    };
};
