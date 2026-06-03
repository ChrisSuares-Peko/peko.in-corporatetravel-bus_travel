import { Button, Result, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

const PaymentFailure = () => (
    <Row className="flex justify-center items-center h-full">
        <Result
            className="md:w-3/6 p-0"
            status="error"
            title="Your payment was unsuccessful"
            subTitle={
                <Typography.Text className="text-sm">
                    If any amount has been deducted from your account, please be assured that the
                    refund will be processed within 7 working days.
                </Typography.Text>
            }
            extra={
                <Link to="/payments">
                    <Button type="primary" danger className="px-6">
                        Try Again
                    </Button>
                </Link>
            }
        />
    </Row>
);

export default PaymentFailure;
