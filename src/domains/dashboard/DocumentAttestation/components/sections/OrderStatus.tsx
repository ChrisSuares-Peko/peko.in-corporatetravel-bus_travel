import React from 'react';

import { Flex, Image, Steps, Typography } from 'antd';

import {
    Completed,
    Dispatched,
    Processing,
    orderAssigned,
    orderPickedup,
    CompletedSuccess,
    DispatchedSuccess,
    ProcessingSuccess,
    orderAssignedSuccess,
    orderPickedupSuccess,
} from '../../assets/icons/order-status';

const stepIconSuccess = [
    orderPickedupSuccess,
    orderAssignedSuccess,
    ProcessingSuccess,
    DispatchedSuccess,
    CompletedSuccess,
];
const stepIcons = [orderPickedup, orderAssigned, Processing, Dispatched, Completed];

type props = {
    status: 'PICKUP' | 'ASSIGNED' | 'PROCESSING' | 'DISPATCHED' | 'COMPLETED';
};
const OrderStatus = ({ status }: props) => {
    const steps = ['pickup', 'assigned', 'processing', 'dispatched', 'completed'];
    const index = steps.findIndex(step => step.toLowerCase() === status.toLowerCase());

    const stepTitles = [
        'Order Picked Up',
        'Order Assigned',
        'Processing',
        'Dispatched',
        'Completed',
    ];
    const Orderstatus = {
        PICKUP: 0,
        ASSIGNED: 1,
        PROCESSING: 2,
        DISPATCHED: 3,
        COMPLETED: 4,
    };
    const currentStep = Orderstatus[status];

    return (
        <Steps
            current={index}
            size="small"
            labelPlacement="vertical"
            className="sm:mt-8"
            // status={currentStep}
        >
            {stepTitles.map((title, i) => (
                <Steps.Step
                    status={currentStep < i ? 'wait' : 'finish'}
                    key={i}
                    title={
                        <Flex>
                            {currentStep < i ? (
                                <Image preview={false} src={stepIcons[i]} alt="icon" />
                            ) : (
                                <Image preview={false} src={stepIconSuccess[i]} alt="icon" />
                            )}
                        </Flex>
                    }
                    description={
                        <Typography.Text className="mt-4 text-xs font-medium">
                            {title}
                        </Typography.Text>
                    }
                />
            ))}
        </Steps>
    );
};

export default OrderStatus;
