import { Col, Image, Typography } from 'antd';

import { SuccessImg } from '../../assets/images';

type Props = {
    tax: boolean;
};

const SuccessHeader = ({ tax }: Props) => (
    <Col span={24} className="md:mt-24 flex flex-col justify-center items-center">
        <Image width={64} src={SuccessImg} />
        {tax ? (
            <>
                <Typography.Text className="text-2xl mt-6">
                    Voila! Corporate Tax Registration Successful!
                </Typography.Text>
                <Typography.Text className="text-sm text-titleDescription text-center mt-4">
                    Congratulations! Your VAT registration with the UAE Federal Tax Authority <br />
                    (FTA) has been successfully completed.
                </Typography.Text>
            </>
        ) : (
            <>
                <Typography.Text className="text-2xl mt-6">
                    Voila! VAT Registration Successful!
                </Typography.Text>
                <Typography.Text className="text-sm text-titleDescription text-center mt-4">
                    Congratulations! Your corporate tax registration with the UAE Ministry of
                    Finance has been successfully completed.
                </Typography.Text>
            </>
        )}
    </Col>
);

export default SuccessHeader;
