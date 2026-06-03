import { Space, Typography, Divider, Button, Flex } from 'antd';

import { useAppSelector } from '@src/hooks/hooks';
import { formatNumberWithLocalString } from '@utils/priceFormat';

type OrderSummaryProps = {
    formRef: React.MutableRefObject<any>;
};
const OrderSummary = ({ formRef }: OrderSummaryProps) => {
    const cartDetails = useAppSelector(state => state.reducer.cart);

    // Calculate other values as needed (shipping, discount, VAT, total)
    const grandTotal = cartDetails?.grandTotal || 0;
    const vatRate = cartDetails?.totalVat || 0;
    const subTotal = cartDetails.itemsTotalAmount - vatRate;
    const shipping = cartDetails?.shippingCharge || 0;

    return (
        <Space
            direction="vertical"
            className="border-0 md:border rounded-lg mt-2 p-2 md:p-4"
            style={{ width: '100%', border: '' }}
        >
            <Flex gap={11} vertical>
                <Flex>
                    <Typography.Text strong>Total Amount</Typography.Text>
                </Flex>
                <Flex justify="space-between">
                    <Space>
                        <Typography.Text>Sub-total</Typography.Text>
                    </Space>
                    <Space>
                        <Typography.Text className="font-roboto text-gray-900 font-medium">
                            AED {formatNumberWithLocalString(subTotal)}
                        </Typography.Text>
                    </Space>
                </Flex>
                <Flex justify="space-between">
                    <Space>
                        <Typography.Text>VAT</Typography.Text>
                    </Space>
                    <Space>
                        <Typography.Text className="font-roboto text-gray-900 font-medium">
                            AED {formatNumberWithLocalString(cartDetails?.totalVat)}
                        </Typography.Text>
                    </Space>
                </Flex>
                <Flex justify="space-between">
                    <Space>
                        <Typography.Text>Shipping</Typography.Text>
                    </Space>
                    <Space>
                        <Typography.Text className="font-roboto text-gray-900 font-medium">
                            {cartDetails.freeDelivery === true
                                ? 'AED 0.00'
                                : `AED ${formatNumberWithLocalString(shipping)}`}
                        </Typography.Text>
                    </Space>
                </Flex>
                <Flex justify="space-between">
                    <Space>
                        <Typography.Text>Discount</Typography.Text>
                    </Space>
                    <Space>
                        <Typography.Text className="font-roboto text-gray-900 font-medium">
                            AED 0.00
                        </Typography.Text>
                    </Space>
                </Flex>
                <Divider style={{ margin: '8px 0' }} />
                <Flex justify="space-between">
                    <Space>
                        <Typography.Text strong>Total</Typography.Text>
                    </Space>
                    <Space>
                        <Typography.Text strong className="font-roboto text-gray-900 font-medium">
                            AED {formatNumberWithLocalString(cartDetails?.grandTotal)}
                        </Typography.Text>
                    </Space>
                </Flex>
            </Flex>
            <Button
                type="primary"
                danger
                disabled={cartDetails.count < 1}
                onClick={() => {
                    formRef.current.handleSubmit();
                }}
                className="w-full"
            >
                Pay Now
            </Button>
        </Space>
    );
};

export default OrderSummary;
