import React from 'react';

import { Flex, Layout, Typography } from 'antd';
import { Link } from 'react-router-dom';

const Footer = () => (
    <Layout.Footer
        style={{ paddingInline: 0, paddingBottom: 0 }}
        className="hidden pt-4 bg-white mt-14 md:block"
    >
        <Flex>
            <Typography.Text className="text-sm text-textBlack">
                © 2024 Peko Payment Services LLC. All Rights Reserved.
            </Typography.Text>
            <Flex align="center" justify="end" className="flex-wrap ml-auto ">
                <Link
                    to="https://peko.one/ae/platform-agreement"
                    target="_blank"
                    className="text-sm text-gray-400 footerLink"
                    type="secondary"
                >
                    <Typography.Text className="text-sm text-textBlack">
                        Peko Platform Agreement
                    </Typography.Text>
                </Link>
                <Divider />
                <Link
                    to="https://peko.one/ae/privacy-policy"
                    target="_blank"
                    className="text-sm footerLink"
                    type="secondary"
                >
                    <Typography.Text className="text-sm text-textBlack">
                        Privacy Policy
                    </Typography.Text>
                </Link>

                <Divider />
                <Link
                    to="https://peko.one/ae/refund-policy"
                    target="_blank"
                    className="text-sm footerLink"
                    type="secondary"
                >
                    <Typography.Text className="text-sm text-textBlack">
                        Refund Policy
                    </Typography.Text>
                </Link>
                <Divider />
                <Link
                    to="https://peko.one/ae/cookie-policy"
                    target="_blank"
                    className="text-sm footerLink"
                    type="secondary"
                >
                    <Typography.Text className="text-sm text-textBlack">
                        Cookie Policy
                    </Typography.Text>
                </Link>
            </Flex>
        </Flex>
    </Layout.Footer>
);

const Divider = () => <span className="mx-2 text-gray-400">|</span>;

export default Footer;
