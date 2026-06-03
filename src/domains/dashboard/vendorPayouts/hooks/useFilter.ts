import { PaginationProps } from 'antd';

import { filterStates } from '../types/types';

interface Props {
    setFilter: (value: any) => void;
}

const useFilter = ({ setFilter }: Props) => {
    const handleSearch = (e: any) => {
        setFilter((prevState: filterStates) => ({
            ...prevState,
            search: e.target.value,
            start: 1,
        }));
    };

    const handlePageChange: PaginationProps['onChange'] = (start, length) => {
        setFilter((prevState: filterStates) => ({
            ...prevState,
            start,
            length,
        }));
    };

    return {
        handleSearch,
        handlePageChange,
    };
};

export default useFilter;
