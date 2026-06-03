import React, { useCallback, useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import useHideFooterAndBreadcrumbs from '../hooks/useHideFooterAndBreadcrumbs ';

type Props = {};

const Insurance = (props: Props) => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleLoad = useCallback(() => {
        const element = document.getElementById('iframeId');
        let currentSrc: string | null = null;
        if (element !== null) {
            currentSrc = element.getAttribute('src');
        }

        if (currentSrc === null) return;
        if (currentSrc.includes('peko.one')) navigate(`/${paths.insurance.index}`);
    }, [navigate]);

    // eslint-disable-next-line consistent-return
    useEffect(() => {
        if (!state?.url) {
            navigate(`/${paths.insurance.index}`);
        }
        const iframeElement = document.getElementById('iframeId');
        if (iframeElement) {
            iframeElement.addEventListener('load', handleLoad);
            return () => {
                iframeElement.removeEventListener('load', handleLoad);
            };
        }
    }, [handleLoad, navigate, state]);

    useHideFooterAndBreadcrumbs(); // hide footer on iframe to avoid peko app scrolling

    return (
        <iframe
            id="iframeId"
            src={state?.url}
            title=" "
            className="w-full"
            style={{ height: ' calc(100vh -  172px)' }}
        />
    );
};

export default Insurance;
