import React, { useState } from 'react';

import { Steps, Flex } from 'antd';

import AddressDetails from './Forms/AddressDetails';
import BankDetails from './Forms/BankDetails';
import PersonalDetails from './Forms/PersonalDetails';

const RegisterBody = () => {
    const [current, setCurrent] = useState<number>(0);

    // for switching steps
    const changeTab = (direction: 'next' | 'prev') => {
        setCurrent(prev => (direction === 'next' ? prev + 1 : prev - 1));
    };

    const steps = [
        {
            title: 'Personal Details',
            content: <PersonalDetails changeTab={changeTab} />,
        },
        {
            title: 'Address Details',
            content: <AddressDetails changeTab={changeTab} />,
        },
        {
            title: 'Bank Details',
            content: <BankDetails changeTab={changeTab} />,
        },
    ];

    const items = steps.map(({ title }) => ({ key: title, title }));

    return (
        <>
            <Steps
                className="text-green-400 mt-[1rem] sm:mt-0"
                direction="horizontal"
                size="small"
                current={current}
                items={items}
            />

            <Flex vertical>{steps[current].content}</Flex>
        </>
    );
};

export default RegisterBody;
