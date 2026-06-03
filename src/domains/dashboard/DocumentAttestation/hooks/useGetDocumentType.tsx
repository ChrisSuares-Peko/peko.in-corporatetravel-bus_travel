import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { getDocumentType } from '../api';

export function useGetDocumentType() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [document, setDocumentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleGetDocument = async (country: string) => {
        const data: any | false = await getDocumentType(
            {
                userId: id,
                userType: role,
            },
            country
        );

        if (data) {
            setDocumentData(data?.data);
            setIsLoading(false);
        }
        setIsLoading(false);
    };

    return { handleGetDocument, isLoading, data: document };
}
