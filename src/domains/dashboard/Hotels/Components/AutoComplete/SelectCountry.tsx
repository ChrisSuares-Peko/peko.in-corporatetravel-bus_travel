import React, { useState } from 'react';

import { Flex, Input, List, Typography } from 'antd';

import { country } from '../../types/types';

interface selectProps {
    options: country[] | undefined;
    onSelect: any;
    searchKey: any;
    setSearchKey: any;
    defaultvalue?: string;
    textSize: any;
    placeholder: string;
}
const SelectCountry = ({
    options,
    onSelect,
    searchKey,
    setSearchKey,
    defaultvalue,
    textSize,
    placeholder,
}: selectProps) => {
    const [filteredOptions, setFilteredOptions] = useState<country[] | undefined>([]);
    const [selectedLabel, setSelectedLabel] = useState('United Arab Emirates'); // This is for displaying label

    const handleInputChange = (searchText: string) => {
        setSearchKey(searchText);
        setFilteredOptions(options);
        setSelectedLabel(searchText);
        if (searchText === '') {
            onSelect('');
            setSelectedLabel('');
        }
    };

    // Handle option selection
    const handleSelectOption = (option: country) => {
        setSearchKey(option.value);
        setFilteredOptions([]);
        onSelect(option.value);
        setSelectedLabel(toTitleCase(option.label));
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
                placeholder={placeholder}
                value={selectedLabel}
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
                            className="p-0 m-0 cursor-pointer hover:bg-[#F8F8F8] active:bg-[#FFF1F0]"
                            onClick={() => handleSelectOption(item)}
                        >
                            <Flex className="w-full" justify="space-between" align="center">
                                <Flex className="w-4/5" vertical>
                                    <Typography.Text className="text-sm font-medium">
                                        {toTitleCase(`${item.label}`)}
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

export default SelectCountry;
