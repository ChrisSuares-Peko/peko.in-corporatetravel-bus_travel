import React from 'react';

import { Breadcrumb, Typography } from 'antd';
import { FiChevronRight } from 'react-icons/fi';
import { useLocation, Link } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';

type BreadCrumbProps = object;

const CustomBreadCrumb: React.FC<BreadCrumbProps> = () => {
    const location = useLocation();
    const { md } = useScreenSize();
    const { pathname } = location;
    const pathnames = pathname.split('/').filter(item => item);

    const capitalize = (s: string) => {
        if (s === 'eSign') {
            return s;
        }
        if (s === 'eSIM') return s;

        return s
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const nestedRoutes = [
        'details',
        'product-details',
        'order-details',
        'project-details',
        'purchase',
    ];

    const blackListedRoutes = [
        'payment-success',
        'payment-failure',
        'payments',
        'hotels',
        'airline',
        'system-user',
    ];

    const extraBreadcrumbItems: any = pathnames
        .map((name, index) => {
            const isIndexLast = index + 1 === pathnames.length - 1;
            let routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            if (nestedRoutes.includes(name) && isIndexLast) {
                return {
                    key: name,
                    title: (
                        <Typography.Text className=" font-normal text-sm text-[#FF9B9B]">
                            {capitalize(name)}
                        </Typography.Text>
                    ),
                };
            }
            if (nestedRoutes.includes(name) && !isIndexLast) {
                routeTo = `/${pathnames.slice(0, index + 2).join('/')}`;
                return {
                    key: name,
                    title: (
                        <Link to={routeTo}>
                            <Typography.Text className=" font-normal text-sm text-[#667085]">
                                {capitalize(name)}
                            </Typography.Text>
                        </Link>
                    ),
                };
            }

            const isLast = index === pathnames.length - 1;

            // Check if it's a UUID (more accurate check)
            const isUUID = parseInt(name, 10) > 0;

            // if ((isLast && isUUID) || pathnames.length === 1) {
            //     return { title: '', key: '' };
            // }
            if (isUUID || pathnames.length === 1 || blackListedRoutes.includes(name)) {
                return { title: '', key: '' };
            }

            if (isLast && !isUUID) {
                return {
                    title: (
                        <Typography.Text className=" font-normal text-sm text-[#FF9B9B]">
                            {capitalize(name)}
                        </Typography.Text>
                    ),
                    key: name,
                };
            }

            return {
                title: (
                    <Link to={routeTo}>
                        <Typography.Text className=" font-normal text-sm text-[#667085]">
                            {capitalize(name)}
                        </Typography.Text>
                    </Link>
                ),
                key: name,
            };
        })
        .filter(item => item.key !== '');

    const breadcrumbs = md ? [...extraBreadcrumbItems] : [];

    return (
        breadcrumbs.length > 0 && (
            <Breadcrumb
                items={breadcrumbs}
                separator={
                    <div className=" pt-[2px]">
                        <FiChevronRight className=" text-base" />
                    </div>
                }
                className={` bg-white ${extraBreadcrumbItems.length > 0 ? 'mb-8' : 'mb-0'}`}
            />
        )
    );
};

export default CustomBreadCrumb;
