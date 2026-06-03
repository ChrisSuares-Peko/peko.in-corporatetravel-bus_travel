import React from 'react';

import { CheckCircleFilled } from '@ant-design/icons';
import { List, Typography, Flex } from 'antd';

const { Paragraph, Text } = Typography;

const additionalNotes = [
    'Throughout the process, you will receive timely notifications via email regarding the status of your submissions and any actions required. If you have any queries or need further assistance, please reach out to us at ',
];

const KeyAdditionalNotes = () => (
    <Flex vertical className="md:mx-20 bg-limeGreen p-1 rounded-lg">
        <Flex align="center" className="mb-1">
            <CheckCircleFilled className="text-green-500 ml-3 mt-3" />
            <Paragraph className="font-semibold mx-2 my-2">Stay Informed</Paragraph>
        </Flex>
        <List
            className="ml-10"
            dataSource={additionalNotes}
            renderItem={item => (
                <List.Item style={{ padding: 0, border: 'none', marginBottom: '4px' }}>
                    <Flex className="items-start">
                        <Text>
                            {item} <Text className="text-iconRed underline">help@peko.one.</Text>
                        </Text>
                    </Flex>
                </List.Item>
            )}
        />
    </Flex>
);

export default KeyAdditionalNotes;
