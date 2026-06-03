import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { checkPrice } from '../api';
import { setData } from '../slice';
import { DocumentDetailsFormVal } from '../types';

export default function useCheckPrice() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const [checkPriceData, setCheckPriceData] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);

    const handleCheckPrice = async (postData: DocumentDetailsFormVal, country: string) => {
        const res: any | false = await checkPrice({
            userId: id,
            userType: role,
            postData,
        });
        if (res) {
            const data = res;
            setCheckPriceData(data);
            const dat = {
                documentType: postData.documentType,
                issuedCountry: country,
                submissionCountry: 'UAE',
                amount: data.price,
                credentialId: id,
                actualPrice: data.actualPrice,
            };
            dispatch(setData(dat));
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    };

    return { handleCheckPrice, docPriceData: checkPriceData, isLoading };
}
