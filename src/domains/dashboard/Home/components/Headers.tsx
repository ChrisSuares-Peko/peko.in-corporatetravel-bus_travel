import { Button, Flex, Image, Skeleton, Typography } from 'antd';
import { Link } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';
// import { paths } from '@src/routes/paths';
// import PekoOne from '@assets/PekoOne.png';

import useBannersApi from '../hooks/useBannersApi';

const Headers = () => {
    const { Text } = Typography;
    const { sm } = useScreenSize();
    const { data, isLoading } = useBannersApi('TOP');

    return isLoading ? (
        <Flex
            className="px-4 py-4 mb-5 sm:px-10 sm:py-7 banner-gradient rounded-2xl"
            justify="space-between"
            align="center"
        >
            <Skeleton active />
        </Flex>
    ) : (
        data && data.length > 0 && (
            <Flex
                className="px-4 py-4 mb-5 sm:px-10 sm:py-7 banner-gradient rounded-2xl"
                justify="space-between"
                align="center"
            >
                <Flex vertical gap={sm ? 16 : 10}>
                    <Text className="text-base font-medium xxl:text-xl">
                        {data[0].bannerTitle}
                        {/* <Text className="text-base font-medium text-brandColor xxl:text-xl">
                        Save Cost!
                    </Text> */}
                    </Text>
                    <Text
                        className="max-w-xl text-[0.65rem] font-normal sm:text-xs xxl:max-w-lg"
                        style={{ lineHeight: sm ? '1.4rem' : '1.1rem' }}
                    >
                        {data[0].description}
                    </Text>
                    <Link to={data[0].bannerLink}>
                        <Button
                            danger
                            size={sm ? 'middle' : 'small'}
                            type="primary"
                            className="w-24 text-xs font-normal sm:text-base sm:font-medium sm:w-32"
                        >
                            {data[0].buttonText}
                        </Button>
                    </Link>
                </Flex>
                <Image
                    src={data[0].bannerImage}
                    preview={false}
                    style={{ width: '100%', height: '100%', maxHeight: '9rem' }} // auto 24vh
                />
            </Flex>
        )
    );
};

export default Headers;
