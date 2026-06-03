import { useCallback, useState } from 'react';

import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { addCustomer, deleteCustomer, updateCustomer } from '../api';
import { UserPayload } from '../types/customertypes';

export const useCustomerAdd = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>(1);
    const [tableData, setTableData] = useState<any[]>();
    const dispatch = useDispatch();

    const customerAdd = useCallback(
        async (payload: UserPayload) => {
            setIsLoading(true);
            const data: any | false = await addCustomer({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: 'Customer added successfully',
                        variant: 'success',
                    })
                );
                setRefresh(true);
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [dispatch, id, role]
    );

    const customerUpdate = useCallback(
        async (payload: UserPayload) => {
            setIsLoading(true);
            const data: any | false = await updateCustomer({
                userId: id,
                userType: role,
                ...payload,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: 'Customer updated successfully',
                        variant: 'success',
                    })
                );
                setRefresh(true);
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [dispatch, id, role]
    );

    const customerDelete = useCallback(
        async (cId: number) => {
            setIsLoading(true);
            const data: any = await deleteCustomer({
                userId: id,
                userType: role,
                id: cId,
            });
            if (data) {
                dispatch(
                    showToast({
                        description: 'Customer deleted successfully',
                        variant: 'success',
                    })
                );
                setRefresh(true);
                return true;
            }
            setIsLoading(false);
            return false;
        },
        [dispatch, id, role]
    );

    return { isLoading, tableData, count, setRefresh, customerAdd, customerUpdate, customerDelete };
};
