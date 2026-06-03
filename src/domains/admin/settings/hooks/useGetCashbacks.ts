import { useCallback, useEffect, useState } from 'react';

import { saveAs } from 'file-saver';

import { CommonFileBuffer, DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import {
    getAllData,
    deleteDocument,
    getUpdateStatus,
    getServiceOperatorsApi,
    getPackagesApi,
    getFileBufferReport,
} from '../api/cashback';
import {
    ServiceResponse,
    ServiceData,
    activeResponse,
    getData,
    updateStatus,
    ServiceProviderData,
    ServiceProvider,
    getPackagesApiResp,
    packages,
} from '../types/cashback';

const useGetCashbacks = (payload: getData) => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<ServiceData[]>();
    const [serviceData, setServiceData] = useState<DropDown>();
    const [packageData, setPackageData] = useState<DropDown>();
    const getDataFromApi = useCallback(async () => {
        setIsLoading(true);
        const data: ServiceResponse | false = await getAllData({
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
        async ({ cashbackId, serviceStatus }: updateStatus) => {
            setIsLoading(true);
            const data: activeResponse | false = await getUpdateStatus({
                userId: id,
                userType: role,
                cashbackId,
                serviceStatus,
            });
            if (data) {
                setRefresh(true);
            }
            setIsLoading(false);
        },
        [id, role]
    );

    const deleteDoc = useCallback(
        async (serviceId: number) => {
            setIsLoading(true);
            const data: activeResponse | false = await deleteDocument({
                userId: id,
                userType: role,
                id: serviceId,
            });
            if (data) {
                setRefresh(true);
            }
        },
        [id, role]
    );
    const getAllServiceProvider = useCallback(async () => {
        setIsLoading(true);
        const data: ServiceProviderData | false = await getServiceOperatorsApi({
            userId: id,
            userType: role,
        });
        if (data) {
            const arr = data.data.map((item: ServiceProvider) => ({
                value: item.id.toString(),
                label: item.serviceProvider,
            }));
            setServiceData(arr);
        }
    }, [id, role]);
    const getAllPackages = useCallback(async () => {
        setIsLoading(true);
        const data: getPackagesApiResp | false = await getPackagesApi({
            userId: id,
            userType: role,
            partnerId: payload.partnerId,
            excludeBasic: false,
        });
        if (data) {
            const arr = data.data.map((item: packages) => ({
                value: item.id.toString(),
                label: item.packageName,
            }));
            setPackageData(arr);
        }
    }, [id, role, payload.partnerId]);

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
                saveAs(blob, `Cashback.xlsx`);
            } else if (type === 'csv') {
                saveAs(blob, `Cashback.csv`);
            } else if (type === 'pdf') {
                saveAs(blob, `Cashback.pdf`);
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        getDataFromApi();
        getAllServiceProvider();
        // getAllPackages();
    }, [getAllPackages, getAllServiceProvider, getDataFromApi]);

    useEffect(() => {
        getDataFromApi();
    }, [refresh, getDataFromApi]);

    useEffect(() => {
        getAllPackages();
    }, [getAllPackages, payload.partnerId]);

    return {
        isLoading,
        tableData,
        count,
        updateActiveStatus,
        deleteDoc,
        setRefresh,
        serviceData,
        packageData,
        downloadReport,
    };
};

export default useGetCashbacks;
