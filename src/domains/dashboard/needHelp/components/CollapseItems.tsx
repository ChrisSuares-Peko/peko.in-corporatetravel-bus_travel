import { CollapseProps, Typography } from 'antd';

import { faqText, faqTitle } from '../utils/data';

export const items: CollapseProps['items'] = [
    {
        key: '1',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
    {
        key: '2',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
    {
        key: '3',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
    {
        key: '4',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
    {
        key: '5',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
    {
        key: '6',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
    {
        key: '7',
        label: (
            <Typography.Text className="ms-6 font-semibold text-base text-faqText">
                {faqTitle}
            </Typography.Text>
        ),
        children: (
            <Typography.Text className="text-faqText" style={{ whiteSpace: 'pre-line' }}>
                {faqText}
            </Typography.Text>
        ),
    },
];
