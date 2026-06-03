import React, { useRef, useState } from 'react';

import { DownOutlined } from '@ant-design/icons';
import { Checkbox, Dropdown, Menu, Button, Flex } from 'antd';

interface WeekdaysCheckboxDropdownProps {
    onChange: (newChecked: string[]) => void;
}

const WeekdaysCheckboxDropdown: React.FC<WeekdaysCheckboxDropdownProps> = ({ onChange }) => {
    // Explicitly define the type of array elements as string[]
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const closeDropdown = () => {
        setDropdownOpen(false); // Function to close the dropdown
    };

    const handleVisibleChange = (flag: any) => {
        if (!flag && !dropdownRef.current?.contains(document.activeElement)) {
            setDropdownOpen(false);
        } else {
            setDropdownOpen(flag);
        }
    };

    const handleMenuClick = (e: any) => {
        e.domEvent.stopPropagation();
        const day = e.key;
        const currentIndex = selectedDays.indexOf(day);
        const newChecked = [...selectedDays];

        if (currentIndex === -1) {
            newChecked.push(day);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setSelectedDays(newChecked);
        onChange(newChecked); // Notify parent component of the change
    };
    const menu = (
        <Menu>
            {weekdays.map(day => (
                <Menu.Item key={day} onClick={handleMenuClick}>
                    <Checkbox
                        checked={selectedDays.includes(day)}
                        onClick={e => e.stopPropagation()} // Stop propagation here
                        onChange={e => handleMenuClick({ key: day, domEvent: e })}
                    >
                        {day}
                    </Checkbox>
                </Menu.Item>
            ))}
            <Menu.Item>
                <Button type="primary" danger onClick={closeDropdown} block>
                    OK
                </Button>
            </Menu.Item>
        </Menu>
    );

    return (
        <Dropdown
            overlay={menu}
            trigger={['click']}
            onOpenChange={handleVisibleChange}
            open={dropdownOpen}
        >
            <Button size="large">
                <Flex justify="space-between" align="center">
                    <span> {selectedDays.length}</span> <DownOutlined />
                </Flex>
            </Button>
        </Dropdown>
    );
};

export default WeekdaysCheckboxDropdown;
