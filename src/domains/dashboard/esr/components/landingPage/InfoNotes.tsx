import React from 'react';

import { InfoCircleFilled } from '@ant-design/icons';
import { Typography, Flex } from 'antd';

const { Paragraph } = Typography;

const additionalNotes = [
    'ESR filing is valid for one financial year.',
    'If you have already completed the assessment and/or notification filing through another channel, you can directly proceed with return filing on our platform after making the required payment.',
];

const InfoNotes = () => (
    <Flex vertical className=" bg-greyBlack p-1 rounded-lg">
        <Flex align="center" className="mb-1">
            <InfoCircleFilled className=" ml-3 mt-3" />
            <Paragraph className="font-semibold mx-2 my-2">Additional Notes</Paragraph>
        </Flex>
        <ul className="list-disc ml-10">
            {additionalNotes.map((note, index) => (
                <li key={index} className="mb-1">
                    {note}
                </li>
            ))}
        </ul>
    </Flex>
);

export default InfoNotes;
