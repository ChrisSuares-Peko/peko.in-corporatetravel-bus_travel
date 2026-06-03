import React, { useState } from 'react';

import { Flex, Steps } from 'antd';

import Step1 from './forms/Step1';
import Step2 from './forms/Step2';
import Step3 from './forms/Step3';

const HealthCheckBody: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: 'Steps 1',
            content: <Step1 current={current} setCurrent={setCurrent} />,
        },
        {
            title: 'Steps 2',
            content: <Step2 current={current} setCurrent={setCurrent} />,
        },
        {
            title: 'Steps 3',
            content: <Step3 current={current} setCurrent={setCurrent} />,
        },
    ];

    const items = steps.map(({ title }) => ({ key: title, title }));

    return (
        <>
            <Steps
                className="text-green-400"
                direction="horizontal"
                size="small"
                current={current}
                items={items}
            />

            {/* form will be render here */}
            <Flex vertical>{steps[current].content}</Flex>
        </>
    );
};

export default HealthCheckBody;
