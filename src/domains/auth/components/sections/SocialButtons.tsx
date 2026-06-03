import { Col, Divider, Flex, Row, Typography } from 'antd';
import { GoArrowUpRight } from 'react-icons/go';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

// import googleIcon from '@assets/svg/google-icon.png';
// import microsoftIcon from '@assets/svg/microsoft-icon.png';
import { resetRegisterState } from '../../slices/registerSlice';

const SocialButtons = () => {
    const dispatch = useDispatch(); // Move dispatch inside the component

    const handleSignup = () => {
        dispatch(resetRegisterState());
    };

    return (
        <Flex vertical gap={40} className="w-full">
            {/* <Flex vertical gap={18}>
            <Button className="w-full xxl:h-[3rem] shadow-none">
                <Row align="middle" className="gap-2">
                    <img src={googleIcon} alt="google-icon" />
                    <Typography.Text className="font-semibold">Sign in with Google</Typography.Text>
                </Row>
            </Button>
            <Button className="w-full xxl:h-[3rem] shadow-none">
                <Row align="middle" className="gap-2">
                    <img src={microsoftIcon} alt="google-icon" />
                    <Typography.Text className="font-semibold">
                        Sign in with Microsoft
                    </Typography.Text>
                </Row>
            </Button>
        </Flex> */}

            <Col span={24} className="w-full text-[#BBBBBB]  ">
                <Divider className="hidden sm:block" />
            </Col>
            <Col span={24} className="flex items-center -mt-8 gap-1 w-full justify-center">
                <Typography.Text>Ready to begin using Peko for your business?</Typography.Text>
                <Row align="middle" className="underline font-bold text-red-500">
                    <Link to="/auth/register" className="p-0" type="link">
                        <Typography.Text className="text-red-500" onClick={handleSignup}>
                            Sign up
                        </Typography.Text>
                    </Link>
                    <GoArrowUpRight />
                </Row>
            </Col>
        </Flex>
    );
};

export default SocialButtons;
