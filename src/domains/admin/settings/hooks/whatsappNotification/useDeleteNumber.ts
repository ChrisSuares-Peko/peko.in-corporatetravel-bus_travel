import { useState } from 'react';

import { deleteNumber } from '../../api/whasappNotification';

const useDeleteNumber = () => {
    const [loading, setLoading] = useState(false);

    const handleDeleteNumber = async (whatsappNumber: string) => {
        setLoading(true);
        try {
            const result = await deleteNumber(whatsappNumber);
            setLoading(false);
            if (result) {
                return true; // Successful deletion
            }
            return false;
        } catch (err) {
            setLoading(false);
            return false;
        }
    };

    return {
        handleDeleteNumber,
        loading,
    };
};

export default useDeleteNumber;
