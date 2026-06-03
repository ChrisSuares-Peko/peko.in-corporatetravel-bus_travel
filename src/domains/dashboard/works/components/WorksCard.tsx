import React from 'react';

import { Card, Flex, Image, Typography, Col, Grid, Empty, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { workData } from '../type';

const WorksCard = ({ id, workTitle, workImg, workDescription }: workData) => {
    const screens = Grid.useBreakpoint();
    return (
        <Col xs={24} sm={12} md={8} xl={6}>
            <Link to={`${paths.works.detail}/${id}`}>
                <Card
                    className=" border-1 border-solid border-gray-300 bg-gray-10  rounded-xl relative cursor-pointer _scale_on_hover transition duration-150 transform hover:scale-105"
                    style={{
                        transition: 'transform .3s ease-in-out',
                    }}
                >
                    <Flex vertical gap={10} align="center">
                        {workImg !== '' && workImg != null ? (
                            <>
                                <Flex
                                    className={` w-24 sm:w-20 md:h-20 xs:h-24 rounded-2xl sm:rounded-3xl`}
                                    align="center"
                                    justify="center"
                                >
                                    <Image preview={false} src={workImg} width="70%" />
                                </Flex>
                                <Typography.Text className="md:mt-3 mt-0  md:text-lg  line-clamp-1 font-medium text-bgOrange2">
                                    <Tooltip title={screens.md ? '' : workTitle}>
                                        {workTitle}
                                    </Tooltip>
                                </Typography.Text>
                            </>
                        ) : (
                            <>
                                {screens.md ? (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <span className="xs:text-xs md:text-sm">
                                                No Preview Available
                                            </span>
                                        }
                                    />
                                ) : (
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        // style={{marginBlock:'0px', width:"70%"}}
                                        style={{
                                            marginBlock: screens.xs ? '1px' : '10px',
                                            width: '70%',
                                        }}
                                        description={
                                            <span className="xs:text-xs md:text-sm">
                                                No Preview Available
                                            </span>
                                        }
                                    />
                                )}

                                <Typography.Text className="md:-mt-3 xs:mt-1 md:text-lg  line-clamp-1 font-medium text-bgOrange2">
                                    <Tooltip title={screens.md ? '' : workTitle}>
                                        {workTitle}
                                    </Tooltip>
                                </Typography.Text>
                            </>
                        )}

                        <Typography.Text className="md:text-[.75rem] xxl:text-sm text-center text-textGrey line-clamp-1">
                            {workDescription}
                        </Typography.Text>
                    </Flex>
                </Card>
            </Link>
        </Col>
    );
};

export default WorksCard;
