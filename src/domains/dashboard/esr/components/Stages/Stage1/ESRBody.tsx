import React, { useEffect, useState } from 'react';

import { Flex, Steps } from 'antd';

import useUpdateStageQuestion from '../../../hooks/useUpdateStageQuestion';
import { Stage } from '../../../types/types';
import StepComponent from '../Steps';

interface Props {
    stageData: Stage;
    fisicalYear: string | undefined;
}

const ESRBody = ({ stageData, fisicalYear }: Props) => {
    const [current, setCurrent] = useState(0);
    const [formSubmitdata, setFormSubmitData] = useState<Stage>(stageData);
    const { btnLoading, updateAnswer } = useUpdateStageQuestion();
    useEffect(() => {
        if (formSubmitdata.isCompleted) {
            // updateAnswer({ ...formSubmitdata, fisicalYear });
        }
    }, [fisicalYear, formSubmitdata, updateAnswer]);
    const data = stageData
        ? stageData.steps.map((step, index) => ({
              title: `Step ${step.stepNo}`,
              content: (
                  <StepComponent
                      btnLoading={btnLoading}
                      current={current}
                      setCurrent={setCurrent}
                      stepData={formSubmitdata.steps[index]}
                      totalSteps={stageData.steps.length}
                      setFormSubmitData={setFormSubmitData}
                  />
              ),
          }))
        : [];

    // Check if there are steps before trying to access their properties
    const items = data.map(({ title }) => ({ key: title, title }));

    return (
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
