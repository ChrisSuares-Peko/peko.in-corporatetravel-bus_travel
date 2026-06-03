/* eslint-disable react/prop-types */
import { Button, Flex } from 'antd';

const CheckRateButton: React.FC<{
    onClick: () => void;
    isLoading: boolean;
}> = ({ onClick, isLoading }) => (
    <Flex className="mt-5 w-full">
        <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            danger
            className="w-full"
            onClick={onClick}
        >
            Check Rate
        </Button>
    </Flex>
);

export default CheckRateButton;
