/* eslint-disable consistent-return */
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Formik } from 'formik';
import { useLocation } from 'react-router-dom';

import InformationNote from '../components/SendMoney/InformationNote';
import RatesCard from '../components/SendMoney/RatesCard';
import { MODALITY_INFO } from '../utils/data';

const { Text } = Typography;

const BeneficiaryReceives = () => {
    const location = useLocation();
    const { rateData, totalAmount } = location.state || {};

    return (
        <Content>
            <Text className="text-xl font-medium">Beneficiary Receives</Text>
            <Formik initialValues={{}} onSubmit={() => console.log('hi')}>
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <Row gutter={30} className="mt-6 md:px-5">
                            <RatesCard dataFields={rateData.data} InvoiceAmount={totalAmount} />
                            <InformationNote
                                title={MODALITY_INFO.title}
                                description={MODALITY_INFO.description}
                                points={MODALITY_INFO.points}
                            />
                            <InformationNote
                                title="Estimated delivery"
                                description="Estimated completion time for this transaction is approximately [X] hours."
                            />
                        </Row>
                    </form>
                )}
            </Formik>
        </Content>
    );
};

export default BeneficiaryReceives;
