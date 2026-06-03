import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';

import { CommonFileBuffer, DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import {
    getCorporateUserData,
    getFileBufferReportCorporate,
    getKycStatus,
    getPackages,
    getUpdateStatus,
    updateUserData,
} from '../api';
import {
    ApiResponse,
    Data,
    activeResponse,
    getCorporateUsers,
    kycResponse,
    packagesResponse,
    packagesTypes,
    updateData,
    updateStatus,
} from '../types/corporateUserTypes';

const useGetCorporateUserData = ({
    searchText,
    itemsPerPage,
    page,
    partnerId,
    sort,
    sortField,
}: getCorporateUsers) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, SetRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<Data[]>();
    const [kyc, setKyc] = useState<DropDown>();
    const [packageData, setPackageData] = useState<DropDown>();
    const getData = useCallback(async () => {
        setIsLoading(true);
        const data: ApiResponse | false = await getCorporateUserData({
            userId: id,
            userType: role,
            itemsPerPage,
            page,
            searchText,
            partnerId,
            sort,
            sortField,
        });
        if (data) {
            setTableData(data.data);
            setCount(data.recordsTotal);
        }
        SetRefresh(false);
        setIsLoading(false);
    }, [id, itemsPerPage, page, partnerId, role, searchText, sort, sortField]);

    const updateActiveStatus = useCallback(
        async ({ corporateId, isActive }: updateStatus) => {
            setIsLoading(true);
            const dataResp: activeResponse | false = await getUpdateStatus({
                userId: id,
                userType: role,
                corporateId,
                isActive,
            });
            if (dataResp) {
                SetRefresh(true);
            }
            // const data = {
            //     id: corporateId,
            //     isActive,
            // };
            // socket.emit('block-corporateUser', data, corporateId);
            SetRefresh(true);
            setIsLoading(false);
        },
        [id, role]
    );
    const kycDetails = useCallback(async () => {
        setIsLoading(true);
        const data: kycResponse | false = await getKycStatus({
            userId: id,
            userType: role,
        });
        if (data) {
            setKyc(data.kycType);
        }
    }, [id, role]);
    const packageDetails = useCallback(async () => {
        const data: packagesResponse | false = await getPackages({
            userId: id,
            userType: role,
        });
        if (data) {
            const arr = data.data.map((item: packagesTypes) => ({
                value: item.id.toString(),
                label: item.packageName,
            }));
            setPackageData(arr);
        }
    }, [id, role]);

    const updateCorporateUserData = useCallback(
        async (payload: updateData) => {
            setIsLoading(true);
            const data: activeResponse | false = await updateUserData({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                SetRefresh(true);
                setIsLoading(false);
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [id, role]
    );

    const downloadReport = async (type: string) => {
        setIsLoading(true);
        const data: CommonFileBuffer | false = await getFileBufferReportCorporate({
            userId: id,
            userType: role,
            type,
            searchText,
            partnerId,
            page,
            itemsPerPage,
        });
        if (data) {
            const arrayBuffer = new Uint8Array(data.buffer.data);

            // Convert ArrayBuffer to Blob
            const blob = new Blob([arrayBuffer], {
                type: data.fileType,
            });

            // Trigger download
            if (type === 'excel') {
                saveAs(blob, `Corporate Users.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `Corporate Users.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `Corporate Users.pdf`);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getData();
    }, [getData, refresh]);

    useEffect(() => {
        kycDetails();
        packageDetails();
    }, [kycDetails, packageDetails]);

    return {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        updateCorporateUserData,
        kycStatus: kyc,
        packageData,
        downloadReport,
    };
};

export default useGetCorporateUserData;
