import React, { useRef } from 'react';

import { Button, Col, Flex, Image, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import banner from '@domains/dashboard/emailDomain/assets/banner.png';
import workspaces from '@domains/dashboard/emailDomain/assets/googleworkspace.png';
import { paths } from '@src/routes/paths';

import { workspace } from '../../utils';
import WorkspaceForm from '../WorkspaceForm';
import WorkspaceList from '../WorkspaceList';

interface props {
    setFormData: (data: any) => void;
    formData: any;
    setIsFormSubmitted: (data: any) => void;
}

const GoogleWorkspace = ({ setFormData, formData, setIsFormSubmitted }: props) => {
    const formRef = useRef<HTMLDivElement>(null);

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const navigate = useNavigate();

    return (
        <>
            <Image
                src={workspaces}
                preview={false}
                style={{ width: '100%', height: 'auto', maxHeight: '9rem' }} // Use auto for height
            />
            <Flex
                justify="space-between" // Space items between
                align="center" // Align items vertically centered
                className="flex-wrap mt-4" // Enable wrapping for responsiveness
            >
                <Flex
                    vertical
                    className="flex-grow w-80" // Allow it to take available space
                    style={{ marginRight: '16px' }} // Optional spacing
                >
                    <Typography.Text className="text-2xl leading-tight">
                        Get GMAIL and many other Google products for your business
                    </Typography.Text>
                    <Typography.Paragraph className="w-full mt-6 mb-5 text-lg leading-9 lg:w-11/12 xxl:w-3/4 text-textGrey">
                        The service boasts of a comprehensive suite of powerful apps to streamline
                        workflow, collaborate seamlessly, and enhance efficiency. Equip your team
                        with world-class productivity tools and boost performance like never before.
                    </Typography.Paragraph>
                    <Flex gap={15}>
                        <Button
                            danger
                            size="small"
                            type="primary"
                            className="justify-center w-full h-10 mt-5 text-xs font-normal rounded-sm sm:w-40 md:w-44 sm:text-sm sm:font-medium"
                            onClick={scrollToForm}
                        >
                            Get Google Workspace
                        </Button>
                        <Button
                            danger
                            size="small"
                            onClick={() =>
                                navigate(
                                    `${paths.dashboard.moreServices}/${paths.emailDomain.index}/${paths.emailDomain.historyPage}`
                                )
                            }
                            type="default"
                            className="justify-center w-full h-10 mt-5 text-xs font-normal rounded-sm sm:w-40 md:w-44 sm:text-sm sm:font-medium"
                        >
                            Order History
                        </Button>
                    </Flex>
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
                    Google Workspace includes (in all plans)
                </Typography.Text>
            </Flex>
            <Row className="mt-5 xxl:px-32" gutter={10}>
                {workspace?.map(data => (
                    <Col xs={12} sm={12} md={12} lg={12} xl={6} xxl={6} className="mt-4">
                        <WorkspaceList
                            image={data.image}
                            name={data.name}
                            description={data.description}
                        />
                    </Col>
                ))}
            </Row>
            <Flex justify="center" align="center">
                <Typography.Text className="text-xl font-medium mt-7">
                    Get Google Workspace Now!
                </Typography.Text>
            </Flex>
            <Flex className="mt-5 xxl:px-64" ref={formRef}>
                {/* TODO: Add form for Google Workspace */}
                <WorkspaceForm
                    setFormData={setFormData}
                    formData={formData}
                    setIsFormSubmitted={setIsFormSubmitted}
                />
            </Flex>
        </>
    );
};

export default GoogleWorkspace;
