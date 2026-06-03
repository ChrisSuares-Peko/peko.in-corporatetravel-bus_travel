import { useEffect, FC } from 'react';

import { Flex, Skeleton } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import SignDeskBranding from '../components/SignDeskBranding';
import DetailsForm from '../components/viewPage/DetailsForm';
import ReviewPageHeader from '../components/viewPage/ReviewPageHeader';
import ThumbnailExample from '../components/viewPage/ThumbnailExample';
import { useESignDocument } from '../hooks/useESignDocument';
import { clearESignDocData } from '../slices/eSignDocSlice';

interface ViewPageProps {}

const ViewPage: FC<ViewPageProps> = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, getOrderDetails } = useESignDocument();

    const { document_url, isDisabled, id, status } = useAppSelector(
        state => state.reducer.eSignDoc
    );

    useEffect(() => {
        if ((!document_url && !isDisabled) || (!id && isDisabled)) {
            navigate(`${paths.dashboard.moreServices}/${paths.eSign.index}`);
        }
        if (isDisabled && id) {
            getOrderDetails(Number(id));
        }

        // Clear the eSignDoc slice data when the component unmounts
        return () => {
            dispatch(clearESignDocData());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, navigate]);

    return (
        <Flex vertical className="gap-[1.5rem] sm:gap-[2.5rem]">
            <SignDeskBranding className=" sm:-mt-9 md:-mt-16" />
            {!isLoading ? (
                <>
                    <ReviewPageHeader />
                    {document_url !== null && <ThumbnailExample />}
                    <DetailsForm />
                </>
            ) : (
                <Skeleton />
            )}
        </Flex>
    );
};

export default ViewPage;
