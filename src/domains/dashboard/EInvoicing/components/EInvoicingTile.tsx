import { Badge, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import IconCard from '@components/molecular/cards/IconCard';
import InvoiceIcon from '@assets/icons/InvoiceIcon.svg';
import { paths } from '@src/routes/paths';

import { useEInvoicingStatus } from '../hooks/useEInvoicingStatus';

const EInvoicingTile = () => {
    const navigate = useNavigate();
    const { status, metrics } = useEInvoicingStatus();

    const subtitle =
        status === 'INACTIVE'
            ? 'Activate now — UAE mandate from 2027'
            : metrics.rejected > 0
              ? `${metrics.rejected} invoices need attention`
              : `${metrics.cleared} cleared this month`;

    const handleClick = () => {
        if (status === 'INACTIVE')
            return navigate(`${paths.dashboard.einvoicing}/${paths.einvoicing.activate}`);
        if (status === 'PENDING')
            return navigate(`${paths.dashboard.einvoicing}/${paths.einvoicing.onboarding}`);
        return navigate(paths.dashboard.einvoicing);
    };

    return (
        <Flex vertical align="center" gap={6}>
            <Badge dot={metrics.rejected > 0 && status === 'ACTIVE'} color="red" offset={[-6, 6]}>
                <IconCard icon={InvoiceIcon} title="E-Invoicing" onClick={handleClick} />
            </Badge>
            <Typography.Text
                className="text-xs text-center"
                style={{
                    color: metrics.rejected > 0 && status === 'ACTIVE' ? '#B91C1C' : '#525252',
                    maxWidth: 130,
                    lineHeight: 1.2,
                }}
            >
            </Typography.Text>
        </Flex>
    );
};

export default EInvoicingTile;
