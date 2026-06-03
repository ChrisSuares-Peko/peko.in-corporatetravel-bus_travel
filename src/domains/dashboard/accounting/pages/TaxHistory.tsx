import React from 'react';

import { Flex } from 'antd';

// Update the path accordingly

import useScreenSize from '@src/hooks/useScreenSize';

import HistoryTable from '../components/taxRegistration/HistoryTable';

const TaxHistory: React.FC = () => {
    const screen = useScreenSize();
    const [searchTextInput, setSearchTextInput] = React.useState('');
    const [searchText, setSearchText] = React.useState<string>('');

    return (
        <Flex vertical>
            <HistoryTable />
        </Flex>
    );
};

export default TaxHistory;
