import { Button, Result, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

const PaymentFailurePage = () => (
    <Row className="flex justify-center items-center h-full">
        <Result
            className="md:w-3/6 p-0"
            status="error"
            title="Your transaction has failed"
            subTitle={
                <Typography.Text className="text-sm">
                    We regret to inform you that your attempt to payment was unsuccessful. If any
                    funds are deducted from your account, please be assured that the refund will be
                    processed within seven working days.
                </Typography.Text>
            }
            extra={
                <Link to={`${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.payment}`}>
                    <Button type="primary" danger className="px-6">
                        Try Again
                    </Button>
                </Link>
            }
        />
    </Row>
);

export default PaymentFailurePage;
