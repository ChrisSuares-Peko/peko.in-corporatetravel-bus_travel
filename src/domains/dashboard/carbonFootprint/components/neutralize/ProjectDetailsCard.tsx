import React from 'react';

import { Card, Flex, Grid, Image, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { paths } from '@src/routes/paths';

import { MapPin } from '../../assets/icons/projectDetails';
import { Project } from '../../types/dashboard';

type Props = {
    projectDetails: Project | undefined;
};
const { useBreakpoint } = Grid;
function toTitleCase(str: string) {
    return str.toLowerCase().replace(/(?:^|\s)\w/g, match => match.toUpperCase());
}
const ProjectDetailsCard = ({ projectDetails }: Props) => {
    const screens = useBreakpoint();
    let projectName;
    if (projectDetails) projectName = toTitleCase(projectDetails.name);
    return (
        <Card className="h-full my-3 sm:border-none md:border md:border-solid rounded-2xl">
            <Image
                loading="eager"
                height={screens.xxl ? 260 : 240}
                width="100%"
                src={projectDetails?.logo}
                preview={false}
                className="object-cover rounded-xl"
            />
            <Flex vertical gap={15}>
                <Typography.Text className="mt-4 text-xl font-medium text-valueText xxl:text-2xl">
                    {projectName}
                </Typography.Text>
                <Flex align="center" gap={3}>
                    <ReactSVG src={MapPin} />
                    <Typography.Text className="text-sm font-normal text-textGrey xxl:text-lg">
                        {`${projectDetails?.city}, ${projectDetails?.country}`}
                    </Typography.Text>
                </Flex>
                <Typography.Text className="text-base font-light text-start line-clamp-6 xxl:text-lg">
                    {projectDetails && (
                        <Content dangerouslySetInnerHTML={{ __html: projectDetails.body.html }} />
                    )}
                </Typography.Text>
                <Link
                    target="_blank" // Open link in new tab
                    rel="noopener noreferrer"
                    to={`${paths.dashboard.moreServices}/${paths.zeroCarbon.index}/${paths.zeroCarbon.projectDetails}/${projectDetails?.id}`}
                    className="flex justify-end mt-0"
                >
                    <Typography.Text className="-mt-3 font-medium  text-bgOrange2 text-end xxl:text-lg">
                        Read more
                    </Typography.Text>
                </Link>
            </Flex>
        </Card>
    );
};
export default ProjectDetailsCard;
