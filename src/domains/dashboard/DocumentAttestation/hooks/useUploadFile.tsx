import { useState } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { uploadDocument } from '../api';
import { IFileUpload } from '../types';

export function useUploadDocument() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [document, setDocumentData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleUploadDocument = async (fileUpload: IFileUpload) => {
        const data: any | false = await uploadDocument({
            userId: id,
            userType: role,
            passportDoc: fileUpload,
        });

        if (data) {
            setDocumentData(data);
            setIsLoading(false);
            return data;
        }

        setIsLoading(false);
        return false;
    };

    return { handleUploadDocument, isLoading };
}
