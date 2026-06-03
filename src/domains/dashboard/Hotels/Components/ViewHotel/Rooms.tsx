import React, { useEffect, useState } from 'react';

import { Divider, Flex, Grid, Radio, RadioChangeEvent, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

interface roomDetails {
    filteredRoomInfo: any;
    roomData: any;
    handleRoomSelect: any;
    reset: boolean;
}

const Rooms = ({
    // name, price, roomIndex, selected, onRoomSelect, roomKey,
    // rIndex ,adult,child,name,description
    filteredRoomInfo,
    roomData,
    handleRoomSelect,
    reset,
}: roomDetails) => {
    const dispatch = useAppDispatch();
    const screens = Grid.useBreakpoint();
    const { roomResponse, hotelsRequest } = useAppSelector(state => state.reducer.hotels);
    const [selectedRooms, setSelectedRooms] = useState<
        { roomIndex: number; name: string; price: number }[]
    >([]);
    const [selected, setSelected] = useState<any>();
    const [borderColor, setBorderColor] = useState('border border-solid rounded-md');
    const { rooms } = hotelsRequest;

    useEffect(() => {
        if (reset) {
            setSelected(undefined);
        }
    }, [reset]);
    // const handleRoomSelect = (
    //     roomIndex: number,
    //     name: string,
    //     price: number,
    //     roomKey: string,
    //     isAdd: any
    // ) => {
    //     dispatch(setRoom({ isAdd, roomInfo: { name, roomIndex, price, roomKey } }));
    // };

    const handleSelectionChange = (e: RadioChangeEvent) => {
        setSelected(e.target.value);
        const item = filteredRoomInfo.find((room: any) => room.roomKey === e.target.value);

        handleRoomSelect(
            item.roomIndex,
            item.roomId,
            item.roomTypeDesc,
            item.roomRate.netAmount,
            item.roomKey,
            { isAdd: e.target.checked }
        );
        setBorderColor(
            e.target.checked
                ? 'border border-solid rounded-md border-orange-300'
                : 'border border-solid rounded-md'
        );
    };

    return (
        <Content className="pt-5 w-full">
            <Content className="bg-gray-200  py-4">
                <Flex justify="space-between" className="px-5">
                    <Typography.Text className="text-xs">
                        Room {roomData.roomIndex} Adult - {roomData.adult}, Child - {roomData.child}{' '}
                        (Total Rooms: {rooms.length})
                    </Typography.Text>
                </Flex>
            </Content>
            <div style={{ maxHeight: '330px', overflowY: 'auto' }}>
                <Radio.Group
                    name="radiogroup"
                    className="w-full"
                    value={selected}
                    size="small"
                    onChange={e => handleSelectionChange(e)}
                >
                    {filteredRoomInfo.map((item: any, index: number) => (
                        <React.Fragment key={item.roomKey}>
                            {!selected && ( // Render all items if nothing is selected
                                <>
                                    <Flex
                                        justify="space-between"
                                        className={`mt-4 px-3 ${index === filteredRoomInfo.length - 1 ? 'mb-3' : ''}`}
                                    >
                                        <Flex vertical gap={10}>
                                            <Typography.Text className="font-medium md:text-lg xs:text-sm">
                                                {item.roomTypeDesc}
                                            </Typography.Text>
                                            <Flex>
                                                <Typography.Text className="text-red-500 md:text-sm xs:text-xs">
                                                    {item.roomRate.rates[0].name === 'DailyRate'
                                                        ? 'Day wise rate'
                                                        : ''}
                                                </Typography.Text>
                                                <Typography.Text
                                                    className={
                                                        item.ratePlan.availableStatus ===
                                                        'Available'
                                                            ? 'text-green-600 text-sm ml-9'
                                                            : 'text-red-500 text-sm ml-9'
                                                    }
                                                >
                                                    {item.ratePlan.availableStatus}
                                                </Typography.Text>
                                                <Typography.Text className="text-bgOrange2 ml-9">
                                                    {item.ratePlan.fixedCombo === true
                                                        ? 'Combined Room'
                                                        : ''}
                                                </Typography.Text>
                                            </Flex>
                                        </Flex>
                                        <Flex
                                            vertical
                                            gap={10}
                                            align={screens.xs ? 'end' : undefined}
                                        >
                                            <Typography.Text className="font-medium md:text-lg xs:text-sm ">
                                                AED {item.roomRate.netAmount}
                                            </Typography.Text>
                                            <Flex>
                                                <Radio value={item.roomKey}>
                                                    <Typography.Text className="md:text-sm xs:text-xs">
                                                        {' '}
                                                        Select this room
                                                    </Typography.Text>
                                                </Radio>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    {index !== filteredRoomInfo.length - 1 && (
                                        <Divider className="mt-10" />
                                    )}
                                </>
                            )}
                            {selected === item.roomKey && ( // Render only the selected item
                                <>
                                    <Flex
                                        justify="space-between"
                                        className={`mt-4 px-3 ${index === filteredRoomInfo.length - 1 ? 'mb-3' : ''}`}
                                    >
                                        <Flex vertical gap={10}>
                                            <Typography.Text className="font-medium text-lg">
                                                {item.roomTypeDesc}
                                            </Typography.Text>
                                            <Flex>
                                                <Typography.Text className="text-red-500 text-sm">
                                                    {item.roomRate.rates[0].name === 'DailyRate'
                                                        ? 'Day wise rate'
                                                        : ''}
                                                </Typography.Text>
                                                <Typography.Text
                                                    className={
                                                        item.ratePlan.availableStatus ===
                                                        'Available'
                                                            ? 'text-green-500 text-sm ml-9'
                                                            : 'text-red-500 text-sm ml-9'
                                                    }
                                                >
                                                    {item.ratePlan.availableStatus}
                                                </Typography.Text>
                                                <Typography.Text className="text-bgOrange2 ml-9">
                                                    {item.ratePlan.fixedCombo === true
                                                        ? 'Combined Room'
                                                        : ''}
                                                </Typography.Text>
                                            </Flex>
                                        </Flex>
                                        <Flex vertical justify="flex-end" gap={10}>
                                            <Typography.Text className="font-medium text-lg">
                                                AED {item.roomRate.netAmount}
                                            </Typography.Text>
                                            <Flex>
                                                <Radio value={item.roomKey}>
                                                    <Typography.Text className="md:text-sm xs:text-xs">
                                                        {' '}
                                                        Select this room{' '}
                                                    </Typography.Text>
                                                </Radio>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                    {index !== filteredRoomInfo.length - 1 ||
                                        (!selected && <Divider className="mt-10" />)}
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </Radio.Group>
            </div>
        </Content>
    );
};

export default Rooms;
