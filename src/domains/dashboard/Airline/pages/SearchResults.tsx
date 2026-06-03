import React, { useEffect } from 'react';

import { useAppDispatch } from '@src/hooks/store';

import SearchResultComponent from '../components/searchResult';
import { resetSelectedAncillaries } from '../slices/airlineSlice';

const SearchResult = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetSelectedAncillaries());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <SearchResultComponent />;
};

export default SearchResult;
