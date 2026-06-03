import React, { useState } from 'react';

import { Flex, Steps } from 'antd';

import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import Step6 from './Steps/Step6';
import Step7 from './Steps/Step7';
import useUpdateStageQuestion from '../../../hooks/useUpdateStageQuestion';
import { Stage } from '../../../types/types';

interface Props {
    fisicalYear: string | undefined;
}

const ESRBodyStag2 = ({ fisicalYear }: Props) => {
    const [current, setCurrent] = useState(0);
    const [formSubmitdata, setFormSubmitData] = useState<Stage>();
    const { btnLoading, updateAnswer } = useUpdateStageQuestion();
    // useEffect(() => {
    //     if (formSubmitdata.isCompleted) {
    //         // updateAnswer({ ...formSubmitdata, fisicalYear });
    //     }
    // }, [fisicalYear, formSubmitdata, updateAnswer]);
    const data = [
        {
            title: `Step 1`,
            content: (
                <Step1
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
        {
            title: `Step 2`,
            content: (
                <Step2
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
        {
            title: `Step 3`,
            content: (
                <Step3
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
        {
            title: `Step 4`,
            content: (
                <Step4
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
        {
            title: `Step 5`,
            content: (
                <Step5
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
        {
            title: `Step 6`,
            content: (
                <Step6
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
        {
            title: `Step 7`,
            content: (
                <Step7
                    btnLoading={btnLoading}
                    setCurrent={setCurrent}
                    setFormSubmitData={setFormSubmitData}
                />
            ),
        },
    ];

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

export default ESRBodyStag2;
