import { Flex, Typography, Radio, Image } from 'antd';
import { Content } from 'antd/es/layout/layout';

type Props = {
    img: string;
    title: string;
    credits: string;
    price: any;
    id: number;
    selectedPackage: number | null;
};

export const ProjectCard = ({ img, title, credits, price, id, selectedPackage }: Props) => (
    <Flex className="relative">
        <Image
            src={img}
            height={180}
            width={180}
            alt={title}
            loading="eager"
            className="rounded-xl object-cover"
            preview={false}
        />
        <Flex
            vertical
            justify="end"
            align="start"
            className="absolute inset-0 bottom-1 ms-2 p-1 text-white "
        >
            <Typography.Text className="text-white text-[10px] z-10">{title}</Typography.Text>
            <Flex justify="space-between" align="center" className="w-full z-10" gap={3}>
                <Typography.Text className="text-white text-xs font-medium">
                    {credits} Credits for AED {price}
                </Typography.Text>
                <Radio value={id} />
            </Flex>
        </Flex>
        <Content className="absolute inset-0 rounded-xl overflow-hidden">
            <Content className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[rgba(0,0,0,0.5)] to-transparent" />
        </Content>
    </Flex>
);
