import { useCallback, useEffect, useState } from 'react';

import { DropDown } from '@customtypes/general';

import { getCompanySizes } from '../api/general';
import { CompanySizesResponse } from '../types';

export default function useCompanySizes() {
    const [companySizesList, setCompanySizesList] = useState<DropDown>([]);

    const fetchCompanySizes = useCallback(async () => {
        const data: CompanySizesResponse | false = await getCompanySizes();
        if (data) {
            setCompanySizesList(data.companySize);
        }
    }, []);

    useEffect(() => {
        fetchCompanySizes();
    }, [fetchCompanySizes]);

    return { companySizesList };
}
