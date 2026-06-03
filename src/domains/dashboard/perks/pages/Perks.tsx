import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Typography } from 'antd';

import PerksCard from '../components/PerksCard';
import { data } from '../utils/data';

type Props = {};

const Perks = (props: Props) => (
    <Flex wrap="wrap" vertical className="xs:mx-0 md:mx-8 mb-8">
        <Flex wrap="wrap" justify="space-between" align="center">
            <Typography.Text className="text-3xl text-valueText">Perks</Typography.Text>
            <Button type="primary" className="xs:block md:hidden" danger>
                Order History
            </Button>
            <Input
                placeholder="Search for services"
                suffix={<SearchOutlined />}
                className="xs:w-full md:w-2/3 h-12 xs:mt-4 md:mt-0"
            />
            <Button type="primary" className="xs:hidden md:block" danger>
                Order History
            </Button>
        </Flex>
        <Flex wrap="wrap" gap="large" justify="center" align="start" className="mt-14">
            {data.map((item, index) => (
                <PerksCard key={index} img={item.img} title={item.title} desc={item.desc} />
            ))}
        </Flex>
    </Flex>
);
export default Perks;
