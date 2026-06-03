import React, { useState } from 'react';

import { Col, Divider, Drawer, Flex, Image, Row, Select, Typography } from 'antd';
import { useLocation } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import add from '@domains/dashboard/Hotels/Assets/icons/add.svg';
import minus from '@domains/dashboard/Hotels/Assets/Minus.png';
import plus from '@domains/dashboard/Hotels/Assets/Plus.png';
import RoomCount from '@src/domains/dashboard/Hotels/hooks/useRoomCount';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import NationalityFields from './NationalityFields';
import { addChildAge } from '../../slices/getHotelSlice';
import { roomTypes } from '../../utils/data';

const { Option } = Select;

interface ModalProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    setRoomData: Function;
}
const BookModal = ({ isModalOpen, handleCancel, setRoomData }: ModalProps) => {
    const location = useLocation();
    const { key } = location.state || {};
    const dispatch = useAppDispatch();
    const { rooms, handleCountChange, roomDelete, handleAddRoom } = RoomCount();
    // const {hotelsRequest}=useAppSelector(state=>state.reducer.hotels)
    const [childAges, setChildAges] = useState<any>([]);
    const roomData = rooms.map((room, index) => ({
        adult: room.adult,
        child: room.child,
        roomIndex: index + 1,
    }));

    setRoomData(rooms);

    const { hotelsRequest } = useAppSelector(state => state.reducer.hotels);
    const handleChildAgeChange = (value: number, childIndex: number, roomIndex: number) => {
        const updatedChildAges = [...childAges];
        updatedChildAges[childIndex] = value;
        setChildAges(updatedChildAges);
        dispatch(addChildAge({ ageIndex: childIndex, childAge: value, roomIndex }));
    };

    return (
        <Drawer title="" onClose={handleCancel} open={isModalOpen}>
            {key && <NationalityFields />}

            {hotelsRequest.rooms.map((room, index) => (
                <React.Fragment key={index}>
                    <Flex justify="space-between">
                        <Typography.Text className="font-bold text-lg">
                            Room {index + 1}
                        </Typography.Text>
                        {hotelsRequest.rooms.length > 1 &&
                            index === hotelsRequest.rooms.length - 1 && (
                                <Typography.Text
                                    className="text-bgOrange cursor-pointer"
                                    onClick={() => roomDelete(index)}
                                >
                                    Delete
                                </Typography.Text>
                            )}
                    </Flex>
                    {roomTypes.map(roomType => (
                        <React.Fragment key={roomType.key}>
                            <Flex justify="space-between" className="py-3">
                                <Flex vertical>
                                    <Typography.Text className=" font-bold">
                                        {roomType.label}
                                    </Typography.Text>
                                    <Typography.Text className=" text-xs">
                                        {roomType.description}
                                    </Typography.Text>
                                </Flex>
                                <Flex className="w-28" justify="space-between">
                                    <Image
                                        className="cursor-pointer"
                                        preview={false}
                                        width={33}
                                        src={minus}
                                        onClick={() =>
                                            handleCountChange(
                                                roomType.key as 'adult' | 'child',
                                                false,
                                                index
                                            )
                                        }
                                    />
                                    <Typography.Text className=" text-sm mt-2">
                                        {(() => {
                                            switch (roomType.key) {
                                                case 'adult':
                                                    return room?.adult;
                                                case 'child':
                                                    return room?.child;

                                                default:
                                                    return null;
                                            }
                                        })()}
                                    </Typography.Text>
                                    <Image
                                        className="cursor-pointer"
                                        preview={false}
                                        width={33}
                                        src={plus}
                                        onClick={() =>
                                            handleCountChange(
                                                roomType.key as 'adult' | 'child',
                                                true,
                                                index
                                            )
                                        }
                                    />
                                </Flex>
                            </Flex>
                        </React.Fragment>
                    ))}

                    {room.child > 0 && (
                        <Row gutter={[10, 10]}>
                            <Col span={12}>
                                {hotelsRequest.rooms[index].childAge.map((val, childIndex) => (
                                    <Flex vertical>
                                        <Typography.Text className=" font-bold mt-3">
                                            Child {childIndex + 1} Age:
                                        </Typography.Text>
                                        <Select
                                            className="mt-3"
                                            key={childIndex}
                                            style={{ width: 120 }}
                                            placeholder="Select Age"
                                            value={val}
                                            onChange={(value: number) =>
                                                handleChildAgeChange(value, childIndex, index)
                                            }
                                        >
                                            {[...Array(12)].map((_, age) => (
                                                <Option key={age + 2} value={age + 2}>
                                                    {age + 2}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Flex>
                                ))}
                            </Col>
                        </Row>
                    )}
                    <Divider className="text-gray-300" style={{ borderTop: '0.1rem dashed' }} />
                </React.Fragment>
            ))}
            <Flex className="mt-5" align="middle" justify="center">
                <ReactSVG src={add} className="fill-bgOrange mt-1" />
                <Typography.Text
                    className="font-bold mt-1 cursor-pointer text-bgOrange ml-1"
                    onClick={handleAddRoom}
                >
                    Add Another Room
                </Typography.Text>
            </Flex>
        </Drawer>
    );
};

export default BookModal;
