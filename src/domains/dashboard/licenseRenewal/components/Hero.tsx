import type { FC } from 'react';

import { Flex } from 'antd';

import HeroCard from './HeroCard';
import HeroLeft from '../assets/images/heroLeft.png';
import HeroRight from '../assets/images/heroRight.png';

interface HeroProps {}

const Hero: FC<HeroProps> = () => (
    <>
        <Flex justify="space-around" className="mt-10 hidden sm:flex w-2/3">
            <HeroCard
                count={1}
                image={HeroLeft}
                text="To renew your license, please send your license number via SMS to 6969"
            />
            <HeroCard
                count={2}
                image={HeroRight}
                text="Enter Voucher ID from the SMS
                you received"
            />
        </Flex>
        <Flex justify="space-around" className="mt-24  sm:hidden">
            <HeroCard
                count={1}
                image={HeroLeft}
                text="To renew your license, please send your license number via SMS to 6969. Enter Voucher ID from the SMS you received"
            />
        </Flex>
    </>
);

export default Hero;
