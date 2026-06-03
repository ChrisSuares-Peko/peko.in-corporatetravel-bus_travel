import { EnvironmentOutlined } from '@ant-design/icons';
import { Col, Flex, Grid, Image, Row, Skeleton, Space, Tag, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link, useParams } from 'react-router-dom';

import emailIcon from '@domains/dashboard/Connect/assets/icons/email.svg';
// import image from '@domains/dashboard/Connect/assets/icons/etisalat.png';
import webIcon from '@domains/dashboard/Connect/assets/icons/website.svg';

import DetailsForm from '../components/DetailsForm';
import useServiceDetailApi from '../hooks/useServiceDetailApi';

const ConnectDetail = () => {
    const { id } = useParams();
    const { data, isLoading } = useServiceDetailApi(id);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const openGmail = (email: string) => {
        const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
        window.open(gmailUrl, '_blank');
    };
    return (
        <Content className="mt-3 sm:mt-0">
            <Row>
                {isLoading ? (
                    <Col span={24}>
                        <Skeleton active avatar paragraph={{ rows: 10 }} className="h-full" />
                    </Col>
                ) : (
                    <Col xs={24}>
                        <div className="w-full h-[11.5rem] md:bg-red-50 rounded-lg relative">
                            {}
                        </div>
                        <Flex vertical className="md:px-10 px-2">
                            <Flex className="absolute top-5 sm:top-16 items-center md:gap-4">
                                <Flex className="flex justify-center items-center  md:w-44 md:h-44  w-32 h-36 bg-white rounded-md border border-neutral-400">
                                    <Image
                                        src={data?.logo}
                                        preview={false}
                                        alt="service logo"
                                        className="object-contain"
                                        height={120}
                                        width={100}
                                    />
                                </Flex>
                                <Flex className="ml-3 md:flex-row flex-col" gap={18}>
                                    <Flex>
                                        <Typography.Text className=" text-center text-neutral-900 text-xl sm:text-3xl font-medium">
                                            {data?.serviceProvider}
                                        </Typography.Text>
                                    </Flex>
                                    {screens.xs && (
                                        <Tag
                                            bordered={false}
                                            color="success"
                                            className=" text-green-700 text-xs font-medium p-1 rounded w-fit"
                                        >
                                            {data?.rewards}
                                        </Tag>
                                    )}
                                    {data?.website && (
                                        <Flex gap={5} align="center">
                                            <Image src={webIcon} preview={false} />
                                            <Link
                                                to={
                                                    data.website.startsWith('http://') ||
                                                    data.website.startsWith('https://')
                                                        ? data.website
                                                        : `https://${data.website}`
                                                }
                                                target="_blank"
                                                className="hover:underline"
                                            >
                                                <Typography.Text className="text-xs md:text-sm">
                                                    {data.website}
                                                </Typography.Text>
                                            </Link>
                                        </Flex>
                                    )}

                                    {data?.email && (
                                        <Flex gap={5} align="center">
                                            <Image src={emailIcon} preview={false} />
                                            <Typography.Text
                                                className="text-xs md:text-sm cursor-pointer"
                                                onClick={() => openGmail(data.email)}
                                            >
                                                {data.email}
                                            </Typography.Text>
                                        </Flex>
                                    )}
                                </Flex>
                            </Flex>
                            <Flex className="mt-2 sm:mt-10 md:mt-20" vertical gap={28}>
                                {!screens.xs && (
                                    <Flex>
                                        <Tag
                                            bordered={false}
                                            color="success"
                                            className=" text-green-700 text-sm font-medium px-2"
                                        >
                                            {data?.rewards}
                                        </Tag>
                                    </Flex>
                                )}
                                <Flex vertical gap={15}>
                                    <Typography.Text className="text-sm sm:text-base font-medium">
                                        About {data?.serviceProvider}
                                    </Typography.Text>
                                    <Typography.Text className="text-xs sm:text-sm font-normal">
                                        {data?.description}
                                    </Typography.Text>
                                </Flex>
                                {data?.services && (
                                    <Flex vertical gap={15}>
                                        <Typography.Text className="text-sm sm:text-base font-medium">
                                            Services
                                        </Typography.Text>
                                        {screens.xs ? (
                                            <Space className="overflow-y-auto w-full">
                                                {data?.services.map((service, i) => (
                                                    <Tag
                                                        color="processing"
                                                        key={i}
                                                        className="mb-3"
                                                    >
                                                        {service}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        ) : (
                                            <Space size={[5, 10]} wrap className="max-w-96">
                                                {data?.services.map((service, i) => (
                                                    <Tag color="processing" key={i}>
                                                        {service}
                                                    </Tag>
                                                ))}
                                            </Space>
                                        )}
                                    </Flex>
                                )}
                                <Flex vertical gap={15}>
                                    <Typography.Text className="text-sm sm:text-base font-medium">
                                        Offerings
                                    </Typography.Text>
                                    <Flex gap={5}>
                                        <Typography.Text className="text-xs sm:text-sm font-normal">
                                            {data?.offerings ?? 'Not available'}
                                        </Typography.Text>
                                    </Flex>
                                </Flex>
                                <Flex vertical gap={15}>
                                    <Typography.Text className="text-sm sm:text-base font-medium">
                                        Location
                                    </Typography.Text>
                                    <Flex gap={5}>
                                        <EnvironmentOutlined className="text-lg" />
                                        <Typography.Text className="text-xs sm:text-sm font-normal">
                                            {data?.address ?? 'Not available'}
                                        </Typography.Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                            <Typography.Text className="text-sm sm:text-base font-medium mt-10 ">
                                Connect Now
                            </Typography.Text>
                            <DetailsForm connectId={data?.id} />
                        </Flex>
                    </Col>
                )}
            </Row>
        </Content>
    );
};

export default ConnectDetail;
