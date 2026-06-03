import React from 'react';

import { Row, Breadcrumb, Layout, Typography, Image } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { capitalize } from 'lodash';
import { FiChevronRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import logo from '../assets/logo/PekoOne.png';
import ListCards from '../components/ListCards';
import ListPartners from '../components/ListPartners';
import PlansCompareTable from '../components/PlansCompareTable';
import useGetPackages from '../hooks/useGetPackages';
import { calculateMaxDiscountPercentages } from '../utils';

const { Title, Paragraph } = Typography;

function PlansIndex() {
    const { data, currentPackageId, isLoading } = useGetPackages();
    const discount = calculateMaxDiscountPercentages(data);

    const { roleName } = useAppSelector(state => state.reducer.auth);
    const navigate = useNavigate();
    if (roleName && roleName === 'corporate sub user') {
        navigate('/404');
        return null;
    }

    const paragraphText = `Explore our range of subscription plans to unlock exclusive features and simplify your payments with Peko.
  Choose the perfect plan that fits your needs and enjoy a seamless payment experience hassle-free!`;

    const formattedText = paragraphText.split('.').map((sentence, index) => (
        <span key={index}>
            {sentence.trim()}
            {index < paragraphText.split('.').length - 1 && '. '}
            <br />
        </span>
    ));
    return (
        <Layout className="overflow-hidden bg-white min-h-svh">
            <Content className="px-4 py-10 sm:p-10 lg:py-20 lg:px-32 xl:px-40 2xl:px-64">
                <Breadcrumb
                    items={[
                        {
                            title: (
                                <Link to={paths.dashboard.home}>
                                    <Typography.Text className=" font-normal text-sm text-[#667085]">
                                        {capitalize('dashboard')}
                                    </Typography.Text>
                                </Link>
                            ),
                            key: 'dashboard',
                        },
                        {
                            title: (
                                <Typography.Text className=" font-normal text-sm text-[#FF9B9B]">
                                    {capitalize('plans')}
                                </Typography.Text>
                            ),
                            key: 'plans',
                        },
                    ]}
                    separator={
                        <div className=" pt-[2px]">
                            <FiChevronRight className="text-base " />
                        </div>
                    }
                    className={` bg-white mb-8`}
                />
                <Title level={1} className="p-3 text-center">
                    Upgrade to
                    <Image
                        src={logo}
                        alt="Peko 1"
                        style={{ marginLeft: '8px', height: '33px', width: 'auto' }}
                    />
                </Title>
                <Paragraph className="py-4 text-base text-center text-gray-800">
                    {formattedText}
                </Paragraph>
                <Row align="middle" justify="center" className="gap-8">
                    <ListCards
                        data={data}
                        currentPackageId={currentPackageId}
                        isLoading={isLoading}
                        discount={discount}
                    />
                    <ListPartners />
                </Row>
                <PlansCompareTable />
            </Content>
        </Layout>
    );
}

export default PlansIndex;
