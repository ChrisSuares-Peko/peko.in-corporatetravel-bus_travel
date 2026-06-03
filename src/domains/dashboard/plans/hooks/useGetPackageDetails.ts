import { useCallback, useEffect, useState } from 'react';

import { getPackageDetails } from '../api';
import { PackageDetailsResponse } from '../types';

export default function useGetPackageDetails(packageId: number) {
    const [tableData, setTableData] = useState<PackageDetailsResponse>();
    const [isLoading, setIsLoading] = useState(true);

    const getPackageDetail = useCallback(async () => {
        setIsLoading(true);
        const data: PackageDetailsResponse | false = await getPackageDetails(packageId);
        if (data) {
            setTableData(data);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, [packageId]);

    useEffect(() => {
        getPackageDetail();
    }, [getPackageDetail]);

    return { data: tableData, isLoading };
}
