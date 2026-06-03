import { Flex, Image, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import { DollarIcon, GearIcon, TargetIcon } from '../../assets/icons';
import { NafaImg } from '../../assets/images';

type Props = {};

const Footer = (props: Props) => (
    <Flex gap="large" className="w-full my-5" vertical>
        <Flex className="w-full" justify="center">
            <Image preview={false} width={100} src={NafaImg} />
        </Flex>
        <Flex gap="large" wrap="wrap" className="w-full" justify="space-around">
            <Flex gap="middle" align="center" className="w-72">
                <ReactSVG src={GearIcon} />
                <Flex gap={2} vertical>
                    <Typography.Text className="text-sm font-semibold">
                        The most tech-forward
                    </Typography.Text>
                    <Typography.Text className="text-[9px]">
                        We have an unbeatable combo: a team of finance experts paired with a
                        top-notch in-house engineering team.
                    </Typography.Text>
                </Flex>
            </Flex>
            <Flex gap="middle" align="center" className="w-72">
                <ReactSVG src={TargetIcon} />
                <Flex gap={2} vertical>
                    <Typography.Text className="text-sm font-semibold">
                        The most tech-forward
                    </Typography.Text>
                    <Typography.Text className="text-[9px]">
                        We have an unbeatable combo: a team of finance experts paired with a
                        top-notch in-house engineering team.
                    </Typography.Text>
                </Flex>
            </Flex>
            <Flex gap="middle" align="center" className="w-72">
                <ReactSVG src={DollarIcon} />
                <Flex gap={2} vertical>
                    <Typography.Text className="text-sm font-semibold">
                        The most tech-forward
                    </Typography.Text>
                    <Typography.Text className="text-[9px]">
                        We have an unbeatable combo: a team of finance experts paired with a
                        top-notch in-house engineering team.
                    </Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    </Flex>
);

export default Footer;
