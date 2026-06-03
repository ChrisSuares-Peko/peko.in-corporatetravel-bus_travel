import { useState, useEffect, useCallback } from 'react';

import { getAllData } from '../../api/whasappNotification';
import { getData, numbers } from '../../types/whatsappNotification'; // Import types as needed

const useWhatsAppData = (initialPayload: getData) => {
    const [whatsappNumbers, setWhatsappNumbers] = useState<numbers[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState<number>(0);

    // Function to fetch data from the API
    const fetchWhatsAppNumbers = useCallback(async (payload: getData) => {
        setIsLoading(true);

        const data = await getAllData(payload);
        if (data) {
            setWhatsappNumbers(data.numbers);
            setTotalCount(data.totalCount);
        }

        setIsLoading(false);
    }, []);

    // UseEffect to initially fetch data
    useEffect(() => {
        fetchWhatsAppNumbers(initialPayload);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        whatsappNumbers,
        totalCount,
        isLoading,
        fetchWhatsAppNumbers,
    };
};

export default useWhatsAppData;
