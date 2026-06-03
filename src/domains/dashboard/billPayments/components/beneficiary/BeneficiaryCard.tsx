import { Button, Card, Flex, Image, Typography } from 'antd';

import defaultServiceImage from '@assets/icons/BillPayments.svg';

import { useGetBillApi } from '../../hooks/useGetBillApi';
import { BeneficiaryCardProps } from '../../types';

const BeneficiaryCard = ({ beneficiary, handleEdit }: BeneficiaryCardProps) => {
    const serviceImage = beneficiary?.serviceOperator?.serviceImage ?? defaultServiceImage;
    const { directPay, isSubmitting } = useGetBillApi();

    return (
        <Card
            size="small"
            className="sm:rounded-2xl"
            title={
                <Typography.Text className=" text-sm font-normal text-cardHTitleText sm:px-3">
                    {beneficiary?.serviceOperator?.serviceProvider}
                </Typography.Text>
            }
            extra={
                <Typography.Text
                    onClick={handleEdit}
                    className="sm:px-3 text-bgOrange2 cursor-pointer"
                >
                    Edit
                </Typography.Text>
            }
        >
            <Flex className=" w-full sm:px-2 gap-3" align="center" justify="space-between">
                <Flex align="center" gap={12}>
                    <Image
                        src={serviceImage}
                        width={50}
                        height={50}
                        preview={false}
                        className="rounded-full object-contain"
                    />
                    <Flex vertical gap={4}>
                        <Typography.Text className=" text-xs font-normal">
                            {beneficiary.name}
                        </Typography.Text>
                        <Typography.Text className=" text-xs font-normal text-black/45">
                            {beneficiary.accountNo}
                        </Typography.Text>
                    </Flex>
                </Flex>
                <Button
                    type="primary"
                    className="text-xs sm:text-sm"
                    danger
                    onClick={() => directPay(beneficiary)}
                    loading={isSubmitting}
                >
                    Pay Now
                </Button>
            </Flex>
        </Card>
    );
};

export default BeneficiaryCard;
