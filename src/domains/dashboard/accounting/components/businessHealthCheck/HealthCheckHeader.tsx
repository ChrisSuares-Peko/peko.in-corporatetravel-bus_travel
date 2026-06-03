import { Flex, Typography } from 'antd';

type Props = {};

const HealthCheckHeader = (props: Props) => (
    <Flex gap="middle" vertical>
        <Typography.Text className="text-3xl font-semibold">Business Health Check</Typography.Text>
        <Typography.Paragraph className="text-xl">
            We are dedicated to helping you streamline your accounting processes and ensure
            compliance with UAE regulations. Please fill out the following questionnaire so we can
            better understand your business and provide tailored advice.
        </Typography.Paragraph>
    </Flex>
);

export default HealthCheckHeader;
