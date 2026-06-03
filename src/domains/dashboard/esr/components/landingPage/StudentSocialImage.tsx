import React from 'react';

import { Image, Grid, Col } from 'antd';

import socialStudentSVG from '../../assets/social-student.svg';

const { useBreakpoint } = Grid;

const StudentSocialImage = () => {
    const screens = useBreakpoint();
    const height = screens.md ? 360 : 250;
    const width = screens.md ? 360 : 250;

    return (
        <Col xs={24} md={screens.md ? 10 : 14} className="flex justify-center md:justify-end">
            <Image
                src={socialStudentSVG}
                alt="ESR Registration"
                width={width}
                height={height}
                preview={false}
            />
        </Col>
    );
};

export default StudentSocialImage;
