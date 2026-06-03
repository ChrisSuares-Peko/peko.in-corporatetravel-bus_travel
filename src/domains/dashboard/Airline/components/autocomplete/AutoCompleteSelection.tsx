import React, { useEffect, useState } from 'react';

import { Flex, Input, List, Typography } from 'antd';

import { ITripData } from '../../types/airlineTypes';
import { ISearchData } from '../../types/searchAirports';
import '../../assets/style.css';

type props = {
    options: ISearchData[] | undefined;
    onSelect: (loc: string, val: string) => void;
    searchKey: string | undefined;
    setSearchKey: (key: string) => void;
    tripData: ITripData;
    location: string;
};

const Autocomplete = ({
    options,
    onSelect,
    searchKey,
    setSearchKey,
    location,
    tripData,
}: props) => {
    const [filteredOptions, setFilteredOptions] = useState<
        { label: string; value: string }[] | undefined
    >([]);
    const [selectedValue, setSelectedValue] = useState('');

    const handleInputChange = (searchText: string) => {
        setSearchKey(searchText);
        setFilteredOptions(options);
        setSelectedValue(searchText);
        if (searchText === '') {
            // @ts-ignore
            onSelect(location, '');
            setSelectedValue('');
        }
    };

    const handleSelectOption = (option: string) => {
        setSearchKey(option);
        setFilteredOptions([]);
        onSelect(location, option);
        // @ts-ignore
        setSelectedValue(tripData[location] !== '' ? tripData[location] : '');
    };
    useEffect(() => {
        // @ts-ignore
        setSelectedValue(tripData[location] !== '' ? tripData[location] : '');
    }, [location, tripData]);

    return (
        <Flex
            onBlur={() => setTimeout(() => setFilteredOptions([]), 200)}
            className="relative p-0 m-0"
        >
            <Input
                type="text"
                // @ts-ignore
                maxLength={20}
                value={selectedValue}
                onChange={e => handleInputChange(e.target.value)}
                placeholder="Enter location"
                variant="borderless"
                onClick={() => setFilteredOptions(options)}
                className={`w-full font-semibold h-8 ${selectedValue ? 'text-xl' : ''}`}
            />
            {filteredOptions && filteredOptions.length > 0 && (
                <List
                    className="absolute z-10 ms-2 w-96 max-h-64 bg-white border border-gray-300 rounded mt-16 overflow-scroll custom-list"
                    style={{ boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.09)' }}
                    bordered
                    dataSource={options ?? []}
                    renderItem={(item, i) => (
                        <List.Item
                            key={i}
                            style={{
                                padding: 8,
                            }}
                            className="p-0 m-0 cursor-pointer hover:bg-[#F8F8F8] active:bg-[#FFF1F0]"
                            onClick={() => handleSelectOption(item.value)}
                        >
                            <Flex className="w-full" justify="space-between" align="center">
                                <Flex className="w-4/5" vertical>
                                    <Typography.Text className="text-sm font-medium">
                                        {item.location}
                                    </Typography.Text>
                                    <Typography.Text className="text-xs font-normal">
                                        {item.label}
                                    </Typography.Text>
                                </Flex>
                                <Typography.Text className="text-xs font-medium w-1/5 text-center">
                                    {item.value}
                                </Typography.Text>
                            </Flex>
                        </List.Item>
                    )}
                />
            )}
        </Flex>
    );
};

export default Autocomplete;
