import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { listVehicleInfo } from '../../api/fleet';
import { FleetListingResponse } from '../../types/fleetManagement';

export const useGetAllVehicleInfoApi = (reloadTable: boolean) => {
    const initialInfoDetails = {
        totalAssets: 0,
        totalAssigned: 0,
        availableAssets: 0,
        totalUnderMaintenance: 0,
    };
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [infoDetails, setInfoDetails] = useState(initialInfoDetails);
    const [vehicleList, setVehicleList] = useState<
        | ((prevState: never[]) => never[])
        | { id: number; vehicleName: string; vehicleNumber: string; purchasedDate: string }[]
    >([]);
    const [isLoading, setIsLoading] = useState(true);

    const getFleetInfo = useCallback(async () => {
        setIsLoading(true);
        const data: FleetListingResponse | false = await listVehicleInfo({
            userId: id,
            userType: role,
        });

        if (data) {
            let totalAssigned = 0;
            let totalUnderMaintenance = 0;
            const vehicles:
                | ((prevState: never[]) => never[])
                | {
                      id: number;
                      vehicleName: string;
                      vehicleNumber: string;
                      purchasedDate: string;
                  }[] = [];

            data.result.forEach(item => {
                if (item.cloud_employee?.employeeName) {
                    totalAssigned += 1;
                }
                if (item?.status === 'Maintenance') {
                    totalUnderMaintenance += 1;
                }
                vehicles.push({
                    id: item.id,
                    vehicleName: item.vehicleName,
                    vehicleNumber: item.vehicleNumber,
                    purchasedDate: item.purchasedDate,
                });
            });

            const totalAssets = data.totalData;
            const availableAssets = totalAssets - totalAssigned;
            setInfoDetails({ totalAssets, totalAssigned, totalUnderMaintenance, availableAssets });
            setVehicleList(vehicles);
        }
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getFleetInfo();
    }, [getFleetInfo, reloadTable]);

    return {
        tableLoading: isLoading,
        infoDetails,
        vehicleList,
    };
};
