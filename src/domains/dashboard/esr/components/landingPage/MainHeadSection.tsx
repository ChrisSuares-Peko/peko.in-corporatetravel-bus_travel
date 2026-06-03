import React from 'react';

import { Row, Grid } from 'antd';

import ESRContent from './EsrContent';
import StudentSocialImage from './StudentSocialImage';

const { useBreakpoint } = Grid;

const MainHeadSection = () => {
    const screens = useBreakpoint();

    return (
        <Row gutter={[16, 16]} align="middle">
            {screens.md ? (
                <>
                    <ESRContent />
                    <StudentSocialImage />
                </>
            ) : (
                <>
                    <StudentSocialImage />
                    <ESRContent />
                </>
            )}
        </Row>
    );
};

export default MainHeadSection;
