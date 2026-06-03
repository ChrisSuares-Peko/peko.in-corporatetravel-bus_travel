import React from 'react';

import { Row } from 'antd';

import useDebounce from '@src/hooks/useDebounce';

import Header from '../components/orders/Header';
import OrdersTable from '../components/orders/OrdersTable';

type Props = {};

const Orders = (props: Props) => {
    const [searchTextInput, setSearchTextInput] = React.useState('');
    const debouncedSearchText = useDebounce(searchTextInput, 300); // Use the custom hook

    return (
        <Row className="gap-5">
            <Header setSearchTextInput={setSearchTextInput} />
            <OrdersTable searchText={debouncedSearchText} />
        </Row>
    );
};

export default Orders;
