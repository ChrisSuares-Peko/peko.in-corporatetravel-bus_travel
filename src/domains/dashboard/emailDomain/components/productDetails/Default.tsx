import React, { useRef } from 'react';

import { Button, Col, Empty, Flex, Image, Row, Typography } from 'antd';

import banner from '@domains/dashboard/emailDomain/assets/banner.png';

import { EmailDomain } from '../../types/types';
import WorkspaceForm from '../WorkspaceForm';

interface props {
    setFormData: (data: any) => void;
    formData: any;
    setIsFormSubmitted: (data: any) => void;
    productData?: EmailDomain | null;
}

const Default = ({ setFormData, formData, setIsFormSubmitted, productData }: props) => {
    const formRef = useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Typography.Text className="text-4xl ">{productData?.name || ''}</Typography.Text>
            <Flex justify="space-between" align="center" className="flex-wrap ">
                <Flex vertical className="flex-grow w-80" style={{ marginRight: '16px' }}>
                    <Typography.Text className="text-2xl leading-tight">
                        Get email and productivity tools for your business
                    </Typography.Text>
                    <Typography.Paragraph className="w-full mt-6 mb-5 text-lg leading-9 lg:w-11/12 xxl:w-3/4 text-textGrey">
                        Our service offers a comprehensive suite of powerful apps to streamline
                        workflow, collaborate seamlessly, and enhance efficiency. Equip your team
                        with world-class productivity tools and boost performance like never before.
                    </Typography.Paragraph>
                    <Button
                        data-testid="get-started-now"
                        danger
                        size="small"
                        type="primary"
                        className="justify-center w-full h-10 mt-5 text-xs font-normal rounded-sm sm:w-40 md:w-44 sm:text-sm sm:font-medium"
                        onClick={scrollToForm}
                    >
                        Get Started
                    </Button>
                </Flex>
                <Image
                    src={banner}
                    preview={false}
                    style={{
                        width: 'auto',
                        height: 'auto',
                        maxHeight: '45rem',
                        maxWidth: '80%',
                        flex: '0 0 auto',
                    }}
                />
            </Flex>
            <Flex justify="center" align="center">
                <Typography.Text className="text-xl font-medium mt-7">
                    Our service includes (in all plans)
                </Typography.Text>
            </Flex>
            <Row className="mt-5 xxl:px-32" gutter={[16, 16]} justify="center">
                <Col xs={24}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Typography.Text className="mt-5 font-normal">
                                No services available
                            </Typography.Text>
                        }
                    />
                </Col>
            </Row>
            <Flex justify="center" align="center">
                <Typography.Text className="text-xl font-medium mt-7">
                    Get Started Now!
                </Typography.Text>
            </Flex>
            <Flex className="mt-5 xxl:px-64" ref={formRef}>
                {/* TODO: Add form for default product */}
                <WorkspaceForm
                    setFormData={setFormData}
                    formData={formData}
                    setIsFormSubmitted={setIsFormSubmitted}
                />
            </Flex>
        </>
    );
};

export default Default;
