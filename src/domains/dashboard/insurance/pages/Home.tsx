import React, { useEffect } from 'react';

import { Row } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import ContentHeader from '../components/home/ContentHeader';
import ContentImage from '../components/home/ContentImage';
import Contents from '../components/home/Contents';
import ContentsSub from '../components/home/ContentsSub';
import Footer from '../components/home/Footer';
import Header from '../components/home/Header';
import useGetRedirectURL from '../hooks/useGetRedirectURL';
import { GetRedirectURLRes } from '../types/types';

type Props = {};

const Home: React.FC<Props> = () => {
    const { handleGetRedirectURL } = useGetRedirectURL();
    const navigate = useNavigate();

    useEffect(() => {
        const handleConfirm = async (landingUrl: string) => {
            const res: GetRedirectURLRes | false = await handleGetRedirectURL(
                'COMMUNICATION',
                landingUrl
            );
            if (res !== false) {
                navigate(paths.insurance.insurance, { state: { url: res.redirectUrl } });
            }
        };
        const queryParams = new URLSearchParams(window.location.search);
        const type = queryParams.get('type');
        const landingUrl = queryParams.get('landingUrl');
        if (type && landingUrl && type === 'insurance') {
            handleConfirm(landingUrl);
        }
    }, [handleGetRedirectURL, navigate]);

    return (
        <Row className="flex justify-center gap-8">
            <Header />
            <ContentHeader />
            <ContentImage />
            <Contents />
            <ContentsSub />
            <Footer />
        </Row>
    );
};

export default Home;
