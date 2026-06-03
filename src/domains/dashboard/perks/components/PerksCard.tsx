import { Flex, Card, Typography, Image } from 'antd';

type Props = {
    img: string;
    title: string;
    desc: string;
};

const PerksCard = ({ img, title, desc }: Props) => (
    <Flex className="mt-14 w-80" vertical>
        <Card size="small" className="w-80 h-52 flex justify-center items-center">
            <Image width={120} preview={false} src={img} />
        </Card>
        <Typography.Text className="text-start mt-4 text-base text-iconRed">
            {title}
        </Typography.Text>
        <Typography.Text className="text-start mt-4 text-sm text-titleText">{desc}</Typography.Text>
    </Flex>
);

export default PerksCard;
