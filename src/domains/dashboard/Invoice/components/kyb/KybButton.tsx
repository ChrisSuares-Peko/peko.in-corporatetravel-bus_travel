import React from 'react';

import { Button } from 'antd';
import { Link } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { DashboardApiResponse } from '../../types';

type KybButtonProps = {
    data: DashboardApiResponse;
};

const KybButton = ({ data }: KybButtonProps) => {
    const kybStatus = data?.paymentLinkKYB.kybStatus;

    const renderButton = () => {
        switch (kybStatus) {
            case 'PENDING':
                return (
                    <Link to={paths.invoice.kybPage}>
                        <Button type="default" danger className="my-5" size="large">
                            Complete KYB
                        </Button>
                    </Link>
                );
            case 'INITIATED':
                return (
                    <Link to={`${paths.invoice.kybPage}/${paths.invoice.kybDocumentPage}`}>
                        <Button type="default" danger className="my-5" size="large">
                            Complete KYB
                        </Button>
                    </Link>
                );
            case 'DOCUMENT UPLOADED':
                return (
                    <Button className="my-5 text-[#FF6B00] border-[#FF6B00]" size="large">
                        KYB Under Review
                    </Button>
                );
            case 'APPROVED':
                return (
                    <Button className="my-5 text-successGreen border-successGreen" size="large">
                        KYB Completed
                    </Button>
                );
            case 'REJECTED':
                return (
                    <Link to={`${paths.invoice.kybPage}/${paths.invoice.kybDocumentPage}`}>
                        <Button type="default" className="my-5" danger size="large">
                            KYB rejected, try again
                        </Button>
                    </Link>
                );
            default:
                return null;
        }
    };

    return renderButton();
};

export default KybButton;
