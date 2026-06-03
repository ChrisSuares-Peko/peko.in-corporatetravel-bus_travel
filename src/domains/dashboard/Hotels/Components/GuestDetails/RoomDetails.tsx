import { useState } from 'react';

import { Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import CheckInRoomDetails from './CheckInRoomDetails';
import DateFields from '../../hooks/useDateField';
import CancelPolicy from '../CancelPolicy';

interface room {
    name: string;
    sqft: number;
    refund: string;
    cancellation: string;
    meal: string;
    rateNotes: any;
    cancellationPolicy?: any;
}

const RoomDetails = ({
    name,
    sqft,
    refund,
    cancellation,
    meal,
    rateNotes,
    cancellationPolicy,
}: room) => {
    const date = new Date(cancellation);
    const [isModal, setIsModal] = useState<boolean>(false);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
    });
    const cancellationPolicyModal = () => {
        setIsModal(true);
    };
    const cancelModal = () => {
        setIsModal(false);
    };

    const { showModal, isModalOpen, handleCancel } = DateFields();
    return (
        <Content className="pt-4 ">
            <Content className="rounded-md border border-gray-200">
                <Flex vertical className="p-5">
                    <Flex>
                        <Flex vertical>
                            <Typography.Text className="font-medium text-base">
                                {name}
                            </Typography.Text>
                            <Typography.Text className="pt-1 font-bold text-xs text-slate-500">
                                {meal}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                    <Flex className=" mt-4">
                        <Typography.Text className="text-sm text-green-800">
                            {refund}{' '}
                        </Typography.Text>
                        {/* {Array.from({ length: guests }).map((_, index) => (
                            <ReactSVG key={index} src={userIcon} />
                        ))} */}
                    </Flex>
                    <Flex gap="small" className="mt-3">
                        <Flex>
                            <Typography.Text
                                className="pt-1 text-sm font-medium cursor-pointer text-red-600"
                                onClick={showModal}
                            >
                                View Room Details
                            </Typography.Text>
                        </Flex>
                    </Flex>
                    <Typography.Text
                        className="pt-1 text-sm font-medium cursor-pointer"
                        onClick={cancellationPolicyModal}
                    >
                        View cancelation policy Details
                    </Typography.Text>
                </Flex>
            </Content>
            <CheckInRoomDetails
                roomData={rateNotes}
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
            />
            <CancelPolicy
                isModalOpen={isModal}
                handleCancel={cancelModal}
                cancellationPolicy={cancellationPolicy}
            />
        </Content>
    );
};

export default RoomDetails;
