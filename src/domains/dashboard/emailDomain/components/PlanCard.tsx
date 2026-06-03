import { Button, Col, Flex, Typography, Image } from 'antd';

type Props = {
    planId: number;
    features: { label: string; value: string }[];
    planName: string;
    monthlyPrice: string | number;
    yearlyPrice: string | number;
    selectedType: string;
    image_url: string;
    description: string;
    handlePurchase: () => void;
};
const PlanCard = ({
    planId,
    features,
    planName,
    image_url,
    selectedType,
    monthlyPrice,
    yearlyPrice,
    description,
    handlePurchase,
}: Props) => (
    <Col xs={24} sm={12} md={10} lg={11} xl={7} className="pt-3" style={{ minWidth: '400px' }}>
        <Flex className="h-full flex-col rounded-2xl border transition duration-150 transform hover:scale-105">
            <Flex className="flex-col flex-grow gap-4 px-8 py-6">
                <Flex className="flex-col flex-grow gap-4">
                    <Typography.Text className="text-lg font-medium md:text-xl">
                        {planName}
                    </Typography.Text>

                    <Flex align="baseline" className="mt-2">
                        <Typography.Text className="text-3xl font-medium">
                            AED {selectedType === 'Monthly' ? monthlyPrice : yearlyPrice}
                        </Typography.Text>
                        <Typography.Text
                            className="text-sm font-normal ml-2"
                            style={{ fontSize: '0.8rem' }}
                        >
                            /{selectedType}
                        </Typography.Text>
                    </Flex>

                    <Flex vertical align="flex-start" className="mt-4">
                        {features.map((feat, index) => (
                            <Flex
                                key={index}
                                className="w-full mt-3"
                                style={{ alignItems: 'center' }}
                            >
                                <Typography.Text
                                    className="text-sm lg:text-base"
                                    style={{ minWidth: '100px' }}
                                >
                                    {feat.label}
                                </Typography.Text>

                                <Typography.Text
                                    className="text-sm lg:text-base font-semibold ml-2"
                                    style={{ flexGrow: 1 }}
                                >
                                    {feat.value}
                                </Typography.Text>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>

                {image_url && (
                    <Flex vertical className="mt-4 flex-wrap gap-4" justify="center">
                        <Typography.Text className="text-sm lg:text-base">Features</Typography.Text>
                        <Image
                            preview={false}
                            src={image_url || ''}
                            alt="Plan Image"
                            style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain' }}
                        />
                    </Flex>
                )}

                <Flex vertical justify="space-between" className="h-full mt-4">
                    <Typography.Paragraph className="font-normal leading-5 overflow-hidden text-ellipsis">
                        {description}
                    </Typography.Paragraph>
                    <Flex>
                        <Button
                            onClick={handlePurchase}
                            className="mt-4 w-full"
                            type="primary"
                            danger
                        >
                            Purchase
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    </Col>
);

export default PlanCard;
