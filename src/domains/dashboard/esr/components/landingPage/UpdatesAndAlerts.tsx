import React from 'react';

import { Typography } from 'antd';

const { Paragraph, Link, Text } = Typography;

const UpdatesAndAlerts = () => (
    <Paragraph className="text-footGrey text-[14px]">
        <Text strong>Stay Informed :</Text> Throughout the process, you will receive timely
        notifications via email regarding the status of your submissions and any actions required
        have any queries or need further assistance, please reach out to us at
        <Link href="https://www.help@peko.one" target="_blank" rel="noopener noreferrer">
            <Text className="text-[14px] text-lightRed"> help@peko.one</Text>
        </Link>
    </Paragraph>
);

export default UpdatesAndAlerts;
