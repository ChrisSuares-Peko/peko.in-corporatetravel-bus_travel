import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Col, Flex, Grid, Input, Pagination, Row, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Lottie from 'react-lottie';

import animation from '@assets/animation/zero_carbon_no_data.json';
import { paths } from '@src/routes/paths';

import ProjectListCard from '../components/projectListing/ProjectListCard';
import useFilter from '../hooks/useFilter';
import useGetAllProjects from '../hooks/useGetAllProjects';
import { InitialValues, filtersState } from '../types/dashboard';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};
const { useBreakpoint } = Grid;
const ProjectListing = () => {
    const today = new Date();
    const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const initaialValues: InitialValues = {
        searchQuery: '',
        category: '',
        sort: 'ASC',
        page: 1,
        itemsPerPage: 10,
        filter: '',
        from: firstDayOfLastMonth.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
        to: firstDayOfThisMonth.toISOString().replace(/T/, ' ').replace(/\..+/, ''),
    };
    const [filters, setFilters] = useState<filtersState>(initaialValues);
    const { data, count, totalPage, isLoading } = useGetAllProjects(
        filters.searchQuery,
        filters.page,
        filters.itemsPerPage
    );
    const screens = useBreakpoint();
    const height = screens.md ? '10rem' : '5rem';
    const { handlePageChange, handleSearch } = useFilter({ setFilters });

    const renderLoadingSkeletons = () =>
        Array.from({ length: 8 }).map((_, index) => (
            <Col xs={12} sm={12} md={8} xl={6} key={index} className="px-10">
                <Skeleton.Button
                    key={index}
                    shape="square"
                    className="w-fit"
                    style={{ height, borderRadius: '0.8rem' }}
                    active
                    block
                    size="large"
                />
                <Skeleton title={false} active className="mt-2" />
            </Col>
        ));

    const renderProjectList = () =>
        data &&
        data.map((item, i) => (
            <Col xs={12} sm={12} md={8} xl={6} xxl={6} key={i}>
                <ProjectListCard
                    key={i}
                    image={item.logo}
                    id={i}
                    title={item.name}
                    location={`${item.city}, ${item.country}`}
                    path={`${paths.dashboard.moreServices}/${paths.zeroCarbon.index}/${paths.zeroCarbon.projectDetails}/${item.id}`}
                />
            </Col>
        ));

    const renderEmptyState = () => (
        <Flex
            vertical
            align="center"
            justify="center"
            gap={15}
            className="text-center h-fit mt-20 "
        >
            <Lottie options={defaultOptions} height={250} width={250} />
            <Typography.Text className="text-textGrey -mt-10 z-10">
                No Projects Found
            </Typography.Text>
        </Flex>
    );

    return (
        <Content>
            <Row justify="space-between" align="middle">
                <Col xs={12} md={6}>
                    <Typography.Text className="   text-black text-2xl font-normal">
                        Projects
                    </Typography.Text>
                </Col>
                <Col xs={12} md={8}>
                    <Input
                        value={filters.searchQuery}
                        placeholder="Search for projects"
                        suffix={<SearchOutlined />}
                        onChange={handleSearch}
                        allowClear
                        type="text"
                        maxLength={100}
                        variant="outlined"
                    />
                </Col>
            </Row>

            <Row
                gutter={[20, 35]}
                className="mt-8"
                justify={data && data.length > 0 ? 'start' : 'center'}
            >
                {isLoading ? (
                    renderLoadingSkeletons()
                ) : (
                    <>{data && data.length > 0 ? renderProjectList() : renderEmptyState()}</>
                )}
            </Row>
            {data && data.length > 0 && (
                <Pagination
                    onChange={handlePageChange}
                    pageSize={filters.itemsPerPage}
                    current={filters.page}
                    size="default"
                    className="text-end pt-7"
                    total={count}
                    showLessItems
                    showSizeChanger={false}
                />
            )}
        </Content>
    );
};
export default ProjectListing;
