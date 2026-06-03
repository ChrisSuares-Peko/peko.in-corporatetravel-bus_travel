import { Col, Flex, Typography, Radio } from 'antd';

import { calculateDiscount } from '@src/domains/dashboard/plans/utils';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import ListPoints from './ListPoints';
import { PlanMode, PlanType } from '../../types';

type Props = {
    planId: number;
    feature: string[];
    benefits?: string[];
    planName: PlanMode;
    price: string | number;
    discount: number;
    selectedType: PlanMode;
    onSelectPlan: (
        plan: PlanMode,
        planId: number,
        price: string | number,
        discountedAmount: number
    ) => void;
    seletedDuration: PlanType;
};

const PlanCard = ({
    planId,
    price,
    planName,
    feature,
    benefits,
    selectedType,
    discount,
    onSelectPlan,
    seletedDuration,
}: Props) => {
    const { discountedAmount, discountPercentage } = calculateDiscount(price, discount);
    const { Text } = Typography;

    let Name;
    if (planName === 'WhatsApp Basic') {
        Name = 'Basic';
    } else {
        Name = 'Pro';
    }

    const durationLabel = seletedDuration === 'monthly' ? '/month' : '/year';

    const handleCardClick = () => {
        onSelectPlan(planName, planId, price, discountedAmount);
    };

    return (
        <Col key={planId} xs={24} sm={12} md={10} lg={11} xl={8} className="pt-3">
            <Flex
                onClick={handleCardClick}
                className={`flex-col h-full w-80 transition duration-300 transform border rounded-2xl cursor-pointer ${
                    selectedType === planName ? 'border-red-500' : 'border-gray-200'
                }`}
                align="stretch"
            >
                <Flex className="flex-col flex-grow gap-4 px-8 py-6" align="start" justify="start">
                    <Flex align="center" justify="space-between">
                        <Radio checked={selectedType === planName} onChange={() => {}} />
                    </Flex>
                    <Flex className="flex-col flex-grow gap-4">
                        <Typography.Text className="text-lg font-medium md:text-xl">
                            {Name}
                        </Typography.Text>
                        <Flex vertical align="flex-start" justify="center">
                            <Typography.Text className="text-xl font-normal">
                                {price === 0 ? `` : `AED `}
                                <Typography.Text className="text-3xl font-medium">
                                    {price === 0
                                        ? `Free`
                                        : `${formatNumberWithLocalString(discountedAmount, 0)} `}
                                    {price !== 0 && discountPercentage && discountPercentage > 0 ? (
                                        <>
                                            <Text className="text-2xl font-normal line-through text-textGray">
                                                {formatNumberWithLocalString(price, 0)}
                                            </Text>
                                            {discountPercentage && discountPercentage > 0 ? (
                                                <Text className="h-full px-2 py-2 mx-2 text-base text-green-700 rounded-sm bg-green-50">
                                                    {formatNumberWithLocalString(
                                                        discountPercentage,
                                                        0,
                                                        0
                                                    )}
                                                    % off
                                                </Text>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </Typography.Text>
                            </Typography.Text>
                        </Flex>
                        <ListPoints itemsWithTicks={feature} itemsWithoutTicks={benefits} />
                    </Flex>
                </Flex>
            </Flex>
        </Col>
    );
};

export default PlanCard;
