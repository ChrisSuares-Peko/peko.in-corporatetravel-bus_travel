import React, { useState } from 'react';

import { Col, Flex, Row, Skeleton } from 'antd';

import useScreenSize from '@src/hooks/useScreenSize';

import ESRHeader from './ESRHeader';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import { EsrStageDataResp } from '../types/types';

interface Props {
    stageStepData: EsrStageDataResp | undefined;
    fisicalYear: number | string;
}

const ESRBody = ({ stageStepData, fisicalYear }: Props) => {
    const [current, setCurrent] = useState(0);
    const { md } = useScreenSize();
    const totalSteps = 7;

    return !stageStepData ? (
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
        <Flex vertical gap={10}>
            <ESRHeader title="ESR Assessment" />
            <Step1 current={0} totalSteps={totalSteps} step1Data={stageStepData?.step1} />{' '}
            <Step2
                current={1}
                setCurrent={setCurrent}
                totalSteps={totalSteps}
                step2Data={stageStepData?.step2}
                fisicalYear={Number(fisicalYear)}
            />
            <Step3
                current={2}
                setCurrent={setCurrent}
                totalSteps={totalSteps}
                step3Data={stageStepData?.step3}
                fisicalYear={Number(fisicalYear)}
            />
            <Step4
                current={3}
                setCurrent={setCurrent}
                totalSteps={totalSteps}
                step4Data={stageStepData?.step4}
            />
            <Step5
                current={4}
                setCurrent={setCurrent}
                totalSteps={totalSteps}
                step5Data={stageStepData?.step5}
            />
            <Step6
                current={5}
                setCurrent={setCurrent}
                totalSteps={totalSteps}
                step6Data={stageStepData?.step6}
            />
            <Step7
                current={6}
                setCurrent={setCurrent}
                step7Data={stageStepData?.step7}
                totalSteps={totalSteps}
            />
        </Flex>
    );
};

export default ESRBody;
