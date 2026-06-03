import { RightOutlined } from '@ant-design/icons';
import { Card, Col, Flex, Typography, Button, Image } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { resetForm, resetTaxData } from '../../slices/accountingSlice';

type Props = {
    imageLink: string;
    path: string;
    text: string;
    heading: string;
    isLoading?: boolean;
};

const Cards = ({ imageLink, path, text, heading, isLoading }: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const displayMessage = () => {
        dispatch(showToast({ variant: 'info', description: 'Coming soon' }));
    };

    const handleClick = () => {
        if (!path) {
            displayMessage();
        }
    };
    return (
        <Col xs={18} sm={12} md={10} lg={9} xl={8}>
            <Card className="bg-bgIconCard border-0 rounded-2xl h-full transition duration-150 transform hover:scale-95">
                <Flex className="" gap="middle" align="center" justify="center" vertical>
                    <Typography.Text className="text-wrap font-normal text-sm text-center ">
                        {heading}
                    </Typography.Text>
                </Flex>
                <Flex className="w-full py-2" justify="center">
                    <Image preview={false} width={150} height={115} src={imageLink} />
                </Flex>
                <Flex className="lg:w-full" justify="center">
                    <Button
                        onClick={() => {
                            handleClick();
                            dispatch(resetTaxData());
                            dispatch(resetForm());
                            navigate(path);
                        }}
                        className="w-fit bg-bgIconCard border border-[#FF4F4F] text-[#FF4F4F] transition duration-150 ease-in-out"
                        loading={isLoading}
                    >
                        {isLoading ? (
                            'Register'
                        ) : (
                            <Typography.Text className="text-[#FF4F4F] font-medium text-xs">
                                {text} <RightOutlined style={{ fontSize: '14px' }} />
                            </Typography.Text>
                        )}
                    </Button>
                </Flex>
            </Card>
        </Col>
    );
};

export default Cards;
