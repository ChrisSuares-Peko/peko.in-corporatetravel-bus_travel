import { useCallback, useEffect, useState } from 'react';

import { getPurchaseDetailsApi } from '../api';
import { PackageDetails, SubscriptionDetailsResponse } from '../types';

type Props = {
    accessKey?: string;
    packageName?: string;
};

export function useGetDetailsSubscription({ accessKey, packageName }: Props) {
    const [details, setDetails] = useState<PackageDetails>();
    const [packages, setPackages] = useState<PackageDetails[]>();

    const [isLoading, setIsLoading] = useState(true);
    const employeeList = useCallback(async () => {
        setIsLoading(true);
        const data: SubscriptionDetailsResponse | false = await getPurchaseDetailsApi({
            accessKey,
            packageName,
        });
        if (data) {
            const { packageDetails } = data;
            if (Array.isArray(packageDetails) && packageDetails.length) {
                setDetails(packageDetails[0]);
                setPackages(packageDetails);
            }
        }
        setIsLoading(false);
    }, [accessKey, packageName]);

    useEffect(() => {
        employeeList();
    }, [employeeList]);

    return { data: details, isLoading, packages };
}
