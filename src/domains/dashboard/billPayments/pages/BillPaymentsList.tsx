import { Col, Row } from 'antd';

import { useAppDispatch } from '@src/hooks/store';

import BeneficiariesList from '../components/beneficiary/BeneficiariesList';
import TelecomPaymentsList from '../components/TelecomPaymentsList';
import UtilityPaymentsList from '../components/UtilityPaymentsList';
import { resetVendors } from '../slices/billPayment';

const BillPaymentsList = () => {
    const dispatch = useAppDispatch();
    dispatch(resetVendors());

    return (
        <Row>
            <Col xl={15} className="mt-6 sm:mt-0">
                <TelecomPaymentsList />
                <UtilityPaymentsList />
            </Col>
            <Col xl={9} className="w-full mt-7 sm:mt-[2.4rem] sm:bg-gray-50 rounded-3xl sm:p-6">
                <BeneficiariesList />
            </Col>
        </Row>
    );
};

export default BillPaymentsList;
