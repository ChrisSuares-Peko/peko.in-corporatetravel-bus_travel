import { useEffect, useState } from 'react';

import { Flex, Typography, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';

import ReviewAmount from '../components/ReviewAmount';
import ShipmentDetailsForm from '../components/ShipmentDetailsForm';
import { setIsComingFromDetails } from '../slice/logisticsSlice';
import { shippingAmount } from '../types';

const initialShippingAmount: shippingAmount = {
    TotalAmount: 0,
    TotalAmountBeforeTax: 0,
    TaxAmount: 0,
    type: '',
};

const ShipmentDetails = () => {
    const [showReviewScreen, setShowReviewScreen] = useState<shippingAmount>(initialShippingAmount);
    const { originAddress, destinationAddress } = useAppSelector(state => state.reducer.logistics);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        token: { colorPrimary },
    } = theme.useToken();

    useEffect(() => {
        if (originAddress && destinationAddress) {
            if (!originAddress.Line1 || !destinationAddress.Line1) {
                navigate('/logistics');
            }
        }
        dispatch(setIsComingFromDetails(true));
    }, [dispatch, originAddress, destinationAddress, navigate]);

    return (
        <Content className="px-0 mb-8">
            <Flex vertical>
                <Flex className="mb-6 text-lg font-medium">Shipment Details</Flex>
                <Typography.Paragraph className="pb-5 text-textGrey">
                    Please check the list of prohibited items{' '}
                    <Link
                        to="https://www.aramex.com/content/uploads/100/55/32335/Prohibited%20Items%20List.pdf"
                        target="_blank"
                        className="underline"
                        style={{ color: colorPrimary }}
                    >
                        here
                    </Link>
                    .
                </Typography.Paragraph>
                <ShipmentDetailsForm setShowReviewScreen={setShowReviewScreen} />
            </Flex>
            {showReviewScreen.TotalAmount !== 0 && <ReviewAmount data={showReviewScreen} />}
        </Content>
    );
};

export default ShipmentDetails;
