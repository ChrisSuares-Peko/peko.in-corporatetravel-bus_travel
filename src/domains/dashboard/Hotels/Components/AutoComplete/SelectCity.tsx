import React, { useState } from 'react';

import { Flex, Input, List, Typography } from 'antd';

import { City } from '../../types/types';

interface selectProps {
    options: City[] | undefined;
    onSelect: any;
    searchKey: any;
    setSearchKey: any;
    defaultvalue: string;
    textSize: any;
}
const SelectCity = ({
    options,
    onSelect,
    searchKey,
    setSearchKey,
    defaultvalue,
    textSize,
}: selectProps) => {
    const [filteredOptions, setFilteredOptions] = useState<City[] | undefined>([]);
    const [selectedValue, setSelectedValue] = useState(defaultvalue);

    const handleInputChange = (searchText: string) => {
        setSearchKey(searchText);
        setFilteredOptions(options);

        setSelectedValue(searchText);
        if (searchText === '') {
            // @ts-ignore
            onSelect('');
            setSelectedValue('');
        }
    };
    const handleSelectOption = (option: string) => {
        setSearchKey(option);
        setFilteredOptions([]);
        onSelect(option);
        // // @ts-ignore
        setSelectedValue(option);
    };

    function toTitleCase(str: string) {
        return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
    }
    return (
        <Flex
            className="relative p-0 m-0"
            onBlur={() => setTimeout(() => setFilteredOptions([]), 200)}
        >
            <Input
                type="text"
                placeholder="Enter location"
                value={selectedValue}
                maxLength={20}
                // defaultValue={defaultvalue}
                onChange={e => handleInputChange(e.target.value)}
                variant="borderless"
                onClick={() => setFilteredOptions(options)}
                className={`w-full font-medium text-black h-10 md:ml-1 ${textSize}`}
            />

            {filteredOptions && filteredOptions.length > 0 && (
                <List
                    className="absolute z-10 w-80 max-h-64 bg-white border border-gray-300 rounded mt-16 overflow-scroll"
                    bordered
                    dataSource={options ?? []}
                    renderItem={(item, i) => (
                        <List.Item
                            key={i}
                            style={{ padding: 8 }}
                            className="p-0 m-0 cursor-pointer hover:bg-[#F8F8F8] active:bg-[#FFF1F0] "
                            onClick={() =>
                                handleSelectOption(
                                    toTitleCase(`${item.cityName}, ${item.countryName}`)
                                )
                            }
                        >
                            <Flex className="w-full" justify="space-between" align="center">
                                <Flex className="w-4/5" vertical>
                                    <Typography.Text className="text-sm font-medium">
                                        {toTitleCase(`${item.cityName}`)}
                                    </Typography.Text>
                                    <Typography.Text className="text-xs font-normal mt-1">
                                        {toTitleCase(`${item.countryName}`)}
                                    </Typography.Text>
                                </Flex>
                            </Flex>
                        </List.Item>
                    )}
                />
            )}
        </Flex>
    );
};

export default SelectCity;
