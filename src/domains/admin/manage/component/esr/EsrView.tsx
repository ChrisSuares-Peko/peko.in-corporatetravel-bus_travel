import { Col, Row, Flex, Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';

import CustomBreadCrumb from '@components/molecular/breadcrumbs/CustomBreadcrumb';
import ESRBody from '@components/molecular/esrCommonFolder/Components/ESRBody';
import useScreenSize from '@src/hooks/useScreenSize';

import useGetEsrStageData from '../../hooks/useGetEsrStageData';

const EsrView = () => {
    const { state } = useLocation();
    console.log('🚀 ~ state:', state);
    const { md } = useScreenSize();
    const { data, isLoading } = useGetEsrStageData(state);
    // Flatten the initial values

    if (isLoading || !data) {
        return (
            <>
                <CustomBreadCrumb />
                {Array.from({ length: md ? 4 : 3 }).map((_, idx) => (
                    <Row gutter={[20, 30]} key={idx} className="md:w-3/4 w-full mt-5">
                        <Col span={24}>
                            <Skeleton
                                active
                                title={false}
                                paragraph={{ rows: 1 }}
                                className="w-3/4"
                            />
                        </Col>
                        <Col span={24}>
                            <Flex vertical={!md} gap={25} justify="space-between">
                                {Array.from({ length: md ? 4 : 3 }).map((leng, index) => (
                                    <Flex gap={10} key={index}>
                                        <Skeleton.Avatar size="small" active />
                                        <Skeleton.Input size="small" active />
                                    </Flex>
                                ))}
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Flex
                                vertical
                                className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full pt-5 "
                            >
                                <Skeleton.Input size="small" active />
                                <Skeleton
                                    active
                                    title
                                    paragraph={{ rows: md ? 6 : 4 }}
                                    className="w-3/4 mt-5"
                                />
                            </Flex>
                        </Col>
                    </Row>
                ))}
            </>
        );
    }
    return (
        <Flex vertical>
            <CustomBreadCrumb />
            <ESRBody stageStepData={data} fisicalYear={data.registrationId.fisicalYear} />
        </Flex>
    );
};

export default EsrView;
