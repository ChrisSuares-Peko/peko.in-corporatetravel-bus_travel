import React, { useState } from 'react';

import { Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import useCancellationPolicyApi from '../hooks/useCancellationPolicyApi';
import { cancelpolicyRoom } from '../types/cancellationTypes';
import { HotelSearch } from '../types/hotelTypes';

const Policy = () => {
    const { roomResponse, keyData, hotelResponse } = useAppSelector(state => state.reducer.hotels);
    const [policy, setPolicy] = useState<cancelpolicyRoom[]>([]);
    const response = hotelResponse as HotelSearch;
    const bookArr = roomResponse.map(value => ({
        roomKey: value.roomKey,
        roomIndex: value.roomIndex,
    }));

    const { cancellationPolicyDetails } = useCancellationPolicyApi();

    cancellationPolicyDetails(
        keyData.conversationId,
        keyData.hotelKey,
        keyData.searchKey,
        bookArr,
        response.hotelDetails.commonData.culture
    )
        .then(data => {
            setPolicy(data);
        })
        .catch(error => false);

    const responseData = policy[0]?.description;
    const policyData = responseData?.replace(/<br\/?>/g, '\n');
    const formattedPolicyData = policyData?.split('. ').map((sentence, index) => (
        <Typography.Text className="mt-2" key={index}>
            {sentence}.<br />
        </Typography.Text>
    ));

    return <div>{formattedPolicyData}</div>;
};

export default Policy;
