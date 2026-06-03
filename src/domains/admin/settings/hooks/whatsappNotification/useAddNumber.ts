import { useState } from 'react';

import { addNumber } from '../../api/whasappNotification';

const useAddNumber = () => {
    const [loading, setLoading] = useState(false);

    const handleAddNumber = async (data: any) => {
        setLoading(true);
        try {
            const result = await addNumber(data);
            if (!result) {
                throw new Error('Failed to add number');
            }
            return result; // Return the added number data
        } catch (err) {
            setLoading(false);
            return false;
        }
    };

    return { handleAddNumber, loading };
};

export default useAddNumber;
