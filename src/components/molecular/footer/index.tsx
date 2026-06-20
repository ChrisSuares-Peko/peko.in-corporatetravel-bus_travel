import React from 'react';

import { Flex, Typography } from 'antd';
import { Link } from 'react-router-dom';

const LINK_STYLE = { fontSize: 12, color: '#8C8C8C' };

const Footer = () => (
    <div
        style={{
            borderTop: '1px solid #F0F0F0',
            marginTop: 48,
            paddingTop: 16,
            paddingBottom: 0,
        }}
        className="flex flex-wrap justify-between items-center gap-4"
    >
        <Typography.Text style={LINK_STYLE}>
            © 2026 Peko Platforms Private Limited. All Rights Reserved
        </Typography.Text>
        <Flex align="center" wrap="wrap" gap={0}>
            {(['Peko Platform Agreement', 'Privacy Policy', 'Refund Policy', 'Cookie Policy'] as const).map(
                (label, i) => (
                    <React.Fragment key={label}>
                        {i > 0 && <span style={{ ...LINK_STYLE, margin: '0 8px' }}>|</span>}
                        <Link to="#" style={LINK_STYLE}>
                            {label}
                        </Link>
                    </React.Fragment>
                )
            )}
        </Flex>
    </div>
);

export default Footer;
