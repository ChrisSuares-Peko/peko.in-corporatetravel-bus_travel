import { Button, Col, Flex, Grid, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import animation from '@assets/animation/zeroCarbon2.json';
import activeProjectsIcon from '@domains/dashboard/carbonFootprint/assets/icons/Active Projects.svg';
import carbonIcon from '@domains/dashboard/carbonFootprint/assets/icons/carbonIcon.svg';
import totalco2Icon from '@domains/dashboard/carbonFootprint/assets/icons/Total CO2 Neutralised.svg';
import { paths } from '@src/routes/paths';

import { AredLogo } from '../assets/icons/projectDetails';
import DashboardCarbonCard from '../components/dashboard/DashboardCarbonCard';
import DashboardNavigateCard from '../components/dashboard/DashboardNavigateCard';
import NeutralizedCard from '../components/dashboard/NeutralizedCard';
import TopProjectSection from '../components/dashboard/TopProjectSection';
import useGetDashboardData from '../hooks/useGetDashboardData';
import { data } from '../utils/dashboard/data';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};
const { useBreakpoint } = Grid;
const Dashboard = () => {
    const screens = useBreakpoint();
    const justify = screens.xl ? 'space-between' : 'start';
    const navigate = useNavigate();
    const { projectData, counterData, isLoading } = useGetDashboardData();
    return isLoading ? (
        <Flex vertical align="center" justify="center" gap={15} className="text-center h-screen ">
            <Lottie options={defaultOptions} height={150} width={150} />
        </Flex>
    ) : (
        <Content>
            <Flex vertical gap={8}>
                <Flex justify="space-between" className="mb-7 " align="center">
                    <Flex vertical gap={5}>
                        <Typography.Text className=" font-medium text-lg sm:text-xl">
                            Zero Carbon
                        </Typography.Text>
                        <Flex
                            className="flex-col md:flex-row"
                            gap={20}
                            align={`${screens.md ? 'end' : 'start'}`}
                        >
                            <Typography.Text className=" text-xl  lg:text-lg font-normal">
                                Calculate Your Carbon Footprint and Start Taking Action
                            </Typography.Text>
                            <Button
                                onClick={() => navigate(paths.zeroCarbon.carbonCalculator)}
                                type="primary"
                                className={` ${screens.md ? '' : 'w-full'} px-6 `}
                                danger
                            >
                                Calculate Now
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex className="xs:hidden lg:block ">
                        <Flex vertical align="center" justify="center" gap={10}>
                            <Typography.Text className=" text-xl lg:text-sm  xl:text-lg font-normal text-center">
                                Powered by
                            </Typography.Text>
                            <Flex align="center" justify="center">
                                <ReactSVG
                                    className="text-center"
                                    beforeInjection={svg => {
                                        svg.classList.add('svg-class-name');
                                        svg.setAttribute('style', 'width: 70px');
                                        svg.setAttribute('style', 'height: 30px');
                                    }}
                                    src={AredLogo}
                                />
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Row gutter={[30, 20]} className="mt-3">
                <Col xs={24} md={24} lg={24} xl={17} xxl={16}>
                    <Row gutter={[15, 20]}>
                        <Col xs={24} className="">
                            <Row
                                gutter={[15, 15]}
                                className="md:hidden xs:flex border border-solid py-8 rounded-md"
                            >
                                <Col xs={24} className="flex justify-center">
                                    <Typography.Text className="text-lg">
                                        Your carbon emission
                                    </Typography.Text>
                                </Col>
                                <Col xs={24}>
                                    <Flex gap={5} justify="center" align="baseline">
                                        <Typography.Text className="text-2xl text-neutriliseVal font-medium">
                                            {counterData?.co2FootPrint}
                                        </Typography.Text>
                                        <Typography.Text className="text-sm  text-neutriliseVal">
                                            tons CO₂
                                        </Typography.Text>
                                    </Flex>
                                </Col>
                            </Row>
                            <Row gutter={[15, 15]} className="md:flex xs:hidden pt-3">
                                <Col xs={8}>
                                    <DashboardCarbonCard
                                        bgColor="bg-bgBluish"
                                        title="Your Carbon Footprint"
                                        amount={counterData?.co2FootPrint}
                                        icon={carbonIcon}
                                        isTons
                                    />
                                </Col>
                                <Col xs={8}>
                                    <DashboardCarbonCard
                                        bgColor="bg-bgLightGreen"
                                        title="Total CO₂ Neutralised"
                                        amount={counterData?.userOffset}
                                        icon={totalco2Icon}
                                        isTons
                                    />
                                </Col>
                                <Col xs={8}>
                                    <DashboardCarbonCard
                                        bgColor="bg-bgMud"
                                        title="Projects Invested"
                                        amount={counterData?.projectsInvested}
                                        icon={activeProjectsIcon}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={[20, 20]} className="mt-12 md:px-2" justify={justify}>
                                <Col span={24}>
                                    <Typography.Text className="text-black text-lg font-normal ">
                                        Quick Actions
                                    </Typography.Text>
                                </Col>
                                {data.map((item, index) => (
                                    <Col key={index} className="mt-3" xs={8} md={4}>
                                        <DashboardNavigateCard
                                            key={index}
                                            title={item.title}
                                            icon={item.icon}
                                            path={item.path}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col
                    xs={24}
                    md={24}
                    lg={24}
                    xl={7}
                    xxl={8}
                    className="min-h-40 flex justify-center md:block  pt-3"
                >
                    <NeutralizedCard totalCommunity={counterData?.communityOffset.toFixed()} />
                </Col>
            </Row>
            <Row className="mt-16 md:px-2 ">
                <TopProjectSection projectData={projectData} />
            </Row>
        </Content>
    );
};
export default Dashboard;
