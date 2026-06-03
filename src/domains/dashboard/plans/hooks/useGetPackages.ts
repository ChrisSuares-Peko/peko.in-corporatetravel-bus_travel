import { useCallback, useEffect, useState } from 'react';

import { getPackages } from '../api';
import { PackagesData, ServicePackage } from '../types';

export default function useGetPackages() {
    const [tableData, setTableData] = useState<ServicePackage[]>([]);
    const [currentPackageId, setCurrentPackageId] = useState<number>();
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();

    const getPackagesLIst = useCallback(async () => {
        setIsLoading(true);
        const data: PackagesData | false = await getPackages();
        if (data) {
            setTableData(data.packages);
            setCurrentPackageId(data.currentPackageId);
            setCount(data.packages.length);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        getPackagesLIst();
    }, [getPackagesLIst]);

    return { data: tableData, isLoading, count, currentPackageId };
}
