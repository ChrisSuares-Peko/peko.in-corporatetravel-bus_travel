import React, { useEffect } from 'react';

import { Col, Flex, Row, Skeleton, Steps } from 'antd';

import useScreenSize from '@src/hooks/useScreenSize';

import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Step7 from './Step7';
import useUpdateStepsForStage1 from '../../../hooks/useUpdateStepsForStage1';
import { EsrStageDataResp } from '../../../types/types';

interface Props {
    registrationId: string | undefined;
    stageStepData: EsrStageDataResp | undefined;
    fisicalYear: number;
    resubmit: boolean;
}

const ESRBody = ({ registrationId, stageStepData, fisicalYear, resubmit }: Props) => {
    const { updateAnswer, btnLoading, current, setCurrent } = useUpdateStepsForStage1();
    const handleFormSubmit = (stepNo: number, data: any, save: boolean = false) => {
        const updateVal = { registrationId, stepNo, stepData: data, save };
        updateAnswer(updateVal);
    };
    const { md } = useScreenSize();
    useEffect(() => {
        if (stageStepData && resubmit) {
            setCurrent(0);
        } else if (stageStepData) {
            setCurrent(Number(stageStepData?.currentStep) - 1);
        }
    }, [resubmit, setCurrent, stageStepData]);
    const totalSteps = 7;
    const data = [
        {
            title: 'Step 1',
            content: (
                <Step1
                    current={current}
                    totalSteps={totalSteps}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    step1Data={stageStepData?.step1}
                />
            ),
        },
        {
            title: 'Step 2',
            content: (
                <Step2
                    current={current}
                    setCurrent={setCurrent}
                    totalSteps={totalSteps}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    step2Data={stageStepData?.step2}
                    fisicalYear={fisicalYear}
                />
            ),
        },
        {
            title: 'Step 3',
            content: (
                <Step3
                    current={current}
                    setCurrent={setCurrent}
                    totalSteps={totalSteps}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    step3Data={stageStepData?.step3}
                    fisicalYear={fisicalYear}
                />
            ),
        },
        {
            title: 'Step 4',
            content: (
                <Step4
                    current={current}
                    setCurrent={setCurrent}
                    totalSteps={totalSteps}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    step4Data={stageStepData?.step4}
                />
            ),
        },
        {
            title: 'Step 5',
            content: (
                <Step5
                    current={current}
                    setCurrent={setCurrent}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    totalSteps={totalSteps}
                    step5Data={stageStepData?.step5}
                />
            ),
        },
        {
            title: 'Step 6',
            content: (
                <Step6
                    current={current}
                    setCurrent={setCurrent}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    totalSteps={totalSteps}
                    step6Data={stageStepData?.step6}
                />
            ),
        },
        {
            title: 'Step 7',
            content: (
                <Step7
                    current={current}
                    setCurrent={setCurrent}
                    btnLoading={btnLoading}
                    handleFormSubmit={handleFormSubmit}
                    step7Data={stageStepData?.step7}
                    totalSteps={totalSteps}
                />
            ),
        },
    ];
    const items = data.map(({ title }) => ({ key: title, title }));

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
        <>
            <Steps
                className="text-green-400"
                direction="horizontal"
                size="small"
                current={current}
                items={items}
            />

            {data[current] && <Flex vertical>{data[current].content}</Flex>}
        </>
    );
};

export default ESRBody;
