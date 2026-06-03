import React, { useState } from 'react';

import { Flex, Steps } from 'antd';

import CompanyInformation from './forms/CompanyInformation';
import ContactInformation from './forms/ContactInformation';
import FinancialInformation from './forms/FinancialInformation';

const TaxRegistrationBody: React.FC = () => {
    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: 'Steps 1',
            content: <CompanyInformation current={current} setCurrent={setCurrent} />,
        },
        {
            title: 'Steps 2',
            content: <ContactInformation current={current} setCurrent={setCurrent} />,
        },
        {
            title: 'Steps 3',
            content: <FinancialInformation current={current} setCurrent={setCurrent} />,
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

export default TaxRegistrationBody;
