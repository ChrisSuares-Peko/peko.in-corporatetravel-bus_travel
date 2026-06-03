import { useState } from 'react';

import { editNumber } from '../../api/whasappNotification';

const useEditNumber = () => {
    const [loading, setLoading] = useState(false);

    const handleEditNumber = async (currentNumber: string, updatedDetails: any) => {
        setLoading(true);

        try {
            const response = await editNumber(currentNumber, updatedDetails);
            setLoading(false);
            if (response) {
                return response; // Return the data if successful
            }
            throw new Error('Failed to edit WhatsApp number');
        } catch (err) {
            setLoading(false);
            return false; // Return false in case of an error
        }
    };

    return { handleEditNumber, loading };
};

export default useEditNumber;
