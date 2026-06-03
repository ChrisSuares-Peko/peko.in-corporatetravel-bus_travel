import React from 'react';

import { Col, Flex, Row, Skeleton } from 'antd';
import { useLocation } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';

import ESRHeader from '../../components/Stages/ESRHeader';
import ESRBody from '../../components/Stages/Stage1/ESRBody';
import { useGetInitialQuestions } from '../../hooks/useGetInitialQuestions';

const ESRegistration: React.FC = () => {
    const { state } = useLocation();

    const { stageData, isLoading, fisicalYear } = useGetInitialQuestions(state);
    const { md } = useScreenSize();
    return (
        <Flex gap={40} vertical className="w-full lg:w-10/12">
            {isLoading ? (
                <Row gutter={[20, 30]}>
                    <Col span={24}>
                        <Skeleton active title={false} paragraph={{ rows: 1 }} className="w-3/4" />
                    </Col>
                    <Col span={24}>
                        <Flex vertical={!md} gap={25} justify="space-between">
                            {Array.from({ length: md ? 4 : 3 }).map((_, index) => (
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
                    <Col span={24}>
                        <Skeleton.Button size="large" active />
                    </Col>
                </Row>
            ) : (
                stageData && (
                    <>
                        <ESRHeader title={stageData?.stageTitle} />
                        <ESRBody stageData={stageData} fisicalYear={fisicalYear} />
                    </>
                )
            )}
        </Flex>
    );
};

export default ESRegistration;
