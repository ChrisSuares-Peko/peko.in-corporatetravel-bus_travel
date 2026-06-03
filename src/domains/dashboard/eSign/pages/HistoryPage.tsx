import { useState, type FC } from 'react';

import useDebounce from '@src/hooks/useDebounce';

import TableBody from '../components/orderHistory/TableBody';
import TableHeader from '../components/orderHistory/TableHeader';

interface HistoryPageProps {}

const HistoryPage: FC<HistoryPageProps> = () => {
    const [searchText, setSearchText] = useState<string>('');
    const debouncedSearchText = useDebounce(searchText, 300); // Use the custom hook

    return (
        <>
            <TableHeader searchText={searchText} setSearchText={setSearchText} />
            <TableBody searchText={debouncedSearchText} />
        </>
    );
};

export default HistoryPage;
