import React, { useCallback } from 'react';

import { Button, Divider, Flex, Modal, Radio, Typography } from 'antd';

import { ITripData } from '../types/airlineTypes';

interface ModalProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    tripData: ITripData;
    setTripData: any;
}

const PassengerSelectModal: React.FC<ModalProps> = ({
    isModalOpen,
    handleCancel,
    tripData,
    setTripData,
}) => {
    const updateTripData = useCallback(
        (key: string, val: number) => {
            if (
                tripData.adults + tripData.children + tripData.infants === 9 &&
                // @ts-ignore
                val >= Number(tripData[key])
            )
                return;

            if (key === 'adults' && val === 0) return;

            setTripData((prevTripData: object) => ({
                ...prevTripData,
                [key]: val,
            }));
        },
        [setTripData, tripData]
    );
    const updateTripClass = useCallback(
        (key: string, val: string) => {
            setTripData((prevTripData: object) => ({
                ...prevTripData,
                [key]: val,
            }));
        },
        [setTripData]
    );

    return (
        <Modal
            closeIcon={false}
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <Flex className="w-full" justify="flex-end" gap={10} key="">
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={handleCancel}
                        className="rounded-sm"
                    >
                        Submit
                    </Button>

                    {/* <Button key="back" onClick={handleCancel} className="rounded-sm ">
                        Cancel
                    </Button> */}
                </Flex>,
            ]}
            width={370}
        >
            <Flex justify="space-between">
                <Flex vertical>
                    <Typography.Text className=" font-bold ml-5">Adults</Typography.Text>
                    <Typography.Text className=" text-xs ml-5">
                        12+ years on travel date
                    </Typography.Text>
                </Flex>
                <Flex className="w-28" justify="space-between" align="flex-start">
                    <Button
                        shape="circle"
                        onClick={() =>
                            updateTripData('adults', tripData.adults > 1 ? tripData.adults - 1 : 0)
                        }
                        className="text-xl flex justify-center items-center font-light text-gray-400 p-0 m-0"
                    >
                        -
                    </Button>

                    <Typography.Text className=" text-sm mt-2">{tripData.adults}</Typography.Text>
                    <Button
                        shape="circle"
                        onClick={() => updateTripData('adults', tripData.adults + 1)}
                        className="text-xl flex justify-center items-center  font-light text-gray-400"
                    >
                        +
                    </Button>
                </Flex>
            </Flex>
            <Flex className="mt-5" justify="space-between">
                <Flex vertical>
                    <Typography.Text className=" font-bold ml-5">Children</Typography.Text>
                    <Typography.Text className=" text-xs ml-5">
                        2-12 years on travel date
                    </Typography.Text>
                </Flex>
                <Flex className="w-28" justify="space-between" align="flex-start">
                    <Button
                        shape="circle"
                        onClick={() =>
                            updateTripData(
                                'children',
                                tripData.children > 0 ? tripData.children - 1 : 0
                            )
                        }
                        className="text-xl flex justify-center items-center font-light text-gray-400 p-0 m-0"
                    >
                        -
                    </Button>
                    <Typography.Text className=" text-sm mt-2">{tripData.children}</Typography.Text>
                    <Button
                        shape="circle"
                        onClick={() => updateTripData('children', tripData.children + 1)}
                        className="text-xl flex justify-center items-center  font-light text-gray-400"
                    >
                        +
                    </Button>
                </Flex>
            </Flex>
            <Flex className="mt-5" justify="space-between">
                <Flex vertical>
                    <Typography.Text className=" font-bold ml-5">Infants</Typography.Text>
                    <Typography.Text className=" text-xs ml-5">
                        Below 2 years on travel date
                    </Typography.Text>
                </Flex>
                <Flex className="w-28" justify="space-between" align="flex-start">
                    <Button
                        shape="circle"
                        onClick={() =>
                            updateTripData(
                                'infants',
                                tripData.infants > 0 ? tripData.infants - 1 : 0
                            )
                        }
                        className="text-xl flex justify-center items-center font-light text-gray-400 p-0 m-0"
                    >
                        -
                    </Button>
                    <Typography.Text className=" text-sm mt-2">{tripData.infants}</Typography.Text>
                    <Button
                        shape="circle"
                        onClick={() => updateTripData('infants', tripData.infants + 1)}
                        className="text-xl flex justify-center items-center  font-light text-gray-400"
                    >
                        +
                    </Button>
                </Flex>
            </Flex>
            <Divider dashed className="border-t-2" />
            <Radio.Group
                onChange={e => updateTripClass('class', e.target.value)}
                className="rounded-none"
                style={{ borderRadius: 0 }}
                value={tripData.class}
                size="middle"
            >
                <Radio.Button className="rounded-none m-1" style={{ borderRadius: 0 }} value="5">
                    Economy
                </Radio.Button>
                <Radio.Button className="rounded-none m-1" style={{ borderRadius: 0 }} value="2">
                    Business Class
                </Radio.Button>
                <Radio.Button className="rounded-none m-1" style={{ borderRadius: 0 }} value="1">
                    First Class
                </Radio.Button>
                <Radio.Button className="rounded-none m-1" style={{ borderRadius: 0 }} value="4">
                    Premium Economy
                </Radio.Button>
            </Radio.Group>
        </Modal>
    );
};

export default PassengerSelectModal;
