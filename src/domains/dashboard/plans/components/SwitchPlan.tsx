import { Col, Flex, Tag, Typography } from 'antd';

import '../assets/styles.css';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { PackagePrices, PlanType } from '../types';

interface SwitchPlanProps {
    selectedType: PlanType;
    handleChange: (tab: PlanType) => void;
    discount: PackagePrices;
}

const SwitchPlan: React.FC<SwitchPlanProps> = ({
    selectedType,
    handleChange,
    discount,
}: SwitchPlanProps) => {
    const annualDiscount = discount?.[PlanType.Annually] ?? 0;
    const monthlyDiscount = discount?.[PlanType.Monthly] ?? 0;
    return (
        <Col className="m-0 mt-3 border rounded-full sm:block w-fit">
            <Flex
                justify="space-between"
                align="center"
                className="h-full xs:flex-col sm:mx-0 sm:flex-row xs:gap-4 sm:gap-4"
            >
                <Flex className="p-2" gap={16}>
                    <Flex
                        className={`flex xs:flex-col md:flex-row cursor-pointer justify-between items-center px-4 sm:px-6 p-2 gap-2 rounded-full bg-white  ${selectedType === PlanType.Monthly ? 'border border-gray-300 shadow-md' : ''}`}
                        onClick={() => handleChange(PlanType.Monthly)}
                    >
                        <Typography.Text className="text-sm font-medium text-center">
                            Billed <br className="sm:hidden" /> Monthly <br className="sm:hidden" />
                            {monthlyDiscount && monthlyDiscount > 0 ? (
                                <Tag
                                    bordered={false}
                                    className="mx-1 text-xs text-green-700 rounded-sm bg-green-50"
                                >
                                    Upto {formatNumberWithLocalString(monthlyDiscount, 0, 0)}% off
                                </Tag>
                            ) : (
                                ''
                            )}
                        </Typography.Text>
                    </Flex>
                    <Flex
                        className={`flex xs:flex-col md:flex-row cursor-pointer justify-between items-center px-4 sm:px-6 p-2 gap-2 rounded-full bg-white  ${selectedType === PlanType.Annually ? 'border border-gray-300 shadow-md' : ''}`}
                        onClick={() => handleChange(PlanType.Annually)}
                    >
                        <Typography.Text className={`text-sm font-medium text-center `}>
                            Billed <br className="sm:hidden" />
                            Annually <br className="sm:hidden" />
                            {annualDiscount && annualDiscount > 0 ? (
                                <Tag
                                    bordered={false}
                                    className="mx-1 text-xs text-green-700 rounded-sm bg-green-50"
                                >
                                    Upto {formatNumberWithLocalString(annualDiscount, 0, 0)}% off
                                </Tag>
                            ) : (
                                ''
                            )}
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Flex>
        </Col>
    );
};

export default SwitchPlan;
