import { Flex, Typography } from 'antd';
import { useSearchParams } from 'react-router-dom';

const ComingSoon = () => {
    const [searchParams] = useSearchParams();
    const service = searchParams.get('service') || 'This Service';

    return (
        <Flex
            vertical
            align="center"
            justify="center"
            className="min-h-[60vh] text-center px-4"
            gap={12}
        >
            <Typography.Title level={3} className="m-0 text-gray-700">
                {service} — Coming Soon
            </Typography.Title>
            <Typography.Text className="text-gray-400 text-base max-w-sm">
                We are working hard to bring this to you. Stay tuned!
            </Typography.Text>
        </Flex>
    );
};

export default ComingSoon;
