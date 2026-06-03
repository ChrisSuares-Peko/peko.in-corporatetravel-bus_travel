import { LoadingOutlined } from '@ant-design/icons';
import { Button, Image, Typography, Grid, Spin } from 'antd'; // Removed Flex import as it's not an antd component
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import vendorLandingIconSVG from '../../assets/vendorLandingIconSVG.svg';
import { useGetKYBDetailsApi } from '../../hooks/useGetKYB';

const { Text } = Typography;
const { useBreakpoint } = Grid;

const VendorInfoSection = () => {
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const imageHeight = screens.md ? 236 : 150;
    const imageWidth = screens.md ? 224 : 130;
    const { kybData, isLoading } = useGetKYBDetailsApi();

    const buttonText = kybData?.status ? 'Check Status of KYB' : 'Activate your account';

    return isLoading ? (
        <div className="flex items-center justify-center" style={{ height: '70vh' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
    ) : (
        <div className="flex flex-col items-center rounded-3xl bg-stone-50 text-center p-8 md:p-10 pb-9 pt-3 xl:h-full md:h-auto mb-4">
            <Image
                height={imageHeight}
                width={imageWidth}
                src={vendorLandingIconSVG}
                preview={false}
                alt="Dashboard Logo"
            />
            <Text className="md:text-xl text-[18px] font-medium text-gray-700 mt-4">
                Now send money to your international vendor at a good price
            </Text>
            <Button
                className="md:mt-8 mt-4"
                type="primary"
                danger
                onClick={() => navigate(`${paths.vendorPayouts.activateAccount}`)}
            >
                {buttonText}
            </Button>
        </div>
    );
};

export default VendorInfoSection;
