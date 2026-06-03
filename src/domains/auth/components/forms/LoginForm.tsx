import { Row, Typography, Form, Button } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import PasswordInput from '@components/atomic/inputs/PasswordInput';
import TextInput from '@components/atomic/inputs/TextInput';

// eslint-disable-next-line import/no-cycle
import useLoginApi from '../../hooks/useLoginApi';

const onChange = (e: CheckboxChangeEvent) => {
    // console.log(`checked = ${e.target.checked}`);
};

const LoginForm = () => {
    const { handleLogin } = useLoginApi();
    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleLogin}
        >
            {({ handleSubmit, isSubmitting }) => (
                <Form onFinish={handleSubmit} className="w-full xxl:w-[27rem] ">
                    <TextInput
                        name="username"
                        placeholder="Email ID/Account Number"
                        type="text"
                        size="large"
                        classes="xxl:h-[3rem] "
                        allowLowerCaseOnly
                        maxLength={50}
                    />
                    <PasswordInput
                        name="password"
                        placeholder="Password"
                        type="password"
                        size="large"
                        classes="xxl:h-[3rem] "
                        maxLength={50}
                    />
                    <Row justify="end" className="w-full">
                        {/* <Checkbox onChange={onChange}>Keep me logged in</Checkbox> */}
                        <Link to="/auth/forgotpassword" className="p-0" type="link">
                            <Typography.Text>Forgot Password?</Typography.Text>
                        </Link>
                    </Row>
                    <Button
                        htmlType="submit"
                        type="primary"
                        danger
                        className="mt-5 font-semibold w-full xxl:h-[3rem] xxl:text-lg"
                        loading={isSubmitting}
                    >
                        Login
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
