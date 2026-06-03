import { useCallback, useEffect, useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getListingDataApi } from '../../api/dubaiPolice';
import {
    PlateCategory,
    PlateCode,
    FineSource,
    LicenseSource,
    ListingData,
    PlateSource,
} from '../../types/dubaiPolice';

export function useDubaiPoliceListingData() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [dataLoader, setDataLoader] = useState(false);
    const [plateCategory, setPlateCategory] = useState<PlateCategory[]>();
    const [plateCode, setPlateCode] = useState<PlateCode[]>();
    const [plateSource, setPlateSource] = useState<PlateSource[]>();
    const [fineSources, setFineSources] = useState<FineSource[]>();
    const [licenseSources, setLicenseSources] = useState<LicenseSource[]>();
    const getDubaiPoliceListingData = useCallback(async () => {
        setDataLoader(true);
        const data: ListingData | false = await getListingDataApi({
            userId: id,
            userType: role,
        });
        if (data) {
            setPlateCategory(data.PlateCategories);
            setPlateCode(data.PlateCodes);
            setPlateSource(data.PlateSources);
            setFineSources(data.FineSources);
            setLicenseSources(data.LicenseSources);
        }
        setDataLoader(false);
        return false;
    }, [id, role]);

    useEffect(() => {
        getDubaiPoliceListingData();
    }, [getDubaiPoliceListingData]);

    return {
        dataLoader,
        plateCategory,
        plateCode,
        fineSources,
        licenseSources,
        plateSource,
        setPlateSource,
        setPlateCode,
    };
}
