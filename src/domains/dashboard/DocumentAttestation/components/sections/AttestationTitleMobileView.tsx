import React from 'react';

import { Button, Flex, Tooltip, Typography } from 'antd';
import Search, { SearchProps } from 'antd/es/input/Search';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

const { Title } = Typography;

type AttestationTitleMobileViewProps = {
    setSearchKey: (key: number) => void;
};

const AttestationTitleMobileView: React.FC<AttestationTitleMobileViewProps> = ({
    setSearchKey,
}) => {
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        setSearchKey(Number(value));
    };
    const handleInputChange = (e: any) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            e.target.value = value;
        } else {
            e.target.value = value.replace(/\D/g, '');
        }
    };
    return (
        <Flex vertical className="w-full" gap={18}>
            <Tooltip
                title="Please enter the tracking number you received when your order was created"
                placement="bottomLeft"
                color="gray"
            >
                <Search
                    inputMode="numeric"
                    onInput={handleInputChange}
                    placeholder="Track your order"
                    onSearch={onSearch}
                />
            </Tooltip>
            <Flex justify="space-between" align="center">
                <Title level={4}>Document Attestation</Title>
                <Flex justify="center" align="center" gap={18}>
                    <Link to={paths.documentAttestation.orderhistory}>
                        <Button htmlType="submit" type="default" danger size="middle">
                            Order History
                        </Button>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AttestationTitleMobileView;
