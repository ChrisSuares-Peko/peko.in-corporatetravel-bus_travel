import React, { useState } from 'react';

import { theme } from 'antd';

import DatePagesm from '@domains/dashboard/Hotels/Components/AdaptiveComponents/DatePagesm';
import HotelviewSmall from '@src/domains/dashboard/Hotels/Components/ViewHotel/HotelviewSmall';

const ViewHotelsSm = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [visible, setVisible] = useState<boolean>(false);

    const calendarOpen = () => {
        setVisible(true);
    };
    return <>{visible ? <DatePagesm /> : <HotelviewSmall />}</>;
};

export default ViewHotelsSm;
