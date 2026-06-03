// import { useState, useCallback, useEffect } from 'react';

// import { useAppSelector } from '@src/hooks/store';

// import { fetchDashboardData } from '../../api/dashboard';
// import { DashboardListingResponse } from '../../types/dash';

// export const useGetDashDataApi = (
//     reloadTable?: boolean,
// ) => {
//     const { role, id } = useAppSelector(state => state.reducer.auth);
//     const [docListData, setDocListData] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [totalDoc, setTotalDoc] = useState<number|string|undefined>();
//     const [totalSubs, setTotalSubs] = useState<number|string|undefined>();
//     const [totalSubSpent, setTotalSubSpent] = useState<number|string|undefined>();
//     const [totalAssetsAndFleets, setTotalAssetsAndFleets] = useState<number|string|undefined>();
//     const getDocList = useCallback(async () => {
//         setIsLoading(true);
//         const data: DashboardListingResponse | false = await fetchDashboardData({
//             userId: id,
//             userType: role,

//         });

//         if (data) {
//             const arr = data?.remindersList?.map(item => ({
//                 title: item.title ?? '',
//                 subTitle: item.subTitle ?? '',
//                 date: item.date ?? '',
//                 icon: item?.icon ?? '',
//                 type: item.type ?? '',

//             }));
//             setTotalDoc(data.totalDocuments);
//             setTotalSubs(data.totalSubscriptions);
//             setTotalSubSpent(data.totalSubscriptionsSpent);
//             setTotalAssetsAndFleets(data.totalAssetsAndFleets);
//             setDocListData(arr);
//         }
//         setIsLoading(false);
//     }, [id, role]);
//     useEffect(() => {
//         getDocList();
//     }, [getDocList, reloadTable]);

//     return {
//         tableDatas: docListData,
//         totalDoc,
//         tableLoading: isLoading,
//         totalSubs,
//         totalSubSpent,
//         totalAssetsAndFleets
//     };
// };

import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { fetchDashboardData } from '../../api/dashboard';
import { DashboardListingResponse } from '../../types/dash';

export const useGetDashDataApi = (reloadTable?: boolean) => {
    function chunkArray(array: any[], chunkSize: number) {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            const chunk = array.slice(i, i + chunkSize);
            result.push(chunk);
        }
        return result;
    }
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [docListData, setDocListData] = useState<any[][]>([]); // Updated to handle an array of arrays
    const [isLoading, setIsLoading] = useState(true);
    const [totalDoc, setTotalDoc] = useState<number | string | undefined>();
    const [totalSubs, setTotalSubs] = useState<number | string | undefined>();
    const [totalSubSpent, setTotalSubSpent] = useState<number | string | undefined>();
    const [totalAssetsAndFleets, setTotalAssetsAndFleets] = useState<number | string | undefined>();

    const getDocList = useCallback(async () => {
        setIsLoading(true);
        const data: DashboardListingResponse | false = await fetchDashboardData({
            userId: id,
            userType: role,
        });

        if (data) {
            const reminders =
                data?.remindersList?.map(item => ({
                    title: item.title ?? '',
                    subTitle: item.subTitle ?? '',
                    date: item.date ?? '',
                    icon: item?.icon ?? '',
                    type: item.type ?? '',
                })) ?? [];
            const chunkedData = chunkArray(reminders, 5);

            setTotalDoc(data.totalDocuments);
            setTotalSubs(data.totalSubscriptions);
            setTotalSubSpent(data.totalSubscriptionsSpent);
            setTotalAssetsAndFleets(data.totalAssetsAndFleets);
            setDocListData(chunkedData);
        }
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getDocList();
    }, [getDocList, reloadTable]);

    return {
        tableDatas: docListData,
        totalDoc,
        tableLoading: isLoading,
        totalSubs,
        totalSubSpent,
        totalAssetsAndFleets,
    };
};
