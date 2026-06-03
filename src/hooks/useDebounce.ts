/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';

import { debounce } from 'lodash';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    const debouncedFunction = useCallback(
        debounce((newValue: string) => {
            setDebouncedValue(newValue);
        }, delay),
        [delay]
    );

    useEffect(() => {
        debouncedFunction(value);
        return () => {
            debouncedFunction.cancel();
        };
    }, [value, debouncedFunction]);

    return debouncedValue;
};

export default useDebounce;
