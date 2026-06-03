import { Flex, Image } from 'antd';
import { Link } from 'react-router-dom';

import { Banner } from '../types';

interface PropType {
    bannerData: Banner;
}
const DashboardBusinessCard = ({ bannerData }: PropType) => (
    <Flex align="center" justify="center" className="pt-6 cursor-pointer">
        <Link to={bannerData.bannerLink}>
            <Image
                src={bannerData.bannerImage}
                preview={false}
                className="object-cover rounded-md lg:rounded-2xl"
            />
        </Link>
    </Flex>
);

export default DashboardBusinessCard;
