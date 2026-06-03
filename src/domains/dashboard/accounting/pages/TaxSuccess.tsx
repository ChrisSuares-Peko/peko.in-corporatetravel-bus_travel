import { Row } from 'antd';

import DataCard from '../components/success/DataCard';
import SuccessHeader from '../components/success/SuccessHeader';

type Props = {};

const TaxSuccess = (props: Props) => (
    <Row justify="center" align="middle">
        <SuccessHeader tax />
        <DataCard tax />
    </Row>
);

export default TaxSuccess;
