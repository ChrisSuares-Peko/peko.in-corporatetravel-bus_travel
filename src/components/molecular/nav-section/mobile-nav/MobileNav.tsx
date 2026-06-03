import { Col, Flex, Grid, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { paths } from '@src/routes/paths';

import useMobileNavData from './MobileNavData';

const MobileNav = () => {
    const navData = useMobileNavData();
    const screens = Grid.useBreakpoint();
    return (
        // <Flex wrap="wrap" justify="space-between" gap={16} className="mt-3">
        <Row
            gutter={screens.xs ? [20, 20] : [20, 40]}
            justify="center"
            align="middle"
            className="mt-3 mb-4"
        >
            {navData &&
                navData?.slice(0, 12)?.map((item, i) => (
                    <Col key={i} xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <Link to={item.key} key={item.key}>
                            <Flex vertical align="center" gap={8}>
                                <Flex
                                    align="center"
                                    justify="center"
                                    className="w-16 h-16 rounded-2xl bg-bgIconCard"
                                >
                                    <ReactSVG
                                        src={item.icon!}
                                        beforeInjection={svg => {
                                            svg.setAttribute('style', 'width: 22px; height: 22px;');
                                        }}
                                        className={` text-2xl
                            ${
                                item.key === paths.dashboard.corporateTravel
                                    ? 'svg-primary-stroke'
                                    : 'svg-primary'
                            }
                        `}
                                    />
                                </Flex>
                                <Typography.Text className=" text-[10px] h-8  max-w-[5rem] text-center font-medium">
                                    {item.label}
                                </Typography.Text>
                            </Flex>
                        </Link>
                    </Col>
                ))}
            {/* </Flex> */}
        </Row>
    );
};

export default MobileNav;
