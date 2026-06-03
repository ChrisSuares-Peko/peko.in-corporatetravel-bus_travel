import React from 'react';

import { Flex, Grid, Image, Skeleton, Typography } from 'antd';
import Button from 'antd/es/button';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { paths } from '@src/routes/paths';

import { MapPin } from '../../assets/icons/projectDetails';
import { GoldStandard } from '../../assets/images/projectDetails.tsx';
import { Project } from '../../types/dashboard';

type Props = {
    isLoading: boolean;
    projectData: Project | undefined;
    id: any;
};

function toTitleCase(str: string) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
}
const { useBreakpoint } = Grid;
const Header = ({ isLoading, projectData, id }: Props) => {
    const navigate = useNavigate();

    const screens = useBreakpoint();
    const width = screens.md ? 350 : '100%';
    let projectName;
    if (projectData) projectName = toTitleCase(projectData.name);
    return (
        <Flex gap={30} className="xs:block md:flex">
            {isLoading ? (
                <Skeleton.Button
                    shape="square"
                    style={{ height: 240, width: screens.xxl ? 500 : width, borderRadius: '1rem' }}
                    className="w-full "
                    active={isLoading}
                    size="large"
                    block={!screens.md}
                />
            ) : (
                <Image
                    loading="eager"
                    height={240}
                    width={screens.xxl ? 500 : width}
                    src={projectData?.logo}
                    preview={false}
                    className="rounded-xl  object-cover "
                />
            )}
            {isLoading ? (
                <Skeleton active paragraph={{ rows: 5 }} className="mt-5" />
            ) : (
                <Flex vertical className="xl:gap-3 lg:gap-1 md:gap-4">
                    <Typography.Text className="font-normal text-valueText text-3xl md:text-xl xl:text-3xl text-start xs:mt-6 md:mt-0">
                        {projectName}
                    </Typography.Text>
                    <Flex align="baseline" className="" gap={3}>
                        <ReactSVG src={MapPin} />
                        <Typography.Text className="font-light text-xl  xs:text-center lg:text-start xs:mt-4 ">
                            {`${projectData?.city}, ${projectData?.country}`}
                        </Typography.Text>
                    </Flex>
                    <Flex className="mt-6 ms-1" justify="start" align="center">
                        <Image preview={false} width={120} height={32} src={GoldStandard} />
                    </Flex>

                    <Button
                        size="large"
                        className="mt-6 "
                        danger
                        type="primary"
                        onClick={() =>
                            navigate(paths.zeroCarbon.neutralize, {
                                state: { id },
                            })
                        }
                    >
                        <Typography.Text className="text-white">Neutralise</Typography.Text>
                    </Button>
                </Flex>
            )}
        </Flex>
    );
};

export default Header;
