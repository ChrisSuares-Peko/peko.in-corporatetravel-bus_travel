import React from 'react';

import { Flex } from 'antd';
import { ReactSVG } from 'react-svg';

import useScreenSize from '@src/hooks/useScreenSize';

import InsuranceSVG from '../../assets/icons/Insurance.svg';

type Props = {};

const ContentImage = (props: Props) => {
    const screens = useScreenSize();

    return (
        <Flex className="w-full justify-center items-center">
            <ReactSVG
                src={InsuranceSVG}
                beforeInjection={svg => {
                    if (screens.xs) {
                        svg.setAttribute('style', 'width: 80%; height: auto;');
                    } else {
                        svg.setAttribute('style', 'width: 100%; height: 100%;');
                    }
                }}
                className="sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"
            />
        </Flex>
    );
};

export default ContentImage;
