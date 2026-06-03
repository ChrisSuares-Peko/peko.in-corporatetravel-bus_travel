import React from 'react';

import { Button, Flex, Tooltip, Typography } from 'antd';
import Search from 'antd/es/input/Search';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

type props = {
    setSearchKey: (key: number) => void;
};
const AttestationTitle = ({ setSearchKey }: props) => {
    const handleInputChange = (e: any) => {
        const { value } = e.target;
        if (/^\d*$/.test(value)) {
            e.target.value = value;
        } else {
            e.target.value = value.replace(/\D/g, '');
        }
    };
    return (
        <Flex vertical gap={24}>
            <Flex justify="space-between" align="center" className="w-full">
                <Typography.Text className="text-lg font-medium align-middle sm:text-xl">
                    Document Attestation
                </Typography.Text>

                <Flex justify="center" align="center" gap={18}>
                    <Tooltip
                        title="Please enter the tracking number you received when your order was created"
                        placement="bottomLeft"
                        color="gray"
                    >
                        <Search
                            placeholder="Track your order"
                            onSearch={e => setSearchKey(Number(e))}
                            onInput={handleInputChange}
                            style={{ width: 240 }}
                        />
                    </Tooltip>
                    <Link to={paths.documentAttestation.orderhistory}>
                        <Button htmlType="submit" type="default" danger>
                            Order History
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            {/* <Flex className=" py-3 mb-2 mt-4 sm:mb-4 sm:mt-2 border-[1px] border-green-200  sm:border-0 bg-green-50 sm:bg-white">
                <Typography.Text
                    className="text-[.9rem] text-center  sm:text-[1.1rem] md:text-[1.3rem] font-thin
                text-textGreenTitle sm:text-black"
                >
                    Book now and one of the agents will collect the document from your pick-up
                    address
                </Typography.Text>
            </Flex> */}
        </Flex>
    );
};

export default AttestationTitle;
