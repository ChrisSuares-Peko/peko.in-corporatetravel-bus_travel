import { Row } from 'antd';

import DataCard from '../components/success/DataCard';
import SuccessHeader from '../components/success/SuccessHeader';

type Props = {};

const VatSuccess = (props: Props) => (
    <Row justify="center" align="middle">
        <SuccessHeader tax={false} />
        <DataCard tax={false} />
    </Row>
);

export default VatSuccess;
