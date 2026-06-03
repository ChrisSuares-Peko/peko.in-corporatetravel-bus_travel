import { Flex, Image, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { EmptyAllEmployeeImg } from '../../assets/images/export';

type Props = {};

const EmptyEmployeeTable = (props: Props) => {
    const navigate = useNavigate();
    return (
        <Row>
            <Flex
                className="w-full h-96 my-10"
                justify="center"
                align="center"
                gap="middle"
                vertical
            >
                <Image preview={false} src={EmptyAllEmployeeImg} width={300} />
                <Typography.Text className="text-center text-titleText text-2xl font-light">
                    No Employee Found
                </Typography.Text>
                {/* <Button
                    className="text-iconRed border-iconRed"
                    onClick={() => navigate('/payroll/employee-profile')}
                >
                    Add Now
                </Button> */}
            </Flex>
        </Row>
    );
};

export default EmptyEmployeeTable;
