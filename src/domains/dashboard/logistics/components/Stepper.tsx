import { Flex, Image, Steps, Typography } from 'antd';

import {
    HandshakeSVG,
    PackageSVG,
    TruckSVG,
    PackageSuccessSVG,
    TruckSuccessSVG,
    HandshakeSuccessSVG,
    TickSuccessSVG,
    TickSVG,
} from '../assets/icons/order-status';
import { shipmentStatus } from '../utils/data';

const { Step } = Steps;

const stepIcons = [PackageSVG, TickSVG, TruckSVG, HandshakeSVG];
const stepIconSuccess = [PackageSuccessSVG, TickSuccessSVG, TruckSuccessSVG, HandshakeSuccessSVG];
const stepTitles = ['Order Placed', 'In Progress', 'Shipped', 'Delivered'];

interface StepperProps {
    current: number;
}
function Stepper({ current }: StepperProps) {
    return (
        <Flex className="block my-8">
            <Flex className="hidden md:block">
                <Steps
                    className="mt-6 sm:mt-14"
                    current={current}
                    progressDot
                    size="default"
                    labelPlacement="vertical"
                >
                    {stepTitles.map((title, index) => (
                        <Step
                            status={current < index ? 'wait' : 'finish'}
                            key={index}
                            title={
                                <Flex>
                                    {current < index ? (
                                        <Image preview={false} src={stepIcons[index]} alt="icon" />
                                    ) : (
                                        <Image
                                            preview={false}
                                            src={stepIconSuccess[index]}
                                            alt="icon"
                                        />
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
            </Flex>
            <Flex className="block md:hidden">
                <Steps initial={1} direction="vertical" current={current} items={shipmentStatus} />
            </Flex>
        </Flex>
    );
}

export default Stepper;
