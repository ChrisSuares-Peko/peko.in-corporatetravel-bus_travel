import { Flex, Typography, Divider } from 'antd';

type Props = {
    label: string;
    value: string | number | undefined;
};

export const DataRow = ({ label, value }: Props) => (
    <Flex vertical>
        <Flex justify="space-between" className="mx-1">
            <Typography.Text className="text-base text-green-800">{label}</Typography.Text>
            <Typography.Text
                className={`text-base ${label === 'Certification' && ' text-white bg-bgGold rounded-2xl px-2'}`}
            >
                {value}
            </Typography.Text>
        </Flex>
        <Divider />
    </Flex>
);
