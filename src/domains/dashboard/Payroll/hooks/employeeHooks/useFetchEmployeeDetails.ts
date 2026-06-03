import { useEffect } from 'react';

import { useAppDispatch } from '@src/hooks/store';

import GetEmployeeDetails from './useGetEmployee';
import { setEmployeeFullData } from '../../slices/employeeDetailsSlice';
import { Employee } from '../../types/types';

const useFetchEmployeeDetails = (id: string | undefined) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                const { data } = GetEmployeeDetails(id);
                if (data && typeof data !== 'boolean') {
                    dispatch(setEmployeeFullData(data as unknown as Employee));
                }
            }
        };

        fetchData();

        return () => {};
    }, [dispatch, id]);
};

export default useFetchEmployeeDetails;
