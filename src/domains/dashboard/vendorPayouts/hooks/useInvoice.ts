/* eslint-disable no-unneeded-ternary */
import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { postInvoice } from '../api';

export default function useInvoice() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [Loading, setLoading] = useState(false);

    const invoicePost = async (formData: FormData) => {
        const data = await postInvoice({
            userId: id,
            userType: role,
            postData: formData,
        });
        setLoading(false); // End loading state

        return data;
    };

    return { invoicePost, Loading };
}
