import { Typography, Card, Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { PlanDetail } from '../types';

import '../assets/style.css';

interface PlanCardWebProps {
    plan: PlanDetail;
    hideBtn?: boolean;
}

const planName = (value: string) => {
    if (value.includes('Flexi Plan')) return 'flexi';
    if (value.includes('Premium Plan')) return 'premium';
    if (value.includes('Basic Plan')) return 'basic';
    return 'plans';
};

const PlanCardWeb = ({ plan, hideBtn }: PlanCardWebProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { id, name, highlights, price, description, billingCycle, is_available } = plan;

    let cost;
    if (billingCycle === 'MONTHLY') {
        cost = (parseInt(price, 10) * 12).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        cost = `Yearly cost you AED ${cost}`;
    } else {
        cost = (parseInt(price, 10) / 12).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        cost = `Monthly cost you AED ${cost}`;
    }

    return (
        <Card className="h-full sm:p-3 sm:py-6 flex justify-between rounded-2xl _scale_on_hover">
            <Flex className="h-full w-full" gap={10} vertical>
                <Typography.Text className="text-xl md:text-2xl font-medium  overflow-hidden line-clamp-1 h-8">
                    {name}
                </Typography.Text>

                <Typography.Paragraph className="font-normal text-sm h-10 overflow-hidden line-clamp-2">
                    {description}
                </Typography.Paragraph>

                <Typography.Text className="text-lg sm:text-xl md:text-2xl font-medium mt-2">
                    {`AED ${parseInt(price, 10).toLocaleString()}`}{' '}
                    <span className=" text-base font-light">
                        {billingCycle === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                    </span>
                </Typography.Text>

                <Typography.Text className="text-gray-400">{cost}</Typography.Text>

                <Typography.Paragraph
                    className="text-sm font-light leading-4 h-36 overflow-hidden text-ellipsis"
                    style={{ whiteSpace: 'pre-wrap' }}
                >
                    {highlights}
                </Typography.Paragraph>

                <Button
                    className="mt-6 w-full sm:w-3/4"
                    type="primary"
                    danger
                    onClick={() => {
                        if (!is_available) {
                            dispatch(
                                showToast({
                                    description:
                                        "Workspace currently unavailable. We'll notify you when it's accessible. Thank you.",
                                    variant: 'error',
                                })
                            );
                            return;
                        }
                        navigate(planName(name), { state: id });
                    }}
                >
                    Purchase
                </Button>
            </Flex>
        </Card>
    );
};

export default PlanCardWeb;
