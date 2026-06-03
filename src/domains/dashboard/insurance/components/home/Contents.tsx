import React, { useState } from 'react';

import { Button, Col, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import useScreenSize from '@src/hooks/useScreenSize';

import ConfirmationModal from './ConfirmationModal';
import RightArrowSVG from '../../assets/icons/right_arrow.svg';

type Props = {};

const Contents = (props: Props) => {
    const screens = useScreenSize();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [redirectType, setRedirectType] = useState<string>('');
    const toggleModal = (key: string) => {
        setRedirectType(key);
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Col className="w-full" span={24}>
            <Flex vertical align="center" justify="center">
                <Button
                    type="primary"
                    className="xs:w-4/5 xs:h-9 sm:w-56 sm:h-11 flex items-center justify-center"
                    size="large"
                    danger
                    onClick={() => toggleModal('HOME')}
                >
                    <Typography.Text className="text-white text-lg sm:font-medium">
                        Get New Insurance
                    </Typography.Text>
                    <ReactSVG
                        src={RightArrowSVG}
                        beforeInjection={svg => {
                            svg.setAttribute('style', 'width: 16px; height: 16px; margin-left:5px');
                        }}
                    />
                </Button>
                <Typography.Text
                    onClick={() => toggleModal('MY_ACCOUNT')}
                    className="text-red-500 text-base mt-4 cursor-pointer"
                >
                    View Policy and Submit Claims{' '}
                </Typography.Text>
            </Flex>
            <ConfirmationModal
                isModalOpen={isModalOpen}
                toggleModal={toggleModal}
                redirectType={redirectType}
            />
        </Col>
    );
};

export default Contents;
