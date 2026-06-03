import { Col, Flex, Grid, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { paths } from '@src/routes/paths';

import useMobileNavData from './MobileNavData';

const MobileNav = () => {
    const navData = useMobileNavData();
    const navigate = useNavigate();
    const screens = Grid.useBreakpoint();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItemClick = (key: string, label: any) => {
        const isCorporateTravel = key.startsWith(paths.dashboard.corporateTravel);
        if (isCorporateTravel) {
            navigate(key);
            return;
        }
        const serviceName = typeof label === 'string' ? label : 'Service';
        navigate(`/coming-soon?service=${encodeURIComponent(serviceName)}`);
    };

    return (
        <Row
            gutter={screens.xs ? [20, 20] : [20, 40]}
            justify="center"
            align="middle"
            className="mt-3 mb-4"
        >
            {navData &&
                navData?.slice(0, 12)?.map((item, i) => (
                    <Col key={i} xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                        <div
                            onClick={() => handleItemClick(item.key, item.label)}
                            className="cursor-pointer"
                        >
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
                                        className={`text-2xl ${
                                            item.key === paths.dashboard.corporateTravel
                                                ? 'svg-primary-stroke'
                                                : 'svg-primary'
                                        }`}
                                    />
                                </Flex>
                                <Typography.Text className="text-[10px] h-8 max-w-[5rem] text-center font-medium">
                                    {item.label}
                                </Typography.Text>
                            </Flex>
                        </div>
                    </Col>
                ))}
        </Row>
    );
};

export default MobileNav;
